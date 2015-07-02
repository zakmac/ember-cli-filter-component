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

  var component = this.subject();

  Ember.run(function() {

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

  var component = this.subject();
  // var z = null;

  Ember.run(function() {

    // input is sanitized
    component.set('properties', '!#$%test.subProp^&()/\\');

    assert.deepEqual(
      component.get('fProperties'),
      ['test.subProp'],
      'passed values have non-[alphanumeric, underscore, period, space, atsymbol] characters removed');

    // filtering by a single index
    component.set('properties', 'username');

    assert.ok(
      Ember.isArray(component.get('fProperties')),
      'specifying a single property for `properties` returns {array}');

    assert.deepEqual(
      component.get('fProperties'),
      ['username'],
      'returned array matches expectations');

    // filtering by multiple indices
    component.set('properties', 'username email accessLevel.@each');

    assert.ok(
      Ember.isArray(component.get('fProperties')),
      'specifying multiple properties for `properties` returns {array}');

    assert.deepEqual(
      component.get('fProperties'),
      ['username', 'email', 'accessLevel.@each'],
      'returned array matches expectations');

  });
});

test('computed property `fQuery`', function(assert) {

  var component = this.subject();

  Ember.run(function() {

    // input sanitization
    component.set('query', 'test\\query');

    assert.equal(
      component.get('fQuery'),
      'testquery',
      'passed value has backslashes removed');

  });
});

test('computed properties observe', function(assert) {

  var component = this.subject();
  var z = null;

  Ember.run(function() {

    // changing `content` recomputes observers
    z = [{thing: 'A'}];
    component.set('content', z);

    assert.deepEqual(
      component.get('fContent'),
      z,
      'Changing `content` updates `fContent`');

    assert.strictEqual(
      component.get('fType'),
      'array',
      'Changing `content` updates `fType`');

    // changing `properties` recomputes observers
    z = 'thing';
    component.set('properties', z);

    assert.deepEqual(
      component.get('fProperties'),
      [z],
      'Changing `properties` updates `fProperties`');

    // changing `query` recomputes observers
    z = "A test query";
    component.set('query', z);

    assert.strictEqual(
      component.get('fQuery'),
      z,
      'Changing `query` updates `fQuery`');

  });
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

  assert.expect(0);
});

test('method `isDS`', function(assert) {

  var component = this.subject();

  // check if objects are DS.Model
  Ember.run(function() {

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
});

test('method `isEmberObj`', function(assert) {

  var component = this.subject();

  Ember.run(function() {

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

  });
});

test('method `isMatch`', function(assert) {

  var component = this.subject();

  Ember.run(function() {

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

  });
});

test('method `setup`', function(assert) {

  assert.expect(0);
});

// functionality
// ---------------------

test('filtering works on {array}', function(assert) {

  assert.expect(0);
});
