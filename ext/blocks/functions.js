/**
 * Registers the logic blocks, and creates its category
 */
const COLOR = '#f75846';

Blockly.Msg.FUNCTION_DEFINITION_DEFAULT_NAME = 'my function';

Blockly.Blocks.function_definition = {
    init: function () {
        this.paramFields = [];
        this.funcDefField = new Blockly.FieldFunctionDefinition({ parameters: 0, returns: false }, (newValue) => {
            this.parameters = newValue.parameters;
            this.returns    = newValue.returns;
            this.updateShape_();
        });
        this.appendDummyInput('NAMES')
            .appendField(this.funcDefField)
            .appendField(Blockly.Msg.FUNCTION_DEFINITION_NAME)
            .appendField(new Blockly.FieldTextInput(Blockly.Msg.FUNCTION_DEFINITION_DEFAULT_NAME, (newValue) => {
                if (this.workspace.isFlyout) {
                    return;
                }
                let definitions = this.workspace.functionsRegistry.getAllFunctions(),
                    names = definitions
                                .filter(def => def.definitionBlock.id !== this.id)
                                .map(def => def.getName());
                // Reject the input with null
                if (newValue === '' || names.indexOf(newValue) !== -1) {
                    return null;
                }
                this._updateCallBlocks();
                this._updateToolbox();
            }), 'NAME');

        this.appendStatementInput('DO');

        if (!this.workspace.isFlyout) {
            this.workspace.functionsRegistry.createFunction(this);
        }

        this.updateShape_();
    },
    updateShape_: function () {
        let names      = this.getInput('NAMES'),
            returns    = this.getInput('RETURNS'),
            prevValues = {},
            fieldName;
        this.paramFields.forEach(name => {
            prevValues[name] = this.getFieldValue(name);
            names.removeField(name);
        });
        if (returns) {
            this.removeInput('RETURNS');
        }
        this.paramFields = [];
        for (let i = 0; i < this.parameters; i++) {
            fieldName = `PARAM${i}`;
            // Closure
            ((fieldParam) => {
                names.appendField(new Blockly.FieldTextInput(prevValues[fieldName] || `param ${i + 1}`, (newValue) => {
                    let funcDef, params, names;
                    if (this.workspace.isFlyout) {
                        return;
                    }
                    funcDef = this.workspace.functionsRegistry.getFunction(this.id);
                    params = funcDef.getParams();
                    names = Object.keys(params)
                            .filter(paramName => paramName !== fieldParam)
                            .map(paramName => params[paramName]);
                    // Prevent empty names
                    if (newValue === '' || names.indexOf(newValue) !== -1) {
                        return null;
                    }
                    this._updateCallBlocks();
                    this._updateArgBlocks();
                    this._updateToolbox();
                }), fieldParam);
                this.paramFields.push(fieldParam);
            })(fieldName);
        }
        if (this.returns) {
            this.appendValueInput('RETURNS')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(Blockly.Msg.FUNCTION_DEFINITION_RETURNS);
        }
        this._updateToolbox();
        this._updateCallBlocks();
        this._updateArgBlocks();
    },
    getToolbox () {
        let functionDef = this.workspace.functionsRegistry.getFunction(this.id),
            toolbox = functionDef.getParamsXml().map(xml => {
                return { custom: xml };
            });

        toolbox.unshift({ custom: functionDef.getCallXml() });
        return toolbox;
    },
    _updateToolbox () {
        this.funcDefField.updateToolbox();
    },
    _updateCallBlocks () {
        if (this.workspace.isFlyout) {
            return;
        }
        let funcDef = this.workspace.functionsRegistry.getFunction(this.id);
        funcDef.updateCallBlocks();
    },
    _updateArgBlocks () {
        if (this.workspace.isFlyout) {
            return;
        }
        let funcDef = this.workspace.functionsRegistry.getFunction(this.id);
        funcDef.updateParamsBlocks();
    },
    getFunctionDefinition: function () {
        return {
            name: this.getFieldValue('NAME'),
            args: this.paramFields.map(paramName => this.getFieldValue(paramName))
        };
    },
    domToMutation (el) {
        let names = this.getInput('NAMES'),
            paramEl, fieldName
        for (let i = 0; i < el.children.length; i++) {
            paramEl = el.children[i];
            if (paramEl.tagName.toLowerCase() === 'param') {
                fieldName = paramEl.getAttribute('name');
                names.appendField(new Blockly.FieldTextInput(paramEl.getAttribute('value')), fieldName);
                this.paramFields.push(fieldName);
            }
        }
        this.parameters = this.paramFields.length;
        this.funcDefField.setValue({ parameters: this.parameters, returns: this.returns });
    },
    mutationToDom () {
        let container = document.createElement('mutation');
        this.paramFields.forEach(fieldName => {
            let param = document.createElement('param');
            param.setAttribute('name', fieldName);
            param.setAttribute('value', this.getFieldValue(fieldName));
            container.appendChild(param);
        });
        return container;
    }
};

