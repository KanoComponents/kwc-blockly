import { Material } from '@kano/kwc-color-picker/palettes/material.js';
import './blockly_built/blockly_compressed.js';
import './blockly_built/msg/js/en.js';

const animationSupported = 'animate' in HTMLElement.prototype;
// Set the default palette to the material from the color picker
Blockly.FieldColour.COLOURS = Material.colors;
Blockly.FieldColour.COLUMNS = Material.rowSize;

Blockly.FieldColour.HEX_REGEXP = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

if (location.search.match('lookup=true')) {
    Blockly.SEARCH_PLUS_ENABLED = true;
}

// Reload the custom messages as Blockly overrides them
if (window.CustomBlocklyMsg) {
    Object.assign(Blockly.Msg, window.CustomBlocklyMsg);
}

/**
 * Sets the state or property of an element.
 * @param {!Element} element DOM node where we set state.
 * @param {!(goog.a11y.aria.State|string)} stateName State attribute being set.
 *     Automatically adds prefix 'aria-' to the state name if the attribute is
 *     not an extra attribute.
 * @param {string|boolean|number|!Array<string>} value Value
 * for the state attribute.
 */
goog.a11y.aria.setState = function (element, stateName, value) {
    if (goog.isArray(value)) {
        value = value.join(' ');
    }
    const attrStateName = goog.a11y.aria.getAriaAttributeName_(stateName);
    if (!element) {
        return;
    }
    if (value === '' || value == undefined) {
        const defaultValueMap = goog.a11y.aria.datatables.getDefaultValuesMap();
        // Work around for browsers that don't properly support ARIA.
        // According to the ARIA W3C standard, user agents should allow
        // setting empty value which results in setting the default value
        // for the ARIA state if such exists. The exact text from the ARIA W3C
        // standard (http://www.w3.org/TR/wai-aria/states_and_properties):
        // "When a value is indicated as the default, the user agent
        // MUST follow the behavior prescribed by this value when the state or
        // property is empty or undefined."
        // The defaultValueMap contains the default values for the ARIA states
        // and has as a key the goog.a11y.aria.State constant for the state.
        if (stateName in defaultValueMap) {
            element.setAttribute(attrStateName, defaultValueMap[stateName]);
        } else {
            element.removeAttribute(attrStateName);
        }
    } else {
        element.setAttribute(attrStateName, value);
    }
};


/**
 * Is this event targeting a text input widget?
 * @param {!Event} e An event.
 * @return {boolean} True if text input.
 * @private
 */
Blockly.utils.isTargetInput = function (e) {
// In a shadow DOM the first element of the path is more accurate
    const target = e.path ? e.path[0] : e.target;
    return target.type == 'textarea' || target.type == 'text' ||
        target.type == 'number' || target.type == 'email' ||
        target.type == 'password' || target.type == 'search' ||
        target.type == 'tel' || target.type == 'url' ||
        target.isContentEditable;
};

Blockly.Variables.variablesDB = {};

Blockly.Variables.allUsedVariables = function (root) {
    let blocks;
    if (root instanceof Blockly.Block) {
    // Root is Block.
        blocks = root.getDescendants();
    } else if (root.getAllBlocks) {
    // Root is Workspace.
        blocks = root.getAllBlocks();
    } else {
        throw `Not Block or Workspace: ${root}`;
    }
    const variableHash = Object.create(null);
    // Iterate through every block and add each variable to the hash.
    for (let x = 0; x < blocks.length; x++) {
        const blockVariables = blocks[x].getVars();
        if (blockVariables) {
            for (let y = 0; y < blockVariables.length; y++) {
                const varName = blockVariables[y];
                // Variable name may be null if the block is only half-built.
                if (varName) {
                    variableHash[varName.toLowerCase()] = varName;
                }
            }
        }
    }
    // Flatten the hash into a list.
    let variableList = [];
    for (const name in variableHash) {
        variableList.push(variableHash[name]);
    }
    if (Blockly.Variables.variablesDB[root.id]) {
        variableList = variableList.concat(Blockly.Variables.variablesDB[root.id]);
    }
    variableList = variableList.filter((value, index, self) => self.indexOf(value) === index);
    return variableList;
};

