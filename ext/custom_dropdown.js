
/**
 * Class for an editable dropdown field.
 * @param {(!Array.<!Array>|!Function)} menuGenerator An array of options
 *     for a dropdown list, or a function which generates these options.
 * @param {Function=} opt_validator A function that is executed when a new
 *     option is selected, with the newly selected value as its sole argument.
 *     If it returns a value, that value (which must be one of the options) will
 *     become selected in place of the newly selected option, unless the return
 *     value is null, in which case the change is aborted.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldCustomDropdown = function(menuGenerator, opt_validator) {
    let options = menuGenerator.map(item => {
        return [item.label, item.value];
    });
    this.textLabels = menuGenerator.reduce((acc, item) => {
      acc[Blockly.utils.replaceMessageReferences(item.label)] = Blockly.utils.replaceMessageReferences(item.textLabel);
      return acc;
    }, {});
  
    // Call parent's constructor.
    Blockly.FieldCustomDropdown.superClass_.constructor.call(this, options, opt_validator);
  };
  goog.inherits(Blockly.FieldCustomDropdown, Blockly.FieldDropdown);
  
  /**
   * Set the text in this field.  Trigger a rerender of the source block.
   * @param {*} newText New text.
   */
  Blockly.FieldCustomDropdown.prototype.setText = function(newText) {
      let text = this.textLabels[newText];
      if (!text) {
          return;
      }
      Blockly.FieldCustomDropdown.superClass_.setText.call(this, text);
  };
  
  /**
   * Get the text from this field.
   * @return {string} Current text.
   */
  Blockly.FieldCustomDropdown.prototype.getText = function() {
      let labels = Object.keys(this.textLabels);
      for (let i = 0; i < labels.length; i++) {
          if (this.text_ === this.textLabels[labels[i]]) {
              return labels[i];
          }
      }
  };
  
  /**
   * Install this dropdown on a block.
   */
  Blockly.FieldCustomDropdown.prototype.init = function() {
    if (this.fieldGroup_) {
      // Dropdown has already been initialized once.
      return;
    }
    // Add dropdown arrow: "option ▾" (LTR) or "▾ אופציה" (RTL)
    this.arrow_ = Blockly.utils.createSvgElement('tspan', {}, null);
    this.arrow_.appendChild(document.createTextNode(this.sourceBlock_.RTL ?
        Blockly.FieldDropdown.ARROW_CHAR + ' ' :
        ' ' + Blockly.FieldDropdown.ARROW_CHAR));
  
    Blockly.FieldDropdown.superClass_.init.call(this);
    // Force a reset of the text to add the arrow.
    var text = this.getText();
    this.text_ = null;
    this.setText(text);
  }
  