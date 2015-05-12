import DS from 'ember-data';
import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('filter-content', {});

var dsObj = DS.Model.extend({});
var emberArr = Ember.ArrayProxy.create({ content: Ember.A([1, 2, 3]) });
var emberObj = Ember.Object.create({});
var literalObj = {};
var literalArr = [];
var testObj = {

  arrVal: ['A', 'B', 'C'],
  intVal: 1,
  strVal: 'dos',
  objValA: {

    arrVal: ['X', 'Y', 'Z'],
    objVal: {

      one: 1,
      two: 2,
      three: 3
    },
    intVal: 3825,
    strVal: 'a string'
  },
  objValB: { prop: 'value' }
};

// properties
// ---------------------

test('properties/content', function(assert) {

  assert.expect(1);

  var component = this.subject();

  Ember.run(function() {

    // check default value

    assert.strictEqual(
      component.get('content'),
      null,
      'no default value');

    // ----------

  });
});

test('properties/filterableContent', function(assert) {

  assert.expect(1);

  var component = this.subject();

  Ember.run(function() {

    // check default value

    assert.strictEqual(
      component.get('filterableContent'),
      null,
      'no default value');

    // ----------

  });
});

test('properties/filterableProperties', function(assert) {

  assert.expect(6);

  var component = this.subject();

  Ember.run(function() {

    // check default value

    assert.deepEqual(
      component.get('filterableProperties'),
      [''],
      'no default value');

    // ----------

    // input sanitization

    component.set('filterProperties', 'username!#$%^&()/\\');

    assert.deepEqual(
      component.get('filterableProperties'),
      ['username'],
      'passed value is sanitized');

    // ----------

    // ensure filtering a single index works as expected

    component.set('filterProperties', 'username');

    assert.ok(
      Ember.isArray(component.get('filterableProperties')),
      'computed property for a single index is {array}');

    assert.deepEqual(
      component.get('filterableProperties'),
      ['username'],
      'computed property for a single index is {array}');

    // ----------

    // ensure filtering a multiple indices works as expected

    component.set('filterProperties', 'username email accessLevel.@each');

    assert.ok(
      Ember.isArray(component.get('filterableProperties')),
      'rcomputed property for multiple indices is {array}');

    assert.deepEqual(
      component.get('filterableProperties'),
      ['username', 'email', 'accessLevel.@each'],
      'computed property for multiple indices is {array}');

    // ----------

  });
});

// todo: bug causes "global failure"
test('properties/filterableQuery', function(assert) {

  assert.expect(2);

  var component = this.subject();

  Ember.run(function() {

    // check default value

    assert.equal(
      component.get('filterableQuery'),
      '',
      'no default value');

    // ----------

    // input sanitization

    // todo: the set() below causes "Uncaught Error: Assertion Failed: calling
    //   set on destroyed object", "Uncaught TypeError: Cannot read property
    //   'filter' of null" or other issues elsewhere in other tests

    component.set('query', 'test\\query');

    assert.equal(
      component.get('filterableQuery'),
      'testquery',
      'passed value is sanitized');

    // ----------

  });
});

test('properties/filterProperties', function(assert) {

  assert.expect(1);

  var component = this.subject();

  Ember.run(function() {

    // check default value

    assert.equal(
      component.get('filterProperties'),
      '',
      'no default value');

    // ----------

  });
});

// observers
// ---------------------

// changedContent
// observes `content` and fires internal methods
// todo: integration test

// debounceFilter
// debounces running `applyFilter` on update of `query`

// methods
// ---------------------

// applyFilter
// applys the relevant filtering technique for the content type
// todo: integration test