Blockly.Variables.addVariable = function (variable, root) {
    if (!Blockly.Variables.variablesDB[root.id]) {
        Blockly.Variables.variablesDB[root.id] = [];
    }
    if (Blockly.Variables.variablesDB[root.id].indexOf(variable) === -1) {
        Blockly.Variables.variablesDB[root.id].push(variable);
    }
};

Blockly.getSvgXY_ = function (element, workspace) {
    let x = 0;
    let y = 0;
    let scale = 1;
    if (goog.dom.contains(workspace.getCanvas(), element) ||
    goog.dom.contains(workspace.getBubbleCanvas(), element)) {
    // Before the SVG canvas, scale the coordinates.
        scale = workspace.scale;
    }
    do {
        if (!element.getAttribute) {
            break;
        }
        // Loop through this block and every parent.
        const xy = Blockly.utils.getRelativeXY(element);
        if (element == workspace.getCanvas() ||
        element == workspace.getBubbleCanvas()) {
            // After the SVG canvas, don't scale the coordinates.
            scale = 1;
        }
        x += xy.x * scale;
        y += xy.y * scale;
        element = element.parentNode;
    } while (element && element != workspace.getParentSvg());
    return new goog.math.Coordinate(x, y);
};

/**
 * Handle a mouse up event on an editable field.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.Field.prototype.onMouseUp_ = function (e) {
    if ((goog.userAgent.IPHONE || goog.userAgent.IPAD) &&
    !goog.userAgent.isVersionOrHigher('537.51.2') &&
    e.layerX !== 0 && e.layerY !== 0) {
    // Old iOS spawns a bogus event on the next touch after a 'prompt()' edit.
    // Unlike the real events, these have a layerX and layerY set.

    } else if (Blockly.utils.isRightButton(e)) {
    // Right-click.

    } else if (this.sourceBlock_.workspace.isDragging() || this.sourceBlock_.isInFlyout) {
    // Drag operation is concluding.  Don't open the editor.

    } else if (this.sourceBlock_.isEditable()) {
    // Non-abstract sub-classes must define a showEditor_ method.
        this.showEditor_();
    // The field is handling the touch, but we also want the blockSvg onMouseUp
    // handler to fire, so we will leave the touch identifier as it is.
    // The next onMouseUp is responsible for nulling it out.
    }
};

/**
 * Install this field on a block.
 */
Blockly.Field.prototype.init = function () {
    if (this.fieldGroup_) {
    // Field has already been initialized once.
        return;
    }
    // Build the DOM.
    this.fieldGroup_ = Blockly.utils.createSvgElement('g', {}, null);
    if (!this.visible_) {
        this.fieldGroup_.style.display = 'none';
    }
    this.borderRect_ = Blockly.utils.createSvgElement(
        'rect',
        {
            rx: 2,
            ry: 2,
            x: -Blockly.BlockSvg.SEP_SPACE_X / 2,
            y: 0,
            height: 16,
        }, this.fieldGroup_, this.sourceBlock_.workspace,
    );
    /** @type {!Element} */
    this.textElement_ = Blockly.utils.createSvgElement(
        'text',
        { class: 'blocklyText', y: this.size_.height - 12.5 },
        this.fieldGroup_,
    );

    this.updateEditable();
    this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);
    this.mouseUpWrapper_ =
    Blockly.bindEventWithChecks_(
        this.fieldGroup_, 'mouseup', this,
        this.onMouseUp_,
    );
    // Force a render.
    this.render_();
};

