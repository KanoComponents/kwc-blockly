/* global Blockly, goog */

/**
 * The menu item index for the rename variable option.
 * @type {number}
 * @private
 */
Blockly.FieldVariable.prototype.newVarItemIndex_ = -1;

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {Blockly.FieldVariable}
 */
Blockly.FieldVariable.dropdownCreate = function () {
  if (!this.variable_) {
    throw Error('Tried to call dropdownCreate on a variable field with no' +
        ' variable selected.');
  }
  var name = this.getText();
  var workspace = null;
  if (this.sourceBlock_) {
    workspace = this.sourceBlock_.workspace;
  }
  var variableModelList = [];
  if (workspace) {
    var variableTypes = this.getVariableTypes_();
    // Get a copy of the list, so that adding rename and new variable options
    // doesn't modify the workspace's list.
    for (var i = 0; i < variableTypes.length; i++) {
      var variableType = variableTypes[i];
      var variables = workspace.getVariablesOfType(variableType);
      variableModelList = variableModelList.concat(variables);
    }
  }
  variableModelList.sort(Blockly.VariableModel.compareByName);

  var options = [];
  for (var i = 0; i < variableModelList.length; i++) {
    // Set the UUID as the internal representation of the variable.
    options[i] = [variableModelList[i].name, variableModelList[i].getId()];
  }
  options.push([Blockly.Msg['NEW_VARIABLE'], Blockly.NEW_VARIABLE_ID]);
  options.push([Blockly.Msg['RENAME_VARIABLE'], Blockly.RENAME_VARIABLE_ID]);
  if (Blockly.Msg['DELETE_VARIABLE']) {
    options.push(
        [
          Blockly.Msg['DELETE_VARIABLE'].replace('%1', name),
          Blockly.DELETE_VARIABLE_ID
        ]
    );
  }

  return options;
};

/**
 * Handle the selection of an item in the variable dropdown menu.
 * Special case the 'Rename variable...' and 'Delete variable...' options.
 * In the rename case, prompt the user for a new name.
 * @param {!goog.ui.Menu} menu The Menu component clicked.
 * @param {!goog.ui.MenuItem} menuItem The MenuItem selected within menu.
 */
Blockly.FieldVariable.prototype.onItemSelected = function(menu, menuItem) {
  var id = menuItem.getValue();
  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
    var workspace = this.sourceBlock_.workspace;
    if (id == Blockly.RENAME_VARIABLE_ID) {
      // Rename variable.
      Blockly.Variables.renameVariable(workspace, this.variable_);
      return;
    } else if (id == Blockly.NEW_VARIABLE_ID) {
        Blockly.Variables.createVariableButtonHandler(workspace, (newName) => {
            var newVariable = Blockly.Variables.getVariable(workspace, null, newName, '');
            this.setValue(newVariable.getId());
        }, '');
        return;
    } else if (id == Blockly.DELETE_VARIABLE_ID) {
      // Delete variable.
      workspace.deleteVariableById(this.variable_.getId());
      return;
    }

    // TODO (#1529): Call any validation function, and allow it to override.
  }
  this.setValue(id);
};