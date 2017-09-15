#!/bin/bash

TMP_DIR=$(mktemp -d)
CURRENT_DIR=$(pwd)

# Remove the current blockly
rm -rf blockly_built
mkdir blockly_built

cp -r blockly $TMP_DIR/blockly
cp -r closure-library $TMP_DIR/closure-library

echo 'Patching blockly'

rsync -av $CURRENT_DIR/blockly_patch/* $TMP_DIR/blockly/

cd $TMP_DIR/blockly

echo 'Building blockly'

./build.py

mv $TMP_DIR/blockly/blockly_* $CURRENT_DIR/blockly_built/
mv $TMP_DIR/blockly/msg $CURRENT_DIR/blockly_built/msg
mv $TMP_DIR/blockly/media $CURRENT_DIR/blockly_built/media
mv $TMP_DIR/blockly/blocks_compressed.js $CURRENT_DIR/blockly_built/blocks_compressed.js
mv $TMP_DIR/blockly/dart_compressed.js $CURRENT_DIR/blockly_built/dart_compressed.js
mv $TMP_DIR/blockly/javascript_compressed.js $CURRENT_DIR/blockly_built/javascript_compressed.js
mv $TMP_DIR/blockly/lua_compressed.js $CURRENT_DIR/blockly_built/lua_compressed.js
mv $TMP_DIR/blockly/php_compressed.js $CURRENT_DIR/blockly_built/php_compressed.js
mv $TMP_DIR/blockly/python_compressed.js $CURRENT_DIR/blockly_built/python_compressed.js

echo 'Cleaning up'

rm -rf $TMP_DIR