Blockly.setPhantomBlock = function (connection, targetBlock) {
    let sourceBlock = connection.getSourceBlock(),
        targetConnection = targetBlock.outputConnection ? targetBlock.outputConnection : targetBlock.previousConnection,
        phantomSvgGroup = document.createElementNS(Blockly.SVG_NS, 'g'),
        phantomSvgPath = document.createElementNS(Blockly.SVG_NS, 'path'),
        phantomSvgText = document.createElementNS(Blockly.SVG_NS, 'text'),
        xy = sourceBlock.getRelativeToSurfaceXY(),
        position = {},
        breathingAnimation;

    if (Blockly.dragMode_ !== 0) {
        if (!targetBlock.initialXY_) {
            return;
        }
        position.x = connection.x_ - xy.x - (targetConnection.x_ - targetBlock.initialXY_.x);
        position.y = connection.y_ - xy.y - (targetConnection.y_ - targetBlock.initialXY_.y);
    } else {
        position.x = xy.x - connection.x_ - (targetConnection.x_ - targetBlock.getBoundingRectangle().topLeft.x) + 8;
        position.y = xy.y - connection.y_ - (targetConnection.y_ - targetBlock.getBoundingRectangle().topLeft.y);
    }

    phantomSvgPath.setAttribute('d', targetBlock.svgPath_.getAttribute('d'));
    phantomSvgPath.setAttribute('fill', targetBlock.getColour());
    phantomSvgPath.setAttribute('fill-opacity', 0.25);
    phantomSvgPath.setAttribute('stroke', targetBlock.getColour());
    phantomSvgPath.setAttribute('stroke-width', 1);
    phantomSvgPath.setAttribute('stroke-dasharray', 6);

    phantomSvgGroup.appendChild(phantomSvgPath);
    phantomSvgGroup.appendChild(phantomSvgText);
    phantomSvgGroup.setAttribute('transform', `translate(${position.x}, ${position.y})`);

    Blockly.removePhantomBlock();

    sourceBlock.svgGroup_.appendChild(phantomSvgGroup);
    if (animationSupported) {
        phantomSvgGroup.animate([{
            opacity: 0,
        }, {
            opacity: 1,
        }], {
            duration: 400,
            easing: 'ease-out',
        });
        breathingAnimation = phantomSvgGroup.animate([{
            opacity: 0.7,
        }, {
            opacity: 1,
        }, {
            opacity: 0.7,
        }], {
            delay: 400,
            duration: 1200,
            easing: 'ease-in-out',
            iterations: Infinity,
        });
    } else {
        phantomSvgGroup.style.opacity = 1;
        breathingAnimation = function () {
            phantomSvgGroup.style.opacity = 1;
        };
        breathingAnimation.cancel = function () {
            return null;
        };
    }


    Blockly.phantomBlock_ = {
        svgRoot: phantomSvgGroup,
        position,
        animation: breathingAnimation,
    };
};

Blockly.removePhantomBlock = function (connection, targetBlock) {
    if (Blockly.phantomBlock_) {
        let translate = `translate(${Blockly.phantomBlock_.position.x}px, ${Blockly.phantomBlock_.position.y}px)`,
            root = Blockly.phantomBlock_.svgRoot;
        // Stop the breathing animation
        Blockly.phantomBlock_.animation.cancel();
        root.style.transformOrigin = 'center center';
        root.style.transformBox = 'fill-box';
        if (animationSupported) {
            root.animate([{
                transform: `${translate} scale(1)`,
                opacity: 1,
            }, {
                transform: `${translate} scale(4)`,
                opacity: 0,
            }], {
                duration: 300,
                easing: 'ease-in',
            }).onfinish = () => {
                root.parentNode.removeChild(root);
            };
        } else {
            root.style.opacity = 0;
            root.parentNode.removeChild(root);
        }
        Blockly.phantomBlock_ = null;
    }
};

