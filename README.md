# ReproApp

This project was generated as an example of a probable Angular CLI bug

# 🐞 Bug report

### Command (mark with an `x`)
<!-- Can you pin-point the command or commands that are effected by this bug? -->
<!-- ✍️edit: -->
```
- [ ] new
- [x] build
- [ ] serve
- [ ] test
- [ ] e2e
- [ ] generate
- [ ] add
- [ ] update
- [ ] lint
- [ ] xi18n
- [ ] run
- [ ] config
- [ ] help
- [ ] version
- [ ] doc
```

### Is this a regression?

No

### Description

When using Webpack `done` hook together with `ng build --watch` command, the `stats` object, passed to the hook as a parameter doesn't always have `stats.compilation.errors` array filled even if there are errors and the build has failed.

Although it could be seen as a minor issue, it makes impossible using of popup build notifiers like the `webpack-notifier` because these rely on errors presence in the `stats` object.

## 🔬 Minimal Reproduction

* Create a new Angular app via `ng new my-app`
* Create a simple Webpack plugin that would use the `done` [hook](https://webpack.js.org/api/compiler-hooks/#done):

```javascript
var MyWebpackPlugin = module.exports = function() {};

MyWebpackPlugin.prototype.compilationDone = function(stats) {
    console.log('Errors:');
    console.info(stats.compilation.errors);
};

MyWebpackPlugin.prototype.apply = function(compiler) {
  if (compiler.hooks) {
    var plugin = { name: 'My Plugin' };

    compiler.hooks.done.tap(plugin, this.compilationDone.bind(this));
  } else {
    compiler.plugin('done', this.compilationDone.bind(this));
  }
};
```

* Add custom webpack config by following [instructions](https://github.com/manfredsteyer/ngx-build-plus) for `ngx-build-plus`:

  * run `ng add ngx-build-plus`
  * add `webpack.partial.js` to the project root with the following contents:

    ```javascript
    const MyWebpackPlugin = require('./myWebpackPlugin');
    module.exports = {
        plugins: [ new MyWebpackPlugin() ]
    }
    ```

* run `ng build --watch --extra-webpack-config webpack.partial.js`
  Result as expected: no build errors and an empty errors array logged to console.
* Now open `/src/app/app.component.ts` and add the following new line to the end of the file: `xxx;`

* Check the build console.
  Expected: "Cannot find name xxx" error logged twice - as a part of an error object in an errors array and as a regular build error message.
  Actual: errors array logged as an empty array, "Cannot find name xxx" error is shown in the console as a regular build error message.

* Now cancel the `build --watch`. Make sure that you still have an `xxx` line in the `app.component.ts` and run `ng build --watch --extra-webpack-config webpack.partial.js` again.
* Check the build console.
   Result as expected: "Cannot find name xxx" error logged twice - as a part of an error object in an errors array and as a regular build error message.
* Remove the `xxx` line and check the console.
   Result as expected: Errors array is empty, build succeeded.

* Once again add the `xxx` line and check the console
  Expected: "Cannot find name xxx" error logged twice - as a part of an error object in an errors array and as a regular build error message.
  Actual: errors array logged as an empty array, "Cannot find name xxx" error is shown in the console as a regular build error message.

## 🌍 Your Environment
<pre><code>
<!-- run `ng version` and paste output below -->
Angular CLI: 7.3.5
Node: 10.13.0
OS: win32 x64
Angular: 7.2.8
... animations, common, compiler, compiler-cli, core, forms
... language-service, platform-browser, platform-browser-dynamic
... router

Package                           Version
-----------------------------------------------------------
@angular-devkit/architect         0.13.5
@angular-devkit/build-angular     0.13.5
@angular-devkit/build-optimizer   0.13.5
@angular-devkit/build-webpack     0.13.5
@angular-devkit/core              7.3.5
@angular-devkit/schematics        7.3.5
@angular/cli                      7.3.5
@ngtools/webpack                  7.3.5
@schematics/angular               7.3.5
@schematics/update                0.13.5
rxjs                              6.3.3
typescript                        3.2.4
webpack                           4.29.0

</code></pre>