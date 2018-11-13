============================
LAA Service Status Dashboard
============================

Built in ES6 using the `Redux <http://redux.js.org/>`__ framework with 
Service status dashboard for LAA using `Reactjs <https://facebook.github.io/react/>`__ with a `Google Firebase <https://firebase.google.com/>`__ backend.

Environments
============
**Test**

Frontend: `https://laa-dashboard-test.firebaseapp.com <https://laa-dashboard-test.firebaseapp.com/>`__

Admin: `https://laa-dashboard-test.firebaseapp.com/admin <https://laa-dashboard-test.firebaseapp.com/admin>`__

**Production - Internal**

The internal version is used on LAA TV screens, and generally contains more information on applications which are not available to external Portal users

Frontend: `https://laa-dashboard-int.firebaseapp.com <https://laa-dashboard-int.firebaseapp.com/>`__

Admin: `https://laa-dashboard-int.firebaseapp.com/admin <https://laa-dashboard-int.firebaseapp.com/admin>`__

**Production - External**

The external version is used on the LAA Portal login page, and generally contains only information on external Portal Applications

Frontend: `https://laa-dashboard.firebaseapp.com <https://laa-dashboard.firebaseapp.com/>`__

Admin: `https://laa-dashboard.firebaseapp.com/admin <https://laa-dashboard.firebaseapp.com/admin>`__

Dependencies
============
-  `nodejs <http://nodejs.org/>`__ (v6.2.0 - can be installed using `nvm <https://github.com/creationix/nvm>`_)


Installation
============

Install dependencies:

::

    npm install
    npm install -g firebase-tools
    firebase login

Development
===========

Run locally on `http://localhost:3000` (uses the test database)

::

    npm start

Deployment
==========

**Test**

::

    npm run deploy-test

Initialise seed data for test

::

    npm run init

**Production - Internal**

::

    npm run deploy-prod-int


**Production - External**

::

    npm run deploy-prod-ext
