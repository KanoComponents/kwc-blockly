/**
`kano-blockly`

Example:
    <kano-blockly></kano-blockly>

 The following custom properties and mixins are also available for styling:

 Custom property | Description | Default
 ----------------|-------------|----------
 `--kwc-blockly-background` | Background | `white`
 `--kwc-blockly-scrollbars-color` | Color of the scrollbars | `#292f35`

@group Kano Elements
@hero hero.svg
@demo demo/index.html
*/
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@kano/kwc-style/color.js';
import '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { Blockly } from './blockly.js';
import './kwc-blockly-omnibox.js';
import './kwc-blockly-toolbox.js';
import './kwc-blockly-flyout.js';
import { blocklyStyle } from './kwc-blockly-style.js';
import { createFilters } from './lib/filters.js';

class KwcBlockly extends PolymerElement {
    static get template() {
        return html`
            ${blocklyStyle}
            <style>
                :host {
                    display: block;
                    position: relative;
                }
                #workspace {
                    position: absolute;
                    top: 0px;
                    bottom: 0px;
                    left: 0px;
                    right: 0px;
                    background-color: var(--kwc-blockly-background, #414a51);
                }
                .toolbox-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    box-sizing: border-box;
                }
                #flyout {
                    @apply --kwc-blockly-flyout;
                    background: var(--kwc-blockly-background, #414a51);
                }
                .toolbox-container {
                    @apply --layout-vertical;
                    background: var(--kwc-blockly-background, #414a51);
                }
                #toolbox, #flyout {
                    @apply --layout-flex;
                    --kwc-blockly-toolbox-background: var(--kwc-blockly-background, #414a51);
                }
                #flyout.flyout-mode {
                    position: relative;
                    padding-top: 20px;
                }
                #flyout.flyout-mode:after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: -20px;
                    bottom: 0;
                    width: 15px;
                    background: -moz-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%); /* FF3.6-15 */
                    background: -webkit-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 100%); /* Chrome10-25,Safari5.1-6 */
                    background: linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.65) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
                }
                #svg {
                    height: 100%;
                    width: 100%;
                    display: block;
                }
                #svg:focus {
                    outline: none;
                }
                .container {
                    padding: 16px 8px 8px 8px;
                }
                .omnibox-wrapper {
                    position: absolute;
                    top: 50%;
                    left: 0px;
                    transform: translateY(-50%);
                    width: 100%;
                    @apply --layout-vertical;
                    @apply --layout-center;
                    display: none;
                }
                paper-dialog .buttons .confirm {
                    background: var(--color-grassland);
                    color: white;
                }
                #dialog-content {
                    min-width: 320px;
                }
                kwc-blockly-omnibox {
                    max-width: 80%;
                }
                [hidden] {
                    display: none !important;
                }
            </style>
            <div id="workspace" class="injectionDiv">
                <svg id="svg" xmlns="http://www.w3.org/2000/svg"></svg>
            </div>
            <div class="toolbox-container">
                <slot name="above-toolbox"></slot>
                <kwc-blockly-flyout id="flyout" toolbox="[[flyout]]" hidden\$="{{!flyout}}" on-size-changed="_resizeFlyout" min-width="0"></kwc-blockly-flyout>
                <kwc-blockly-toolbox id="toolbox" toolbox="[[toolbox]]" auto-close="" hidden\$="[[_shouldHideToolbox(toolbox, noToolbox)]]"></kwc-blockly-toolbox>
                <slot name="under-toolbox"></slot>
            </div>
            <div class="omnibox-wrapper" id="omnibox-wrapper" on-tap="_omniboxWrapperTapped">
                <kwc-blockly-omnibox id="omnibox" on-close="_closeOmnibox" on-confirm="_onOmniboxConfirm"></kwc-blockly-omnibox>
            </div>
            <paper-dialog id="dialog" entry-animation="from-big-animation" fit-into="[[_svg]]" with-backdrop="">
                <div id="dialog-content">
                    <h2>[[dialog.message]]</h2>
                    <div class="container" hidden\$="[[dialog.noInput]]">
                        <input type="text" id="dialog-input" value="{{dialog.input::input}}" no-label="" autofocus="" on-keydown="_dialogKeydown">
                    </div>
                    <div class="buttons">
                        <button dialog-confirm="" class="confirm">Confirm</button>
                        <button dialog-dismiss="" hidden\$="[[dialog.noCancel]]">Cancel</button>
                    </div>
                </div>
            </paper-dialog>
            <iron-a11y-keys keys="meta+f" on-keys-pressed="_openOmnibox" target="[[_target]]"></iron-a11y-keys>
            <iron-a11y-keys keys="esc" on-keys-pressed="_closeOmnibox" target="[[_target]]"></iron-a11y-keys>
        `;
    }
    static get properties() {
        return {
            toolbox: {
                type: Array,
                value: () => [],
            },
            flyout: {
                type: Array,
                value: null,
                observer: '_flyoutChanged',
            },
            code: {
                type: String,
                notify: true,
            },
            defaultBlocks: {
                type: String,
                observer: '_defaultBlocksChanged',
            },
            language: {
                type: String,
                value: 'JavaScript',
            },
            scale: {
                type: Number,
                value: 0.9,
            },
            shadowLight: {
                type: Number,
            },
            noTrashcan: {
                type: Boolean,
                value: false,
            },
            noZoomControl: {
                type: Boolean,
                value: false,
            },
            noToolbox: {
                type: Boolean,
                value: false,
                observer: '_noToolboxChanged',
            },
            media: {
                type: String,
                value() {
                    return this.resolveUrl('./blockly_built/media/');
                },
                observer: '_mediaChanged',
            },
            getMetrics: Function,
            setMetrics: Function,
            _target: Object,
            _svg: Object,
        };
    }
    constructor() {
        super();
        this._target = this;
        this.visible = false;
        this._loadBlocks = this._loadBlocks.bind(this);
        this._blurInput = this._blurInput.bind(this);
        this._onMouseWheel = this._onMouseWheel.bind(this);
        this._onToolboxScroll = this._onToolboxScroll.bind(this);
    }
    ready() {
        super.ready();
        this.codeRelatedEvents = [
            Blockly.Events.CREATE,
            Blockly.Events.MOVE,
            Blockly.Events.CHANGE,
            Blockly.Events.DELETE,
            'value',
            'connect',
        ];
    }

