# ember-cli-filter-component

[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-filter-component.svg)](http://emberobserver.com/addons/ember-cli-filter-component)
[![Shields.io](https://img.shields.io/badge/tests-11%2F11-brightgreen.svg)](http://shields.io)
[![Build Status](https://travis-ci.org/zakmac/ember-cli-filter-component.svg?branch=feature)](https://travis-ci.org/zakmac/ember-cli-filter-component)


### Table of Contents
- About
- Installation
- Usage
  - Sample template
  - Block parameters
  - Template properties
- Development
  - Link `ember-cli-filter-component` to your project
  - Running tests


## About

**ember-cli-filter-component** provides a `{{filter-content}}` block component. The component filters an array of items based on specified properties against a text query.

- [Live example](http://www.zak.xxx/ember-demos/filter-content-component) _- external link_
- Sample code _- available in EXAMPLES.md_


## Installation

```shell
cd /path/to/projects/cool-project
ember install ember-cli-filter-component
```


## Usage

### Sample template

```hbs  
{{#filter-content content=ingredients properties="name" as |filteredIngredients query|}}
  {{input value=query}}
  {{#each filteredIngredients as |ingredient|}}
    {{! ... }}
  {{/each}}
{{/filter-content}}
```

### Block parameters

```hbs
{{filter-content as |filtered query|}}
```

**filtered** `{array}`
- **Description**<br>Computed result of filtering items from `content` against `query`
- **Note**<br>Passed as the first block param to the component yield

**query** `{string}`
- **Description**<br>Value matched against items from `content`
- **Note**<br>Passed as the second block param to the component yield

### Template properties

**content** (required) `{array.<array, object>}`
- **Description**<br>Items being checked for matches against `query`

**properties** (required) `{string}`
- **Description**<br>Properties on each item to filter
  - Space-delimited
  - Enumerables are represented using `@each`
  - **ex:** `properties="title category.@each"`

**timeout** `{number}`
- **Description**<br>Time in milliseconds to debounce applying the filter when `content`, `properties`, or `query`
- **Default:** `420`

**query** `{string}`
- **Description**<br>Value used to match against items from `content`


## Development

To start developing/testing locally, clone the project to your machine.

```shell
cd /path/to/projects
git clone git@github.com:zakmac/ember-cli-filter-component.git
```

Once cloned, you can start editing and testing in the project folder itself, or include the addon in another project via `npm link`.


### Link `ember-cli-filter-component` to your project

```shell
# create an npm link from the project directory
cd /path/to/projects/ember-cli-filter-component
npm link

# include the npm link in another
cd /path/to/projects/cool-project
npm link ember-cli-filter-component
```

The last step is to add `"ember-cli-filter-component": ""` to the `devDependencies` section of your project's `package.json`.

Next time your project is run, the `filter-content` component will be accessible.


### Running tests

The command `ember test` will run the test suite via CLI, outputting results.

You can also run `ember test --server` to launch a [Test'em](https://github.com/testem/testem) browser session.


## License

This project is licensed under the MIT License.

---
<small>
For more information on using **ember-cli**, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).<br>
For more information on **Ember.js**, visit [http://www.emberjs.com/](http://www.emberjs.com/).
</small>
