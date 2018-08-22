/**
 * Shut the trash can and, if necessary, delete the dragging block.
 * Should be called at the end of a block drag.
 * @return {boolean} whether the block was deleted.
 * @private
 */
Blockly.BlockDragger.prototype.maybeDeleteBlock_ = function() {
    var trashcan = this.workspace_.trashcan;

    if (this.wouldDeleteBlock_) {
        if (trashcan) {
        goog.Timer.callOnce(trashcan.close.bind(trashcan, true), 100, trashcan);
        }
        // Fire a move event, so we know where to go back to for an undo.
        this.fireMoveEvent_();
        this.draggingBlock_.dispose(false, true);
    } else if (trashcan) {
        // Make sure the trash can is closed.
        trashcan.close(false);
    }
    return this.wouldDeleteBlock_;
};
