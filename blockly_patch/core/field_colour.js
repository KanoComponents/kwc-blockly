/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Colour input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldColour');

goog.require('Blockly.Field');
goog.require('Blockly.utils');

goog.require('goog.style');
goog.require('goog.ui.ColorPicker');


/**
 * Class for a colour input field.
 * @param {string} colour The initial colour in '#rrggbb' format.
 * @param {Function=} opt_validator A function that is executed when a new
 *     colour is selected.  Its sole argument is the new colour value.  Its
 *     return value becomes the selected colour, unless it is undefined, in
 *     which case the new colour stands, or it is null, in which case the change
 *     is aborted.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldColour = function(colour, opt_validator) {
  Blockly.FieldColour.superClass_.constructor.call(this, colour, opt_validator);
  this.setText(Blockly.Field.NBSP + Blockly.Field.NBSP + Blockly.Field.NBSP);
};
goog.inherits(Blockly.FieldColour, Blockly.Field);

/**
 * Construct a FieldColour from a JSON arg object.
 * @param {!Object} options A JSON object with options (colour).
 * @returns {!Blockly.FieldColour} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldColour.fromJson = function(options) {
  return new Blockly.FieldColour(options['colour']);
};

/**
 * Array of colours used by this field.  If null, use the global list.
 * @type {Array.<string>}
 * @private
 */
Blockly.FieldColour.prototype.colours_ = null;

/**
 * Array of colour tooltips used by this field.  If null, use the global list.
 * @type {Array.<string>}
 * @private
 */
Blockly.FieldColour.prototype.titles_ = null;

/**
 * Number of colour columns used by this field.  If 0, use the global setting.
 * By default use the global constants for columns.
 * @type {number}
 * @private
 */
Blockly.FieldColour.prototype.columns_ = 0;

/**
 * Install this field on a block.
 */
Blockly.FieldColour.prototype.init = function() {
  Blockly.FieldColour.superClass_.init.call(this);
  this.borderRect_.style['fillOpacity'] = 1;
  this.setValue(this.getValue());
};

/**
 * Mouse cursor style when over the hotspot that initiates the editor.
 */
Blockly.FieldColour.prototype.CURSOR = 'default';

/**
 * Close the colour picker if this input is being deleted.
 */
Blockly.FieldColour.prototype.dispose = function() {
  Blockly.WidgetDiv.hideIfOwner(this);
  Blockly.FieldColour.superClass_.dispose.call(this);
};

/**
 * Return the current colour.
 * @return {string} Current colour in '#rrggbb' format.
 */
Blockly.FieldColour.prototype.getValue = function() {
  return this.colour_;
};

/**
 * Set the colour.
 * @param {string} colour The new colour in '#rrggbb' format.
 */
Blockly.FieldColour.prototype.setValue = function(colour) {
  if (this.sourceBlock_ && Blockly.Events.isEnabled() &&
      this.colour_ != colour) {
    Blockly.Events.fire(new Blockly.Events.BlockChange(
        this.sourceBlock_, 'field', this.name, this.colour_, colour));
  }
  this.colour_ = colour;
  if (this.borderRect_) {
    this.borderRect_.style.fill = colour;
  }
};

/**
 * Get the text from this field.  Used when the block is collapsed.
 * @return {string} Current text.
 */
