/* global Blockly */

Blockly.Functions = {};

Blockly.Functions.NAME_TYPE = 'FUNCTION';

class UserFunction {
    constructor (definitionBlock, registry) {
        this.registry = registry;
        this.params = [];
        this.calls = [];
        if (typeof definitionBlock !== 'string') {
            this.definitionBlock = definitionBlock;
            this.setDefinitionBlock(definitionBlock);
        } else {
            this.blockId = definitionBlock;
        }
    }

    setDefinitionBlock (definitionBlock) {
        let onDelete;
        this.definitionBlock = definitionBlock;

        onDelete = (e) => {
            if (e.type === Blockly.Events.DELETE && e.blockId === this.definitionBlock.id) {
                this.deleteCalls();
                this.deleteParams();
                Blockly.Workspace.getById(e.workspaceId).removeChangeListener(onDelete);
                this.registry.deleteFunction(this.getBlockId());
            }
        }
        this.definitionBlock.workspace.addChangeListener(onDelete);
        // A late registration of the function can leave calls and params
        // in an unfinished state. This ensures they are rendered properly
        this.updateCallBlocks();
        this.updateParamsBlocks();
    }

    addCall (callBlock) {
        let onDelete = (e) => {
            let index;
            if (e.type === Blockly.Events.DELETE && e.blockId === callBlock.id) {
                Blockly.Workspace.getById(e.workspaceId).removeChangeListener(onDelete);
                index = this.calls.indexOf(callBlock);
                if (index !== -1) {
                    this.calls.splice(index, 1);
                }
            }
        };
        for (let i = 0; i < this.calls.length; i++) {
            if (this.calls[i].id === callBlock.id) {
                this.calls.splice(i, 1, callBlock);
                callBlock.workspace.addChangeListener(onDelete);
                return;
            }
        }
        this.calls.push(callBlock);
        callBlock.workspace.addChangeListener(onDelete);
    }

    addParam (paramBlock) {
        let onDelete = (e) => {
            let index;
            if (e.type === Blockly.Events.DELETE && e.blockId === paramBlock.id) {
                Blockly.Workspace.getById(e.workspaceId).removeChangeListener(onDelete);
                index = this.params.indexOf(paramBlock);
                if (index !== -1) {
                    this.params.splice(index, 1);
                }
            }
        };
        for (let i = 0; i < this.params.length; i++) {
            if (this.params[i].id === paramBlock.id) {
                this.params.splice(i, 1, paramBlock);
                paramBlock.workspace.addChangeListener(onDelete);
                return;
            }
        }
        this.params.push(paramBlock);
        paramBlock.workspace.addChangeListener(onDelete);
    }

    deleteCalls () {
        this.calls.forEach(block => block.dispose(false, false));
    }

    deleteParams () {
        this.params.forEach(block => block.dispose(false, false));
    }

    getBlockId () {
        return this.definitionBlock ? this.definitionBlock.id : this.blockId;
    }

    getCallXml () {
        let blockId = this.getBlockId();
        return `<block type="function_call"><mutation definition="${blockId}"></mutation></block>`;
    }

    getParamsXml () {
        let blockId = this.getBlockId(),
            params = this.getParams();
        return Object.keys(params).map(param => `<block type="function_argument"><mutation param="${param}" definition="${blockId}"></mutation></block>`);
    }

    getName () {
        return this.definitionBlock ? this.definitionBlock.getFieldValue('NAME') : this.blockId;
    }

    getParams () {
        return this.definitionBlock.paramFields.reduce((acc, field) => {
            acc[field] = this.definitionBlock.getFieldValue(field);
            return acc;
        }, {});
    }

    getReturns () {
        return this.definitionBlock.returns;
    }

    updateCallBlocks () {
        this.calls.forEach(block => block.updateShape());
        this.definitionBlock.workspace.fireChangeListener({
            type: Blockly.Events.UPDATE_FUNCTIONS,
            blockId: this.definitionBlock.id
        });
    }

    updateParamsBlocks () {
        let params = Object.keys(this.getParams());
        // Delete blocks that used to point to a deleted param
        this.params.forEach((block, index) => {
            if (params.indexOf(block.paramName) === -1) {
                block.dispose(false, false);
                this.params.splice(index, 1);
            }
        });
        this.params.forEach(block => block.updateShape());
    }
}

Blockly.FunctionsRegistry = function (workspace) {
    this.workspace = workspace;
    this.functions = {};
};

Blockly.FunctionsRegistry.prototype.createFunction = function (definitionBlock) {
    let id = typeof definitionBlock === 'string' ? definitionBlock : definitionBlock.id,
        currentDefinition = this.functions[id];
    if (currentDefinition) {
        currentDefinition.setDefinitionBlock(definitionBlock);
    } else {
        currentDefinition = new UserFunction(definitionBlock, this);
    }
    this.workspace.fireChangeListener({
        type: Blockly.Events.UPDATE_FUNCTIONS
    });
    return this.functions[id] = currentDefinition;
};

Blockly.FunctionsRegistry.prototype.reset = function () {
    this.functions = {};
    this.workspace.fireChangeListener({
        type: Blockly.Events.UPDATE_FUNCTIONS
    });
};

Blockly.FunctionsRegistry.prototype.deleteFunction = function (id) {
    delete this.functions[id];
    this.workspace.fireChangeListener({
        type: Blockly.Events.UPDATE_FUNCTIONS
    });
};

Blockly.FunctionsRegistry.prototype.createCall = function (id, callBlock) {
    let funcDef = this.getFunction(id);
    if (!funcDef) {
        funcDef = this.createFunction(id);
    }
    funcDef.addCall(callBlock);
};

Blockly.FunctionsRegistry.prototype.createParam = function (id, paramBlock) {
    let funcDef = this.getFunction(id);
    if (!funcDef) {
        funcDef = this.createFunction(id);
    }
    funcDef.addParam(paramBlock);
};

Blockly.FunctionsRegistry.prototype.getFunction = function (definitionId) {
    return this.functions[definitionId];
};

Blockly.FunctionsRegistry.prototype.getAllFunctions = function () {
    return Object.keys(this.functions).map(defId => this.functions[defId]);
};

Blockly.FunctionsRegistry.prototype.getToolbox = function () {
    let toolbox = Object.keys(this.functions).map(functionId => {
        return {
            custom: this.functions[functionId].getCallXml()
        }
    });

    toolbox.unshift({ id: 'function_definition' });

    return toolbox;
};