Blockly.Workspace.prototype.openOmnibox = function () {
    if (!this._omnibox) {
        const svg = this.getParentSvg();
        this._omniboxContainer = document.createElement('div');
        this._omniboxContainer.style.position = 'fixed';
        this._omniboxContainer.style.top = 0;
        this._omniboxContainer.style.left = 0;
        this._omniboxContainer.style.width = '100%';
        this._omniboxContainer.style.height = '100%';
        this._omniboxContainer.addEventListener('mousedown', (e) => {
            const target = e.path ? e.path[0] : e.target;
            if (target === this._omniboxContainer) {
                this.closeOmnibox();
            }
        });
        this._omnibox = document.createElement('kwc-blockly-omnibox');
        this._omnibox.targetWorkspace = this;
        this._omnibox.noDrag = true;
        this._omniboxContainer.appendChild(this._omnibox);
        svg.parentNode.appendChild(this._omniboxContainer);
        this._omnibox.style.position = 'fixed';
        this._omnibox.style.maxHeight = '345px';
        this._omnibox.style.boxShadow = 'initial';
    } else {
        this._omniboxContainer.style.display = 'block';
    }
    this._omnibox.focus();
    return this._omnibox;
};

Blockly.Workspace.prototype.closeOmnibox = function (doNotNotify) {
    if (this._omnibox) {
        this._omnibox.clear();
        this._omniboxContainer.style.display = 'none';
        if (!doNotNotify) {
            this._omnibox.dispatchEvent(new CustomEvent('close'));
        }
    }
};

Blockly.Block.prototype.renderSearchPlus_ = function () {
    let inputList = this.inputList,
        connections;

    // Only add the listener once, trick to avoid overriding the constructor
    if (!this.listenerAdded) {
        this.listenerAdded = true;
        // Don't do it if in flyout
        if (this.isInFlyout || !this.rendered) {
            return;
        }

        // Grab all the input connections that are eligible for search plus buttons
        connections = inputList.filter(input => input.type === Blockly.INPUT_VALUE || input.type === Blockly.NEXT_STATEMENT)
            .map(input => input.connection);
        // Create the buttons
        connections.forEach(connection => this.attachSearchToConnection_(connection));
        // Create a button for the nextConnection if exists and store the created block
        this.shadowSearch_ = this.attachSearchToConnection_(this.nextConnection);
        this.workspace.addChangeListener((e) => {
            // On a move event, we might need to remove/add a button to the next connection as it is not dealt with the `shadow block` paradigm
            if (e.type === Blockly.Events.MOVE) {
                // A block was connected to this one and the next connection now contains a block that is not the search plus button
                if (e.newParentId === this.id
                    && this.shadowSearch_
                    && this.nextConnection.targetConnection
                    && this.nextConnection.targetConnection.getSourceBlock() !== this.shadowSearch_) {
                    // Remove the search plus button and dereference it
                    this.shadowSearch_.dispose();
                    this.shadowSearch_ = null;
                } else if (e.oldParentId === this.id
                        && this.nextConnection
                        && !this.nextConnection.targetConnection
                        && this.workspace) {
                    // A block disconnected from this block and the nextConnection is now empty
                    this.attachSearchToConnection_(this.nextConnection);
                }
            }
        });
    }
};

Blockly.Block.prototype.attachSearchToConnection_ = function (connection) {
    // Do not attach if a block is already connected
    if (connection && !connection.targetConnection && this.workspace) {
        let type,
            block,
            connectionName;
        // Prevent this manipulation to trigger events
        Blockly.Events.disable();
        // Select the right type of search plus and connection for the current connection
        if (connection.type === Blockly.INPUT_VALUE) {
            type = 'search_output';
            connectionName = 'outputConnection';
        } else if (connection.type === Blockly.NEXT_STATEMENT) {
            type = 'search_statement';
            connectionName = 'previousConnection';
        }
        // Create the search plus block
        block = this.workspace.newBlock(type);
        block.initSvg();
        block.render();
        // Connect to the given connection
        connection.connect(block[connectionName]);
        Blockly.Events.enable();
        return block;
    }
};

/**
 * Create a virtual workspace where virtual blocks will be added
 * This is used to grab instances of blocks and extract data from them, without the need of rendering them
 */
Blockly._dataWorkspace = new Blockly.Workspace();
Blockly._dataBlocks = {};

Blockly.getDataBlock = function (block) {
    const type = block.id;
    if (!Blockly._dataBlocks[type]) {
        Blockly._dataBlocks[type] = new Blockly.Block(Blockly._dataWorkspace, type);
        if (block.colour) {
            Blockly._dataBlocks[type].setColour(block.colour);
        }
    }
    return Blockly._dataBlocks[type];
};

