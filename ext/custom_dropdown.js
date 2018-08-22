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
Blockly.FieldCustomDropdown = function(menuGenerator, labels, opt_validator) {
    this.labels = labels
    // Call parent's constructor.
    Blockly.FieldCustomDropdown.superClass_.constructor.call(this, menuGenerator, opt_validator);
  };
goog.inherits(Blockly.FieldCustomDropdown, Blockly.FieldDropdown);

/**
 * Create and populate the menu and menu items for this dropdown, based on
 * the options list.
 * @return {!goog.ui.Menu} The populated dropdown menu.
 * @private
 */
Blockly.FieldCustomDropdown.prototype.createMenu_ = function() {
    var menu = new goog.ui.Menu();
    menu.setRightToLeft(this.sourceBlock_.RTL);
    var options = this.getOptions();
    for (var i = 0; i < options.length; i++) {
        var value = options[i][1];   // Language-neutral value.
      var content = Blockly.utils.replaceMessageReferences(this.labels[value]); // Human-readable text or image.
      if (typeof content == 'object') {
        // An image, not text.
        var image = new Image(content['width'], content['height']);
        image.src = content['src'];
        image.alt = content['alt'] || '';
        content = image;
      }
      var menuItem = new goog.ui.MenuItem(content);
      menuItem.setRightToLeft(this.sourceBlock_.RTL);
      menuItem.setValue(value);
      menuItem.setCheckable(true);
      menu.addChild(menuItem, true);
      menuItem.setChecked(value == this.value_);
    }
    return menu;
  };