Blockly.Blocks.function_call = {
    init: function () {
        this._args = [];
        this.appendDummyInput()
            .appendField(this.id, 'NAME');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(COLOR);

        this.params = {};
    },
    getFunctionCall () {
        return this.getFieldValue('NAME');
    },
    updateShape () {
        let connectionHistory = {},
            input, funcDef, updateConnections;

        // Retrieve the function definition from the definitions workspace's registry
        funcDef = this.getFunctionDefinition();

        // When loading blocks, this one can be empty. The definition will
        // retrigger an update shape once ready
        if (!funcDef.definitionBlock) {
            return;
        }

        // Remove all params, but keep track of the connected blocks
        Object.keys(this.params).forEach(param => {
            input = this.getInput(param);
            if (input.connection && input.connection.targetConnection) {
                connectionHistory[param] = input.connection.targetConnection;
            }
            this.removeInput(param);
        });

        // Update all the inputs and fields
        this.setFieldValue(funcDef.getName(), 'NAME');
        this.params = funcDef.getParams();
        updateConnections = this.returns !== funcDef.getReturns();
        this.returns = funcDef.getReturns();

        Object.keys(this.params).forEach(param => {
            this.appendValueInput(param)
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(this.params[param], param);
            if (connectionHistory[param]) {
                input = this.getInput(param);
                input.connection.connect(connectionHistory[param]);
            }
        });
        this.setInputsInline(Object.keys(this.params).length <= 2);
        if (updateConnections) {
            this.unplug();
            if (this.returns) {
                this.setOutput(true);
                this.setPreviousStatement(false);
                this.setNextStatement(false);
            } else {
                this.setOutput(false);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
            }
        }
    },
    getFunctionDefinition () {
        return this.definitionWorkspace.functionsRegistry.getFunction(this.definitionBlock);
    },
    domToMutation (el) {
        this.definitionWorkspace = this.workspace;

        if (this.definitionWorkspace.isFlyout) {
            this.definitionWorkspace = this.definitionWorkspace.parentWorkspace;
        }

        this.definitionBlock = el.getAttribute('definition');
        if (!this.definitionBlock) {
            throw new Error(`Cannot create a function call without definition`);
        }

        this.definitionWorkspace.functionsRegistry.createCall(this.definitionBlock, this);
        this.updateShape();
    },
    mutationToDom () {
        let container = document.createElement('mutation');
        container.setAttribute('definition', this.definitionBlock);
        return container;
    }
};

/**
 * Function argument block.
 * Creates a block representing the argument of a function definition
 */
Blockly.Blocks.function_argument = {
    init: function () {
        this.appendDummyInput()
            .appendField(this.id, 'NAME');

        this.setColour(COLOR);
        this.setOutput(true);

        this.workspace.addChangeListener(e => {
            if (e.blockId === this.id && e.type === Blockly.Events.MOVE && e.newParentId) {
                let parent = this,
                    funcDef = this.getFunctionDefinition();
                while (parent && parent.type !== 'function_definition') {
                    parent = parent.parentBlock_;
                }
                if ((!parent && this.outputConnection.isConnected())
                    || (parent && parent.getFieldValue('NAME') !== funcDef.getName())) {
                    this.outputConnection.disconnect();
                }
            }
        });
    },
    getFunctionDefinition () {
        return this.definitionWorkspace.functionsRegistry.getFunction(this.definitionBlock);
    },
    updateShape () {
        let funcDef = this.getFunctionDefinition(),
            params = funcDef.getParams();
        this.setFieldValue(params[this.paramName], 'NAME');
    },
    domToMutation (el) {
        this.definitionWorkspace = this.workspace;

        if (this.definitionWorkspace.isFlyout) {
            this.definitionWorkspace = this.definitionWorkspace.parentWorkspace;
        }

        this.definitionBlock = el.getAttribute('definition');
        if (!this.definitionBlock) {
            throw new Error(`Cannot create a function argument without definition`);
        }

        this.definitionWorkspace.functionsRegistry.createParam(this.definitionBlock, this);
        this.paramName = el.getAttribute('param');
        this.updateShape();
    },
    mutationToDom () {
        let container = document.createElement('mutation');
        container.setAttribute('definition', this.definitionBlock);
        container.setAttribute('param', this.paramName);
        return container;
    }
};
