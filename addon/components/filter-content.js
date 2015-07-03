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
   * fContent
   *
   * @description an object of known type that we can safely, naively filter
   * @memberof FilterContentComponent
   * @type {(Ember.ArrayProxy|Ember.Object|Ember.Enumerable|DS.Model)}
   * @instance
   */
  fContent: Ember.computed('content', function() {

    var content = this.get('content');
    // var returns = null;
    var type = Ember.typeOf(content);

    try {

      if (type === 'array') {

        // coerce returns into Ember.Array
        return Ember.A(content);

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
  fType: Ember.computed('content', function() {

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

  /* observers
  ------------------------ */

  debounceFilter: null,

  /**
   * debounceFilter
   *
   * @description apply the correct filter type to 'fContent' and populate
   *   'model' with the result
   * @memberof FilterContentComponent
   * @instance
   */
  setFilterTimer: Ember.observer('fContent', 'fQuery', function() {

    this.set('debounceFilter', Ember.run.later(this, this.applyFilter, 350));
  }),

  /* methods
  ------------------------ */

  model: 'butt',

  /**
   * applyFilter
   *
   * @description apply the filter to 'fContent', debounced by 'dbounceFilter'
   * @memberof FilterContentComponent
   * @instance
   */
  applyFilter: function() {

    // side step a bug that occurs during testing
    // todo: find a better fix for this... `willDestroy`?
    if (this.get('isDestroyed')) { return false; }

    // Ember.run(function() {

      var compare = [];
      var fContent = this.get('fContent');
      var fProps = this.get('fProperties');
      var fQuery = this.get('fQuery');
      var fType = this.get('fType');
      var match = false;
      // var prop = null;
      var returns = [];
      var that = this;

      if (!Ember.isBlank(fContent) && !Ember.isBlank(fQuery) && !Ember.isBlank(fProps)) {

        if (fType === 'array') {

          // iterate each item passed in `content`
          returns = Ember.EnumerableUtils.filter(fContent, function(item) {

            compare = item;
            match = false;

            // check each specified property for a match
            fProps.forEach(function(prop) {

              // split the property into its dot string fragments
              // prop = prop.split('.');

              // recurse into the object using dot string fragments
              // prop.forEach(function(propFrag) {

              compare = that.enumGet(compare, prop);
              // });/

              if (that.containsMatch(compare, fQuery)) {

                match = true;
              }
            });

            return match;
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

      this.set('model', returns);
    // });
  },

  containsMatch: function(arr, query) {

    var that = this;
    var match = false;

    arr.forEach(function(item) {

      if (that.isMatch(item, query)) {

        match = true;
      }
    });

    return match;
  },

  /**
   * a poor man's `get` for use on enumerables
   * - returns a single, root-level value
   *
   * @param {array} arr the array being filtered
   * @param {string} index dot notation of desired property
   * @returns {array} properties matching specified indices
   */
  enumGet: function(arr, index) {

    var component = this;
        index = Ember.inspect(index).split('.');
    var returns = arr;
    var len = index.length;
    var skip = false;
    // var prevPid = null;



    index.forEach(function(pid, z) {

      if (!skip) {

        if (pid === '@each') {

          var test = index.slice(z + 1, len).join('.');

          if (z + 1 === len) {

            returns = returns;

          } else {

            console.log('> '+ index.join('.'), index.slice(z + 1, len));
            console.log('#1', returns);
            console.log('#2', test);
            console.log('##', index.slice(z + 1, len));
            console.log('###', index.slice(z + 1, len).join('.'));
            console.log('####', component.enumGet(returns, test));

            skip = true;
            returns = component.enumGet(returns, test);
          }

        } else if (returns[pid]) {

          returns = returns[pid];

        } else {

          returns = [];
        }
      }
    });

    // prevPid = z > 0 ? index[z - 1] : null;
    //
    // } else if (prevPid === '@each' && z < len) {
    //   console.log('previous was @each');
    //   returns = component.enumGet(returns, prevPid);
    //   console.log('value is', returns);

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
  },

  setup: Ember.on('init', function() {

    // trigger fContent if necessary
    if (!this.get('content')) {

      this.set('content', []);
    }
  }),

  willDestroy: function() {

    this._super();

    // Ember.run.cancel(this.get('debounceFilter'));
    this.set('debounceFilter', null);
  }
});
