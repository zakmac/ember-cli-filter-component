# ember-cli-filter-component
[![Code Climate](https://codeclimate.com/github/zakmac/ember-cli-filter-component/badges/gpa.svg)](https://codeclimate.com/github/zakmac/ember-cli-filter-component)

`ember-cli-filter-component` adds a `{{filter-content}}` component to your project. 
- The component filters an array passed into it using a text input included above it's `yield`ed conent.
- Items matching the filter query are available via the `model` property on the component.

#### Installation

From within your project's folder, enter the following command:

- `ember install ember-cli-filter-component`

## Parameters

**content** – The array of items being filtered.
```handlebars
{{filter-content content=model}}
```

**properties** – Properties on each item to filter.
- Accepts a space-delimited string.
- Specify `@each` to iterate an array.
```handlebars
{{filter-content content=model properties="title category.@each"}}
```

## Examples

**Filter an array of strings**
```handlebars
{{! filter by a specific item }}
{{filter-content content=model properties="1"}}
```
```handlebars
{{! filter by all items }}
{{filter-content content=model properties="@each"}}
```
```javascript
model: [
    [ '#00FFFF', 'Aqua' ],
    [ '#FFE4B5', 'Moccasin' ],
    [ '#708090', 'SlateGray' ]
]
```

**Filter a nested array**
```handlebars
{{filter-content content=model properties="title category.@each"}}
```
```javascript
model: [{
    'title': 'A Partridge in a Pear Tree',
    'category': ['vegetation', 'food', 'avian']
}]
```

**Filter an object inside an array**
```handlebars
{{filter-content content=model properties="bills.@each.name coins.@each.name"}}
```
```javascript
model: [{
    bills: [{
        count: 4,
        name: 'dollar bill'
        value: 100
    }],
    coins: [{
        count: 2,
        name: 'dime',
        value: 10
    }]
}]
```

**Toggle `properties`'s value with a button**
```handlebars
{{#filter-content content=model properties=filterProperty as |fc|}}
    <button {{action "tp"}}>Change filter type</button>
{{/filter-content}}
```
```javascript
filterProperty: Ember.computed('propertyToggle', function() {
    return this.get('propertyToggle') ? 'name.longForm' : 'name.code';
}),
model: [{
    "name": {
        "longForm": "Hartsfield–Jackson Atlanta International Airport",
        "code": "ATL"
    },
    "location": "Atlanta, GA"
}],
filterToggle: true,
actions: {
    tp: function() {
        this.toggleProperty('filterToggle');
    }
}
```

**Make the UI a little friendlier**
```handlebars
{{#filter-content content=model properties="firstName" as |fc|}}
    <small>
        Showing {{fc.model.length}}/{{fc.content.length}} people matching:
        <strong>"{{fc.query}}"</strong>
    </small>
    {{! each item in fc.model ... }}
{{/filter-content}}
```

## Contributing

The more the merrier. **Please submit any PRs against** [__the__ `feature` __branch__](https://github.com/zakmac/ember-cli-filter-component/tree/feature)**.**

--- 
<small>
For more information on using **ember-cli**, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).<br>
For more information on **Ember.js**, visit [http://www.emberjs.com/](http://www.emberjs.com/).<br>
Looking for more great Ember addons? Check out [http://www.emberobserver.com/](http://www.emberobserver.com/).<br>
Check out the Ember.js IRC channel at `#emberjs` on **Freenode IRC** or join the [Ember Community Slack organization](https://ember-community-slackin.herokuapp.com/).
</small>