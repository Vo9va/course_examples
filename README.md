# ng-backend-e2e

## NG test cases

### Run all NG specs for specific brand

```
$ yarn capitalix.dev
OR
$ yarn investFW.dev
```

## BO test cases

### Run all BO specs (local on the 'dev' env)

```
$ yarn bo.dev
```

## General

### Husky and Lint-staged usage

After the changes have been made in project, they need to be added and committed to git.

Example:

- 'git add .' - to update what will be committed
- 'git commit -m “commit message”'
- then git push via "Push" button in WebStorm -> make it once for creating the brunch (after the brunch has been created
  use git push via terminal for the next push into git)

### Run indicated suite

To run only some tests, change the `specs` parameter in the script command:
Before (run all specs files):

```
"capitalix.dev": "ENV=dev mocha ng/specs/** --opts ./mocha.opts",
```

After (run only `currencyValidation.spec.js` file):

```
"capitalix.dev": "ENV=dev mocha ng/specs/customers/currencyValidation.spec.js --opts ./mocha.opts"
```

## Reporting to ReportPortal

To run all test cases with a report generating use environment variable `REPORT`.

Example: `"stage": "REPORT=true ENV=stage mocha"`

To create report with tag use environment variable `TAG`.

Example: `REPORT=true TAG=regression npm run capitalix.dev`

To run a specific test cases with report generating use `only` as described above.

When using ReportPortal for generating a report - at the end of the run logs will appear:

1. `ReportPortal launch link: https://...`
2. `Test run info: { suites: 1, ...`

## Update the status of 'Automated' cases in TestRail

To update the status of 'Automated' cases in TestRail use environment variable `TR_UPDATE`.

Example: `"stage": "TR_UPDATE=true ENV=stage mocha"`
