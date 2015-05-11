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
  content: null,

  /**
   * filterableContent
   *
   * @description an object of known type that we can safely, naively filter
   * @memberof FilterContentComponent
   * @type {(Ember.ArrayProxy|Ember.Object|Ember.Enumerable|DS.Model)}
   * @instance
   */
  filterableContent: null,

  /**
   * filterableProperties
   *
   * @description an array of strings representing the filterableContent properties
   *   matching against
   * @memberof FilterContentComponent
   * @returns {array}
   * @instance
   */
  filterableProperties: Ember.computed('filterProperties', function() {

    var properties = this.get('filterProperties') || '';
    // anything ![alphanumeric, underscore, period, space, atsymbol]
    var regexA = new RegExp(/[^\w\s@.-]+/g);
    // one or more spaces
    var regexB = new RegExp(/\s+/g);

    // cast to string
    properties = properties.toString();
    properties = properties.replace(regexA, '');
    properties = properties.split(regexB);

    return properties;

  }),

  /**
   * filterableQuery
   *
   * @description the string being matched against 'filterableContent' replaces
   *   forward slashes to prevent error
   * @todo is there a better solution for forward slashes?
   * @memberof FilterContentComponent
   * @returns {string}
   * @instance
   */
  filterableQuery: Ember.computed('query', function() {

    var query = this.get('query') || '';
    var regex = new RegExp(/\\+/g);

    query = query.replace(regex, '');

    return query;

  }),

  /**
   * filterProperties
   *
   * @description a space-delimited string of dot-notated properties to match against when filtering
   * @memberof FilterContentComponent
   * @type {string}
   * @instance
   */
  filterProperties: '',

  /**
   * filterType
   *
   * @description a string specifying the type of filtering to perform; possible
   *   values include 'array', 'ds', 'object'
   * @memberof FilterContentComponent
   * @enum {string}
   * @instance
   */
  filterType: '',

  /**
   * query
   *
   * @description the query string being filtered against
   * @memberof FilterContentComponent
   * @type {string}
   * @instance
   */
  query: '',

  /* observers
  ------------------------ */

  /**
   * changedContent
   *
   * @description fires when 'content' is changed, fires 'setFilterableContent'
   *   and 'setFilterType'
   * @memberof FilterContentComponent
   * @instance
   */
  changedContent: Ember.observer('content', function() {

    this.setFilterableContent();
    this.setFilterType();

  }), // .on('init')

  /**
   * applyFilter
   *
   * @description apply the correct filter type to 'filterableContent' and populate
   *   'model' with the result
   * @memberof FilterContentComponent
   * @instance
   */
  debounceFilter: Ember.observer('filterableContent', 'filterableQuery', function() {

    Ember.run.debounce(this, this.applyFilter, 350);
  }),

  /* methods
  ------------------------ */

  /**
   * applyFilter
   *
   * @description apply the filter to 'filterableContent', debounced by 'dbounceFilter'
   * @memberof FilterContentComponent
   * @instance
   */
  applyFilter: function() {

    var compare = null;
    var compareItem = null;
    var content = this.get('filterableContent');
    var filterProperties = this.get('filterableProperties');
    var filterType = this.get('filterType');
    var matched = false;
    var model = null;
    var that = this;
    var query = this.get('filterableQuery');

    // only evaluate if there is a query entered
    if (query !== '') {

      // iterate and filter the content
      model = content.filter(function(item) {

        matched = false;

        // iterate each specified property in 'filterProperties' checking for a match
        filterProperties.forEach(function(property) {

          // select compare the painless, ember data way if possible
          if (!matched && filterType === 'ds') {

            compare = item.get(property);

            // check for a match
            if (Ember.isPresent(compare) && that.isMatch(compare, query)) {

              matched = true;
            }

          // otherwise take the long way (getValueAtIndex)
          } else {

            // get an array of items matching the specified property
            compare = that.getValueAtIndex(item, property);

            // iterate each returned item chekcing for a match
            compare.forEach(function(compareItem) {

              if (Ember.isPresent(compareItem) && that.isMatch(compareItem, query)) {

                matched = true;
              }
            });
          }

          return matched;
        });

        return matched;
      });

    } else {

      model = content;
    }

    this.set('model', model);

  },

  /**
   * getValueAtIndex
   *
   * @description return value(s) for an item at specified indices
   * @memberof FilterContentComponent
   * @returns {array} items matching the specified indices
   * @instance
   */
  getValueAtIndex: function(item, index) {

    var component = this;
    var indices = index ? index.split('.') : null;
    var foundItem = item;

    try {

      if (Ember.isPresent(item) && item !== {} && indices) {

        // iterate indices, returning fewer items each time we recurse
        indices.forEach(function(idx) {

          foundItem = component.getItemProperty(foundItem, idx);
        });

      } else {

        if (!item) {

          throw 'required argument "item" is missing';
        }

        if (!indices) {

          throw 'required argument "index" is missing or malformed';
        }
      }

    } catch (ex) {

      console.warn('FilterContentComponent.getValueAtIndex', ex);
    }

    return foundItem;
  },

  /**
   * getItemProperty
   *
   * @description return the value(s) for a specified property on an item
   * @memberof FilterContentComponent
   * @returns {*} items matching the specified property name
   * @instance
   */
  getItemProperty: function(item, property) {

    var returnProperty = [];
    // Getting the property by default, even if it's '@each' (dangerous), and
    // depending on the logic below to avoid problems
    var value = item ? item[property] : null;

    if (item && property) {

      // If requesting @each, iterate the current level and return the items found
      if (property === '@each') {

        item.forEach(function(z) {

          returnProperty.push(z);
        });

        // There is a minor bug where returning an array of arrays would nest
        // entries under a root level array item, causing complications. So since
        // we've requested '@each' (an array!), let's hackishly fix things...
        returnProperty = returnProperty[0];

      // Otherwise, return a single item
      } else if (value) {

        returnProperty.push(value);
      }
    } // if

    return returnProperty ? returnProperty : null;
  },

  /**
   * isDS
   *
   * @description check if passed value is DS.Model
   * @memberof FilterContentComponent
   * @param {*} value the value being evaluated
   * @instance
   */
  isDS: function(value) {

    return (Ember.inspect(value).toLowerCase().indexOf('ds.model') !== -1);
  },

  /**
   * isEmberObj
   *
   * @description check if passed value is Ember.Object
   * @memberof FilterContentComponent
   * @param {*} value the value being evaluated
   * @instance
   */
  isEmberObj: function (value) {

    return (Ember.inspect(value).toLowerCase().indexOf('ember.object') !== -1);
  },

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

    if (valueA && valueB) {

      valueA = valueA.toString().toLowerCase();
      valueB = valueB.toString().toLowerCase();

      return (valueA.match(valueB) !== null);

    } else {

      return false;
    }
  }, // isMatch

  /**
   * setFilterableContent
   *
   * @description set 'filterableContent' to a filter friendly type
   * @memberof FilterContentComponent
   * @instance
   */
  setFilterableContent: function() {

    var content = this.get('content');
    // Ember.typeOf: http://emberjs.com/api/#method_typeOf
    var type = Ember.typeOf(content);

    try {

      // could be Ember.Object, or junk
      if (type === 'instance') {

        // if content is an instance that is not an ember.object, take offense
        if (!isEmberObj(content)) {

          throw 'Ember.typeOf(content) === instance that is not Ember';
        }

      // could be DS.Model, or junk
      } else if (type === 'class') {

        // if content is an instance that is not an ember.object, take offense
        if (!isDS(content)) {

          throw 'Ember.typeOf(content) === class that is not DS';
        }

      } else if (type === 'array') {

        // convert content into an Ember.ArrayProxy
        content = Ember.ArrayProxy.create({ content: Ember.A(content) });

      } else if (type === 'object') {

        // convert content into an  Ember.Object
        content = Ember.Object.create(content);

      } else {

        throw 'Ember.typeOf(content) === "'+ type +'" is not supported';
      }

      this.set('filterableContent', content);

    } catch (ex) {

      console.warn('FilterContentComponent.setFilterableContent', ex);
    }
  },

  /**
   * setFilterType
   *
   * @description set 'filterType' to the "type" of 'filterableContent'
   * @memberof FilterContentComponent
   * @instance
   */
  setFilterType: function() {

    var content = this.get('content');
    // Ember.typeOf: http://emberjs.com/api/#method_typeOf
    var type = Ember.typeOf(content);

    try {

      // Ember.Object or junk
      if (type === 'instance') {

        // if content is an instance that is not an ember.object, take offense
        if (this.isEmberObj(content)) {

          type = 'object';

        } else {

          throw 'Ember.typeOf(content) === instance that is not Ember';
        }

      // DS.Model or junk
      } else if (type === 'class') {

        // if content is an instance that is not an ember.object, take offense
        if (this.isDS(content)) {

          type = 'ds';

        } else {

          throw 'Ember.typeOf(content) === class that is not DS';
        }

      } else {

        if (type !== 'array' && type !== 'object') {

          throw 'Ember.typeOf(content) === "'+ type +'" is not supported';
        }
      }

      this.set('filterType', type);

    } catch (ex) {

      console.warn('FilterContentComponent.setFilterType', ex);
    }
  }
});
