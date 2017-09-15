/* global Blockly, goog */

Blockly.FieldLookup = function (text, c) {
    this._text = text;
    this._c = c || '';
    this.size_ = new goog.math.Size(0, Blockly.BlockSvg.MIN_BLOCK_Y);
};
goog.inherits(Blockly.FieldLookup, Blockly.Field);
Blockly.FieldLookup.prototype.init = function () {
    if (this._container) {
        // Field has already been initialized once.
        return;
    }
    // Build the DOM.
    this._container = Blockly.utils.createSvgElement('g', {
        class: 'blocklyLookupField ' + this._c
    }, null);
    this._textEl = Blockly.utils.createSvgElement('text', {
        transform: `translate(0, 12)`
    }, this._container);
    this._textEl.appendChild(document.createTextNode(this._text));
    this.sourceBlock_.getSvgRoot().appendChild(this._container);
    Blockly.bindEvent_(this._container, 'mousedown', this, this._onMouseDown);
};

/**
 * Draws the border with the correct width.
 * Saves the computed width in a property.
 * @private
 */
Blockly.FieldLookup.prototype.render_ = function() {
  if (!this.visible_) {
    this.size_.width = 0;
    return;
  }
  // Replace the text.
  goog.dom.removeChildren(/** @type {!Element} */ (this._textEl));
  var textNode = document.createTextNode(this._text);
  this._textEl.appendChild(textNode);

  var width = Blockly.Field.getCachedWidth(this._textEl);
  this.size_.width = width;
};

Blockly.FieldLookup.prototype._onMouseDown = function (e) {
    if (Blockly.WidgetDiv.isVisible()) {
        Blockly.WidgetDiv.hide();
    } else if (!this.sourceBlock_.isInFlyout) {
        this.showEditor_();
        e.preventDefault();
        e.stopPropagation();
    }
};
Blockly.FieldLookup.prototype.getSvgRoot = function () {
    return this._container;
};
Blockly.FieldLookup.prototype.showEditor_ = function () {
    var block = this.sourceBlock_;
    var xy = Blockly.getSvgXY_(block.svgGroup_, block.workspace);
    var connection = block.outputConnection ? block.outputConnection : block.previousConnection;
    var targetConnection = connection.targetConnection;
    var workspace = this.sourceBlock_.workspace;

    var omnibox = workspace.openOmnibox();
    omnibox.style.top = `${xy.y}px`;
    omnibox.style.left = `${xy.x}px`;

    omnibox.filter = (block) => {
        let blockConnection;
        if (targetConnection.type === Blockly.NEXT_STATEMENT) {
            blockConnection = block.previousConnection;
        } else if (targetConnection.type === Blockly.INPUT_VALUE) {
            blockConnection = block.outputConnection;
        }
        // The connection exists on the block found and it matches the type of the input
        return blockConnection  && (!targetConnection.check_ || !blockConnection.check_
                || targetConnection.check_.some(inputCheck => blockConnection.check_.indexOf(inputCheck) !== -1));
    };
    var onConfirm = (e) => {
        let type;
        omnibox.removeEventListener('confirm', onConfirm);
        omnibox.removeEventListener('close', onConfirm);
        if (e.detail && e.detail.selected) {
            type = e.detail.selected.type;
            if (type) {
                let block = workspace.newBlock(type),
                    searchBlock;
                block.fromQuery(omnibox.query, workspace);
                block.initSvg();
                block.render();
                if (targetConnection.type === Blockly.NEXT_STATEMENT) {
                    targetConnection.connect(block.previousConnection);
                } else if (targetConnection.type === Blockly.INPUT_VALUE) {
                    targetConnection.connect(block.outputConnection);
                }
                setTimeout(() => {
                    // Focus on the first available search block of the inserted block
                    searchBlock = block.getFirstAvailableSearch();
                    if (searchBlock) {
                        searchBlock.getField('SEARCH').focus();
                    }
                });
            }
        }
        workspace.closeOmnibox(true);
    };
    omnibox.addEventListener('confirm', onConfirm);
    omnibox.addEventListener('close', onConfirm);
    if ('animate' in HTMLElement.prototype) {
        let rect = omnibox.getBoundingClientRect(),
            hw = block.getHeightWidth();
        omnibox.style.transformOrigin = '0 0';
        omnibox.animate({
            transform: [`scale(${hw.width / rect.width}, ${hw.height / rect.height})`, 'scale(1, 1)']
        }, {
            duration: 170,
            easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)'
        });
    }
};

Blockly.FieldLookup.prototype.focus = function () {
    let onKeyDown = (e) => {
        window.removeEventListener('keydown', onKeyDown);
        if (e.keyCode === 13) {
            this.showEditor_();
        }
    };
    window.addEventListener('keydown', onKeyDown);
    this._container.classList.add('selected');
};