Blockly.stringMatch = function (s, lookup) {
    return s.toLowerCase().indexOf(lookup.toLowerCase()) !== -1;
};

Blockly.stringMatchScore = function (s, lookup) {
    const matches = s.toLowerCase().match(lookup.toLowerCase());
    if (!matches) {
        return 0;
    }
    return matches[0].length / matches.input.length;
};

Blockly.Block.prototype.matches = function (qs, workspace) {
    let score = 0;
    this.inputList.forEach((input) => {
        input.fieldRow.forEach((field) => {
            score += (field.matches(qs, workspace) ? 1 : 0);
        });
    });
    return score;
};

Blockly.Block.prototype.fromQuery = function (qs, workspace) {
    if (!qs) {
        return;
    }
    this.inputList.forEach((input) => {
        input.fieldRow.forEach((field) => {
            field.fromQuery(qs, workspace);
        });
    });
};

Blockly.Field.prototype.getAPIText = function () {
    return this.getText();
};

Blockly.Field.prototype.matches = function (qs) {
    return qs.split(' ').some(piece => Blockly.stringMatch(this.text_, piece));
};

Blockly.Field.prototype.fromQuery = function () {};

Blockly.FieldDropdown.prototype.getAPIText = function () {
    const options = this.getOptions().map(options => options[0]);
    return `[${options.join('|')}]`;
};

Blockly.FieldDropdown.prototype.matches = function (qs) {
    const options = this.getOptions().map(options => options[0]);
    // As soon as we find an option containing a piece of the query string
    return options.some(option => qs.split(' ').some(piece => Blockly.stringMatch(option, piece)));
};

Blockly.FieldDropdown.prototype.fromQuery = function (qs) {
    const options = this.getOptions();
    // As soon as we find an option containing a piece of the query string
    return options.some(option => qs.split(' ').forEach((piece) => {
        if (Blockly.stringMatch(option[0], piece)) {
            this.setValue(option[1]);
        }
    }));
};

Blockly.FieldVariable.prototype.getAPIText = function (qs, workspace) {
    let variableList = Blockly.Variables.allUsedVariables(workspace),
        variables = variableList.slice(0);
    if (qs.split(' ').some(piece => Blockly.stringMatch('variable', piece))) {
        return '<variable>';
    }
    for (let i = 0; i < variables.length; i++) {
        if (qs.split(' ').some(piece => Blockly.stringMatch(variables[i], piece))) {
            return `(${variables[i]})`;
        }
    }
    return '<variable>';
};

Blockly.FieldVariable.prototype.matches = function (qs, workspace) {
    let variableList = Blockly.Variables.allUsedVariables(workspace),
        variables = variableList.slice(0);
    if (qs.split(' ').some(piece => Blockly.stringMatch('variable', piece))) {
        return '<variable>';
    }
    // As soon as we find an option containing a piece of the query string
    return variables.some(variable => qs.split(' ').some(piece => Blockly.stringMatch(variable, piece)));
};

Blockly.FieldVariable.prototype.fromQuery = function (qs, workspace) {
    let variableList = Blockly.Variables.allUsedVariables(workspace),
        variables = variableList.slice(0);
    // As soon as we find an option containing a piece of the query string
    for (let i = 0; i < variables.length; i++) {
        if (qs.split(' ').some(piece => Blockly.stringMatch(variables[i], piece))) {
            this.setValue(variables[i]);
            return;
        }
    }
};

Blockly.FieldNumber.prototype.getAPIText = function (qs) {
    return !isNaN(qs) ? `(${qs})` : '<number>';
};

Blockly.FieldNumber.prototype.matches = function (s) {
    return !isNaN(s) || 'number'.indexOf(s) !== -1;
};

Blockly.FieldNumber.prototype.fromQuery = function (qs) {
    const n = parseInt(qs, 10);
    if (!isNaN(n)) {
        this.setValue(n);
    }
};

