Blockly.BlockSvg.prototype.getShadowLight = function() {
    return this.shadowLight || this.workspace.shadowLight || 0.6;
};

Blockly.BlockSvg.prototype.setShadowLight = function(shadowLight) {
    return this.shadowLight = shadowLight;
};

/**
 * Change the colour of a block.
 */
Blockly.BlockSvg.prototype.updateColour = function() {
    if (this.disabled) {
      // Disabled blocks don't have colour.
      return;
    }
    var hexColour = this.getColour();
    var rgb = goog.color.hexToRgb(hexColour);
    if (this.isShadow()) {
      rgb = goog.color.lighten(rgb, this.getShadowLight());
      hexColour = goog.color.rgbArrayToHex(rgb);
      this.svgPathLight_.style.display = 'none';
      this.svgPathDark_.setAttribute('fill', hexColour);
    } else {
      this.svgPathLight_.style.display = '';
      var hexLight = goog.color.rgbArrayToHex(goog.color.lighten(rgb, 0.3));
      var hexDark = goog.color.rgbArrayToHex(goog.color.darken(rgb, 0.2));
      this.svgPathLight_.setAttribute('stroke', hexLight);
      this.svgPathDark_.setAttribute('fill', hexDark);
    }
    this.svgPath_.setAttribute('fill', hexColour);
  
    var icons = this.getIcons();
    for (var i = 0; i < icons.length; i++) {
      icons[i].updateColour();
    }
  
    // Bump every dropdown to change its colour.
    for (var x = 0, input; input = this.inputList[x]; x++) {
      for (var y = 0, field; field = input.fieldRow[y]; y++) {
        field.setText(null);
      }
    }
  };
