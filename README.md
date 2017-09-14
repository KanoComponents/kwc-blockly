# \<kwc-blockly\>

[WIP] Reusable code editor based on Blockly that powers Kano Code

 - What is it called?
     - kwc-blockly
 - What is it made out of?
     - Polymer wrapper for a blockly instance. Uses a customized blockly and adds some features like the onibox
 - What variants are needed?
     - [TBD]
 - How does it scale?
     - Not targeted to small screens
 - What style variables are in use?
     - General colors (background, text colors)

## Installation
Clone this repository.
Run `bower i`

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test --skip-plugin junit-reporter
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

### Building blockly

The script `build_blockly.sh` will pull down the latest version of blockly and build it with the patches included in `blockly_patches`, meaning files in this folder will replace the sources from blockly before building it. As we have a custom implmentation of the toolbox, this is used to empty the Toolbox class and reduce the size of the blockly we use, but if in the future, more things get stripped down, of features are not needed, this patching system can be used.