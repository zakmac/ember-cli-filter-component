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

<table border="0" cellpadding="0"><tr><td>*ember-cli-filter-component* provides a `{{filter-content}}` block component. The component filters an array of items based on specified properties using a text input field. The input field can also be disabled to allow for alternative filter input methods.</td><td width="200"><img src="http://i.imgur.com/MiSiG2G.gif" width="200"></td></tr></table>

## Installation

```shell
cd /path/to/my-awesome-application
ember install ember-cli-filter-component
```

## Properties

**content (req.)** `{array.<array, object, string>}`
- Items being checked for matches against `query`

**filteredContent** `{array}`
- Computed result of filtering items from `content` against `query`

**inputClassNames** `{string}`
- Class names appended to the filter text input
  - Space-delimited
  - **ex:** `inputClassNames"all-caps monospaced"`

**placeholder** `{string}`
- Placeholder for the filter text input
  - **ex:** `placeholder="Type here to filter..."`

**properties (req.)** `{string}`
- Properties on each item to filter
  - Space-delimited
  - Enumerables are represented using `@each`
  - **ex:** `properties="title category.@each"`

**query** `{string}`
- Value used to match against items from `content`
  - Set using the filter text input

**showInput** `{boolean}`
- Whether to show the filter text input

## Contributing / Modifying

Clone the project and do what you want with it. If you're feeling generous submit a PR [against the `feature` branch (GitHub)](https://github.com/zakmac/ember-cli-filter-component/tree/feature)**.**

```shell
cd /path/to/projects
git clone git@github.com:zakmac/ember-cli-filter-component.git
```

---
<small>
For more information on using **ember-cli**, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).<br>
For more information on **Ember.js**, visit [http://www.emberjs.com/](http://www.emberjs.com/).<br>
Looking for more great Ember addons? Check out [http://www.emberobserver.com/](http://www.emberobserver.com/).<br>
Check out the Ember.js IRC channel at `#emberjs` on **Freenode IRC** or join the [Ember Community Slack organization](https://ember-community-slackin.herokuapp.com/).
</small>
