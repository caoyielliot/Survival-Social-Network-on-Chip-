# S16-SV1-SSNoC

## How to run the application?

To run and test it locally, run following command after you clone the repo:

```bash
# install dependencies
bower install & npm install
# run test
mocha
# start server
npm start
```

## Package dependencies

frontend dependencies goes to bower.json, installed by `bower install`

backend dependencies goes to package.json, installed by `npm install`

## Instructions for creating a new module

To create a new module {NAME} in our system, you need to create following components:

* db
  * create db driver: `/db/table_{NAME}.js`
  * register your table in db/db.js
  * Add your test into db unit test: `/test/db.js` (Do not create a new test because this will bring database conflict.)
* model
  * create model: `/models/{NAME}.js`
  * create model tester(optional): `/test/model_{NAME}.js`
* controllers
  * create controller: `/controllers/{NAME}Controller.js`
  * create controller tester(optional): `/test/controller_{NAME}.js`
* router
  * create router: `/routes/{NAME}.js`
  * register your router in `app.js`
  * create router tester(optional): `/test/router_{NAME}.js`
* view
  * create partial using template /views/partial_template.jade: `/views/partials/{NAME}.jade`
  * make sure to extends `../layout.jade`
* angularjs
  * create angular app controller: `/public/app/{NAME}Controller.js`
  * add stateProvider in `/public/app/main.js`
  * include stateProvider and urlRouterProvider
* navbar
  * add navbar entry in `/views/partial_layout.jade`
  * add class handler in `/public/app/main.js`
  * make sure your partial `extends ../partial_layout.jade`

## Continuous Integration (CI)

* Add you system dependencies in circle.yml
* Check out https://circleci.com/gh/cmusv-fse/S16-SV1-SSNoC
* Sample screenshot (first success after 37 build)

![Sample screenshot for circleci](https://github.com/cmusv-fse/S16-SV1-SSNoC/blob/master/doc/screenshot-circleci.png)

## Datetime format

* Angular JS 

[https://docs.angularjs.org/api/ng/filter/date](https://docs.angularjs.org/api/ng/filter/date)

in controller

```javascript
var timestamp = $filter('date')(message.timestamp, 'MM/dd/yyyy HH:mm:ss');
```

or in html

```javascript
{{ message.Timestamp | date : 'MM/dd/yyyy HH:mm:ss' }}
```

* Moment JS

[http://momentjs.com/docs/#/parsing/](http://momentjs.com/docs/#/parsing/)

```javascript
var timestamp = moment().format('MM/DD/YYYY HH:mm:ss');
```
* BASE64 JS

[https://github.com/ninjatronic/angular-base64](https://github.com/ninjatronic/angular-base64)

```javascript
var imageData=$base64.encode(image);
var image=$base64.decode(imageData);
```