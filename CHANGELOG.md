# ember-cli-filter-component

### v2.0.0 (TBD)
- `model` property has been deprecated in favor of `filteredContent` for the sake of common sense. This is a non-backwards compatible change.
- [FEATURE] Filter query input can be disabled by setting `showInput=false`.
- [BUGFIX] Ability to filter array of arrays.
- [BUGFIX] `debounceFilter` was never "debouncing" due to the timeout set in `setFilterTimer` not being cancelled each time `setFilterTimer` was called.

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