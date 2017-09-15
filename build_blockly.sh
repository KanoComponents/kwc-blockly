#!/bin/bash

TMP_DIR=$(mktemp -d)
CURRENT_DIR=$(pwd)

# Remove the current blockly
rm -rf blockly_built

cp -r blockly $TMP_DIR/blockly
cp -r closure-library $TMP_DIR/closure-library

echo 'Patching blockly'

rsync -av $CURRENT_DIR/blockly_patch/* $TMP_DIR/blockly/

cd $TMP_DIR/blockly

echo 'Building blockly'

./build.py

mv $TMP_DIR/blockly $CURRENT_DIR/blockly_built

echo 'Cleaning up'

rm -rf $TMP_DIR