    /**
   * Inject blockly to the workspace div
   */
    connectedCallback() {
        super.connectedCallback();
        this.dialog = {
            element: this.$.dialog,
        };
        const options = new Blockly.Options({
            media: this.media,
            scrollbars: true,
            trashcan: !this.noTrashcan,
            comments: true,
            disable: true,
            zoom: {
                controls: !this.noZoomControl,
                startScale: this.scale,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
            },
        });
        options.getMetrics = this.getMetrics;
        options.setMetrics = this.setMetrics;
        this.$.toolbox.addEventListener('scroll', this._onToolboxScroll);
        this._svg = this.$.svg;
        this._svg.addEventListener('mousewheel', this._onMouseWheel);
        const filters = createFilters(Blockly, options);
        options.embossFilterId = filters.embossFilter.id;
        options.disabledPatternId = filters.disabledPattern.id;
        options.gridPattern = filters.gridPattern;
        this.$.svg.appendChild(filters.defs);
        // Load CSS.
        Blockly.Css.inject(options.hasCss, options.pathToMedia);
        this._setupDialogs();
        this.workspace = this._createWorkspace(this._svg, options);
        // Recompute flyout and toolbox now that the worlkspace exist
        this._noToolboxChanged();
        this._flyoutChanged();
        this._initWorkspace();
        this.workspace.markFocused();
        Blockly.bindEvent_(this.$.svg, 'focus', this.workspace, this.workspace.markFocused);
        Blockly.svgResize(this.workspace);
        this.shadowRoot.appendChild(Blockly.Css.styleSheet_.ownerNode.cloneNode(true));
        this.workspace.componentRoot_ = this.shadowRoot;
        this.workspace.addChangeListener(this.onBlocklyChange.bind(this));

        this.$.omnibox.targetWorkspace = this.workspace;
        this.$.toolbox.targetWorkspace = this.workspace;
        this.$.flyout.targetWorkspace = this.workspace;

        afterNextRender(this, () => {
            this.resize();
            this.dispatchEvent(new CustomEvent('blockly-ready', {
                bubbles: true,
                composed: true,
            }));
            if (this.blocks) {
                this.loadBlocks(this.blocks);
            }
            this._defaultBlocksChanged();
        });
        // TODO Removing this is possibly controversial.
        // I moved it into the main CSS, but it would be good to find
        // out why we need it.
        // document.body.style.overflow = 'hidden';
        document.addEventListener('iron-overlay-opened', this._blurInput);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._teardownDialogs();
        this.$.toolbox.removeEventListener('scroll', this._onToolboxScroll);
        this._svg.removeEventListener('mousewheel', this._onMouseWheel);
        this.workspace.dispose();
        // document.body.style.overflow = undefined;
        document.removeEventListener('iron-overlay-opened', this._blurInput);
        this.toolbox = null;
        this.toolbox_ = null;
        this.workspace.toolbox = null;
        this.workspace.toolbox_ = null;
    }
    _mediaChanged() {
        if (!this.workspace) {
            return;
        }
        const { options } = this.workspace;
        options.pathToMedia = this.media;
        const styleNode = Blockly.Css.styleSheet_.ownerNode;
        styleNode.parentNode.removeChild(styleNode);
        // Blockly won't inject new stylesheet if it has a reference to a stylesheet
        Blockly.Css.styleSheet_ = null;
        Blockly.Css.inject(options.hasCss, options.pathToMedia);
        if (options.hasSounds) {
            Blockly.inject.loadSounds_(options.pathToMedia, this.workspace);
        }
    }

