import '@polymer/polymer/polymer-legacy.js';
import './blockly.js';
import './kwc-blockly-style.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

const BLOCK_SPACING_Y = 12;

Polymer({
  _template: html`
        <style include="kwc-blockly-style"></style>
        <style>
            :host {
                display: block;
                overflow-y: auto;
            }
            svg {
                width: 0px;
            }
        </style>
        <div class="injectionDiv">
            <svg id="svg"></svg>
        </div>
`,

  is: 'kwc-blockly-flyout',

  properties: {
      toolbox: {
          type: Array,
          observer: '_toolboxChanged'
      },
      targetWorkspace: {
          type: Object,
          observer: '_targetWorkspaceChanged'
      },
      align: {
          type: String,
          value: 'left'
      },
      paddingLeft: {
          type: Number,
          value: 20
      },
      separators: {
          type: Boolean,
          value: false
      },
      autoClose: {
          type: Boolean,
          value: false
      },
      noDrag: {
          type: Boolean,
          value: false
      },
      minWidth: {
          type: Number,
          value: 200
      },
      maxWidth: {
          type: Number,
          value: Infinity,
          observer: '_maxWidthChanged'
      }
  },

  get width_ () {
      return this.width;
  },

  get height_ () {
      return this.height;
  },

  ready () {
      this._listeners = [];
      this._separators = [];
      this._rectPool = [];
      this._blockDB = {};
  },

  attached () {
      if (Blockly.Css.styleSheet_) {
          dom(this.root).appendChild(Blockly.Css.styleSheet_.ownerNode.cloneNode(true));
      }
      this._render();
  },

  _targetWorkspaceChanged () {
      this._render();
  },

  getWorkspace () {
      return this.ws;
  },

  isScrollable () {
      return false;
  },

  get targetWorkspace_ () {
      return this.targetWorkspace;
  },

  _createRect (opts) {
      if (this._rectPool.length) {
          return this._rectPool.pop();
      } else {
          return Blockly.utils.createSvgElement('rect', opts, null);
      }
  },

  _recycleRect (rect) {
      return this._rectPool.push(rect);
  },

  _createWorkspace () {
      this.ws = new Blockly.WorkspaceSvg({});
      this.ws.isFlyout = true;
      this.wsDom = this.ws.createDom();
      this.svgGroup = Blockly.utils.createSvgElement('g', { 'class': 'kanoBlocklyFlyout' }, null);
      this.svgGroup.appendChild(this.wsDom);
      this.$.svg.appendChild(this.svgGroup);
  },

  _toolboxChanged (toolbox) {
      let xmlString,
          content,
          xml,
          extraArgs;

      toolbox = toolbox || [];

      xmlString = toolbox.map(block => {
          content = '';
          extraArgs = [];
          if (block.custom) {
              return block.custom;
          }
          if (block.shadow) {
              content = Object.keys(block.shadow).map(field => `<value name="${field}">${block.shadow[field]}</value>`);
          }
          return `<block type="${block.id}" ${extraArgs.join(' ')}>${content}</block>`;
      }).join('');

      xmlString = `<xml>${xmlString}</xml>`

      xml = Blockly.Xml.textToDom(xmlString);
      this.xmlList = xml.children;

      if (this.ws) {
          this._renderBlocks();
      }
  },

  _render () {
      if (!this.targetWorkspace) {
          return;
      }
      this._createWorkspace();
      this.ws.scale = this.targetWorkspace.scale;
      this.ws.parentWorkspace = this.targetWorkspace;
      this._renderBlocks();
  },

  _updateDB () {
      this._blockDB = {};
      this.ws.getAllBlocks().forEach(block => {
          if (!block.isShadow()) {
              this._blockDB[block.type] = block;
          }
      });
  },

  getBlockByType (type) {
      return this._blockDB[type];
  },

  _maxWidthChanged() {
      this._render();
  },

  render () {
      this._renderBlocks();
  },

  _renderBlocks () {
      let cursorX = this.paddingLeft + Blockly.BlockSvg.TAB_WIDTH,
          cursorY = 0,
          maxWidth = 0,
          thisRect, rect, canvas, allBlocks, root, sep, hw, height;

      if (!this.xmlList) {
          return;
      }

      this._clearOldBlocks();
      this._clearOldSeparators();

      this.$.svg.style.width = '500px';
      this.$.svg.style.height = '2000px';

      this.ws.scale = this.targetWorkspace.scale;

      this.blocks = [];
      for (let i = 0; i < this.xmlList.length; i++) {
          this.blocks.push(Blockly.Xml.domToBlock(this.xmlList[i], this.ws));
      }

      this.blocks.forEach(block => {
          hw = block.getHeightWidth();
          const width = hw.width * this.ws.scale;
          if (width > maxWidth) {
              maxWidth = width;
          }
      });

      this.maxBlockWidth = maxWidth;

      maxWidth = Math.min(this.maxWidth, Math.max(maxWidth + this.paddingLeft + 20, this.minWidth + Blockly.BlockSvg.TAB_WIDTH));

      canvas = this.ws.getCanvas();
      if (!canvas) {
          return;
      }

      canvas.setAttribute('transform', `scale(${this.ws.scale})`);

      for (let i = 0; i < this.blocks.length; i++) {
          let block = this.blocks[i],
          hasOutputConnection = !!block.outputConnection;
          allBlocks = block.getDescendants();
          allBlocks.forEach(child => {
              child.isInFlyout = true;
          });
          if (this.separators) {
              sep = this._createRect({ height: 1, width: maxWidth, fill: '#37454d' });
              sep.setAttribute('transform', `translate(0, ${cursorY})`);
              canvas.insertBefore(sep, root);
              this._separators.push(sep);
          }

          cursorY += BLOCK_SPACING_Y;

          hw = block.getHeightWidth();
          if (this.align === 'right') {
              cursorX = maxWidth - hw.width;
          }
          // Silence the MOVE event as this move is to set the initial position
          Blockly.Events.disable();
          block.moveBy(cursorX, cursorY);
          Blockly.Events.enable();
          rect = this._createRect({ 'fill-opacity': 0 });
          rect.setAttribute('x', cursorX - (hasOutputConnection ? 6 : 0));
          rect.setAttribute('y', cursorY);
          rect.setAttribute('width', hw.width);
          rect.setAttribute('height', hw.height);
          rect.tooltip = block;
          Blockly.Tooltip.bindMouseEvents(rect);
          root = block.getSvgRoot();
          canvas.insertBefore(rect, root);
          block.flyoutRect_ = rect;
          this._addBlockListeners(root, block, rect);
          cursorY += hw.height + 12;
      }
      height = (cursorY + 20) * this.ws.scale;
      this.width = maxWidth;
      this.height = height;
      this.$.svg.style.width = this.width;
      this.$.svg.style.height = this.height;
      this.fire('size-changed', {
          width: maxWidth,
          height
      });
      this._updateDB();
  },

  _clearOldBlocks () {
      let oldBlocks = this.ws.getTopBlocks(false);

      this._removeBlockListeners();

      oldBlocks.forEach(block => {
          block.flyoutRect_.parentNode.removeChild(block.flyoutRect_);
          this._recycleRect(block.flyoutRect_);
          if (block.workspace === this.ws) {
              block.dispose(false, false);
          }
      });
  },

  _clearOldSeparators () {
      if (this._separators) {
          this._separators.forEach(sep => {
              if (sep.parentNode) {
                  sep.parentNode.removeChild(sep);
              }
              this._recycleRect(sep);
          });
      }
      this._separators = [];
  },

  _addBlockListeners (root, block, rect) {
      this._listeners = this._listeners || [];
      this._listeners.push(Blockly.bindEvent_(root, 'mousedown', null, this._blockMouseDown(block)));
      this._listeners.push(Blockly.bindEvent_(rect, 'mousedown', null, this._blockMouseDown(block)));
      this._listeners.push(Blockly.bindEvent_(root, 'mouseover', block, block.addSelect));
      this._listeners.push(Blockly.bindEvent_(root, 'mouseout', block, block.removeSelect));
      this._listeners.push(Blockly.bindEvent_(rect, 'mouseover', block, block.addSelect));
      this._listeners.push(Blockly.bindEvent_(rect, 'mouseout', block, block.removeSelect));
  },

  _removeBlockListeners () {
      this._listeners.forEach(listener => {
          Blockly.unbindEvent_(listener);
      });
  },

  _blockMouseDown (block) {
      return (e) => {
          if (this.noDrag) {
              this.fire('block-clicked', block);
              return;
          }
          var gesture = this.targetWorkspace.getGesture(e);
          this._rect = this.ws.svgGroup_.getBoundingClientRect();
          if (gesture) {
              gesture.setStartBlock(block);
              gesture.handleFlyoutStart(e, this);
              this.targetWorkspace._gesture = gesture;
          }
      };
  },

  createBlock (originBlock) {
      let block,
          onChange;
      if (originBlock.disabled) {
          return;
      }
      Blockly.Events.disable();
      try {
          block = this._placeNewBlock(originBlock);
      } finally {
          Blockly.Events.enable();
      }
      if (Blockly.Events.isEnabled()) {
          Blockly.Events.setGroup(true);
          Blockly.Events.fire(new Blockly.Events.Create(block));
      }
      this.fire('block-created');


      /* Add a class with elevated z-index when dragging
         the block out of the toolbox and register a listener to
         remove it when the dragging is over. */
      onChange = (e) => {
          if (e.type === Blockly.Events.MOVE && e.blockId === block.id) {
              Blockly.utils.removeClass(block.svgGroup_, 'initialDrag');
              block.workspace.removeChangeListener(onChange);
          }
      };
      Blockly.utils.addClass(block.svgGroup_, 'initialDrag');
      block.workspace.addChangeListener(onChange);

      return block;
  },

  _placeNewBlock (originBlock) {
      const svgRootOld = originBlock.getSvgRoot();
      const svgRootOldPos = Blockly.utils.getRelativeXY(svgRootOld);
      if (!svgRootOld) {
          throw 'originBlock is not rendered.';
      }

      const targetWorkspace = this.targetWorkspace;

      // Create the new block by cloning the block in the flyout (via XML).
      const xml = Blockly.Xml.blockToDom(originBlock);
      const block = Blockly.Xml.domToBlock(xml, targetWorkspace);
      const svgRootNew = block.getSvgRoot();
      if (!svgRootNew) {
          throw 'block is not rendered.';
      }
      // Offset of the flyout itself
      const ownOffset = {
          x: this.paddingLeft + Blockly.BlockSvg.TAB_WIDTH,
          y: BLOCK_SPACING_Y
      };

      if (this.align === 'right') {
          let connectionOffset = (!originBlock.outputConnection ? 6 : 0);
          ownOffset.x = this.width - this.maxBlockWidth - connectionOffset;
      }

      // Retrieve the absolute position of the target workspace
      const targetWorkspaceRoot = targetWorkspace.getParentSvg();
      const targetWorkspaceRect = targetWorkspaceRoot.getBoundingClientRect();

      // Retrieve the absolute position of the current workspace
      const workspaceRect = this._rect;

      // Compute the offset between the two workspaces
      const offset = {
          x: workspaceRect.left - targetWorkspaceRect.left,
          y: workspaceRect.top - targetWorkspaceRect.top,
      };

      // Position in flyout
      const oldPos = {
          x: (svgRootOldPos.x - ownOffset.x) * this.ws.scale,
          y: (svgRootOldPos.y - ownOffset.y) * this.ws.scale
      };

      // Retrieve the position of the newly created block
      const newBlockRect = svgRootNew.getBoundingClientRect();
      const newBlockPos = {
          // Position the block at 0,0 relatively to the target workspace add the position of the origin block
          // and cancel the applied scale
          x: (-newBlockRect.left + oldPos.x + workspaceRect.left) * (1 / targetWorkspace.scale),
          y: (-newBlockRect.top + oldPos.y + workspaceRect.top) * (1 / targetWorkspace.scale)
      };

      block.moveBy(newBlockPos.x, newBlockPos.y);
      block.initialXY_ = newBlockPos;
      return block;
  },

  detached () {
      while (this.$.svg.firstChild) {
          this.$.svg.removeChild(this.$.svg.firstChild);
      }
  },

  /**
   * Blockly compatibility methods
   */
  getWidth () {
      return this.width;
  },

  getHeight () {
      return this.height;
  },

  position () {},

  getClientRect () {
      if (!this.$.svg) {
          return null;
      }

      const flyoutRect = this.getBoundingClientRect();
      // BIG_NUM is offscreen padding so that blocks dragged beyond the shown flyout
      // area are still deleted.  Must be larger than the largest screen size,
      // but be smaller than half Number.MAX_SAFE_INTEGER (not available on IE).
      const BIG_NUM = 1000000000;
      const x = flyoutRect.left;
      const width = flyoutRect.width;

      return new goog.math.Rect(x - BIG_NUM, -BIG_NUM, BIG_NUM + width, BIG_NUM * 2);
  },

  reflow () {},
  setContainerVisible () {}
});
