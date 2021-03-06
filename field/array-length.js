import { goog, Blockly } from '../blockly-module.js';
import './config-input.js';
import '../input/kwc-blockly-array-length.js';

const FieldArrayLength = function (value, opt_validator) {
    this._width = 16;
    this._height = 16;
    FieldArrayLength.superClass_.constructor.call(this, value || 0, opt_validator);
};
goog.inherits(FieldArrayLength, Blockly.FieldConfig);

FieldArrayLength.prototype.showEditor_ = function () {
    Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, FieldArrayLength.widgetDispose_);

    const div = Blockly.WidgetDiv.DIV;

    this.customEl = document.createElement('kwc-blockly-array-length');
    this.customEl.value = this.getValue();


    this.customEl.addEventListener('value-changed', (e) => {
        this.setValue(e.detail.value);
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
FieldArrayLength.prototype.setValue = function (v) {
    const value = typeof v === 'number' ? v : parseInt(v, 10);
    FieldArrayLength.superClass_.setValue.call(this, value);
};
window.Blockly.FieldArrayLength = FieldArrayLength;
