# Introduction

This project has the minimum setup that is needed to work with a node project using typescript. Once you clone this repo, run:

```
npm install
```

Then you can start adding your sources inside the src folder and start testing it.

You can execute a typescript file directly using nodemon like so:

```
npx nodemon ./src/index.ts
```

or the script

```
npm run dev
```

It will run your file in a watch mode and will rebuild and run whenever changes are made to the file.

## Debugging

Debugging is configured with necessary pre launch tasks to ensure the code is built, and latest js files are available for the debugger along with the source map files. You simply select the file which you want to debug and run the 'launch program' configuration from within the debug pane.

## Unit testing

Jest is integrated and also jest is configured to ensure it compiles down any ES6 only libraries too to commonjs modules to ensure correct interoperability and testing. Please ensure to give
correct regex for `transformIgnorePatterns` in case you want to consider some of the library sources to be parsed and transformed.

You can run the tests using

```
npm test
```

## Commands used to setup this project

This project has all necessary integrations of typescript, eslint, prettier, jest, and also a setup to debug the current file selected.

Looking at following commands might give some insights into the kind of setup that is done in this project and the libraries it is
using.

```
1. npm --init -y
2. npm i typescript ts-node @types/node --save-dev
3. npx tsc --init
4. npm i eslint --save-dev
5. npx eslint --init
6. npm i prettier --save-dev
7. npm i @typescript-eslint/parser --save-dev
8. npm i eslint-plugin-prettier eslint-config-prettier --save-dev
9. npm i eslint-import-resolver-typescript tsconfig-paths --save-dev
10. npm i jest --save-dev
    11.npm i @types/jest --save-dev
11. npm i @babel/core @babel/plugin-transform-modules-commonjs @babel/preset-env babel-jest babel-plugin-dynamic-import-node ts-jest --save-dev
11. npm install nodemon ts-node --save-dev
12. npx husky-init && npm install
13. npm install --save-dev lint-staged
```
