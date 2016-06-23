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
   * classNames
   *
   * @description class names applied to the component DOM object
   * @memberof FilterContentComponent
   * @type {array.<string>}
   * @instance
   */
  classNames: ['filter-content'],

  /**
   * component
   *
   * @description a reference to the component to match deprecation with yield
   *   being passed `controller` or `view`
   * @memberof FilterContentComponent
   * @type {Ember.Component}
   * @instance
   */
  component: Ember.computed(function() {

    return this;
  }),

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
   * filteredContent
   *
   * @description set by applyFilter, the name says it all
   * @memberof FilterContentComponent
   * @type {array}
   * @instance
   */
  filteredContent: [],

  /**
   * inputClassNames
   *
   * @description space-delimited class names to append to the text query input field
   * @memberof FilterContentComponent
   * @type {string}
   * @instance
   */
  inputClassNames: '',

  /**
   * placeholder
   *
   * @description placeholder text for the text input field
   * @memberof FilterContentComponent
   * @type {string}
   * @instance
   */
  placeholder: '',

  /**
   * properties
   *
   * @description a space-delimited string of dot-notated properties to match
   *   against when filtering
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

  /**
   * showInput
   *
   * @description whether to show the query input field
   * @memberof FilterContentComponent
   * @type {string}
   * @instance
   */
  showInput: true,

  /* computed properties
  ------------------------ */

  /**
   * contentComputed
   *
   * @description an object of known type that we can safely, naively filter
   * @memberof FilterContentComponent
   * @type {(Ember.ArrayProxy|Ember.Object|Ember.Enumerable|DS.Model)}
   * @instance
   */
  contentComputed: Ember.computed('content', function() {

    var content = !Ember.isNone(this.get('content')) ? this.get('content') : [];
    // First check if it's an Ember Data Collection
    var type = Ember.typeOf(content.content) || Ember.typeOf(content);

    try {

      // if the content is an array, ensure it's loyal to the cause
      if (content && type === 'array') {

        if (content['@each'] && content['@each'].hasArrayObservers) {

          content = content;

        } else {

          content = Ember.A(content);
        }

        // todo: check on simplifying this
        return content && content.get ? content : Ember.ArrayProxy.create({content: content});

      // todo: check on plausibility of removing this
      } else if (type === 'object') {

        // coerce objects into Ember.Objects
        return Ember.Object.create(content);

      // could be DS.Model, or junk...
      // - if content is an instance that is not an ember.object, take offense
      } else if (type === 'class') {

        // @todo: isDS does not currently exist, luckily this path has never
        // been executed, yet...
        if (this.isDS(content)) {

          return content;

        } else {

          throw 'Ember.typeOf(content) === class that is not DS';
        }

      // could be Ember.Object, or junk...
      // - if content is an instance that is not an ember.object, take offense
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
   * inputClassNamesComputed
   *
   * @description concatenates any passed `inputClassNames` string with 'filter-input'
   * @memberof FilterContentComponent
   * @type {string}
   * @instance
   */
  inputClassNamesComputed: Ember.computed('inputClassNames', function() {

    var classNames = this.get('inputClassNames');

    return (classNames ? classNames + ' ' : '') + 'filter-input';
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

    // cast to string and apply transforms
    if (properties) {

      return  properties
                .toString()
                .replace(regexA, '')
                .split(regexB);

    } else {

      return [];
    }
  }),

  /**
   * queryComputed
   *
   * @description the string being matched against 'contentComputed' replaces
   *   forward slashes to prevent error
   * @todo is there a better solution for forward slashes?
   * @memberof FilterContentComponent
   * @returns {string}
   * @instance
   */
  queryComputed: Ember.computed('query', function() {

    var query = this.get('query');
    var regex = new RegExp(/\\+/g);

    if (Ember.isPresent(query)) {

      return query.replace(regex, '');

    } else {

      return '';
    }
  }),

  /* observers
  ------------------------ */

  /**
   * debounceFilter
   *
   * @description an `Ember.run.later` timer that handles debouncing `applyFilter()`,
   *   set by `setFilterTimer()`
   * @memberof FilterContentComponent
   * @type {string}
   * @instance
   */
  debounceFilter: null,

  /**
   * setFilterTimer
   *
   * @description an observer that sets `debounceFilter` to an `Ember.run.later`
   *   instance
   * @memberof FilterContentComponent
   * @instance
   */
  setFilterTimer: Ember.observer('contentComputed', 'queryComputed', function() {

    Ember.run.cancel(this.get('debounceFilter'));
    this.set('debounceFilter', Ember.run.later(this, this.applyFilter, 350));
  }),

  /* methods
  ------------------------ */

  /**
   * applyFilter
   *
   * @description a debounced method called by `debounceFilter()` to actually apply
   *   the filter
   * @memberof FilterContentComponent
   * @instance
   */
  applyFilter: function() {

    if (this.get('isDestroyed')) { return false; }

    var compareItems = [];
    var component = this;
    var currentItem = [];
    var filteredItems = [];

    // iterate each item passed in `content`
    filteredItems = this.get('contentComputed').filter(function(item) {

      compareItems = [];

      // check each specified property for a match
      component.get('propertiesComputed').forEach(function(prop) {

        currentItem = item;

        // if the item supports `get()`, use it
        if (currentItem.get) {

          currentItem = currentItem.get(prop);

        // if the item doesn't support `get()`, take the hard way
        } else {

          currentItem = component.getFromEnum(Ember.makeArray(currentItem), prop);
        }

        // if an item was found add it to the matching queue
        if (currentItem) {

          compareItems = compareItems.concat(currentItem);
        }
      });

      // return true if the specified indices were found and of those, at least
      // one matched the query
      if (!Ember.isEmpty(compareItems)) {

        return component.arrayContainsMatch(compareItems, component.get('queryComputed'));

      } else {

        return false;
      }
    });

    this.set('filteredContent', filteredItems);
  },

  /**
   * arrayContainsMatch
   *
   * @description a method to check whether an array contains a match for a query
   * @memberof FilterContentComponent
   * @param possibleMatches {array.<string>} an array of strings to match against
   * @param query {string} the query used to match against `possibleMatches`
   * @returns {boolean} whether `possibleMatches` contains a match
   */
  arrayContainsMatch: function(possibleMatches, query) {

    var component = this;
    var matchFound = false;

    possibleMatches.forEach(function(item) {

      if (!matchFound && component.isMatch(item, query)) {

        matchFound = true;
      }
    });

    return matchFound;
  },

  /**
   * getFromEnum
   *
   * @description provides `get()`-like functionality for enumerables
   * @param {array} enumerable the array of items to search for `property`
   * @param {string} property dot notation of desired property
   * @returns {array} properties matching specified indices
   */
  getFromEnum: function(enumerable, property) {

    var component = this;
    var found = [];
    var len = 0;
    var properties = property.split('.') || [];
    var skip = false;
    var tempItem = null;
    var tempProperties = properties;

    len = properties.length;

    // if no array was passed return an empty array
    if (!enumerable) {

      return [];

    // if all that was requested was "@each" return what was passed in
    } else if (property === '@each') {

      return enumerable;
    }

    // iterate the passed array of items and attempt to "`get(property)`" from each
    enumerable.forEach(function(item) {

      // create copies that can be modified
      tempItem = item;
      tempProperties = properties;

      // iterate each specified index chunk to...
      tempProperties.forEach(function(index, y) {

        // efficiency/safety check
        if (!skip && tempItem) {

          // if the specified index is "@each":
          // - if current item is last
          //   - return whatever `tempItem` is
          // - if current item is not last
          //   - recurse and continue looking for value(s)
          // - set `skip=true` to prevent subsequent loops from incorrectly
          //   trying to whittle down `tempItem`
          if (index === '@each') {

            if (Ember.isArray(tempItem)) {

              if (y + 1 !== len) {

                // recurse and continue looking for value(s)
                tempItem = Ember.makeArray(tempItem);
                tempProperties = tempProperties.slice(y + 1, len).join('.');
                tempItem = component.getFromEnum(tempItem, tempProperties);

              } else {

                tempItem = tempItem;
              }

            // if the item isn't an array return null to prevent problems
            } else {

              tempItem = null;
            }

            // prevent subsequent loops from incorrectly trying to whittle
            // down `tempItem`
            skip = true;

          // if `tempItem` is an object, attempt to find a value at the
          // specified index
          } else if (typeof tempItem === 'object') {

            tempItem = tempItem[index] || null;

          // if the specified index was not "@each" and `item` isn't an object
          } else {

            tempItem = null;
            skip = true;
          }
        }
      });

      // reset `skip` for the next iteration
      skip = false;

      // if `tempItem` still exists at this point, add it to the array of
      // found items
      if (tempItem) {

        found = found.concat(tempItem);
      }
    });

    return found;
  },

  /**
   * init
   *
   * @description use init to kick off an initial filtering
   */
  init: function() {

    this._super();
    this.applyFilter();
  },

  /**
   * isMatch
   * @todo: seems like this would fail if either value was 'false', should
   *   probably fix this if that's the case...
   *
   * @description checks if valueA and valueB match; passed values are sloppily
   *   coerced to strings
   * @memberof FilterContentComponent
   * @param {(number|string)} valueA
   * @param {(number|string)} valueA
   * @returns {boolean} whether there was a match between the passed values
   */
  isMatch: function(valueA, valueB) {

    var matched = false;
    var typeA = Ember.typeOf(valueA);
    var typeB = Ember.typeOf(valueB);

    typeA = (typeA === 'undefined' || typeA === 'null' || typeA === 'number' || typeA === 'string' || typeA === 'boolean');
    typeB = (typeB === 'undefined' || typeB === 'null' || typeB === 'number' || typeB === 'string' || typeB === 'boolean');

    if (typeA && typeB) {

      valueA = Ember.inspect(valueA).toLowerCase();
      valueB = Ember.inspect(valueB).toLowerCase();
      matched = (valueA.match(valueB) !== null);
    }

    return matched;
  },

  /**
   * willDestroy
   * @todo: this may be elligible for deprecation
   *
   * @description runs before the component is destroyed and tears things down
   */
  willDestroy: function() {

    this._super();
    this.set('debounceFilter', null);
  }
});
