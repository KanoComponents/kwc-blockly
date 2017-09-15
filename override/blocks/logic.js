Blockly.Blocks.controls_if = {
    init: function () {

        this.stackField = new Blockly.FieldIfStack({ elseIfs: 0, else: false }, (newValue) => {
            this.elseifCount_ = newValue.elseIfs;
            this.elseCount_   = newValue.else;
            this.updateShape_();
        });

        this.appendValueInput('IF0')
            .setCheck('Boolean')
            .appendField(this.stackField)
            .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);

        this.appendStatementInput('DO0')
            .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);

        this.setPreviousStatement(true);
        this.setNextStatement(true);

        this.setColour(Blockly.Constants.Logic.HUE);
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @this Blockly.Block
     * @private
     */
    updateShape_: function () {
        let i;
        // Delete everything.
        if (this.getInput('ELSE')) {
            this.removeInput('ELSE');
        }
        i = 1;
        while (this.getInput('IF' + i)) {
            this.removeInput('IF' + i);
            this.removeInput('DO' + i);
            i++;
        }
        // Rebuild block.
        for (let i = 1; i <= this.elseifCount_; i++) {
            this.appendValueInput('IF' + i)
                .setCheck('Boolean')
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
            this.appendStatementInput('DO' + i)
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
        }
        if (this.elseCount_) {
            this.appendStatementInput('ELSE')
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
        }
    },
    /**
     * Create XML to represent the number of else-if and else inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        let container;
        if (!this.elseifCount_ && !this.elseCount_) {
            return null;
        }
        container = document.createElement('mutation');
        if (this.elseifCount_) {
            container.setAttribute('elseif', this.elseifCount_);
        }
        if (this.elseCount_) {
            container.setAttribute('else', 1);
        }
        return container;
    },
    /**
     * Parse XML to restore the else-if and else inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
        this.elseCount_   = parseInt(xmlElement.getAttribute('else'), 10) || 0;
        this.stackField.setValue({
            elseIfs: this.elseifCount_,
            else: this.elseCount_
        });
        this.updateShape_();
    }
};