# ember-cli-filter-component examples

**Adapting an existing template**
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
{{#filter-content content=busiestAirports properties="name.code name.longForm" as |filtered query|}}
  {{input value=query}}
  <ul class="airports">
    {{#each filtered as |airport|}}
      <li>{{airport.name.code}} – {{airport.name.longForm}}</li>
    {{/each}}
  </ul>
{{/filter-content}}
```

**Filter an array**

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

**Filter a nested array**
```handlebars
{{filter-content content=daysOfChristmas properties="title category.@each"}}
```
```javascript
daysOfChristmas: [
  {
    number: 1,
    title: 'A Partridge in a Pear Tree',
    category: ['vegetation', 'food', 'avian']
  }
]
```

**Filter arrays of arrays ![yodawg](http://i.imgur.com/wkB6nwQ.png)**
```handlebars
{{filter-content content=yoDawg properties="@each.@each"}}
```
```javascript
yoDawg: [
  [
    [1, 2, 3],
    ['A', 'B', 'C']
  ], [
    [98, 99, 100],
    ['X', 'Y', 'Z']
  ]
]
```

**Filter properties of an object within an array**
```handlebars
{{filter-content content=cashBack properties="bills.@each.name coins.@each.name"}}
```
```javascript
cashBack: [
  {
    bills: [
      {
        count: 2,
        name: 'one'
        value: 1
      }, {
        count: 1,
        name: 'two'
        value: 2
      }
    ],
    coins: [
      {
        count: 2,
        name: 'dime',
        value: 0.1
      }
    ]
  }
]
```

**Add a shown and/or total count**
```handlebars
{{#filter-content content=boardMembers properties="firstName" as |filtered query|}}
  {{input value=query}}
  <small>
    Showing {{filtered.length}}/{{content.length}} people matching:
    <strong>"{{query}}"</strong>
  </small>
  {{! ... }}
{{/filter-content}}
```

**Filter multiple components simultaneously**
```handlebars
{{input value=sharedQuery}}

{{#filter-content content=htmlColors.collectionA properties="name" query=sharedQuery as |filtered query|}}
  {{! ... }}
{{/filter-content}}

{{#filter-content content=htmlColors.collectionB properties="name" query=sharedQuery as |filtered query|}}
  {{! ... }}
{{/filter-content}}
```
```javascript
htmlColors: {
  collectionA: [{ /* .. */ }],
  collectionB: [{ /* ... */ }]
},
sharedQuery: ''
```
