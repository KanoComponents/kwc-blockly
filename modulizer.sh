modulizer --out . \
--npm-name @kano/kwc-blockly \
--npm-version 3.0.0-beta.2 \
--dependency-mapping kwc-style,@kano/kwc-style,^3.0.0 \
--dependency-mapping kwc-color-picker,@kano/kwc-color-picker,^3.0.0
echo "window.goog = goog;window.Blockly=Blockly;" >> blockly_built/blockly_compressed.js
