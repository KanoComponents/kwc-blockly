import { goog, Blockly } from '../blockly-module.js';
import './config-input.js';
import '../input/kwc-blockly-if-stack.js';

export const FieldIfStack = function FieldIfStack(value, opt_validator) {
    this._width = 16;
    this._height = 16;
    FieldIfStack.superClass_.constructor.call(this, value || 0, opt_validator);
};
goog.inherits(FieldIfStack, Blockly.FieldConfig);

FieldIfStack.prototype.showEditor_ = function showEditor_() {
    Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, FieldIfStack.widgetDispose_);

    const div = Blockly.WidgetDiv.DIV;

    this.customEl = document.createElement('kwc-blockly-if-stack');
    this.customEl.value = JSON.parse(this.getValue());

    this.customEl.addEventListener('value-changed', () => {
        this.setValue(JSON.stringify(this.customEl.value));
    });

    div.appendChild(this.customEl);

    this.position();

    if ('animate' in HTMLElement.prototype) {
        div.animate({
            opacity: [0, 1],
        }, {
            duration: 100,
            easing: 'ease-out',
        });
    }
};

window.Blockly.FieldIfStack = FieldIfStack;

export default FieldIfStack;
