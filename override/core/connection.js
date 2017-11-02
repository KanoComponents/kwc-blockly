/**
 * Checks whether the current connection can connect with the target
 * connection.
 * @param {Blockly.Connection} target Connection to check compatibility with.
 * @return {number} Blockly.Connection.CAN_CONNECT if the connection is legal,
 *    an error code otherwise.
 * @private
 */
Blockly.Connection.prototype.canConnectWithReason_ = function(target) {
    if (!target) {
      return Blockly.Connection.REASON_TARGET_NULL;
    }
    if (this.isSuperior()) {
      var blockA = this.sourceBlock_;
      var blockB = target.getSourceBlock();
    } else {
      var blockB = this.sourceBlock_;
      var blockA = target.getSourceBlock();
    }
    if (blockA && blockA == blockB) {
      return Blockly.Connection.REASON_SELF_CONNECTION;
    } else if (target.type != Blockly.OPPOSITE_TYPE[this.type]) {
      return Blockly.Connection.REASON_WRONG_TYPE;
    } else if (blockA && blockB && blockA.workspace !== blockB.workspace) {
      return Blockly.Connection.REASON_DIFFERENT_WORKSPACES;
    } else if (!this.checkType_(target)) {
      return Blockly.Connection.REASON_CHECKS_FAILED;
    }
    return Blockly.Connection.CAN_CONNECT;
  };