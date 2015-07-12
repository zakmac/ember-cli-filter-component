# ember-cli-filter-component examples

#### Table of Contents
- [**Demos**](http://www.zakmac.com/ember-demos/filter-content-component) _- external link_
- <a href="#user-content-ex1">Adapting an existing template</a>
- <a href="#user-content-ex2">Filter an array</a>
- <a href="#user-content-ex3">Filter a nested array</a>
- <a href="#user-content-ex4">Filter arrays of arrays</a>
- <a href="#user-content-ex5">Filter properties of an object within an array</a>
- <a href="#user-content-ex7">Add a shown and/or hidden count</a>
- <a href="#user-content-ex8">Filter multiple components simultaneously</a>

**Adapting an existing template**<a name="ex1"></a>
```handlebars
{{! original }}
<ul class="airports">
  {{#each busiestAirports as |airport|}}
    <li>{{airport.name.code}} – {{airport.name.longForm}}</li>
  {{/each}}
</ul>
```

```handlebars
{{! updated }}
{{#filter-content content=busiestAirports properties="name.code name.longForm" as |fc|}}
  <ul class="airports">
    {{#each fc.filteredContent as |airport|}}
      <li>{{airport.name.code}} – {{airport.name.longForm}}</li>
    {{/each}}
  </ul>
{{/filter-content}}
```

**Filter an array**<a name="ex2"></a>
```handlebars
{{! specific index }}
{{filter-content content=htmlColors properties="1"}}
```
```handlebars
{{! all indices }}
{{filter-content content=htmlColors properties="@each"}}
```
```javascript
htmlColors: [
  ['00FFFF', 'Aqua'],
  ['FFE4B5', 'Moccasin'],
  ['708090', 'SlateGray']
]
```

**Filter a nested array**<a name="ex3"></a>
```handlebars
{{filter-content content=daysOfChristmas properties="title category.@each"}}
```
```javascript
daysOfChristmas: [{
  number: 1,
  title: 'A Partridge in a Pear Tree',
  category: ['vegetation', 'food', 'avian']
}]
```

**Filter arrays of arrays ![yodawg](http://i.imgur.com/wkB6nwQ.png)**<a name="ex4"></a>
```handlebars
{{filter-content content=yoDawg properties="@each.@each"}}
```
```javascript
yoDawg: [[
  [1, 2, 3],
  ['A', 'B', 'C']
], [
  [98, 99, 100],
  ['X', 'Y', 'Z']
]]
```

**Filter properties of an object within an array**<a name="ex5"></a>
```handlebars
{{filter-content content=cashBack properties="bills.@each.name coins.@each.name"}}
```
```javascript
cashBack: [{
  bills: [{
    count: 2,
    name: 'one'
    value: 1
  }, {
    count: 1,
    name: 'two'
    value: 2
  }],
  coins: [{
    count: 2,
    name: 'dime',
    value: 0.1
  }]
}]
```

**Add a shown and/or hidden count**<a name="ex7"></a>
```handlebars
{{#filter-content content=boardMembers properties="firstName" as |fc|}}
  <small>
    Showing {{fc.filteredContent.length}}/{{fc.content.length}} people matching:
    <strong>"{{fc.query}}"</strong>
  </small>
  {{! ... }}
{{/filter-content}}
```

**Filter multiple components simultaneously**<a name="ex8"></a>
```handlebars
{{input value=sharedQuery}}

{{!--
  important:
  - `showInput=false` disables the default filter text input
  - `query=sharedQuery`
--}}

{{#filter-content content=htmlColors.collectionA properties="name" query=sharedQuery showInput=false as |fc|}}
  {{! ... }}
{{/filter-content}}

{{#filter-content content=htmlColors.collectionB properties="name" query=sharedQuery showInput=false as |fc|}}
  {{! ... }}
{{/filter-content}}
```
```javascript
htmlColors: {
  collectionA: [{
    // ...
  }],
  collectionB: [{
    // ...
  }]
},
sharedQuery: ''
```
