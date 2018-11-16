/**
 * Execute a block click.
 * @private
 */
Blockly.Gesture.prototype.doBlockClick_ = function() {
    // Block click in an autoclosing flyout.
    if (this.flyout_ && this.flyout_.autoClose) {
      if (!this.targetBlock_.disabled) {
        if (!Blockly.Events.getGroup()) {
          Blockly.Events.setGroup(true);
        }
      }
    } else {
      // Clicks events are on the start block, even if it was a shadow.
      Blockly.Events.fire(
          new Blockly.Events.Ui(this.startBlock_, 'click', undefined, undefined));
    }
    this.bringBlockToFront_();
    Blockly.Events.setGroup(false);
  };
