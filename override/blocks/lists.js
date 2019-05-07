import '../../field/array-length.js';

Blockly.Blocks['lists_create_with'] = {
    /**
     * Block for creating a list with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
        this.setColour(Blockly.Constants.Lists.HUE);
        this.itemCount_ = 3;
        this.updateShape_();
        this.setOutput(true, 'Array');
        this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
    },
    /**
     * Create XML to represent list inputs.
     * @return {!Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
        if (this.itemCount_ && this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE);
        }
        // Add new inputs.
        for (var i = 0; i < this.itemCount_; i++) {
            if (!this.getInput('ADD' + i)) {
                var input = this.appendValueInput('ADD' + i);
                if (i == 0) {
                    input.appendField(new Blockly.FieldArrayLength(this.itemCount_, (newValue) => {
                        if (typeof newValue === 'number' && this.itemCount_ !== newValue) {
                            this.itemCount_ = newValue;
                            this.updateShape_();
                        }
                    }));
                    input.appendField(Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH);
                }
            }
        }
        // Remove deleted inputs.
        while (this.getInput('ADD' + i)) {
            this.removeInput('ADD' + i);
            i++;
        }
        const widgetInput = this.getInput('ADD0');
        const widget = widgetInput && widgetInput.fieldRow[0] ? widgetInput.fieldRow[0] : null;
        if (!widget) {
            return;
        }
        widget.setValue(this.itemCount_);
    }
};
