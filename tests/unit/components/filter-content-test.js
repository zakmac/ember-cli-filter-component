import DS from 'ember-data';
import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('filter-content', {});

var typeEmberDSObj = DS.Model.extend({});
var typeEmberArr = Ember.ArrayProxy.create({ content: Ember.A([]) });
var typeEmberObj = Ember.Object.create({});

// initial state
// ---------------------

test('initial component state', function(assert) {

  assert.expect(11);

  var component = this.subject();

  // ensure all properties have the correct default state
  assert.deepEqual(
    component.get('classNames'),
    ['ember-view', 'filter-content'],
    '`classNames` has an initial value of ["ember-view", filter-content"]');

  assert.deepEqual(
    component.get('content'),
    [],
    '`content` has an initial value of []');

  assert.strictEqual(
    component.get('inputClassNames'),
    '',
    '`inputClassNames` has an initial value of ""');

  assert.strictEqual(
    component.get('placeholder'),
    '',
    '`placeholder` has an initial value of ""');

  assert.strictEqual(
    component.get('properties'),
    '',
    '`properties` has an initial value of ""');

  assert.strictEqual(
    component.get('query'),
    '',
    '`query` has an initial value of ""');

  assert.strictEqual(
    component.get('showInput'),
    true,
    '`showInput` has an initial value of true');

  assert.deepEqual(
    component.get('contentComputed'),
    [],
    '`contentComputed` initially computes to []');

  assert.strictEqual(
    component.get('inputClassNamesComputed'),
    'filter-input',
    '`inputClassNamesComputed` initially computes to "filter-content"');

  assert.deepEqual(
    component.get('propertiesComputed'),
    [],
    '`propertiesComputed` initially computes to []');

  assert.strictEqual(
    component.get('queryComputed'),
    '',
    '`queryComputed` initially computes to ""');

  // @todo: write a test to check initial status of filter input field's class?
});

// properties
// ---------------------
// noop, property values are covered by initial state tests

test('property `classNames`', function(assert) {

  assert.expect(0);
});

test('property `content`', function(assert) {

  assert.expect(0);
});

test('property `placeholder`', function(assert) {

  assert.expect(0);
});

test('property `properties`', function(assert) {

  assert.expect(0);
});

test('property `query`', function(assert) {

  assert.expect(0);
});

// computed properties
// ---------------------

test('computed property `propertiesComputed`', function(assert) {

  assert.expect(5);

  var component = this.subject();

  // input is sanitized
  Ember.run(function() {

    component.set('properties', '!#$%test.subProp^&()/\\');
  });

  assert.deepEqual(
    component.get('propertiesComputed'),
    ['test.subProp'],
    'passed values have non-[alphanumeric, underscore, period, space, atsymbol] characters removed');

  // filtering by a single index
  Ember.run(function() {

    component.set('properties', 'username');
  });

  assert.ok(
    Ember.isArray(component.get('propertiesComputed')),
    'specifying a single property for `properties` returns a value of type {array}');

  assert.deepEqual(
    component.get('propertiesComputed'),
    ['username'],
    'returned array contains a single value matching the passed property');

  // filtering by multiple indices
  Ember.run(function() {

    component.set('properties', 'username email accessLevel.@each');
  });

  assert.ok(
    Ember.isArray(component.get('propertiesComputed')),
    'specifying multiple properties for `properties` returns a value of type {array}');

  assert.deepEqual(
    component.get('propertiesComputed'),
    ['username', 'email', 'accessLevel.@each'],
    'returned array contains three entries each matching their passed property');
});

test('computed property `queryComputed`', function(assert) {

  assert.expect(1);

  var component = this.subject();

  // input sanitization
  Ember.run(function() {

    component.set('query', 'test\\query');
  });

  assert.equal(
    component.get('queryComputed'),
    'testquery',
    'returned value has backslashes removed');
});

test('computed properties observe their specified targets', function(assert) {

  assert.expect(4);

  var component = this.subject();

  // changing `content` recomputes observers
  Ember.run(function() {

    component.set('content', [{thing: 'A'}]);
  });

  assert.deepEqual(
    component.get('contentComputed'),
    [{thing: 'A'}],
    'Changing `content` updates `contentComputed`');

  // changing `inputClassNames` recomputes observers
  Ember.run(function() {

    component.set('inputClassNames', 'test-class anotherClass');
  });

  assert.strictEqual(
    component.get('inputClassNamesComputed'),
    'test-class anotherClass filter-input',
    'Changing `inputClassNames` updates `inputClassNamesComputed`');

  // changing `properties` recomputes observers
  Ember.run(function() {

    component.set('properties', 'thing');
  });

  assert.deepEqual(
    component.get('propertiesComputed'),
    ['thing'],
    'Changing `properties` updates `propertiesComputed`');

  // changing `query` recomputes observers
  Ember.run(function() {

    component.set('query', 'A test query');
  });

  assert.strictEqual(
    component.get('queryComputed'),
    'A test query',
    'Changing `query` updates `queryComputed`');
});

// observers
// ---------------------

test('observer `debounceFilter`', function(assert) {

  assert.expect(0);
});

// methods
// ---------------------

test('method `applyFilter`', function(assert) {

  assert.expect(0);
});

