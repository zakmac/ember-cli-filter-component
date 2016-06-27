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
   * @type        {(array|object|Ember.Object)}
   */
  content: [],

  /**
   * @name        debounceFilter
   * @description timer handling debouncing `applyFilter()`, set by `setFilterTimer()`
   * @type        {Ember.run.later}
   */
  debounceFilter: null,

  layout,

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

  /**
   * @name        filterableProperties
   * @description normalize `properties` and return them as an array
   * @returns     {array} an array of normalized property indices
   */
  normalizedProperties: Ember.computed ('query', 'properties', function () {

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

        if (window.console) { window.console.error ('normalizedProperties', exception); }
      }
  }),

  /**
   * @name        queryComputed
   * @description the string being matched against 'contentComputed' replaces
   *              forward slashes to prevent error
   * @returns     {string}
   * @todo        is there a better solution for forward slashes?
   */
  normalizedQuery: Ember.computed('query', function () {

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
   * @name        setFilterTimer
   * @description an observer that passes `debounceFilter` to `Ember.run.later`
   */
  setFilterTimer: Ember.observer('content', 'normalizedProperties', 'normalizedQuery', function () {

    try {

      Ember.run.cancel(this.get('debounceFilter'));
      this.set('debounceFilter', Ember.run.later(this, this.applyFilter, 420));

    } catch (exception) {

      if (window.console) { window.console.error ('setFilterTimer', exception); }
    }
  }),

  /* methods
  ------------------------ */

  /**
   * @name        applyFilter
   * @description filters for `query` against value(s) of `properties` in `content`
   */
  applyFilter () {

    try {

      var content = this.get ('content') || [];
      var matched = false;
      var properties = this.get ('normalizedProperties') || [];
      var propertiesTmp = [];
      var query = this.get ('normalizedQuery') || '';
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

      if (window.console) { window.console.error ('applyFilter', exception); }
    }
  },

  /**
   * @name        getContentProps
   * @description returns an array of values from `item` at dot notated `property`
   * @param       {(array|object)} item
   * @param       {string} property dot notated index
   * @returns     {array} an array of values matching `property`'s index
   */
  getContentProps (item, property, inception = 0) {

    try {

      var propArr = property.split (/\.+/g);// (/\.?\@each\.?/g);
      var prop = '';
      var values = [];
      var z = [];

      if (!propArr.length) { return []; }

      prop = propArr.shift ();

      // get array items
      if (prop === '@each') {

        // if @each is the only property and we are not incepted...
        if (!propArr.length && inception === 0) {

          values = values.concat (item);

        // if the item is eachable...
        } else if (item.forEach) {

          item.forEach (i => values = values.concat (propArr.length ? this.getContentProps (i, propArr.join ('.'), ++inception) : i));
        }

      // get item property
      } else {

        z = Ember.get (item, prop) || [];
        values = values.concat (propArr.length ? this.getContentProps (z, propArr.join ('.'), ++inception) : z);
      }

      return values && !!values.length ? values : [];

    } catch (exception) {

      if (window.console) { window.console.error ('getContentProps', exception); }
    }
  },

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

    try {

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

    } catch (exception) {

      if (window.console) { window.console.error ('isMatch', exception); }
    }
  },

  /**
   * @name        willDestroy
   * @todo        this may be elligible for deprecation
   * @description runs before the component is destroyed and tears things down
   */
  willDestroy () {

    this._super ();
    Ember.run.cancel(this.get('debounceFilter'));
  }
});
