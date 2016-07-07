import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent ('filter-content', 'Integration | Component | filter content', {
  integration: true
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

test ('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  // Template block usage:
  this.render(hbs`
    {{#filter-content}}
      template block text
    {{/filter-content}}
  `);

  assert.equal (this.$ ().text ().trim (), 'template block text');
});

test ('it renders with content', function (assert) {

  this.set ('contentData', data[0]);

  this.render (hbs`
    {{#filter-content content=contentData properties="@each" as |filtered query|}}
      {{#each filtered as |f i|~}}
        {{~if i ", "~}}{{~f~}}
      {{~else}}
        [NONE]
      {{/each}}
    {{/filter-content}}
  `);

  assert.equal (this.$ ().text ().trim (), data[0].join (', '));
  // assert.equal (this.$ ().text ().trim (), data[1].map (d => d.name).join (', '));
});

test ('filter fails when content is a single dimension array', function (assert) {
// not supported, doesn't seem necessary

  this.set ('contentData', data[0]);
  this.set ('queryData', 'i');

  // single index
  this.render (hbs`
    {{#filter-content content=contentData properties="@each" query=queryData as |filtered query|}}
      {{#each filtered as |f i|~}}
        {{~if i ", "~}}{{~f~}}
      {{~else}}
        [NONE]
      {{/each}}
    {{/filter-content}}
  `);

  assert.equal (this.$ ().text ().trim (), '[NONE]');
});

test ('it filters by property index', function (assert) {

  this.set ('contentData', data[1]);
  this.set ('queryData', 'c');

  // single index
  this.render (hbs`
    {{#filter-content content=contentData properties="name" query=queryData as |filtered query|}}
      {{#each filtered as |f i|~}}
        {{~if i ", "~}}{{~f.name~}}
      {{~else}}
        [NONE]
      {{/each}}
    {{/filter-content}}
  `);

  // assert.equal (this.$ ().text ().trim (), 'cindy, duncan, francis');
  assert.equal (this.$ ().text ().trim (), 'cindy, duncan, francis');

  this.set ('contentData', data[1]);
  this.set ('queryData', 'x');

  // multiple indices
  this.render (hbs`
    {{#filter-content content=contentData properties="name hometown" query=queryData as |filtered query|}}
      {{#each filtered as |f i|~}}
        {{~if i ", "~}}{{~f.name}} ({{~f.hometown~}})
      {{~else}}
        [NONE]
      {{/each}}
    {{/filter-content}}
  `);

  assert.equal (this.$ ().text ().trim (), 'alexa (New York), duncan (Roxbury)');
});

test ('it filters by a nested property', function (assert) {

  this.set ('contentData', data[2]);
  this.set ('queryData', 'a');

  // single nested property
  this.render (hbs`
    {{#filter-content content=contentData properties="name.first" query=queryData as |filtered query|}}
      {{#each filtered as |f i|~}}
        {{~if i ", "~}}{{~f.name.first}} {{f.name.last~}}
      {{~else}}
        [NONE]
      {{/each}}
    {{/filter-content}}
  `);

  // assert.equal (this.$ ().text ().trim (), 'cindy, duncan, francis');
  assert.equal (this.$ ().text ().trim (), 'alexa benjamin, emilia francis');

  // multiple nested properties
  this.render (hbs`
    {{#filter-content content=contentData properties="name.first name.last" query=queryData as |filtered query|}}
      {{#each filtered as |f i|~}}
        {{~if i ", "~}}{{~f.name.first}} {{f.name.last~}}
      {{~else}}
        [NONE]
      {{/each}}
    {{/filter-content}}
  `);

  // assert.equal (this.$ ().text ().trim (), 'cindy, duncan, francis');
  assert.equal (this.$ ().text ().trim (), 'alexa benjamin, cindy duncan, emilia francis');
});

test ('it filters a nested array', function (assert) {

  this.set ('contentData', data[4]);
  this.set ('queryData', 'x');

  // single nested property
  this.render (hbs`
    {{#filter-content content=contentData properties="people.@each.name.@each" query=queryData as |filtered query|}}
      {{#each filtered as |f i|~}}
        {{~if i ", "~}}
        {{~#each f.people as |p j|~}}
          {{~if j ", "~}}{{~p.name.[0]}} {{p.name.[1]~}}
        {{~/each~}}
      {{~else}}
        [NONE]
      {{/each}}
    {{/filter-content}}
  `);

  // assert.equal (this.$ ().text ().trim (), 'cindy, duncan, francis');
  assert.equal (this.$ ().text ().trim (), 'alexa benjamin, cindy duncan');
});