test('method `containsMatch`', function(assert) {

  assert.expect(7);

  var component = this.subject();

  // can match numbers
  assert.ok(
    component.arrayContainsMatch([1, 2, 3], '2'),
    'can match a string containing an integer against an integer');

  assert.ok(
    component.arrayContainsMatch(['1', '2', '3'], '2'),
    'can match two strings containing integers against one another');

  assert.ok(
    component.arrayContainsMatch(['100', '200', '300'], '2'),
    'can perform a partial match on integers');

  // can match strings
  assert.ok(
    component.arrayContainsMatch(['one', 'two', 'three'], 'two'),
    'can match two strings against one another');

  assert.ok(
    component.arrayContainsMatch(['one', 'two', 'three'], 'w'),
    'can perform a partial match on strings');

  // returns false on mismatch
  assert.ok(
    !component.arrayContainsMatch(['one', 'two', 'three'], '1'),
    'does not return a match when there is no match expected');

  assert.ok(
    !component.arrayContainsMatch(['one', 'two', 'three'], 'onehundred'),
    'does not return a match when the match would be a substring of the query');
});

test('method `getFromEnum`', function(assert) {

  assert.expect(3);

  var component = this.subject();

  // can get value of a property
  assert.deepEqual(
    component.getFromEnum([{prop: 'valA'}, {prop: 'valB'}], 'prop'),
    ['valA', 'valB'],
    'can get the value of an object\'s property');

  // can get `@each`
  assert.deepEqual(
    component.getFromEnum([1, 2, 3], '@each'),
    [1, 2, 3],
    'can parse an `@each` selector');

  // can get nested properties
  assert.deepEqual(
    component.getFromEnum([{prop: {subProp: 'valA'}}, {prop: {subProp: 'valB'}}], 'prop.subProp'),
    ['valA', 'valB'],
    'can parse nested properties');
});

test('method `isMatch`', function(assert) {

  assert.expect(10);

  var component = this.subject();

  // Ember.run(function() {

    // check mismatches
    assert.ok(
      !component.isMatch(true, false),
      'true and false do not match');

    assert.ok(
      !component.isMatch(0, 1),
      '0 and 1 do not match');

    assert.ok(
      !component.isMatch('yes', 'no'),
      '"yes" and "no" do not match');

    // check matches
    assert.ok(
      component.isMatch(true, true),
      'true and true match');

    assert.ok(
      component.isMatch(false, false),
      'false and false match');

    assert.ok(
      component.isMatch(1, 1),
      '1 and 1 match');

    assert.ok(
      component.isMatch('1', '1'),
      '"1" and "1" match');

    assert.ok(
      component.isMatch(1, '1'),
      '1 and "1" and integer {string} match');

    assert.ok(
      component.isMatch('test', 'test'),
      '"test" and "test" match');

    assert.ok(
      component.isMatch('TEST', 'test'),
      '"TEST" and "test" match');

  // });
});

test('method `willDestroy`', function(assert) {

  assert.expect(0);
});

// functionality
// ---------------------

test('component filters when type is array', function(assert) {

  assert.expect(6);

  var component = this.subject();
  var dummyData = [
    [
      [1, 2, 3],
      ['A', 'B', 'C']
    ], {
      prop: 'valZ'
    }, {
      prop: {
        prop: 'valY'
      }
    }, [
      'valX', 'valW', 'valV'
    ], {
      prop: [
        'valU', 'valT', 'valS'
      ]
    }, {
      prop: [{
        prop: 'valR'
      }, {
        prop: 'valQ'
      }, {
        prop: 'valP'
      }]
    }
  ];

  // root level property
  Ember.run(function() {

    component.set('content', dummyData);
    component.set('properties', 'prop');
    component.set('query', 'Z');
    component.applyFilter();
  });

  assert.deepEqual(
    component.get('filteredContent'),
    [{prop: 'valZ'}],
    'root level property');

  // nested property
  Ember.run(function() {

    component.set('properties', 'prop.prop');
    component.set('query', 'Y');
    component.applyFilter();
  });

  assert.deepEqual(
    component.get('filteredContent'),
    [{prop: {prop: 'valY'}}],
    'nested property');

  // root level array
  Ember.run(function() {

    component.set('properties', '@each');
    component.set('query', 'X');
    component.applyFilter();
  });

  assert.deepEqual(
    component.get('filteredContent'),
    [['valX', 'valW', 'valV']],
    'root level array');

  // nested array
  Ember.run(function() {

    component.set('properties', 'prop.@each');
    component.set('query', 'T');
    component.applyFilter();
  });

  assert.deepEqual(
    component.get('filteredContent'),
    [{prop: ['valU', 'valT', 'valS']}],
    'nested array');

  // array of arrays
  Ember.run(function() {

    component.set('content', dummyData);
    component.set('properties', '@each.@each');
    component.set('query', 'A');
    component.applyFilter();
  });

  assert.deepEqual(
    component.get('filteredContent'),
    [[[1, 2, 3], ['A', 'B', 'C']]],
    'array of arrays');

  // properties in a nested array
  Ember.run(function() {

    component.set('properties', 'prop.@each.prop');
    component.set('query', 'Q');
    component.applyFilter();
  });

  assert.deepEqual(
    component.get('filteredContent'),
    [{prop: [{prop: 'valR'}, {prop: 'valQ'}, {prop: 'valP'}]}],
    'properties in a nested array');
});
