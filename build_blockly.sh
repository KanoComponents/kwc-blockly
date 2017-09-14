#!/bin/bash

TMP_DIR=$(mktemp -d)
CURRENT_DIR=$(pwd)

# Remove the current blockly
rm -rf blockly

cd $TMP_DIR

echo 'Pulling blockly and closure...'

wget -O blockly.tar.gz https://github.com/google/blockly/tarball/master
wget -O closure.tar.gz https://github.com/google/closure-library/tarball/master

tar xzf blockly.tar.gz
tar xzf closure.tar.gz

mv google-blockly-* blockly
mv google-closure-library-* closure-library

echo 'Patching blockly'

rsync -av ./blockly_patch/* ./blockly/

cd blockly

echo 'Building blockly'

./build.py

mv $TMP_DIR/blockly $CURRENT_DIR/blockly

echo 'Cleaning up'

rm -rf $TMP_DIR
