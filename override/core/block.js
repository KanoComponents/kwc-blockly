import '../../blockly_built/blockly_compressed.js';

/**
 * Get the colour of a block.
 * @return {string} #RRGGBB string.
 */
Blockly.Block.prototype.getColour = function() {
    if (this.isShadow()) {
        let parent = this.getParent();
        if (parent) {
            return parent.getColour();
        }
    }
    return this.customColor || this.colour_;
};
