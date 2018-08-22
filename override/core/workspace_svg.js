/* global Blockly */

/**
 * Set the workspace to have focus in the browser.
 * @private
 */
Blockly.WorkspaceSvg.prototype.setBrowserFocus = function () {
    // Blur whatever was focused since explcitly grabbing focus below does not
    // work in Edge.
    //   if (document.activeElement) {
    //     document.activeElement.blur();
    //   }
    try {
        // Focus the workspace SVG - this is for Chrome and Firefox.
        this.getParentSvg().focus();
    }  catch (e) {
        // IE and Edge do not support focus on SVG elements. When that fails
        // above, get the injectionDiv (the workspace's parent) and focus that
        // instead.  This doesn't work in Chrome.
        try {
            // In IE11, use setActive (which is IE only) so the page doesn't scroll
            // to the workspace gaining focus.
            this.getParentSvg().parentNode.setActive();
        } catch (e) {
            // setActive support was discontinued in Edge so when that fails, call
            // focus instead.
            this.getParentSvg().parentNode.focus();
        }
    }
};

Blockly.WorkspaceSvg.prototype.scrollBlockIntoView = function (block, animate) {
    var xy = block.getRelativeToSurfaceXY();
    var metrics = this.getMetrics();
    var transitionCallback, blockTransitionCallback;
    if (animate) {
        transitionCallback = function () {
            this.svgBlockCanvas_.removeEventListener('transitionend', transitionCallback);
            Blockly.utils.removeClass(this.svgBlockCanvas_, 'smoothScroll');
        }.bind(this);
        Blockly.utils.addClass(this.svgBlockCanvas_, 'smoothScroll');
        this.svgBlockCanvas_.addEventListener('transitionend', transitionCallback);
    }
    let x = this.scrollX,
        y = this.scrollY,
        wasDragging;
    // if a block was dragging, terminate the drag. It will be resumed after the translation
    if (Blockly.selected && Blockly.selected.workspace._gesture) {
        wasDragging = Blockly.selected;
    }
    this.scrollbar.set(xy.x * this.scale - metrics.contentLeft - metrics.viewWidth  * 0.2,
                        xy.y * this.scale - metrics.contentTop  - metrics.viewHeight * 0.3);
    // Apply the translation to the block if it was being dragged
    if (wasDragging) {
        var dx = x - this.scrollX,
            dy = y - this.scrollY;
        var xy = wasDragging.getRelativeToSurfaceXY();
        // Modify the gesture's mousedown and last mouse event to cancel out the scroll
        wasDragging.workspace._gesture.mostRecentEvent_.clientX -= dx;
        wasDragging.workspace._gesture.mostRecentEvent_.clientY -= dy;
        wasDragging.workspace._gesture.mouseDownXY_.x -= dx;
        wasDragging.workspace._gesture.mouseDownXY_.y -= dy;

        if (animate) {
            blockTransitionCallback = function () {
                // Clear the listeners and temporary scroll transition class
                this.svgBlockCanvas_.removeEventListener('transitionend', blockTransitionCallback);
                Blockly.utils.removeClass(wasDragging.svgGroup_, 'smoothScroll');
            }.bind(this);
            // Apply a transition class on the block
            Blockly.utils.addClass(wasDragging.svgGroup_, 'smoothScroll');
            // Listen for the transition end to remove the class and the listener
            this.svgBlockCanvas_.addEventListener('transitionend', blockTransitionCallback);
        }

        wasDragging.workspace._gesture.handleMove(wasDragging.workspace._gesture.mostRecentEvent_);
    }
};
