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

  /* observers
  ------------------------ */

  /**
   * debounceFilter
   *
   * @description apply the correct filter type to 'fContent' and populate
   *   'model' with the result
   * @memberof FilterContentComponent
   * @instance
   */
  debounceFilter: Ember.observer('content', 'query', function() {

    console.log('debounce');

    Ember.run.debounce(this, this.applyFilter, 350);
  }),

  /**
   * fType
   *
   * @description returns a sanitized `typeof content`
   * @memberof FilterContentComponent
   * @instance
   */
  fType: Ember.computed('content', function() {

    console.log('fType');

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
  }),

  /**
   * fContent
   *
   * @description an object of known type that we can safely, naively filter
   * @memberof FilterContentComponent
   * @type {(Ember.ArrayProxy|Ember.Object|Ember.Enumerable|DS.Model)}
   * @instance
   */
  fContent: Ember.computed('content', function() {

    console.log('fContent');

    var content = this.get('content');
    var returns = null;
    var type = Ember.typeOf(content);

    try {

      if (type === 'array') {

        // coerce returns into Ember.Array
        returns = Ember.A(content);

      } else if (type === 'object') {

        // coerce returns into an  Ember.Object
        returns = Ember.Object.create(content);

      // could be DS.Model, or junk
      // if content is an instance that is not an ember.object, take offense
      } else if (type === 'class') {

        if (isDS(content)) {

          returns = content;

        } else {

          throw 'Ember.typeOf(content) === class that is not DS';
        }

      // could be Ember.Object, or junk
      // if content is an instance that is not an ember.object, take offense
      } else if (type === 'instance') {

        if (isEmberObj(content)) {

          returns = content;

        } else {

          throw 'Ember.typeOf(content) === instance that is not Ember';
        }

      } else {

        throw 'Ember.typeOf(content) === "'+ type +'" is not supported';
      }

      return returns;

    } catch (ex) {

      console.warn('FilterContentComponent.fContent', ex);
    }
  }),

  /**
   * fProperties
   *
   * @description an array of strings representing the fContent properties
   *   matching against
   * @memberof FilterContentComponent
   * @returns {array}
   * @instance
   */
  fProperties: Ember.computed('properties', function() {

    console.log('fProperties');

    var properties = this.get('properties') || '';
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
   * fQuery
   *
   * @description the string being matched against 'fContent' replaces
   *   forward slashes to prevent error
   * @todo is there a better solution for forward slashes?
   * @memberof FilterContentComponent
   * @returns {string}
   * @instance
   */
  fQuery: Ember.computed('query', function() {

    console.log('fQuery');

    var query = this.get('query');
    var regex = new RegExp(/\\+/g);

    query = query.replace(regex, '');

    return query;
  }),

  /* methods
  ------------------------ */

  /**
   * applyFilter
   *
   * @description apply the filter to 'fContent', debounced by 'dbounceFilter'
   * @memberof FilterContentComponent
   * @instance
   */
  applyFilter: function() {

    console.log('apply');

    var compare = [];
    var fContent = null;
    var fProps = null;
    var fQuery = null;
    var fType = null;
    var prop = null;
    var returns = null;
    var that = this;

    // done in a separate run loop to avoid issues
    Ember.run(this, function() {

      fContent = this.get('fContent');
      fProps = this.get('fProperties');
      fQuery = this.get('fQuery');
      fType = this.get('fType');
    });

    Ember.run.next(this, function() {

      console.log('//------');
      console.log(fContent, fProps, fQuery, fType);
      console.log('finishapply', !Ember.isEmpty(fContent), !Ember.isBlank(fQuery), !Ember.isBlank(fProps));
      console.log('------//');

      if (!Ember.isBlank(fContent) && !Ember.isBlank(fQuery) && !Ember.isBlank(fProps)) {

        if (fType === 'array') {

          console.log('isArr');

          // iterate each item passed in `content`
          returns = Ember.EnumerableUtils.filter(fContent, function(item) {

            // check each specified property for a match
            fProps.forEach(function(prop) {

              compare = that.enumGet(item, prop);

              return that.containsMatch(compare, fQuery);
            });

            return false;
          });

        } else {

          // iterate each item passed in `content`
          returns = Ember.EnumerableUtils.filter(fContent, function(item) {

            // check each specified property for a match
            fProps.forEach(function(prop) {

              compare = this.get(prop);

              return that.containsMatch(compare, fQuery);
            });

            return false;
          });
        }
      }

      console.log('ret', returns);

      this.set('model', returns);
    });
  },

  containsMatch: function(arr, query) {

    var that = this;

    arr.forEach(function(item) {

      if (that.isMatch(item, query)) {

        return true;
      }
    });

    return false;
  },

  /**
   * a poor man's `get` for use on enumerables
   *
   * @param {array} arr the array being filtered
   * @param {string} index dot notation of desired property
   * @returns {array} properties matching specified indices
   */
  enumGet: function(arr, index) {

    var returns = arr;

    index = Ember.inspect(index).split('.');

    index.forEach(function(pid) {

      if (pid === '@each') {

        returns = returns;

      } else if (returns[pid]) {

        returns = returns[pid];

      } else {

        returns = null;
      }
    });

    return Ember.makeArray(returns);
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
  }
});
