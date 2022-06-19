# ts_speaking-clock
speaking clock for TypeScript

```bash
webpack init
? Which of the following JS solutions do you want to use? Typescript
? Do you want to use webpack-dev-server? Yes
? Do you want to simplify the creation of HTML files for your bundle? Yes
? Do you want to add PWA support? Yes
? Which of the following CSS solutions do you want to use? SASS
? Will you be using CSS styles along with SASS in your project? Yes
? Will you be using PostCSS in your project? No
? Do you want to extract CSS for every file? No
? Do you like to install prettier to format generated configuration? Yes
? Pick a package manager: yarn
[webpack-cli] ℹ INFO  Initialising project...
   create package.json
   create src/index.ts
   create README.md
   create index.html
   create webpack.config.js
   create tsconfig.json
yarn add v1.22.19
warning package.json: No license field
info No lockfile found.
warning my-webpack-project@1.0.0: No license field
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
success Saved lockfile.
warning my-webpack-project@1.0.0: No license field
success Saved 423 new dependencies.
info Direct dependencies
├─ css-loader@6.7.1
├─ html-webpack-plugin@5.5.0
├─ prettier@2.7.1
├─ sass-loader@13.0.0
├─ sass@1.52.3
├─ style-loader@3.3.1
├─ ts-loader@9.3.0
├─ typescript@4.7.3
├─ webpack-cli@4.10.0
├─ webpack-dev-server@4.9.2
├─ webpack@5.73.0
└─ workbox-webpack-plugin@6.5.3
info All dependencies
├─ @ampproject/remapping@2.2.0
├─ @apideck/better-ajv-errors@0.3.4
├─ @babel/compat-data@7.18.5
├─ @babel/core@7.18.5
├─ @babel/helper-builder-binary-assignment-operator-visitor@7.16.7
├─ @babel/helper-compilation-targets@7.18.2
├─ @babel/helper-explode-assignable-expression@7.16.7
├─ @babel/helper-module-imports@7.16.7
├─ @babel/helper-plugin-utils@7.17.12
├─ @babel/helper-simple-access@7.18.2
├─ @babel/helper-wrap-function@7.16.8
├─ @babel/helpers@7.18.2
├─ @babel/highlight@7.17.12
├─ @babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@7.17.12
├─ @babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@7.17.12
├─ @babel/plugin-proposal-async-generator-functions@7.17.12
├─ @babel/plugin-proposal-class-properties@7.17.12
├─ @babel/plugin-proposal-class-static-block@7.18.0
├─ @babel/plugin-proposal-dynamic-import@7.16.7
├─ @babel/plugin-proposal-export-namespace-from@7.17.12
├─ @babel/plugin-proposal-json-strings@7.17.12
├─ @babel/plugin-proposal-logical-assignment-operators@7.17.12
├─ @babel/plugin-proposal-nullish-coalescing-operator@7.17.12
├─ @babel/plugin-proposal-numeric-separator@7.16.7
├─ @babel/plugin-proposal-object-rest-spread@7.18.0
├─ @babel/plugin-proposal-optional-catch-binding@7.16.7
├─ @babel/plugin-proposal-private-methods@7.17.12
├─ @babel/plugin-proposal-private-property-in-object@7.17.12
├─ @babel/plugin-proposal-unicode-property-regex@7.17.12
├─ @babel/plugin-syntax-class-properties@7.12.13
├─ @babel/plugin-syntax-import-assertions@7.17.12
├─ @babel/plugin-syntax-top-level-await@7.14.5
├─ @babel/plugin-transform-arrow-functions@7.17.12
├─ @babel/plugin-transform-async-to-generator@7.17.12
├─ @babel/plugin-transform-block-scoped-functions@7.16.7
├─ @babel/plugin-transform-block-scoping@7.18.4
├─ @babel/plugin-transform-classes@7.18.4
├─ @babel/plugin-transform-computed-properties@7.17.12
├─ @babel/plugin-transform-destructuring@7.18.0
├─ @babel/plugin-transform-dotall-regex@7.16.7
├─ @babel/plugin-transform-duplicate-keys@7.17.12
├─ @babel/plugin-transform-exponentiation-operator@7.16.7
├─ @babel/plugin-transform-for-of@7.18.1
├─ @babel/plugin-transform-function-name@7.16.7
├─ @babel/plugin-transform-literals@7.17.12
├─ @babel/plugin-transform-member-expression-literals@7.16.7
├─ @babel/plugin-transform-modules-amd@7.18.0
├─ @babel/plugin-transform-modules-commonjs@7.18.2
├─ @babel/plugin-transform-modules-systemjs@7.18.5
├─ @babel/plugin-transform-modules-umd@7.18.0
├─ @babel/plugin-transform-named-capturing-groups-regex@7.17.12
├─ @babel/plugin-transform-new-target@7.18.5
├─ @babel/plugin-transform-object-super@7.16.7
├─ @babel/plugin-transform-property-literals@7.16.7
├─ @babel/plugin-transform-regenerator@7.18.0
├─ @babel/plugin-transform-reserved-words@7.17.12
├─ @babel/plugin-transform-shorthand-properties@7.16.7
├─ @babel/plugin-transform-spread@7.17.12
├─ @babel/plugin-transform-sticky-regex@7.16.7
├─ @babel/plugin-transform-template-literals@7.18.2
├─ @babel/plugin-transform-typeof-symbol@7.17.12
├─ @babel/plugin-transform-unicode-escapes@7.16.7
├─ @babel/plugin-transform-unicode-regex@7.16.7
├─ @babel/preset-env@7.18.2
├─ @babel/preset-modules@0.1.5
├─ @babel/runtime@7.18.3
├─ @babel/traverse@7.18.5
├─ @discoveryjs/json-ext@0.5.7
├─ @jridgewell/resolve-uri@3.0.7
├─ @jridgewell/source-map@0.3.2
├─ @leichtgewicht/ip-codec@2.0.4
├─ @rollup/plugin-babel@5.3.1
├─ @rollup/plugin-node-resolve@11.2.1
├─ @rollup/plugin-replace@2.4.2
├─ @surma/rollup-plugin-off-main-thread@2.2.3
├─ @types/body-parser@1.19.2
├─ @types/bonjour@3.5.10
├─ @types/connect-history-api-fallback@1.3.5
├─ @types/connect@3.4.35
├─ @types/eslint-scope@3.7.3
├─ @types/eslint@8.4.3
├─ @types/express-serve-static-core@4.17.29
├─ @types/express@4.17.13
├─ @types/html-minifier-terser@6.1.0
├─ @types/http-proxy@1.17.9
├─ @types/json-schema@7.0.11
├─ @types/mime@1.3.2
├─ @types/range-parser@1.2.4
├─ @types/resolve@1.17.1
├─ @types/retry@0.12.0
├─ @types/serve-index@1.9.1
├─ @types/serve-static@1.13.10
├─ @types/sockjs@0.3.33
├─ @types/trusted-types@2.0.2
├─ @types/ws@8.5.3
├─ @webassemblyjs/floating-point-hex-parser@1.11.1
├─ @webassemblyjs/helper-numbers@1.11.1
├─ @webassemblyjs/helper-wasm-section@1.11.1
├─ @webassemblyjs/wasm-edit@1.11.1
├─ @webassemblyjs/wasm-opt@1.11.1
├─ @webassemblyjs/wast-printer@1.11.1
├─ @webpack-cli/configtest@1.2.0
├─ @webpack-cli/info@1.5.0
├─ @webpack-cli/serve@1.7.0
├─ @xtuc/ieee754@1.2.0
├─ accepts@1.3.8
├─ acorn-import-assertions@1.8.0
├─ acorn@8.7.1
├─ ajv-formats@2.1.1
├─ ajv-keywords@5.1.0
├─ ajv@8.11.0
├─ ansi-html-community@0.0.8
├─ ansi-regex@5.0.1
├─ ansi-styles@4.3.0
├─ anymatch@3.1.2
├─ array-flatten@1.1.1
├─ async@3.2.4
├─ at-least-node@1.0.0
├─ babel-plugin-polyfill-corejs2@0.3.1
├─ babel-plugin-polyfill-corejs3@0.5.2
├─ babel-plugin-polyfill-regenerator@0.3.1
├─ batch@0.6.1
├─ binary-extensions@2.2.0
├─ body-parser@1.20.0
├─ bonjour-service@1.0.13
├─ brace-expansion@1.1.11
├─ braces@3.0.2
├─ browserslist@4.20.4
├─ buffer-from@1.1.2
├─ builtin-modules@3.3.0
├─ camel-case@4.1.2
├─ caniuse-lite@1.0.30001355
├─ chalk@4.1.2
├─ chokidar@3.5.3
├─ chrome-trace-event@1.0.3
├─ clean-css@5.3.0
├─ clone-deep@4.0.1
├─ color-convert@2.0.1
├─ color-name@1.1.4
├─ commander@7.2.0
├─ common-tags@1.8.2
├─ compressible@2.0.18
├─ compression@1.7.4
├─ concat-map@0.0.1
├─ connect-history-api-fallback@1.6.0
├─ content-disposition@0.5.4
├─ convert-source-map@1.8.0
├─ cookie-signature@1.0.6
├─ cookie@0.5.0
├─ core-js-compat@3.23.1
├─ core-util-is@1.0.3
├─ crypto-random-string@2.0.0
├─ css-loader@6.7.1
├─ css-select@4.3.0
├─ css-what@6.1.0
├─ cssesc@3.0.0
├─ deepmerge@4.2.2
├─ default-gateway@6.0.3
├─ define-lazy-prop@2.0.0
├─ detect-node@2.1.0
├─ dns-equal@1.0.0
├─ dns-packet@5.4.0
├─ dom-converter@0.2.0
├─ dom-serializer@1.4.1
├─ domutils@2.8.0
├─ dot-case@3.0.4
├─ ee-first@1.1.1
├─ ejs@3.1.8
├─ electron-to-chromium@1.4.160
├─ enhanced-resolve@5.9.3
├─ envinfo@7.8.1
├─ es-module-lexer@0.9.3
├─ es-to-primitive@1.2.1
├─ escalade@3.1.1
├─ escape-string-regexp@1.0.5
├─ eslint-scope@5.1.1
├─ esrecurse@4.3.0
├─ estraverse@4.3.0
├─ estree-walker@1.0.1
├─ esutils@2.0.3
├─ eventemitter3@4.0.7
├─ events@3.3.0
├─ execa@5.1.1
├─ express@4.18.1
├─ fastest-levenshtein@1.0.12
├─ faye-websocket@0.11.4
├─ filelist@1.0.4
├─ fill-range@7.0.1
├─ finalhandler@1.2.0
├─ find-up@4.1.0
├─ follow-redirects@1.15.1
├─ forwarded@0.2.0
├─ fs-extra@9.1.0
├─ fs-monkey@1.0.3
├─ fs.realpath@1.0.0
├─ function.prototype.name@1.1.5
├─ gensync@1.0.0-beta.2
├─ get-own-enumerable-property-symbols@3.0.2
├─ get-stream@6.0.1
├─ get-symbol-description@1.0.0
├─ glob-parent@5.1.2
├─ glob@7.2.3
├─ graceful-fs@4.2.10
├─ handle-thing@2.0.1
├─ has-bigints@1.0.2
├─ he@1.2.0
├─ hpack.js@2.1.6
├─ html-entities@2.3.3
├─ html-minifier-terser@6.1.0
├─ html-webpack-plugin@5.5.0
├─ htmlparser2@6.1.0
├─ http-deceiver@1.2.7
├─ http-parser-js@0.5.6
├─ http-proxy-middleware@2.0.6
├─ http-proxy@1.18.1
├─ human-signals@2.1.0
├─ immutable@4.1.0
├─ import-local@3.1.0
├─ inflight@1.0.6
├─ inherits@2.0.4
├─ interpret@2.2.0
├─ ipaddr.js@2.0.1
├─ is-bigint@1.0.4
├─ is-binary-path@2.1.0
├─ is-boolean-object@1.1.2
├─ is-callable@1.2.4
├─ is-core-module@2.9.0
├─ is-date-object@1.0.5
├─ is-docker@2.2.1
├─ is-extglob@2.1.1
├─ is-module@1.0.0
├─ is-negative-zero@2.0.2
├─ is-number-object@1.0.7
├─ is-number@7.0.0
├─ is-obj@1.0.1
├─ is-plain-obj@3.0.0
├─ is-plain-object@2.0.4
├─ is-regex@1.1.4
├─ is-regexp@1.0.0
├─ is-shared-array-buffer@1.0.2
├─ is-string@1.0.7
├─ is-symbol@1.0.4
├─ is-weakref@1.0.2
├─ is-wsl@2.2.0
├─ isarray@1.0.0
├─ isexe@2.0.0
├─ isobject@3.0.1
├─ jake@10.8.5
├─ jest-worker@27.5.1
├─ js-tokens@4.0.0
├─ jsesc@2.5.2
├─ json-parse-even-better-errors@2.3.1
├─ json-schema-traverse@1.0.0
├─ json-schema@0.4.0
├─ json5@2.2.1
├─ jsonfile@6.1.0
├─ jsonpointer@5.0.0
├─ klona@2.0.5
├─ leven@3.1.0
├─ loader-runner@4.3.0
├─ locate-path@5.0.0
├─ lodash.debounce@4.0.8
├─ lodash.sortby@4.7.0
├─ lower-case@2.0.2
├─ lru-cache@6.0.0
├─ magic-string@0.25.9
├─ media-typer@0.3.0
├─ memfs@3.4.4
├─ merge-descriptors@1.0.1
├─ methods@1.1.2
├─ micromatch@4.0.5
├─ mime-db@1.52.0
├─ mime-types@2.1.35
├─ mime@1.6.0
├─ mimic-fn@2.1.0
├─ minimalistic-assert@1.0.1
├─ minimatch@3.1.2
├─ ms@2.0.0
├─ multicast-dns@7.2.5
├─ nanoid@3.3.4
├─ negotiator@0.6.3
├─ node-forge@1.3.1
├─ node-releases@2.0.5
├─ normalize-path@3.0.0
├─ npm-run-path@4.0.1
├─ nth-check@2.1.1
├─ object-inspect@1.12.2
├─ object.assign@4.1.2
├─ obuf@1.1.2
├─ on-headers@1.0.2
├─ onetime@5.1.2
├─ open@8.4.0
├─ p-limit@2.3.0
├─ p-locate@4.1.0
├─ p-retry@4.6.2
├─ p-try@2.2.0
├─ param-case@3.0.4
├─ pascal-case@3.1.2
├─ path-exists@4.0.0
├─ path-is-absolute@1.0.1
├─ path-key@3.1.1
├─ path-parse@1.0.7
├─ path-to-regexp@0.1.7
├─ picomatch@2.3.1
├─ pkg-dir@4.2.0
├─ postcss-modules-extract-imports@3.0.0
├─ postcss-modules-local-by-default@4.0.0
├─ postcss-modules-scope@3.0.0
├─ postcss-modules-values@4.0.0
├─ postcss-selector-parser@6.0.10
├─ postcss-value-parser@4.2.0
├─ postcss@8.4.14
├─ prettier@2.7.1
├─ pretty-bytes@5.6.0
├─ pretty-error@4.0.0
├─ process-nextick-args@2.0.1
├─ proxy-addr@2.0.7
├─ raw-body@2.5.1
├─ readable-stream@3.6.0
├─ readdirp@3.6.0
├─ rechoir@0.7.1
├─ regenerate-unicode-properties@10.0.1
├─ regenerator-runtime@0.13.9
├─ regenerator-transform@0.15.0
├─ regexp.prototype.flags@1.4.3
├─ regexpu-core@5.0.1
├─ regjsgen@0.6.0
├─ regjsparser@0.8.4
├─ relateurl@0.2.7
├─ renderkid@3.0.0
├─ require-from-string@2.0.2
├─ requires-port@1.0.0
├─ resolve-cwd@3.0.0
├─ resolve-from@5.0.0
├─ resolve@1.22.0
├─ retry@0.13.1
├─ rimraf@3.0.2
├─ rollup-plugin-terser@7.0.2
├─ rollup@2.75.6
├─ safe-buffer@5.2.1
├─ safer-buffer@2.1.2
├─ sass-loader@13.0.0
├─ sass@1.52.3
├─ schema-utils@3.1.1
├─ select-hose@2.0.0
├─ selfsigned@2.0.1
├─ semver@6.3.0
├─ serialize-javascript@6.0.0
├─ serve-index@1.9.1
├─ serve-static@1.15.0
├─ shallow-clone@3.0.1
├─ shebang-command@2.0.0
├─ shebang-regex@3.0.0
├─ signal-exit@3.0.7
├─ sockjs@0.3.24
├─ source-list-map@2.0.1
├─ source-map-js@1.0.2
├─ source-map-support@0.5.21
├─ source-map@0.6.1
├─ sourcemap-codec@1.4.8
├─ spdy-transport@3.0.0
├─ spdy@4.0.2
├─ string_decoder@1.3.0
├─ string.prototype.matchall@4.0.7
├─ string.prototype.trimend@1.0.5
├─ string.prototype.trimstart@1.0.5
├─ stringify-object@3.3.0
├─ strip-ansi@6.0.1
├─ strip-comments@2.0.1
├─ strip-final-newline@2.0.0
├─ style-loader@3.3.1
├─ supports-color@7.2.0
├─ supports-preserve-symlinks-flag@1.0.0
├─ tapable@2.2.1
├─ temp-dir@2.0.0
├─ tempy@0.6.0
├─ terser-webpack-plugin@5.3.3
├─ terser@5.14.1
├─ thunky@1.1.0
├─ to-fast-properties@2.0.0
├─ to-regex-range@5.0.1
├─ toidentifier@1.0.1
├─ tr46@1.0.1
├─ ts-loader@9.3.0
├─ type-fest@0.16.0
├─ typescript@4.7.3
├─ unbox-primitive@1.0.2
├─ unicode-canonical-property-names-ecmascript@2.0.0
├─ unicode-match-property-ecmascript@2.0.0
├─ unicode-match-property-value-ecmascript@2.0.0
├─ unicode-property-aliases-ecmascript@2.0.0
├─ unique-string@2.0.0
├─ util-deprecate@1.0.2
├─ utila@0.4.0
├─ utils-merge@1.0.1
├─ uuid@8.3.2
├─ watchpack@2.4.0
├─ wbuf@1.7.3
├─ webidl-conversions@4.0.2
├─ webpack-cli@4.10.0
├─ webpack-dev-middleware@5.3.3
├─ webpack-dev-server@4.9.2
├─ webpack-merge@5.8.0
├─ webpack-sources@1.4.3
├─ webpack@5.73.0
├─ websocket-driver@0.7.4
├─ websocket-extensions@0.1.4
├─ whatwg-url@7.1.0
├─ which-boxed-primitive@1.0.2
├─ which@2.0.2
├─ wildcard@2.0.0
├─ workbox-broadcast-update@6.5.3
├─ workbox-build@6.5.3
├─ workbox-google-analytics@6.5.3
├─ workbox-navigation-preload@6.5.3
├─ workbox-range-requests@6.5.3
├─ workbox-recipes@6.5.3
├─ workbox-streams@6.5.3
├─ workbox-sw@6.5.3
├─ workbox-webpack-plugin@6.5.3
├─ workbox-window@6.5.3
├─ ws@8.8.0
└─ yallist@4.0.0
Done in 19.16s.
[webpack-cli] ⚠ Generated configuration may not be properly formatted as prettier is not installed.
[webpack-cli] Project has been initialised with webpack!
1ced12784774:/tmp/test# webpack
asset workbox-7d6a3f4d.js 13.9 KiB [emitted] [minimized]
asset service-worker.js 885 bytes [emitted] [minimized]
asset index.html 747 bytes [emitted]
asset main.js 28 bytes [emitted] [minimized] (name: main)
./src/index.ts 29 bytes [built] [code generated]

LOG from GenerateSW
<i> The service worker at service-worker.js will precache
<i>         2 URLs, totaling 775 B.

webpack 5.73.0 compiled successfully in 3825 ms

```

```bash
ts-jest config:init
```

```bash
yarn add jest-environment-jsdom
```
