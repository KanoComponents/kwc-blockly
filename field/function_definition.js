import '../input/kwc-blockly-function-definition.js';
import './config-input.js';
const FieldFunctionDefinition = function (value, opt_validator) {
    this._width = 16;
    this._height = 16;
    FieldFunctionDefinition.superClass_.constructor.call(this, value || 0, opt_validator);
};
goog.inherits(FieldFunctionDefinition, Blockly.FieldConfig);

FieldFunctionDefinition.prototype.showEditor_ = function () {
    Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, this.dispose.bind(this));
    var div = Blockly.WidgetDiv.DIV;
    
    this.customEl = document.createElement('kwc-blockly-function-definition');
    this.customEl.set('targetWorkspace', this.sourceBlock_.workspace);
    this.customEl.set('toolbox', this.sourceBlock_.getToolbox());
    this.customEl.renderToolbox();
    this.customEl.value = this.getValue();

    this.customEl.addEventListener('value-changed', (e) => {
        this.setValue(this.customEl.value);
    });
    this.customEl.addEventListener('close-tapped', (e) => {
        Blockly.WidgetDiv.hide();
    });

    div.appendChild(this.customEl);

    this.position();
    if ('animate' in HTMLElement.prototype) {
        div.animate({
            opacity: [0, 1]
        }, {
            duration: 100,
            easing: 'ease-out'
        });
    }
};

FieldFunctionDefinition.prototype.updateToolbox = function () {
    if (this.customEl) {
        this.customEl.set('toolbox', this.sourceBlock_.getToolbox());
        this.customEl.addEventListener('size-changed', () => {
            this.position();
        });
    }
};

// Legacy Blockly field registration
window.Blockly['FieldFunctionDefinition'] = FieldFunctionDefinition;