test('methods/getValueAtIndex', function(assert) {

  assert.expect(7);

  var component = this.subject();

  Ember.run(function() {

    // get root level values

    assert.deepEqual(
      component.getValueAtIndex(testObj, 'arrVal'),
      ['A', 'B', 'C'],
      'able to select `arrVal`');

    assert.deepEqual(
      component.getValueAtIndex(testObj, 'intVal'),
      1,
      'able to select `intVal`');

    assert.deepEqual(
      component.getValueAtIndex(testObj, 'strVal'),
      'dos',
      'able to select `strVal`');

    // ----------

    // get nested values

    assert.deepEqual(
      component.getValueAtIndex(testObj, 'objValA.arrVal.@each'),
      ['X', 'Y', 'Z'],
      'able to select `objValA.arrVal.@each`');

    assert.deepEqual(
      component.getValueAtIndex(testObj, 'objValA.objVal.one'),
      1,
      'able to select `objValA.objVal.one`');

    assert.deepEqual(
      component.getValueAtIndex(testObj, 'objValA.intVal'),
      3825,
      'able to select `objValA.intVal`');

    assert.deepEqual(
      component.getValueAtIndex(testObj, 'objValA.strVal'),
      'a string',
      'able to select `objValA.strVal`');

    // ----------

  });
});

test('methods/getItemProperty', function(assert) {

  assert.expect(4);

  var component = this.subject();

  Ember.run(function() {

    // get values

    assert.deepEqual(
      component.getItemProperty(testObj, 'arrVal'),
      [['A', 'B', 'C']],
      'able to select `arrVal`');

    assert.deepEqual(
      component.getItemProperty(testObj, 'intVal'),
      [1],
      'able to select `intVal`');

    assert.deepEqual(
      component.getItemProperty(testObj, 'objValB'),
      [{ prop: 'value' }],
      'able to select `objValB`');

    assert.deepEqual(
      component.getItemProperty(testObj, 'strVal'),
      ['dos'],
      'able to select `strVal`');

    // ----------

  });
});

test('methods/isDS', function(assert) {

  assert.expect(5);

  var component = this.subject();

  // check if objects are DS.Model

  Ember.run(function() {

    assert.ok(
      component.isDS(dsObj),
      'DS.Model passes');

    assert.ok(
      !component.isDS(emberArr),
      'Ember.Array fails');

    assert.ok(
      !component.isDS(emberObj),
      'Ember.Object fails');

    assert.ok(
      !component.isDS(literalObj),
      'Object literal fails');

    assert.ok(
      !component.isDS(literalArr),
      'Array literal fails');

    // ----------

  });
});

test('methods/isEmberObj', function(assert) {

  assert.expect(5);

  var component = this.subject();

  Ember.run(function() {

    // check if objects are Ember.Object

    assert.ok(
      component.isEmberObj(emberObj),
      'Ember.Object passes');

    assert.ok(
      !component.isEmberObj(dsObj),
      'DS.Model fails');

    assert.ok(
      !component.isEmberObj(emberArr),
      'Ember.Array fails');

    assert.ok(
      !component.isEmberObj(literalObj),
      'Object literal fails');

    assert.ok(
      !component.isEmberObj(literalArr),
      'Array literal fails');

    // ----------

  });
});

test('methods/isMatch', function(assert) {

  assert.expect(10);

  var component = this.subject();

  Ember.run(function() {

    // check mismatches

    assert.ok(
      !component.isMatch(true, false),
      'mismatch {boolean} do not match');

    assert.ok(
      !component.isMatch(0, 1),
      'mismatch {integer} do not match');

    assert.ok(
      !component.isMatch('yes', 'no'),
      'mismatch {string} do not match');

    // ----------

    // check matches

    assert.ok(
      component.isMatch(true, true),
      'true {boolean} match');

    assert.ok(
      component.isMatch(false, false),
      'false {boolean} match');

    assert.ok(
      component.isMatch(1, 1),
      '{integer} match');

    assert.ok(
      component.isMatch('1', '1'),
      'integer {string} match');

    assert.ok(
      component.isMatch(1, '1'),
      '{integer} and integer {string} match');

    assert.ok(
      component.isMatch('test string', 'test string'),
      '{string} match');

    assert.ok(
      component.isMatch('TEST STRING', 'test string'),
      'case-mismatched {string} match');

    // ----------

  });
});

// setFilterableContent
// todo: integration test

// setFilterType
// todo: integration test
