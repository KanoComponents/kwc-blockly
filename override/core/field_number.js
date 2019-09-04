import '@kano/kwc-number-inputs/kwc-numpad.js';
import '../../blockly_built/blockly_compressed.js';

const OriginalFieldNumber = Blockly.FieldNumber;

class FieldNumber extends OriginalFieldNumber {
    position() {
        const viewportBBox = Blockly.utils.getViewportBBox();
        const anchorBBox = this.getScaledBBox_();
        const elementSize = goog.style.getSize(this.customEl);
        const y = Blockly.WidgetDiv.calculateY_(
            viewportBBox,
            anchorBBox,
            elementSize,
        );
        if (y < anchorBBox.top) {
            this.customEl.style.transform = 'translateY(-100%)';
            this.customEl.style.top = 0;
            this.customEl.style.position = 'absolute';
        }
    }
    showEditor_() {
        this.workspace_ = this.sourceBlock_.workspace;
        let quietInput = false;
        if (goog.userAgent.IPHONE || goog.userAgent.IPAD || goog.userAgent.ANDROID) {
            quietInput = true;
        }
        this.showInlineEditor_(quietInput);
        const div = Blockly.WidgetDiv.DIV;
        const el = document.createElement('kwc-numpad');
        this.customEl = el;
        this.customEl.value = this.getValue();
        this.customEl.resultOverride = true;
        div.appendChild(this.customEl);
        this.customEl.addEventListener('string-value-changed', () => {
            this.setValue(this.customEl.value);
            Blockly.FieldTextInput.htmlInput_.value = this.customEl.stringValue;
        });
        this.position();
        if ('animate' in HTMLElement.prototype) {
            div.animate({
                opacity: [0, 1],
            }, {
                duration: 100,
                easing: 'ease-out',
            });
        } else {
            div.style.opacity = 1;
        }
    }
    onMouseUp_(e) {
        if (Blockly.utils.isRightButton(e)) {
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
    }
}

Blockly.FieldNumber = FieldNumber;
