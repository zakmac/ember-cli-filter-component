# ember-cli-filter-component examples

### Table of contents

* Upgrading a `filter-content` ~v2.0.0 template
* Adapting an existing template
* Filter an array
* Filter a nested array
* Filter arrays of arrays
* Filter properties of an object within an array
* Add a shown and/or total count
* Filter multiple components simultaneously

## Upgrading a `filter-content` ~v2.0.0 template

**Note:**
* The block parameters have changed
* The query input is no longer automatically included in the template

**~v2.0.0 template**
```handlebars
{{#filter-content content=airports properties="name.code name.longForm" placeholder="filter by airport name or code" inputClassNames="form-control" as |fc|}}
  <small class="{{if fc.query '' 'invisible'}}">
    Showing {{fc.filteredContent.length}}/{{fc.content.length}} airports matching
    <strong>"{{fc.query}}"</strong>
  </small>
  <table>
    <tbody>
      {{#each fc.filteredContent as |airport|}}
        {{! ... }}
      {{/each}}
    </tbody>
  </table>
{{/filter-content}}
```

**v3.0.0 template**
```handlebars
{{#filter-content content=airports properties="name.code name.longForm" as |filteredAirports query|}}
  {{input value=query class="form-control" placeholder="filter by airport name or code"}}
  <small class="{{if query '' 'invisible'}}">
    Showing {{filteredAirports.length}}/{{airports.length}} airports matching
    <strong>"{{query}}"</strong>
  </small>
  <table>
    <tbody>
      {{#each filteredAirports as |airport|}}
        {{! ... }}
      {{/each}}
    </tbody>
  </table>
{{/filter-content}}
```

## Adapting an existing template

**Existing**
```handlebars
<ul class="airports">
  {{#each busiestAirports as |airport|}}
    <li>{{airport.name.code}} – {{airport.name.longForm}}</li>
  {{/each}}
</ul>
```

**Updated**
```handlebars
{{#filter-content content=busiestAirports properties="name.code name.longForm" as |filtered query|}}
  {{input value=query}}
  <ul class="airports">
    {{#each filtered as |airport|}}
      <li>{{airport.name.code}} – {{airport.name.longForm}}</li>
    {{/each}}
  </ul>
{{/filter-content}}
```


## Filter an array

```handlebars
{{filter-content content=htmlColors properties="@each"}}
```

```javascript
htmlColors: [
  ['00FFFF', 'Aqua'],
  ['FFE4B5', 'Moccasin'],
  ['708090', 'SlateGray']
]
```


## Filter a nested array

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


## Filter arrays of arrays ![yodawg](http://i.imgur.com/wkB6nwQ.png)

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


## Filter properties of an object within an array

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


## Add a shown and/or total count

```handlebars
{{#filter-content content=boardMembers properties="firstName" as |filtered query|}}
  {{input value=query}}
  <small>
    Showing {{concat filtered.length "/" boardMembers.length}} people matching:
    <strong>{{concat "\"" query "\""}}</strong>
  </small>
  {{! ... }}
{{/filter-content}}
```


## Filter multiple components simultaneously

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
  collectionA: [{ /* ... */ }],
  collectionB: [{ /* ... */ }]
}
```
