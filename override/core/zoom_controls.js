/* global Blockly */

Blockly.ZoomControls.prototype.IMAGES = {};
Blockly.ZoomControls.prototype.HEIGHT_ = 120;
Blockly.ZoomControls.prototype.WIDTH_ = 24;

Blockly.ZoomControls.ZOOM_IN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.12 20.11"><defs><style>.cls-1{fill:#fff;}</style></defs><title>Zoom-In</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_5" data-name="Layer 5"><path class="cls-1" d="M10.56,0h0A10.56,10.56,0,0,0,0,10.56v9.55H21.12V10.56A10.56,10.56,0,0,0,10.56,0Zm4.12,11.19a.54.54,0,0,1-.17.39.49.49,0,0,1-.38.16h-2a.5.5,0,0,0-.39.17.49.49,0,0,0-.16.38v2a.55.55,0,0,1-.55.55h-.9a.55.55,0,0,1-.55-.55v-2a.49.49,0,0,0-.16-.38A.5.5,0,0,0,9,11.74H7a.5.5,0,0,1-.47-.27.54.54,0,0,1-.08-.28V10.3a.54.54,0,0,1,.17-.39A.49.49,0,0,1,7,9.75H9a.54.54,0,0,0,.39-.17.53.53,0,0,0,.16-.39v-2a.55.55,0,0,1,.55-.55H11a.55.55,0,0,1,.55.55v2a.53.53,0,0,0,.16.39.54.54,0,0,0,.39.17h2a.49.49,0,0,1,.38.16.54.54,0,0,1,.17.39Z"/></g></g></svg>
`;
Blockly.ZoomControls.ZOOM_OUT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.12 20.11"><defs><style>.cls-1{fill:#fff;}</style></defs><title>Zoom-Out</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_5" data-name="Layer 5"><path class="cls-1" d="M0,0V9.55A10.56,10.56,0,0,0,10.56,20.11h0A10.56,10.56,0,0,0,21.12,9.55V0ZM14.68,10a.54.54,0,0,1-.17.39.49.49,0,0,1-.38.16H7a.5.5,0,0,1-.47-.27A.51.51,0,0,1,6.44,10V9.12a.54.54,0,0,1,.17-.39A.49.49,0,0,1,7,8.57h7.14a.49.49,0,0,1,.38.16.54.54,0,0,1,.17.39Z"/></g></g></svg>
`;
Blockly.ZoomControls.TARGET_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.89 13.91"><title>Target</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_5" data-name="Layer 5"><path fill="white" d="M7.08,0A6.53,6.53,0,0,1,9.65.55a6.79,6.79,0,0,1,3.7,3.7,7,7,0,0,1,0,5.42,6.79,6.79,0,0,1-3.7,3.7,7,7,0,0,1-5.41,0,6.81,6.81,0,0,1-3.7-3.7A6.56,6.56,0,0,1,0,7.09,7.41,7.41,0,0,1,.35,4.75a6.65,6.65,0,0,1,1-1.91,7.42,7.42,0,0,1,1.5-1.5,6.59,6.59,0,0,1,1.92-1A7.54,7.54,0,0,1,7.08,0Zm4.41,7.5h-.73a.44.44,0,0,1-.42-.2.78.78,0,0,1-.12-.39.49.49,0,0,1,.16-.34.51.51,0,0,1,.38-.16h.74a.76.76,0,0,0,.61-.29.68.68,0,0,0,.14-.66A5.35,5.35,0,0,0,10.84,3,5.41,5.41,0,0,0,8.43,1.63a.69.69,0,0,0-.64.14.73.73,0,0,0-.3.62v.74a.45.45,0,0,1-.2.42.79.79,0,0,1-.38.12.47.47,0,0,1-.33-.16.51.51,0,0,1-.16-.38V2.39a.75.75,0,0,0-.29-.61.74.74,0,0,0-.66-.15A5.41,5.41,0,0,0,3.05,3a5.35,5.35,0,0,0-1.4,2.41.68.68,0,0,0,.14.66.76.76,0,0,0,.61.29h.75a.5.5,0,0,1,.37.16.53.53,0,0,1,.16.38.57.57,0,0,1-.16.39.49.49,0,0,1-.37.16H2.4a.79.79,0,0,0-.61.3.65.65,0,0,0-.14.64,5.36,5.36,0,0,0,1.41,2.41,5.47,5.47,0,0,0,2.4,1.4.71.71,0,0,0,.66-.14.76.76,0,0,0,.29-.62v-.73a.54.54,0,0,1,.53-.54.54.54,0,0,1,.38.16.51.51,0,0,1,.16.38v.73a.79.79,0,0,0,.3.62.68.68,0,0,0,.64.14,5.48,5.48,0,0,0,3.79-3.74.73.73,0,0,0-.12-.69A.76.76,0,0,0,11.49,7.5Z"/></g></g></svg>
`;

Blockly.ZoomControls.prototype.IMAGES.base = '/assets/icons/';

Blockly.ZoomControls.prototype.IMAGES.zoomIn = 'zoom-in';
Blockly.ZoomControls.prototype.IMAGES.zoomOut = 'zoom-out';
Blockly.ZoomControls.prototype.IMAGES.target = 'target';
Blockly.ZoomControls.prototype.ICON_SIZE = 16;

/**
 * Create the zoom controls.
 * @return {!Element} The zoom controls SVG group.
 */
Blockly.ZoomControls.prototype.createDom = function () {
    var workspace = this.workspace_;
    this.svgGroup_ = Blockly.utils.createSvgElement('g', {'class': 'blocklyZoom'}, null);
    let boxHeight = this.ICON_SIZE * 4 + 2,
        spaceLeft = this.HEIGHT_ - this.ICON_SIZE;
    let g = Blockly.utils.createSvgElement('g', {
        'transform': 'translate(0, ' + ((spaceLeft - boxHeight) / 2 + this.ICON_SIZE + 9) + ')'
    }, this.svgGroup_);
    var zoomoutSvg = Blockly.utils.createSvgElement('image',
        {'class': 'button',
        'width': this.ICON_SIZE * 1.7,
        'height': this.ICON_SIZE * 1.7,
        'x': (this.WIDTH_ - this.ICON_SIZE * 1.7) / 2,
        'y': this.ICON_SIZE * 1.7},
        g);
    zoomoutSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `data:image/svg+xml;utf8,${encodeURIComponent(Blockly.ZoomControls.ZOOM_OUT_SVG)}`);

    var zoominSvg = Blockly.utils.createSvgElement('image',
        {'class': 'button',
        'width': this.ICON_SIZE * 1.7,
        'height': this.ICON_SIZE * 1.7,
        'x': (this.WIDTH_ - this.ICON_SIZE * 1.7) / 2,
        'y': 0},
        g);
    zoominSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',`data:image/svg+xml;utf8,${encodeURIComponent(Blockly.ZoomControls.ZOOM_IN_SVG)}`);
    var zoomresetSvg = Blockly.utils.createSvgElement('image',
        {'class': 'button',
        'width': this.ICON_SIZE + 6,
        'height': this.ICON_SIZE + 6,
        'x': (this.WIDTH_ - this.ICON_SIZE - 4) / 2,
        'y': 0},
        this.svgGroup_);
    zoomresetSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `data:image/svg+xml;utf8,${Blockly.ZoomControls.TARGET_SVG}`);

    // Attach event listeners.
    Blockly.bindEventWithChecks_(zoomresetSvg, 'mousedown', null, function (e) {
        workspace.markFocused();
        workspace.setScale(workspace.options.zoomOptions.startScale);
        workspace.scrollCenter();
        Blockly.Touch.clearTouchIdentifier();  // Don't block future drags.
        e.stopPropagation();  // Don't start a workspace scroll.
        e.preventDefault();  // Stop double-clicking from selecting text.
    });
    Blockly.bindEventWithChecks_(zoominSvg, 'mousedown', null, function (e) {
        workspace.markFocused();
        workspace.zoomCenter(1);
        Blockly.Touch.clearTouchIdentifier();  // Don't block future drags.
        e.stopPropagation();  // Don't start a workspace scroll.
        e.preventDefault();  // Stop double-clicking from selecting text.
    });
    Blockly.bindEventWithChecks_(zoomoutSvg, 'mousedown', null, function (e) {
        workspace.markFocused();
        workspace.zoomCenter(-1);
        Blockly.Touch.clearTouchIdentifier();  // Don't block future drags.
        e.stopPropagation();  // Don't start a workspace scroll.
        e.preventDefault();  // Stop double-clicking from selecting text.
    });

    return this.svgGroup_;
};

/**
 * Move the zoom controls to the bottom-right corner.
 */
Blockly.ZoomControls.prototype.position = function() {
  // Not yet initialized.
  if (!this.verticalSpacing_) {
    return;
  }
  var metrics = this.workspace_.getMetrics();
  if (!metrics) {
    // There are no metrics available (workspace is probably not visible).
    return;
  }
  if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_LEFT
    || (this.workspace_.horizontalLayout && !this.workspace_.RTL)) {
    // Toolbox starts in the left corner.
    this.left_ = metrics.viewWidth + metrics.absoluteLeft -
      this.WIDTH_ - this.MARGIN_SIDE_ - Blockly.Scrollbar.scrollbarThickness;
  } else {
    // Toolbox starts in the right corner.
    this.left_ = this.MARGIN_SIDE_ + Blockly.Scrollbar.scrollbarThickness;
  }

  if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_BOTTOM) {
    this.top_ = this.verticalSpacing_;
    /* Commented out blockly's transforms as we use different assets */
    // this.zoomInGroup_.setAttribute('transform', 'translate(0, 34)');
    // this.zoomResetGroup_.setAttribute('transform', 'translate(0, 77)');
  } else {
    this.top_ = metrics.viewHeight + metrics.absoluteTop -
        this.HEIGHT_ - this.verticalSpacing_;
    /* Commented out blockly's transforms as we use different assets */
    // this.zoomInGroup_.setAttribute('transform', 'translate(0, 43)');
    // this.zoomOutGroup_.setAttribute('transform', 'translate(0, 77)');
  }

  this.left_ -= 1;
  this.svgGroup_.setAttribute('transform',
      'translate(' + this.left_ + ',' + this.top_ + ')');
};
