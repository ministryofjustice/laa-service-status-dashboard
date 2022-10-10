# LAA Service Status Dashboard

Small [React](https://reactjs.org/) dashboard used to display and update
the status of several services running at the
[LAA](https://www.gov.uk/government/organisations/legal-aid-agency).

It's primarly embedded in the
[LAA Portal's homepage](https://portal.legalservices.gov.uk/).

## Dependencies

* Node.js `v16.18.1` (you can install with
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
will point to the Test , unless you change the existing
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
| Test | Used for local development | [Dashboard](TBD) / [Admin](TBD/admin) |
| Production _**Internal**_ | Used for services *not* available on the LAA Portal and TV screens | [Dashboard](TBD) / [Admin](TBD/admin) |
| Production _**External**_ | Used for services available on the LAA Portal | [Dashboard](TBD) / [Admin](TBD/admin) |

## Auth

Users are part of an Amazon Cognito Identity Pool. New users are created
manually.

## Deployment

The dashboard is currently hosted on TBD.

Before running the following commands, make sure you have installed the
TBD CLI and are logged in:

```sh
TBD
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
