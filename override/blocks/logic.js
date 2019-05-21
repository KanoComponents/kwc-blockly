import { FieldIfStack } from '../../field/if-stack.js';

Blockly.Blocks.controls_if = {
    init() {
        this.stackField = new FieldIfStack(JSON.stringify({ elseIfs: 0, else: false }), (newValue) => {
            const v = JSON.parse(newValue);
            this.elseifCount_ = v.elseIfs;
            this.elseCount_ = v.else;
            this.updateShape_();
        });

        this.appendValueInput('IF0')
            .setCheck('Boolean')
            .appendField(this.stackField, 'CONFIG')
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
    updateShape_() {
        let i;
        // Delete everything.
        if (this.getInput('ELSE')) {
            this.removeInput('ELSE');
        }
        i = 1;
        while (this.getInput(`IF${i}`)) {
            this.removeInput(`IF${i}`);
            this.removeInput(`DO${i}`);
            i += 1;
        }
        // Rebuild block.
        for (let j = 1; j <= this.elseifCount_; j += 1) {
            this.appendValueInput(`IF${j}`)
                .setCheck('Boolean')
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
            this.appendStatementInput(`DO${j}`)
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
        }
        if (this.elseCount_) {
            this.appendStatementInput('ELSE')
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
        }
    },
};
