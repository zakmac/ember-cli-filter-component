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
var typeLiteralObj = {};
var typeLiteralArr = [];

// initial state
// ---------------------

test('initial component state', function(assert) {

  assert.expect(6);

  var component = this.subject();

  // ensure all properties have the correct default state
  assert.deepEqual(
    component.get('content'),
    [],
    '`content` === []');

  assert.strictEqual(
    component.get('properties'),
    '',
    '`properties` === ""');

  assert.strictEqual(
    component.get('query'),
    '',
    '`query` === ""');

  // ensure all computed properties have the correct default value
  assert.strictEqual(
    component.get('fType'),
    'array',
    '`fType` === "array" (lowercase req.)');

  assert.deepEqual(
    component.get('fContent'),
    [],
    '`fContent` === []');

  assert.deepEqual(
    component.get('fProperties'),
    [],
    '`fProperties` === []');
});

// properties
// ---------------------
// noop, property values are covered by initial state tests

test('property `content`', function(assert) {

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

test('computed property `fProperties`', function(assert) {

  assert.expect(5);

  var component = this.subject();
  var z = null;

  // input is sanitized
  Ember.run(function() {

    component.set('properties', '!#$%test.subProp^&()/\\');
  });

  assert.deepEqual(
    component.get('fProperties'),
    ['test.subProp'],
    'passed values have non-[alphanumeric, underscore, period, space, atsymbol] characters removed');

  // filtering by a single index
  Ember.run(function() {

    component.set('properties', 'username');
  });

  assert.ok(
    Ember.isArray(component.get('fProperties')),
    'specifying a single property for `properties` returns {array}');

  assert.deepEqual(
    component.get('fProperties'),
    ['username'],
    'returned array matches expectations');

  // filtering by multiple indices
  Ember.run(function() {

    component.set('properties', 'username email accessLevel.@each');
  });

  assert.ok(
    Ember.isArray(component.get('fProperties')),
    'specifying multiple properties for `properties` returns {array}');

  assert.deepEqual(
    component.get('fProperties'),
    ['username', 'email', 'accessLevel.@each'],
    'returned array matches expectations');
});//

test('computed property `fQuery`', function(assert) {

  assert.expect(1);

  var component = this.subject();

  // input sanitization
  Ember.run(function() {

    component.set('query', 'test\\query');
  });

  assert.equal(
    component.get('fQuery'),
    'testquery',
    'passed value has backslashes removed');
});

test('computed property `fType`', function(assert) {

  assert.expect(0);
});

test('computed properties observe', function(assert) {

  assert.expect(4);

  var component = this.subject();
  var z = null;

  // changing `content` recomputes observers
  Ember.run(function() {

    z = [{thing: 'A'}];
    component.set('content', z);
  });

  assert.deepEqual(
    component.get('fContent'),
    z,
    'Changing `content` updates `fContent`');

  assert.strictEqual(
    component.get('fType'),
    'array',
    'Changing `content` updates `fType`');

  // changing `properties` recomputes observers
  Ember.run(function() {

    z = 'thing';
    component.set('properties', z);
  });

  assert.deepEqual(
    component.get('fProperties'),
    [z],
    'Changing `properties` updates `fProperties`');

  // changing `query` recomputes observers
  Ember.run(function() {

    z = "A test query";
    component.set('query', z);
  });

  assert.strictEqual(
    component.get('fQuery'),
    z,
    'Changing `query` updates `fQuery`');
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

  assert.expect(0);
});

test('method `enumGet`', function(assert) {

  assert.expect(3);

  var component = this.subject();
  var z = null;

  // can get value of a property
  assert.deepEqual(
    component.enumGet({prop: 'value'}, 'prop'),
    ['value'],
    'can get the value of an object\'s property');

  // can get `@each`
  assert.deepEqual(
    component.enumGet([1, 2, 3], '@each'),
    [1, 2, 3],
    'can parse an `@each` selector');

  // can get nested properties
  assert.equal(
    component.enumGet({prop: {subProp: 'value'}}, 'prop.subProp'),
    'value',
    'can parse nested properties');
});

test('method `isDS`', function(assert) {

  assert.expect(5);

  var component = this.subject();
  var test = this;

  // check if objects are DS.Model
  assert.ok(
    component.isDS(typeEmberDSObj),
    'DS.Model returns true');

  assert.ok(
    !component.isDS(typeEmberArr),
    'Ember.Array returns false');

  assert.ok(
    !component.isDS(typeEmberObj),
    'Ember.Object returns false');

  assert.ok(
    !component.isDS(typeLiteralObj),
    'Object literal returns false');

  assert.ok(
    !component.isDS(typeLiteralArr),
    'Array literal returns false');
});

test('method `isEmberObj`', function(assert) {

  assert.expect(5);

  var component = this.subject();

  // Ember.run(function() {

    // check if objects are Ember.Object
    assert.ok(
      component.isEmberObj(typeEmberObj),
      'Ember.Object returns true');

    assert.ok(
      !component.isEmberObj(typeEmberDSObj),
      'DS.Model returns false');

    assert.ok(
      !component.isEmberObj(typeEmberArr),
      'Ember.Array returns false');

    assert.ok(
      !component.isEmberObj(typeLiteralObj),
      'Object literal returns false');

    assert.ok(
      !component.isEmberObj(typeLiteralArr),
      'Array literal returns false');

  // });
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

  assert.expect(5);

  var component = this.subject();
  var dummyData = [
    {
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
    component.get('model'),
    [{prop: 'valZ'}],
    'root level property');

  // nested property
  Ember.run(function() {

    component.set('properties', 'prop.prop');
    component.set('query', 'Y');
    component.applyFilter();
  });

  assert.deepEqual(
    component.get('model'),
    [{prop: {prop: 'valY'}}],
    'nested property');

  // root level array
  Ember.run(function() {

    component.set('properties', '@each');
    component.set('query', 'X');
    component.applyFilter();
  });

  assert.deepEqual(
    component.get('model'),
    [['valX', 'valW', 'valV']],
    'root level array');

  // nested array
  Ember.run(function() {

    component.set('properties', 'prop.@each');
    component.set('query', 'T');
    component.applyFilter();
  });

  assert.deepEqual(
    component.get('model'),
    [{prop: ['valU', 'valT', 'valS']}],
    'nested array');

  // properties in a nested array
  Ember.run(function() {

    component.set('properties', 'prop.@each.prop');
    component.set('query', 'Q');
    component.applyFilter();
  });

  assert.deepEqual(
    component.get('model'),
    [{prop: [{prop: 'valR'}, {prop: 'valQ'}, {prop: 'valP'}]}],
    'properties in a nested array');
});

test('component filters when content type is Ember.DS', function(assert) {

  assert.expect(0);
});
