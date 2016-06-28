# ember-cli-filter-component

[![Code Climate](https://codeclimate.com/github/zakmac/ember-cli-filter-component/badges/gpa.svg)](https://codeclimate.com/github/zakmac/ember-cli-filter-component)
[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-filter-component.svg)](http://emberobserver.com/addons/ember-cli-filter-component)
[![Shields.io](https://img.shields.io/badge/tests-54%2F54-brightgreen.svg)](http://shields.io)
[![Test Coverage](https://codeclimate.com/github/zakmac/ember-cli-filter-component/badges/coverage.svg)](https://codeclimate.com/github/zakmac/ember-cli-filter-component/coverage)
[![Build Status](https://travis-ci.org/zakmac/ember-cli-filter-component.svg?branch=feature)](https://travis-ci.org/zakmac/ember-cli-filter-component)

#### Table of Contents

- [Live Example](http://www.zakmac.com/ember-demos/filter-content-component) _- external link_
- <a href="#user-content-about">About</a>
- <a href="#user-content-installation">Installation</a>
- <a href="#user-content-properties">Properties</a>
- Example Code _- available in EXAMPLES.md_
- <a href="#user-content-contributing">Contributing</a>

## About

<table border="0" cellpadding="0"><tr><td><strong>ember-cli-filter-component</strong> provides a <code>{{filter-content}}</code> block component. The component filters an array of items based on specified properties using a text input field. The input field can also be disabled to allow for alternative filter input methods.</td><td width="200"><img src="http://i.imgur.com/MiSiG2G.gif" width="200"></td></tr></table>

## Installation

```shell
# add to an existing ember-cli project
cd /path/to/projects/cool-project
ember install ember-cli-filter-component
```

## Properties

**content (required)** `{array.<array, object, string>}`
- Items being checked for matches against `query`

**filteredContent (read-only)** `{array}`
- Computed result of filtering items from `content` against `query`

**properties (required)** `{string}`
- Properties on each item to filter
  - Space-delimited
  - Enumerables are represented using `@each`
  - **ex:** `properties="title category.@each"`

**query** `{string}`
- Value used to match against items from `content`


## Contributing

To start developing/testing locally, clone the project repo.

```shell
# clone the repo
cd /path/to/projects
git clone git@github.com:zakmac/ember-cli-filter-component.git
```

If you're feeling generous [submit a pull request (GitHub)](https://github.com/zakmac/ember-cli-filter-component)**.**


### Development

Once cloned, you can start editing and testing in the project folder itself, or
include the addon in another project via `npm link`

```shell
# create an npm link
cd /path/to/projects/ember-cli-filter-component
npm link

# include the link in your project
cd /path/to/projects/cool-project
npm link ember-cli-filter-component
```

The last step is to add `"ember-cli-filter-component": ""` to the `devDependencies` section of your project's `package.json`.

Next time your project is run, the `filter-content` component will be accessible.


## Testing

The command `ember test` will run the test suite via CLI, outputting results. You can also run `ember serve` and visit [http://localhost:4200/tests](http://localhost:4200/tests) to see qUnit output in the browser.

---
<small>
For more information on using **ember-cli**, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).<br>
For more information on **Ember.js**, visit [http://www.emberjs.com/](http://www.emberjs.com/).
</small>
