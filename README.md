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

## Usage

Blockly is installed under `blockly_built`, You will have to import the blockly library yourself as you can choose the compressed or uncompressed version and you can also choose the generators and language you want to use.

Create a HTML file to import the javascript from `blockly_built`, as it will deduplicate the import of these scripts:

```html
<script src="/bower_components/kwc-blockly/blockly_built/blockly_compressed.js"></script>
<script src="/bower_components/kwc-blockly/blockly_built/blocks_compressed.js"></script>
<script src="/bower_components/kwc-blockly/blockly_built/msg/js/en.js"></script>
<script src="/bower_components/kwc-blockly/blockly_built/javascript_compressed.js"></script>
<link rel="import" href="/bower_components/kwc-blockly/kwc-blockly.html">
```

Then use this file to import `<kwc-blockly>` Wherever you want to use it

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

`blockly` and the `closure-library` from Google are submodules of this repository. This way, we keep a reference to the sources, and apply our changes on top of it.

To rebuild with patches applied, just run the `build_blockly.sh` script. It will copy the blockly sources, apply the patches from `blockly_patches`, rebuild blockly and export this into the `blockly_built` folder.

To update to a newer version of blockly, run `git submodule update --remote` to grab the latest changes from blockly and then rebuild with `build_blockly.sh`. This can and will most likely BREAK things as the patches rely on blockly's internal API to enhance it. Getting a newer version can lead to some work to adapt the changes.

