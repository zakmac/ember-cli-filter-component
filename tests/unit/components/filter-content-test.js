import DS from 'ember-data';
import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('filter-content', {});

var dsObj = DS.Model.extend({});
var emberArr = Ember.ArrayProxy.create({ content: Ember.A([1, 2, 3]) });
var emberObj = Ember.Object.extend({});
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

test('content', function(assert) {

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

test('filterableContent', function(assert) {

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

test('filterableProperties', function(assert) {

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

// todo: bugs?
test('filterableQuery', function(assert) {

  assert.expect(1);

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

    // component.set('query', 'test\\query');

    // assert.equal(
    //   component.get('filterableQuery'),
    //   'testquery',
    //   'passed value is sanitized');

    // ----------

  });
});

test('filterProperties', function(assert) {

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

// debounceFilter
// debounces running `applyFilter` on update of `query`

// methods
// ---------------------

// applyFilter
// applys the relevant filtering technique for the content type
// todo: consider writing a test for this to ensure each content type is correctly
//   filtered

// todo: failures
test('getValueAtIndex', function(assert) {

  assert.expect(7);

  var component = this.subject();

  Ember.run(function() {

    // get root level values

    assert.deepEqual(
      component.getValueAtIndex(testObj, 'arrVal'),
      [['A', 'B', 'C']],
      'able to select `arrVal.@each`');

    assert.deepEqual(
      component.getValueAtIndex(testObj, 'intVal'),
      [1],
      'able to select `intVal`');

    assert.deepEqual(
      component.getValueAtIndex(testObj, 'strVal'),
      ['dos'],
      'able to select `strVal`');

    // ----------

    // get nested values

    // todo: this fails
    assert.deepEqual(
      component.getValueAtIndex(testObj, 'objValA.arrVal.@each'),
      ['X', 'Y', 'Z'],
      'able to select `objValA.arrVal.@each`');

    // todo: this fails
    assert.deepEqual(
      component.getValueAtIndex(testObj, 'objValA.objVal.one'),
      [1],
      'able to select `objValA.objVal.one`');

    // todo: this fails
    assert.deepEqual(
      component.getValueAtIndex(testObj, 'objValA.intVal'),
      [3825],
      'able to select `objValA.intVal`');

    // todo: this fails
    assert.deepEqual(
      component.getValueAtIndex(testObj, 'objValA.strVal'),
      ['a string'],
      'able to select `objValA.strVal`');

    // ----------

  });
});

test('getItemProperty', function(assert) {

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

test('isDS', function(assert) {

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

// todo: failures
test('isEmberObj', function(assert) {

  assert.expect(5);

  var component = this.subject();

  // check if objects are Ember.Object

  Ember.run(function() {

    // todo: this fails
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

// todo: failures
test('isMatch', function(assert) {

  assert.expect(1);

  var component = this.subject();

  Ember.run(function() {

    // check matches

    assert.ok(
      component.isMatch(true, true),
      'true booleans match');

    // todo: this fails
    assert.ok(
      component.isMatch(false, false),
      'false booleans match');

    assert.ok(
      component.isMatch(1, 1),
      'integers match');

    assert.ok(
      component.isMatch('1', '1'),
      'integer strings match');

    assert.ok(
      component.isMatch('test string', 'test string'),
      'identical strings match');

    assert.ok(
      component.isMatch('TEST STRING', 'test string'),
      'case-mismatched strings match');

    // ----------

  });
});

// setFilterableContent

// setFilterType