Blockly.FieldColour.prototype.getAPIText = function (qs) {
    let colors = Blockly.FieldColour.COLOURS,
        highestScore = 0,
        highestColor,
        score;
    if (Blockly.FieldColour.HEX_REGEXP.test(qs)) {
        return `Color: ${qs}`;
    }
    for (let i = 0; i < colors.length; i++) {
        score = Blockly.stringMatchScore(colors[i], qs);
        if (score > highestScore) {
            highestScore = score;
            highestColor = colors[i];
        }
    }
    return highestColor || '<color>';
};

Blockly.FieldColour.prototype.matches = function (s) {
    let colors = Blockly.FieldColour.COLOURS,
        highestScore = 0,
        highestColor,
        score;
    if (Blockly.FieldColour.HEX_REGEXP.test(s)) {
        return true;
    }
    for (let i = 0; i < colors.length; i++) {
        score = Blockly.stringMatchScore(colors[i], s);
        if (score > highestScore) {
            highestScore = score;
            highestColor = colors[i];
        }
    }
    return !!highestColor || Blockly.stringMatch('color', s);
};

Blockly.FieldColour.prototype.fromQuery = function (qs) {
    let colors = Blockly.FieldColour.COLOURS,
        highestScore = 0,
        highestColor,
        score;
    if (Blockly.FieldColour.HEX_REGEXP.test(qs)) {
        this.setValue(qs);
        return;
    }
    for (let i = 0; i < colors.length; i++) {
        score = Blockly.stringMatchScore(colors[i], qs);
        if (score > highestScore) {
            highestScore = score;
            highestColor = colors[i];
        }
    }
    this.setValue(highestColor);
};

Blockly.Input.prototype.toAPIString = function (qs, workspace) {
    let s = '';
    s += this.fieldRow.map(field => field.getAPIText(qs, workspace)).join(' ');
    // Deal with connection displays
    if (this.type === Blockly.INPUT_VALUE) {
        s += ' [ ]';
    } else if (this.type === Blockly.NEXT_STATEMENT) {
        s += ' ...';
    }
    return s;
};

Blockly.Block.prototype.getFirstAvailableSearch = function () {
    let input;
    for (let i = 0; i < this.inputList.length; i++) {
        input = this.inputList[i];
        if (input.connection && input.connection.targetConnection) {
            const block = input.connection.targetConnection.sourceBlock_;
            if (input.connection.type === Blockly.INPUT_VALUE && block.type === 'search_output'
                || input.connection.type === Blockly.NEXT_STATEMENT && block.type === 'search_statement') {
                return block;
            }
        }
    }
};

Blockly.Block.prototype.toAPIString = function (qs, workspace) {
    return this.inputList.map(input => input.toAPIString(qs, workspace)).join(' ');
};

Blockly.Workspace.prototype.search = function (qs) {
    let blocks = [];
    // lookup blocks in the toolbox
    this.toolbox.toolbox.forEach((category) => {
        blocks = blocks.concat(category.blocks);
    });
    // Lookup all blocks registered
    // blocks = Object.keys(Blockly.Blocks);
    return blocks
        .map(Blockly.getDataBlock)
        .filter(block => block.matches(qs, this) > 0);
};

Blockly.Blocks.search_statement = {
    init() {
        const searchField = new Blockly.FieldLookup('Type: __________', 'blocklySearchStatement');
        this.setColour('#bdbdbd');
        this.appendDummyInput('SEARCH')
            .appendField(searchField, 'SEARCH');
        this.setPreviousStatement(true);
        this.setPaddingY(0);
        this.setPaddingX(0);
        this.setShadow(true);
        this.workspace.addChangeListener(() => {
            if (!this.previousConnection.targetConnection) {
                this.dispose();
            }
        });
    },
};

Blockly.Blocks.search_output = {
    init() {
        const searchField = new Blockly.FieldLookup('+', 'blocklySearchOutput');
        this.setColour('#bdbdbd');
        this.appendDummyInput('SEARCH')
            .appendField(searchField, 'SEARCH');
        this.setOutput(true);
        this.setShadow(true);
    },
};
