# ember-cli-filter-component

### v3.0.0 (wip)
- [ENHANCEMENT] Remove text input field linked to `query` from component template.
  - Remove `inputClassNames` property.
  - Remove `placeholder` property.
  - Remove `showInput` property.
- [ENHANCEMENT] Added `timeout` property, which enables specifying in milliseconds how long the debounce timer for `applyFilter` is.
- [INTERNAL] Changes to `applyFilter` and subsequent methods, in an effort to simplify the code base.
- [BUGFIX] Tests could fail sporadically due to a bug in `willDestroy()` teardown.
- [BREAKING] Block parameters have changed, see README.md for details.
- [DOCS] Updated README.md
- [DOCS] Updated EXAMPLES.md

### v2.0.2 (July 22, 2016)
- \#7 [BUGFIX] remove references to EnumerableUtils @jgadbois

### v2.0.1 (July 15, 2015)
- Added property `component` to satisfy block param deprecation warnings regarding use of `component` in yield.

### v2.0.0 (July 12, 2015)
- [BREAKING] `model` property has been deprecated in favor of `filteredContent` for the sake of common sense. This is a non-backwards compatible change.
- [FEATURE] Filter query input can be disabled by setting `showInput=false`.
- [BUGFIX] Ability to filter array of arrays.
- [BUGFIX] `debounceFilter` was never debouncing due to the timeout set in `setFilterTimer` not being cancelled each time `setFilterTimer` was called.

### v1.1.1 (July 10, 2015)
- [FEATURE] Filter query input placeholder text can now be specified.
- [FEATURE] Filter query input className can now be customized.
- [BUGFIX] Initial filtering did not take place, disabling subsequent filtering.
- [BUGFIX] Component's yield context changed to `controller` from `model`.

### v1.0.1-beta (July 7, 2015)
- #3 [BUGFIX] Passing unit tests
- #1 [BUGFIX] Subsequent property selection fails following `@each` when filtering an enumerable

### v1.0.0 (June 29, 2015)
- Premature version release with numerous bugs and missing features
