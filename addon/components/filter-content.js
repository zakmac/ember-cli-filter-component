import Ember from 'ember';

/**
 * FilterContentComponent
 *
 * @description component that applys a simple filter to a specified content model
 *   based on basic matching
 * @memberof App
 * @extends external:Ember.Component
 * @constructor
 */
export default Ember.Component.extend({

  /* properties
  ------------------------ */

  /**
   * content
   *
   * @description the content passed in to be filtered
   * @memberof FilterContentComponent
   * @type {(array|object|Ember.Object|Ember.Enumerable|DS.Model)}
   * @instance
   */
  content: [],

  /**
   * properties
   *
   * @description a space-delimited string of dot-notated properties to match against when filtering
   * @memberof FilterContentComponent
   * @type {string}
   * @instance
   */
  properties: '',

  /**
   * query
   *
   * @description the query string being filtered against
   * @memberof FilterContentComponent
   * @type {string}
   * @instance
   */
  query: '',

  /* computed properties
  ------------------------ */

  /**
   * contentComp
   *
   * @description an object of known type that we can safely, naively filter
   * @memberof FilterContentComponent
   * @type {(Ember.ArrayProxy|Ember.Object|Ember.Enumerable|DS.Model)}
   * @instance
   */
  contentComp: Ember.computed('content', function() {

    var content = !Ember.isNone(this.get('content')) ? this.get('content') : [];
    // var returns = null;
    var type = Ember.typeOf(content);

    try {

      if (content && type === 'array') {

        if (content['@each'] && content['@each'].hasArrayObservers) {

          content = content;

        } else {

          content = Ember.A(content);
        }

        return content && content.get ? content : Ember.ArrayProxy.create({content: content});

      } else if (type === 'object') {

        // coerce returns into an  Ember.Object
        return Ember.Object.create(content);

      // could be DS.Model, or junk
      // if content is an instance that is not an ember.object, take offense
      } else if (type === 'class') {

        if (this.isDS(content)) {

          return content;

        } else {

          throw 'Ember.typeOf(content) === class that is not DS';
        }

      // could be Ember.Object, or junk
      // if content is an instance that is not an ember.object, take offense
      } else if (type === 'instance') {

        if (this.isEmberObj(content)) {

          return content;

        } else {

          throw 'Ember.typeOf(content) === instance that is not Ember';
        }

      } else {

        throw 'Ember.typeOf(content) === "'+ type +'" is not supported';
      }

      return [];

    } catch (ex) {

      console.warn('FilterContentComponent.contentComp', ex);
    }
  }),

  /**
   * propertiesComputed
   *
   * @description an array of strings representing the contentComp properties
   *   matching against
   * @memberof FilterContentComponent
   * @returns {array}
   * @instance
   */
  propertiesComputed: Ember.computed('properties', function() {

    var properties = this.get('properties') || '';
    // anything ![alphanumeric, underscore, period, space, atsymbol]
    var regexA = new RegExp(/[^\w\s@.-]+/g);
    // one or more space
    var regexB = new RegExp(/\s+/g);

    // cast to string
    if (properties) {

      properties = properties.toString();
      properties = properties.replace(regexA, '');
      properties = properties.split(regexB);

      return properties;
    }

    return [];
  }),

  /**
   * queryComp
   *
   * @description the string being matched against 'contentComp' replaces
   *   forward slashes to prevent error
   * @todo is there a better solution for forward slashes?
   * @memberof FilterContentComponent
   * @returns {string}
   * @instance
   */
  queryComp: Ember.computed('query', function() {

    var query = this.get('query');
    var regex = new RegExp(/\\+/g);

    if (Ember.isPresent(query)) {

      return query.replace(regex, '');
    }

    return '';
  }),

  /**
   * fType
   *
   * @description returns a sanitized `typeof content`
   * @memberof FilterContentComponent
   * @instance
   */
  /*fType: Ember.computed('content', function() {

    var content = this.get('content');
    var returns = Ember.typeOf(content);

    try {

      // Ember.Object or junk
      if (returns === 'instance') {

        // if content is an instance that is not an ember.object, take offense
        if (this.isEmberObj(content)) {

          returns = 'object';

        } else {

          throw 'Ember.typeOf(content) === instance that is not Ember';
        }

      // DS.Model or junk
      } else if (returns === 'class') {

        // if content is an instance that is not an ember.object, take offense
        if (this.isDS(content)) {

          returns = 'ds';

        } else {

          throw 'Ember.typeOf(content) === class that is not DS';
        }

      } else {

        if (returns !== 'array' && returns !== 'object') {

          throw 'Ember.typeOf(content) === "'+ returns +'" is not supported';
        }
      }

      return returns;

    } catch (ex) {

      console.warn('FilterContentComponent.fType', ex);
    }
  }),*/

  /* observers
  ------------------------ */

  debounceFilter: null,

  /**
   * debounceFilter
   *
   * @description apply the correct filter type to 'contentComp' and populate
   *   'model' with the result
   * @memberof FilterContentComponent
   * @instance
   */
  setFilterTimer: Ember.observer('contentComp', 'queryComp', function() {

    this.set('debounceFilter', Ember.run.later(this, this.applyFilter, 350));
  }),

  /* methods
  ------------------------ */

  applyFilter: function() {

    if (this.get('isDestroyed')) { return false; }

    var compare = [];
    var compareTemp = [];
    var contentComp = this.get('contentComp');
    var propertiesComp = this.get('propertiesComputed');
    var queryComp = this.get('queryComp');
    // var fType = this.get('fType');
    // var len = propertiesComp.length;
    // var matchFound = false;
    // var match = false;
    // var prop = null;
    var returns = [];
    // var skip = false;
    var component = this;

    // iterate each item passed in `content`
    returns = Ember.EnumerableUtils.filter(contentComp, function(item) {

      compare = item;
      compareTemp = [];

      // check each specified property for a match
      propertiesComp.forEach(function(prop) {

        if (compare.get) {

          compare = compare.get(prop);

        } else {

          compare = component.getFromEnum(Ember.makeArray(compare), prop);
        }

        if (compare) {

          compareTemp = compareTemp.concat(compare);
        }
      });

      // console.log('COMPARE', compareTemp, queryComp, component.containsMatch(compare, queryComp));

      return !Ember.isEmpty(compareTemp) && typeof compareTemp[0] === 'string' ? component.containsMatch(compareTemp, queryComp) : false;
    });

    this.set('model', returns);
  },

  containsMatch: function(arr, query) {

    var that = this;
    var matchFound = false;

    arr.forEach(function(item) {

      if (!matchFound && that.isMatch(item, query)) {

        matchFound = true;
      }
    });

    return matchFound;
  },

  /**
   * a poor man's `get` for use on enumerables
   * - returns a single, root-level value
   *
   * @param {array} arr the array being filtered
   * @param {string} index dot notation of desired property
   * @returns {array} properties matching specified indices
   */
  getFromEnum: function(enumerable, property) {

    var component = this;
    var found = [];
    var len = 0;
    var properties = property.split('.');
    var skip = false;
    var tempItem = null;
    var tempProperties = properties;

    len = tempProperties.length;

    if (!enumerable) {

      return [];

    } else if (property === '@each') {

      return enumerable;
    }

    enumerable.forEach(function(item) {

      tempItem = item;
      // tempProperties = properties;

      tempProperties.forEach(function(index, y) {

        if (!skip) {

          if (index === '@each') {

            if (Ember.isArray(tempItem)) {

              if (y + 1 !== len) {

                tempItem = Ember.makeArray(tempItem);
                tempProperties = tempProperties.slice(y + 1, len).join('.');
                tempItem = component.getFromEnum(tempItem, tempProperties);

              } else {

                tempItem = tempItem;
              }

            } else {

              tempItem = null;
            }

            skip = true;

          } else if (typeof tempItem === 'object') {

            tempItem = tempItem[index] || null;

          } else {

            tempItem = null;
            skip = true;
          }
        }
      });

      skip = false;

      if (tempItem) {

        found = found.concat(tempItem);
      }
    });

    return found;
  },

  /**
   * isDS
   *
   * @description check if passed value is DS.Model
   * @memberof FilterContentComponent
   * @param {*} value the value being evaluated
   * @instance
   */
  /*isDS: function(value) {

    return (Ember.inspect(value).toLowerCase().indexOf('ds.model') !== -1);
  },*/

  /**
   * isEmberObj
   *
   * @description check if passed value is Ember.Object
   * @memberof FilterContentComponent
   * @param {*} value the value being evaluated
   * @instance
   */
  /*isEmberObj: function (value) {

    return (Ember.inspect(value).toLowerCase().indexOf('ember.object') !== -1);
  },*/

  /**
   * isMatch
   *
   * @description checks if valueA and valueB match; passed values are sloppily
   *   coerced to strings
   * @memberof FilterContentComponent
   * @param {(number|string)} valueA
   * @param {(number|string)} valueA
   * @instance
   */
  isMatch: function(valueA, valueB) {

    var returns = false;
    var typeA = Ember.typeOf(valueA);
    var typeB = Ember.typeOf(valueB);

    typeA = (typeA === 'undefined' || typeA === 'null' || typeA === 'number' || typeA === 'string' || typeA === 'boolean');
    typeB = (typeB === 'undefined' || typeB === 'null' || typeB === 'number' || typeB === 'string' || typeB === 'boolean');

    if (typeA && typeB) {

      valueA = Ember.inspect(valueA).toLowerCase();
      valueB = Ember.inspect(valueB).toLowerCase();
      returns = (valueA.match(valueB) !== null);
    }

    return returns;
  },

  /*setup: Ember.on('init', function() {

    // trigger contentComp if necessary
    if (!this.get('content')) {

      this.set('content', []);
    }
  }),*/

  willDestroy: function() {

    this._super();

    // Ember.run.cancel(this.get('debounceFilter'));
    this.set('debounceFilter', null);
  }
});