    _shouldHideToolbox() {
        return this.noToolbox || !this.toolbox;
    }
    _flyoutChanged() {
        if (!this.workspace) {
            return;
        }
        if (this.flyout) {
            this.workspace.flyout_ = this.$.flyout;
        } else {
            this.workspace.flyout_ = null;
        }
    }
    _noToolboxChanged() {
        if (!this.workspace) {
            return;
        }
        if (!this.noToolbox) {
            this.workspace.toolbox = this.$.toolbox;
            this.workspace.toolbox_ = this.$.toolbox;
        } else {
            this.workspace.toolbox = null;
            this.workspace.toolbox_ = null;
        }
    }
    _resizeFlyout(e) {
        this.$.flyout.style.width = `${e.detail.width}px`;
    }
    _onMouseWheel(e) {
        const { workspace } = this;
        let x = e.deltaX * workspace.scale;
        let y = e.deltaY * workspace.scale;

        x = (workspace.scrollbar.hScroll.handlePosition_ / workspace.scrollbar.hScroll.ratio_) + x;
        y = (workspace.scrollbar.vScroll.handlePosition_ / workspace.scrollbar.vScroll.ratio_) + y;

        // Remove the ratio to compute max position
        x *= workspace.scrollbar.hScroll.ratio_;
        y *= workspace.scrollbar.vScroll.ratio_;

        // Apply max poisition based on scrollbar length and scrollview
        x = Math.min(x, workspace.scrollbar.hScroll.scrollViewSize_ - workspace.scrollbar.hScroll.handleLength_);
        y = Math.min(y, workspace.scrollbar.vScroll.scrollViewSize_ - workspace.scrollbar.vScroll.handleLength_);

        // Reapply ratio
        x /= workspace.scrollbar.hScroll.ratio_;
        y /= workspace.scrollbar.vScroll.ratio_;

        x = Math.max(x, 0);
        y = Math.max(y, 0);

        // Move the scrollbars and the page will scroll automatically.
        workspace.scrollbar.set(x, y);
        e.stopPropagation();
        e.preventDefault();
    }
    _setupDialogs() {
        Blockly._originalPrompt = Blockly.prompt;
        Blockly.prompt = (message, defaultValue, callback) => {
            this._openDialog(message, defaultValue, { inputSelect: true }).then((answer) => {
                if (!answer || !answer.length) {
                    return callback(null);
                }
                callback(answer);
            });
        };
        Blockly._originalConfirm = Blockly.confirm;
        Blockly.confirm = (message, callback) => {
            this._openDialog(message, true, { noInput: true }).then((answer) => {
                if (answer) {
                    callback(answer);
                }
            });
        };
        Blockly._originalAlert = Blockly.alert;
        Blockly.alert = (message, callback) => {
            this._openDialog(message, null, { noInput: true, noCancel: true }).then(callback);
        };
    }
    _teardownDialogs() {
        Blockly.prompt = Blockly._originalPrompt;
        Blockly.confirm = Blockly._originalConfirm;
        Blockly.alert = Blockly._originalAlert;
    }
    _preventSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    _createWorkspace(svg, options) {
        options.parentWorkspace = null;
        const workspaceContainer = this.$.workspace;
        const blockSurface = new Blockly.BlockDragSurfaceSvg(workspaceContainer);
        const wsSurface = new Blockly.WorkspaceDragSurfaceSvg(workspaceContainer);
        const mainWorkspace = new Blockly.WorkspaceSvg(options, blockSurface, wsSurface);
        mainWorkspace.scale = options.zoomOptions.startScale;
        mainWorkspace.shadowLight = this.shadowLight;
        svg.appendChild(mainWorkspace.createDom('blocklyMainBackground'));
        // A null translation will also apply the correct initial scale.
        mainWorkspace.translate(0, 0);
        mainWorkspace.markFocused();

        mainWorkspace.functionsRegistry = new Blockly.FunctionsRegistry(mainWorkspace);

        // The SVG is now fully assembled.
        Blockly.svgResize(mainWorkspace);
        Blockly.WidgetDiv.createDom();
        Blockly.Tooltip.createDom();
        return mainWorkspace;
    }
    _initWorkspace() {
        const { options } = this.workspace;
        const svg = this.workspace.getParentSvg();

        // Supress the browser's context menu.
        Blockly.bindEvent_(svg, 'contextmenu', null, (e) => {
            if (!Blockly.utils.isTargetInput(e)) {
                e.preventDefault();
            }
        });

        const workspaceResizeHandler = Blockly.bindEvent_(window, 'resize', null, () => {
            Blockly.hideChaff(true);
            Blockly.svgResize(this.workspace);
        });
        this.workspace.setResizeHandlerWrapper(workspaceResizeHandler);

        Blockly.inject.bindDocumentEvents_();

        if (options.hasScrollbars) {
            this.workspace.scrollbar = new Blockly.ScrollbarPair(this.workspace);
            this.workspace.scrollbar.resize();
        }

        // Load the sounds.
        if (options.hasSounds) {
            Blockly.inject.loadSounds_(options.pathToMedia, this.workspace);
        }
    }
    _closeOmnibox(e) {
        if (!this._omniboxOpened) {
            return;
        }
        if (e && e.detail.keyboardEvent) {
            e.detail.keyboardEvent.stopPropagation();
            e.detail.keyboardEvent.preventDefault();
        }
        this._omniboxOpened = false;
        if ('animate' in HTMLElement.prototype) {
            this.$.omnibox.animate([{
                opacity: 1,
            }, {
                opacity: 0,
            }], {
                duration: 80,
                easing: 'ease-in',
            }).onfinish = () => {
                this.$['omnibox-wrapper'].style.display = 'none';
            };
        } else {
            this.$['omnibox-wrapper'].style.display = 'none';
        }
    }
    _openOmnibox(e) {
        if (e && e.detail && e.detail.keyboardEvent) {
            e.detail.keyboardEvent.preventDefault();
            e.detail.keyboardEvent.stopPropagation();
        }
        Blockly.ContextMenu.hide();
        this._omniboxOpened = true;
        this.$['omnibox-wrapper'].style.display = 'flex';
        this.$.omnibox.focus();
        this.$.omnibox.animate([{
            transform: 'scale(0)',
            opacity: 0,
        }, {
            transform: 'scale(1)',
            opacity: 1,
        }], {
            duration: 150,
            easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)',
        });
    }
    _omniboxWrapperTapped(e) {
        const event = dom(e);
        if (event.rootTarget === this.$['omnibox-wrapper']) {
            this._closeOmnibox();
        }
    }
    _onOmniboxConfirm(e) {
        const xml = Blockly.Xml.blockToDom(e.detail.selected);
        const block = Blockly.Xml.domToBlock(xml, this.workspace);
        const svgRoot = block.getSvgRoot();

        block.fromQuery(this.$.omnibox.query, this.workspace);
        block.initSvg();
        block.render();

        const workspaceRoot = this.workspace.getParentSvg();
        const workspaceRect = workspaceRoot.getBoundingClientRect();

        const newPos = {
            x: workspaceRect.width / 2,
            y: workspaceRect.height / 2,
        };

        const blockRect = svgRoot.getBoundingClientRect();
        const blockPos = {
            x: (-blockRect.left + newPos.x + workspaceRect.left) * (1 / this.workspace.scale),
            y: (-blockRect.top + newPos.y + workspaceRect.top) * (1 / this.workspace.scale),
        };

        block.moveBy(blockPos.x, blockPos.y);
        const xy = block.getRelativeToSurfaceXY();
        if ('animate' in SVGElement.prototype) {
            svgRoot.style.transformOrigin = 'center center';
            svgRoot.animate({
                transform: [`translate(${xy.x}px, ${xy.y}px) scale(0, 0)`, `translate(${xy.x}px, ${xy.y}px) scale(1, 1)`],
            }, {
                duration: 200,
                easing: 'cubic-bezier(0.2, 0, 0.13, 1.5)',
            });
        }
        this._closeOmnibox();
    }
    _openDialog(message, defaultValue, opts) {
        const options = Object.assign({
            noInput: false,
            noCancel: false,
            inputSelect: false,
        }, opts || {});
        return new Promise((resolve) => {
            let dialog = this.dialog.element,
                onDialogClose = (e) => {
                    let reason = e.detail,
                        answer = this.dialog.input;
                    dialog.removeEventListener('iron-overlay-closed', onDialogClose);
                    if (reason.confirmed) {
                        return resolve(answer);
                    }
                    return resolve(null);
                };
            this.set('dialog.message', message);
            this.set('dialog.input', defaultValue);
            this.set('dialog.noInput', options.noInput);
            this.set('dialog.noCancel', options.noCancel);
            this.$['dialog-input'].focus();
            if (options.inputSelect) {
                this.$['dialog-input'].select();
            }
            dialog.addEventListener('iron-overlay-closed', onDialogClose);
            dialog.open();
        });
    }
    _dialogKeydown(e) {
        if (e.keyCode === 13) {
            this.dialog.element.close();
        } else if (e.keyCode === 8) {
            e.stopPropagation();
        }
    }
    /**
   * Triggers the resize event on the window
   */
    resize() {
        const ev = new Event('resize');
        window.dispatchEvent(ev);
        if (!this.workspace) {
            return;
        }
        Blockly.resizeSvgContents(this.workspace);
    }
    /**
   * Remove every block in the workspace
   */
    clearWorkspace() {
        if (!this.workspace) {
            return;
        }
        /**
      * Temporarily disable events to prevent profusion of deletion
      * events being fired
      */
        Blockly.Events.disable();
        this.workspace.clear();
        /** Re-enable events */
        Blockly.Events.enable();
        this.workspace.functionsRegistry.reset();
    }
    /**
   * Update the code on any blockly change and
   * bubble up the event
   * @param  {Event} e    A Blockly event
   * @return {[type]}   [description]
   */
    onBlocklyChange(e) {
        let block;
        let blockTypeAvailabe;
        let blockType;
        if (e.type === Blockly.Events.OPEN_SEARCHBOX) {
            this._openOmnibox();
            return;
        }
        if (e.type === Blockly.Events.SCROLL) {
            this._panDebouncer = Debouncer.debounce(
                this._panDebouncer,
                timeOut.after(200),
                () => {
                    this.dispatchEvent(new CustomEvent('workspace-scroll', {
                        bubbles: true,
                        composed: true,
                    }));
                },
            );
            return;
        }
        if (e.type === Blockly.Events.CREATE) {
            this.lastCreated = e.blockId;
            block = this.workspace.getBlockById(e.blockId);
            if (block) {
                blockType = block.type;
            }
        }
        if (e.type === Blockly.Events.DELETE) {
            blockTypeAvailabe = e.oldXml &&
                              e.oldXml.attributes &&
                              e.oldXml.attributes.type;
            if (blockTypeAvailabe) {
                blockType = e.oldXml.attributes.type.value;
            }
        }
        if ((e.type === Blockly.Events.MOVE || e.type === Blockly.Events.UI && e.element === 'click')) {
            block = this.workspace.getBlockById(e.blockId);
            // If there is a move event or a click event, we check if it matches the last block created
            if (this.lastCreated === e.blockId) {
                // The block targetted by the last event matches the last created,
                //  we trigger a drop event
                const ev = {
                    type: Blockly.Events.DROP_BLOCK,
                    blockId: e.blockId,
                };
                this.workspace.fireChangeListener(ev);
                this.lastCreated = null;
            } else if (e.type === Blockly.Events.MOVE) {
                // The event type is `move` and the block concerned was not just created
                this.dispatchEvent(new CustomEvent('block-move', {
                    bubbles: true,
                    composed: true,
                }));
            }
            if (block) {
                blockType = block.type;
            }
        }
        this.updateFunctions(e);
        /** Enrich the event for tracking purposes */
        e.blockType = blockType;
        this.dispatchEvent(new CustomEvent('change', {
            detail: e,
            bubbles: true,
            composed: true,
        }));
        if (this.codeRelatedEvents.indexOf(e.type) !== -1) {
            this.set('code', this.getCode(this.language));
        }
    }
    updateFunctions(e) {
        let toolbox;
        if (e.type === Blockly.Events.UPDATE_FUNCTIONS) {
            if (this.toolbox) {
                for (let i = 0; i < this.toolbox.length; i += 1) {
                    if (this.toolbox[i].id === 'functions') {
                        toolbox = this.workspace.functionsRegistry.getToolbox();
                        this.set(`toolbox.${i}.blocks`, toolbox);
                        break;
                    }
                }
                // Force a render of the box in case the shapes of the blocks changed
                this.$.toolbox.render();
            }
        }
    }
    /**
   * Generate a XML string representation of the blocks
   * currently on the workspace
   * @return {String}     XML string representation of the blocks
   */
    getBlocks() {
        const xml = Blockly.Xml.workspaceToDom(this.workspace);
        const xmlString = Blockly.Xml.domToText(xml);
        return xmlString;
    }
    /**
   * Compute the current code for a given language
   * @param  {String} type Language to use to compute the code
   * @return {String}      A piece of code
   */
    getCode(type) {
        try {
            return Blockly[type].workspaceToCode(this.workspace);
        } catch (e) {
            return '';
        }
    }
    save() {
        const javascript = this.getCode(this.language);
        const blocks = this.getBlocks();
        const snapshot = {
            javascript,
            blocks,
        };
        this.set('blocks', blocks);
        return Promise.resolve(snapshot);
    }
    load(snapshot = {}) {
        this.set('blocks', snapshot.blocks);
        if (!this.workspace) {
            return;
        }
        this._loadBlocks(snapshot.blocks);
    }
    _loadBlocks(blocksXml = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>') {
        const xml = Blockly.Xml.textToDom(blocksXml);
        this.clearWorkspace();
        try {
            Blockly.Xml.domToWorkspace(xml, this.workspace);
        } catch (e) {
            console.log(e);
        } // Ignore loading errors
        this._checkDefaultBlocks();
    }
    loadBlocks(...args) {
        this._loadBlocks(...args);
    }
    _checkDefaultBlocks() {
        const blocks = this.workspace.getAllBlocks();
        if (!blocks.length && this.defaultBlocks) {
            this._loadBlocks(this.defaultBlocks);
        }
    }
    _defaultBlocksChanged() {
        // Defer the load until the workspace exists
        if (!this.workspace) {
            return;
        }
        this._checkDefaultBlocks();
    }
    _blurInput() {
        Blockly.WidgetDiv.hide();
    }
    getWorkspace() {
        return this.workspace;
    }
    getToolbox() {
        return this.$.toolbox;
    }
    getFlyout() {
        return this.workspace.flyout_;
    }
    _onToolboxScroll() {
        this._scrollDebouncer = Debouncer.debounce(
            this._scrollDebouncer,
            timeOut.after(200),
            () => {
                this.dispatchEvent(new CustomEvent('toolbox-scroll', {
                    bubbles: true,
                    composed: true,
                }));
            },
        );
    }
}

window.customElements.define('kwc-blockly', KwcBlockly);
