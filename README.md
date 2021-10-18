# LAA Service Status Dashboard

Small [React](https://reactjs.org/) dashboard used to display and update
the status of several services running at the
[LAA](https://www.gov.uk/government/organisations/legal-aid-agency).

It's primarly embedded in the
[LAA Portal's homepage](https://portal.legalservices.gov.uk/).

## Dependencies

* Node.js `v14.18.1` (you can install with
  [`nvm`](https://github.com/nvm-sh/nvm))
* Firebase CLI for deployment (you can install
  [`firebase-tools`](https://github.com/firebase/firebase-tools)
  with `npm` or as a standalone binary)
* *Recommended*: install [`yarn`](https://github.com/yarnpkg/berry)
  instead of `npm` (included with Node.js)

## Local development

* Clone the repo
* Install dependencies with: `yarn install`
* Run locally with: `yarn run start`

**Please note**: by default [http://localhost:3000](http://localhost:3000)
will point to the Test Firebase database, unless you change the existing
`.env.*` file(s).

## Testing

All page components have unit tests written with
[Jest](https://jestjs.io/docs/getting-started) and following the
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

To run:

```sh
yarn test --coverage
```

## Environments

The status dashboard is currently deployed to one test environment and
two separate production environments in Firebase.

| Environment | Description | URLs |
| --- | --- | --- |
| Test | Used for local development | [Dashboard](https://laa-dashboard-test.firebaseapp.com) / [Admin](https://laa-dashboard-test.firebaseapp.com/admin) |
| Production _**Internal**_ | Used for services *not* available on the LAA Portal and TV screens | [Dashboard](https://laa-dashboard-int.firebaseapp.com) / [Admin](https://laa-dashboard-int.firebaseapp.com/admin) |
| Production _**External**_ | Used for services available on the LAA Portal | [Dashboard](https://laa-dashboard.firebaseapp.com) / [Admin](https://laa-dashboard.firebaseapp.com/admin) |

## Auth

Users are managed under Google Cloud Platform IAM. New users are created
manually in Firebase.

## Deployment

The dashboard is currently hosted on Google Cloud Platform as a firebase
projects.

Before running the following commands, make sure you have installed the
Firebase CLI and are logged in:

```sh
firebase login
```

### Test

```sh
yarn run deploy-test
```

Whenever needed, you can initialise seed data for test with:

```sh
yarn run init
```

### Production - Internal

```sh
yarn run deploy-prod-int
```

### Production - External

```sh
yarn run deploy-prod-ext
```
