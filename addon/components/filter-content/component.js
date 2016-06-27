import Ember from 'ember';
import layout from './template';

/**
 * @name        FilterContentComponent
 * @description component that applys a simple filter to a specified content model
 *              based on basic matching
 * @extends     external:Ember.Component
 */
export default Ember.Component.extend({

  /* properties
  ------------------------ */

  /**
   * @name        classNames
   * @description class names applied to the component DOM object
   * @type        {array.<string>}
   */
  classNames: ['filter-content'],

  /**
   * @name        content
   * @description the content passed in to be filtered
   * @type        {(array|object|Ember.Object|Ember.Enumerable|DS.Model)}
   */
  content: [],

  /**
   * @name        properties
   * @description a space-delimited string of dot-notated properties to match
   *              against when filtering
   * @type        {string}
   */
  properties: '',

  /**
   * @name        query
   * @description the query string being filtered against
   * @type        {string}
   */
  query: '',

  applyFilter () {

    try {

      var content = this.get ('content') || [];
      var matched = false;
      var properties = this.normalizeProperties ();
      var propertiesTmp = [];
      var query = this.get ('normalizedQuery') || null;
      var values = [];

      if (!content || !properties) { return content ? content : []; }

      if (content.length && properties.length && !!query) {

        content = content.filter (item => {

          matched = false;
          propertiesTmp = properties.slice (0);

          propertiesTmp.forEach (prop => {

            values = values.concat (this.getContentProps (item, prop) || []);
          });

          while (matched === false && values.length) {

            matched = this.isMatch(values.shift (), query) ? true : false;
          }

          values = [];
          return matched;
        });
      }

      this.set('filteredContent', content);

    } catch (exception) {

      if (window.console) { window.console.error ('applyFilter', exception) }
    }
  },

  /**
   * @name        getContentProps
   * @description returns an array of values from `item` at dot notated `property`
   * @param       {(array|object)} item
   * @param       {(string)} property dot notated index
   * @returns     {array} an array of values matching `property`'s index
   */
  getContentProps (item, property) {

    // console.log('getContentProps', property, item);

    try {

      var propArr = property.split (/\.+/g);// (/\.?\@each\.?/g);
      var prop = '';
      var values = [];
      var z = [];

      if (!propArr.length) { return []; }

      prop = propArr.shift ();

      if (prop === '@each') {

        item.forEach (i => values = values.concat (propArr.length ? this.getContentProps (i, propArr.join('.')) : i));

      } else {

        z = Ember.get (item, prop) || [];
        values = values.concat (propArr.length ? this.getContentProps (z, propArr.join('.')) : z);
      }

      return values && !!values.length ? values : [];

    } catch (exception) {

      if (window.console) { window.console.error ('getContentProps', exception) }
    }
  },

  /**
   * @name        filterableProperties
   * @description normalize `properties` and return them as an array
   * @returns     {array}
   */
  normalizeProperties () {

    try {

      var properties = this.get ('properties') || '';

      return !properties ? [] : properties
        // replace invalid characters
        .replace(/[^\w\s\@\.\-]+/g, '')
        // replace multiple periods with single periods
        .replace(/[\.]{2,}/g, '.')
        // normalize delimiter to single spaces
        .replace(/(\.+)?\s\1?/g, ' ')
        .split(/\s/g);

      } catch (exception) {

        if (window.console) { window.console.error ('normalizedProperties', exception) }
      }
  },

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
  normalizedQuery: Ember.computed('query', function() {

    try {

      var query = this.get ('query');

      return Ember.isPresent(query) ? query.replace(/\\+/g, '') : '';

    } catch (exception) {

      if (window.console) { window.console.error ('normalizedQuery', exception); }
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
  setFilterTimer: Ember.observer('content', 'normalizedProperties', 'normalizedQuery', function() {

    Ember.run.cancel(this.get('debounceFilter'));
    this.set('debounceFilter', Ember.run.later(this, this.applyFilter, 350));
  }),

  /* methods
  ------------------------ */

  /**
   * @name        init
   * @description n/a
   */
  init () {

    this._super ();
    this.applyFilter ();
  },

  /**
   * @name        isMatch
   * @todo        seems like this would fail if either value was 'false', should
   *              probably fix this if that's the case...
   * @description checks if valueA and valueB match; passed values are sloppily
   *              coerced to strings
   * @param       {(number|string)} valueA
   * @param       {(number|string)} valueA
   * @returns     {boolean} whether there was a match between the passed values
   */
  isMatch (valueA, valueB) {

    // console.log('ismatch', valueA, valueB);

    var matched = false;
    var typeA = Ember.typeOf (valueA);
    var typeB = Ember.typeOf (valueB);

    typeA = (typeA === 'undefined' || typeA === 'null' || typeA === 'number' || typeA === 'string' || typeA === 'boolean');
    typeB = (typeB === 'undefined' || typeB === 'null' || typeB === 'number' || typeB === 'string' || typeB === 'boolean');

    if (typeA && typeB) {

      valueA = Ember.inspect (valueA).toLowerCase ();
      valueB = Ember.inspect (valueB).toLowerCase ();
      matched = (valueA.match (valueB) !== null);
    }

    return matched;
  },

  /**
   * @name        willDestroy
   * @todo        this may be elligible for deprecation
   * @description runs before the component is destroyed and tears things down
   */
  willDestroy () {

    this._super ();
    this.set ('debounceFilter', null);
  }
});
