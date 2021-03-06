import { goog, Blockly } from '../blockly-module.js';

const FieldConfig = function (value, opt_validator) {
    this._width = 16;
    this._height = 16;
    FieldConfig.superClass_.constructor.call(this, value || 0, opt_validator);
};
goog.inherits(FieldConfig, Blockly.Field);

FieldConfig.prototype.init = function () {
    if (this._container) {
        // Image has already been initialized once.
        return;
    }
    // Build the DOM.
    this._container = Blockly.utils.createSvgElement('g', {
        class: 'blocklyConfigInput',
    }, null);
    this._rect = Blockly.utils.createSvgElement('rect', {
        rx: 4,
        ry: 4,
        width: `${this._width + 4}px`,
        height: `${this._height}px`,
    }, this._container);
    this._dot1 = Blockly.utils.createSvgElement('circle', {
        cx: 6,
        cy: 8,
        r: 1,
    }, this._container);
    this._dot2 = Blockly.utils.createSvgElement('circle', {
        cx: 10,
        cy: 8,
        r: 1,
    }, this._container);
    this._dot3 = Blockly.utils.createSvgElement('circle', {
        cx: 14,
        cy: 8,
        r: 1,
    }, this._container);
    this.sourceBlock_.getSvgRoot().appendChild(this._container);
    Blockly.bindEvent_(this._container, 'mousedown', this, this._onMouseDown);
};

FieldConfig.prototype._onMouseDown = function (e) {
    if (Blockly.WidgetDiv.isVisible()) {
        Blockly.WidgetDiv.hide();
    } else if (!this.sourceBlock_.isInFlyout) {
        this.showEditor_();
        e.preventDefault();
        e.stopPropagation();
    }
};

FieldConfig.prototype.getSvgRoot = function () {
    return this._container;
};

FieldConfig.prototype.getSize = function () {
    return {
        width: this._width + 4,
        height: this._height,
    };
};

FieldConfig.prototype.getAbsoluteXY_ = function () {
    return goog.style.getPageOffset(this._container);
};

FieldConfig.prototype.getScaledBBox_ = function () {
    const bbox = this._container.getBBox();
    return new goog.math.Size(bbox.width * this.sourceBlock_.workspace.scale, bbox.height * this.sourceBlock_.workspace.scale);
};

FieldConfig.prototype.dispose = function () {
    if (this.customEl) {
        this.customEl = null;
    }
};

FieldConfig.prototype.showEditor_ = function () {
    Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, this.dispose.bind(this));
    const div = Blockly.WidgetDiv.DIV;

    this.customEl = document.createElement('div');
};

FieldConfig.prototype.position = function () {
    const windowSize = goog.dom.getViewportSize();
    const scrollOffset = goog.style.getViewportPageOffset(document);
    const xy = goog.style.getPageOffset(this.sourceBlock_.svgGroup_);
    const borderBBox = this.getScaledBBox_();
    const div = Blockly.WidgetDiv.DIV;
    const size = this.customEl.getBoundingClientRect();
    xy.y -= size.height + 6;
    if (this.sourceBlock_.RTL) {
        xy.x += borderBBox.width;
        xy.x -= size.height;
        // Don't go offscreen left.
        if (xy.x < scrollOffset.x) {
            xy.x = scrollOffset.x;
        }
    } else {
        // Don't go offscreen right.
        if (xy.x > windowSize.width + scrollOffset.x - size.height) {
            xy.x = windowSize.width + scrollOffset.x - size.height;
        }
    }
    Blockly.WidgetDiv.position(xy.x, xy.y, windowSize, scrollOffset, this.sourceBlock_.RTL);
    div.style.height = `${size.height}px`;
};

FieldConfig.prototype.setValue = function (value) {
    if (value === null) {
        // No change if null.
        return;
    }
    value = this.callValidator(value);
    if (this.sourceBlock_ && Blockly.Events.isEnabled() && this._value != value) {
        Blockly.Events.fire(new Blockly.Events.Change(this.sourceBlock_, 'field', this.name, this._value, value));
    }
    this._value = value;
};

FieldConfig.prototype.getValue = function () {
    return this._value;
};
// Legacy Blockly field registration
window.Blockly.FieldConfig = FieldConfig;
