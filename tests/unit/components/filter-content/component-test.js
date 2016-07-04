import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

moduleForComponent ('filter-content', 'Unit | Component | filter content', {
  unit: true
});

var data = [
  ['alexa', 'benjamin', 'cindy', 'duncan', 'emilia', 'francis'],
  [
    { name: 'alexa', hometown: 'New York' },
    { name: 'benjamin', hometown: 'Louisville' },
    { name: 'cindy', hometown: 'Pawtucket' },
    { name: 'duncan', hometown: 'Roxbury' },
    { name: 'emilia', hometown: 'Auburn' },
    { name: 'francis', hometown: 'Los Angeles' }
  ], [
    { name: { first: 'alexa', last: 'benjamin' } },
    { name: { first: 'cindy', last: 'duncan' } },
    { name: { first: 'emilia', last: 'francis' } }
  ], [
    { names: ['alexa', 'benjamin'] },
    { names: ['cindy', 'duncan'] },
    { names: ['emilia', 'francis'] }
  ], [
    {
      people: [
        { name: ['alexa', 'benjamin'] },
        { name: ['cindy', 'duncan'] }
      ]
    },{
      people: [
        { name: ['emilia', 'francis'] }
      ]
    }
  ]
];

test ('applyFilter filters', function (assert) {

  assert.expect (2);

  var subject = this.subject ();

  // setup, then run the filter
  Ember.run (function () {

    subject.set ('setFilterTimer', () => null);

    subject.setProperties ({
      content: data[1],
      normalizedProperties: ['name', 'hometown'],
      normalizedQuery: 'c'
    });

    subject.applyFilter ();
  });

  assert.deepEqual (
    subject.get ('filteredContent'),
    [ data[1][2], data[1][3], data[1][5] ]
  );

  // change query and re-run the filter
  Ember.run (function () {

    subject.set ('normalizedQuery', 'x');

    subject.applyFilter ();
  });

  assert.deepEqual (
    subject.get ('filteredContent'),
    [ data[1][0], data[1][3] ]
  );
});

test ('getContentProps gets content props', function (assert) {

  assert.expect (4);

  var subject = this.subject ();

  // single level
  assert.deepEqual (subject.getContentProps (data[1][0], 'name'), ['alexa']);

  // two levels
  assert.deepEqual (subject.getContentProps (data[2][2], 'name.last'), ['francis']);

  // nested array
  assert.deepEqual (subject.getContentProps (data[3][2], 'names.@each'), ['emilia', 'francis']);

  // nested array
  assert.deepEqual (subject.getContentProps (data[4][0], 'people.@each.name.@each'), ['alexa', 'benjamin', 'cindy', 'duncan']);
});

test ('normalizedProperties normalizes', function (assert) {

  assert.expect (3);

  var subject = this.subject ();

  // single property

  Ember.run (function () {

    subject.set ('setFilterTimer', () => null);
    subject.set ('properties', 'title');
  });

  assert.deepEqual (subject.get ('normalizedProperties'), ['title']);

  // multiple properties

  Ember.run (function () {

    subject.set ('properties', 'title name.@each');
  });

  assert.deepEqual (subject.get ('normalizedProperties'), ['title', 'name.@each']);

  // cleans up junk

  Ember.run (function () {

    subject.set ('properties', '    title    ...    name.......@each    ');
  });

  assert.deepEqual (subject.get ('normalizedProperties'), ['title', 'name.@each']);
});

test ('normalizedQuery normalizes', function (assert) {

  assert.expect (2);

  var subject = this.subject();

  // removes backslashes

  Ember.run (function () {

    subject.set ('setFilterTimer', () => null);

    subject.set ('query', '\\\\test \\\\ value\\\\');
  });

  assert.deepEqual (subject.get ('normalizedQuery'), 'test  value');

  // doesn't remove anything else

  Ember.run (function () {

    subject.set ('query', 'test !@#$%^&*()_+-=,./<>?;\':"[]{} value');
  });

  assert.deepEqual (subject.get ('normalizedQuery'), 'test !@#$%^&*()_+-=,./<>?;\':"[]{} value');
});

test ('aContainsB functions', function (assert) {

  assert.expect (4);

  var subject = this.subject();

  // matches

  assert.ok (subject.aContainsB ('matches', 'matches'));

  // matches regardless of case

  assert.ok (subject.aContainsB ('MATCHES', 'matches'));

  // matches contain spaces

  assert.ok (subject.aContainsB ('m A t C h E s', 'M a T c H e S'));

  // maContainsBes are detected

  assert.notOk (subject.aContainsB ('will not', 'match'));
});