Blockly.FieldColour.prototype.getText = function() {
  var colour = this.colour_;
  // Try to use #rgb format if possible, rather than #rrggbb.
  var m = colour.match(/^#(.)\1(.)\2(.)\3$/);
  if (m) {
    colour = '#' + m[1] + m[2] + m[3];
  }
  return colour;
};

/**
 * An array of colour strings for the palette.
 * Copied from goog.ui.ColorPicker.SIMPLE_GRID_COLORS
 * All colour pickers use this unless overridden with setColours.
 * @type {!Array.<string>}
 */
Blockly.FieldColour.COLOURS = goog.ui.ColorPicker.SIMPLE_GRID_COLORS;

/**
 * An array of tooltip strings for the palette.  If not the same length as
 * COLOURS, the colour's hex code will be used for any missing titles.
 * All colour pickers use this unless overridden with setColours.
 * @type {!Array.<string>}
 */
Blockly.FieldColour.TITLES = [];

/**
 * Number of columns in the palette.
 * All colour pickers use this unless overridden with setColumns.
 */
Blockly.FieldColour.COLUMNS = 7;

/**
 * Set a custom colour grid for this field.
 * @param {Array.<string>} colours Array of colours for this block,
 *     or null to use default (Blockly.FieldColour.COLOURS).
 * @param {Array.<string>} opt_titles Optional array of colour tooltips,
 *     or null to use default (Blockly.FieldColour.TITLES).
 * @return {!Blockly.FieldColour} Returns itself (for method chaining).
 */
Blockly.FieldColour.prototype.setColours = function(colours, opt_titles) {
  this.colours_ = colours;
  if (opt_titles !== undefined) {
    this.titles_ = opt_titles;
  }
  return this;
};

/**
 * Set a custom grid size for this field.
 * @param {number} columns Number of columns for this block,
 *     or 0 to use default (Blockly.FieldColour.COLUMNS).
 * @return {!Blockly.FieldColour} Returns itself (for method chaining).
 */
Blockly.FieldColour.prototype.setColumns = function(columns) {
  this.columns_ = columns;
  return this;
};

/**
 * Create a palette under the colour field.
 * @private
 */
Blockly.FieldColour.prototype.showEditor_ = function() {
    Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, Blockly.FieldColour.widgetDispose_);

    var div = Blockly.WidgetDiv.DIV;

    this.customEl = document.createElement('kwc-color-picker');
    this.customEl.updateStyles({
        '--kwc-color-picker-size': '22px',
        '--kwc-color-picker-margin': '0px'
    });
    this.customEl.colors = this.colours_ || Blockly.FieldColour.COLOURS;
    this.customEl.rowSize = this.columns_ || Blockly.FieldColour.COLUMNS;
    this.customEl.style.background = '#282F34';
    this.customEl.style.padding = '12px';
    this.customEl.style.boxSizing = 'border-box';
    this.customEl.style.borderRadius = '6px';
    this.customEl.value = this.getValue();

    this.customEl.addEventListener('value-changed', (e) => {
        const value = this.getValue();
        const normalized = this.customEl.normalizeHex(value);
        if (this.customEl.normalizeHex(e.detail.value) !== normalized) {
            this.setValue(e.detail.value);
        }
    });

    div.appendChild(this.customEl);
    // As kwc-color-picker will render at next frame, we force a flush
    this.customEl.flush();
    let isUnder = this.position();
    if ('animate' in HTMLElement.prototype) {
        div.style.transformOrigin = isUnder ? '0 bottom' : '0 0';
        div.animate({
            transform: ['scale(0, 0)', 'scale(1, 1)'],
            opacity: [0, 1]
        }, {
                duration: 100,
                easing: 'ease-out'
            }).onfinish = () => {
                this.customEl.resize();
            };
    }
};

Blockly.FieldColour.prototype.position = function () {
    var viewportBBox = Blockly.utils.getViewportBBox();
    var anchorBBox = this.getScaledBBox_();
    var paletteSize = goog.style.getSize(this.customEl);
    Blockly.WidgetDiv.positionWithAnchor(viewportBBox, anchorBBox, paletteSize, this.sourceBlock_.RTL);
    return anchorBBox.bottom + paletteSize.height >= viewportBBox.bottom;
};

/**
 * Hide the colour picker widget.
 * @private
 */
Blockly.FieldColour.widgetDispose_ = function() {
  if (Blockly.FieldColour.onUpWrapper_) {
    Blockly.unbindEvent_(Blockly.FieldColour.onUpWrapper_);
  }
  Blockly.Events.setGroup(false);
};

Blockly.Field.register('field_colour', Blockly.FieldColour);
