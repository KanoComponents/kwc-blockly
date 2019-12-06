/**
`kano-blockly-toolbox`

Example:
    <kano-toolbox></kano-toolbox>

 The following custom properties and mixins are also available for styling:

 Custom property | Description | Default
 ----------------|-------------|----------
 `--kwc-blockly-toolbox-color` | Text color | `white`
 `--kwc-blockly-toolbox-background` | Background color | `#414a51`
 `--kwc-blockly-toolbox-selected-color` | Background color of a selected category | `#394148`
 `--kwc-blockly-toolbox` | Applied to the toolbox | {}
 `--kano-blockly-toolbox-opened` | Applied to the toolbox when opened | {}

@group Kano Elements
@hero hero.svg
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { microTask, timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { Blockly, goog } from './blockly.js';
import './kwc-blockly-flyout.js';

class KwcBlocklyToolbox extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                    display: block;
                    padding: 18px 0px 0px 0px;
                    color: var(--kwc-blockly-toolbox-color, white);
                    font-family: var(--font-body, Arial);
                    background: var(--kwc-blockly-toolbox-background, #414a51);
                    overflow-y: auto;
                    @apply --kwc-blockly-toolbox;
                    /* Promote layer as a prime element */
                    transform: translateZ(0);
                    position: relative;
                }
                :host([hidden]) {
                    display: none !important;
                }
                :host([rtl]) button.category {
                    flex-direction: row-reverse;
                    padding: 2px 12px 3px 32px;
                }
                :host([rtl]) button.category .color {
                    margin: 0 2px 0 8px;
                }
                button.category {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    width: 100%;
                    background: transparent;
                    color: var(--kwc-blockly-toolbox-color, white);
                    text-align: left;
                    font-family: var(--font-body, Arial);
                    font-size: 16px;
                    font-weight: bold;
                    border: 0;
                    cursor: pointer;
                    padding: 2px 32px 3px 12px;
                    transition: border-color linear 100ms;
                }
                button.category>* {
                    display: inline-block;
                    vertical-align: middle;
                    pointer-events: none;
                }
                button.category:hover {
                    background-color: var(--kwc-blockly-toolbox-selected-color, #394148);
                }
                .separator {
                    height: 16px;
                }
                button.category.selected {
                    background-color: var(--kwc-blockly-toolbox-selected-color, #394148);
                }
                button.category:focus {
                    outline: none;
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .category-label {
                    margin: 3px 0 3px;
                }
                #flyout {
                    position: absolute;
                    top: 0;
                    transition: border-color linear 300ms;
                    /*border-bottom: 1px solid #383838;*/
                    overflow: hidden;
                    animation: fade-in ease-out 300ms;
                    display: none;
                    margin-left: 12px;
                }
                button.category.selected .color {
                    box-shadow: 0 0 0 1px var(--kwc-blockly-toolbox-selected-color, #394148),
                                0 0 0 2px var(--selected-color, black);
                }
                .color {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    box-shadow: none;
                    transition: box-shadow linear 150ms;
                    margin: 0 8px 0 2px;
                }
                :host([opened]) {
                    @apply --kwc-blockly-toolbox-opened;
                }
                *[hidden] {
                    display: none !important;
                }
                .mask {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: inherit;
                    display: none;
                }
            </style>
            <kwc-blockly-flyout
                id="flyout"
                rtl="[[rtl]]"
                padding-left="0"
                toolbox="[[currentToolbox]]"
                target-workspace="[[targetWorkspace]]"
                on-block-created="_onBlockCreated"
                on-flyout-scrolled="_onFlyoutScrolled"
                auto-close="[[autoClose]]">
            </kwc-blockly-flyout>
            <div id="mask" class="mask"></div>
            <template is="dom-repeat" items="[[toolbox]]" as="category" on-dom-change="_toolboxDomChanged">
                <button type="button" class$="category [[_computeSelectedClass(category.selected)]]" on-tap="_selectCategory" id$="category-[[category.id]]" hidden$="[[_isSeparator(category.type)]]">
                    <div class="color" style$="[[_computeColorStyle(category.colour)]]"></div>
                    <div class="category-label">[[category.name]]</div>
                </button>
                <div class="separator" hidden$="[[!_isSeparator(category.type)]]"></div>
            </template>
        `;
    }
    static get properties() {
        return {
            targetWorkspace: {
                type: Object,
                observer: '_targetWorkspaceChanged',
            },
            toolbox: {
                type: Array,
            },
            currentToolbox: {
                type: Array,
            },
            opened: {
                type: Boolean,
                value: false,
                notify: true,
                reflectToAttribute: true,
            },
            autoClose: {
                type: Boolean,
                value: false,
            },
            _canAnimate: {
                type: Boolean,
                value: 'animate' in HTMLElement.prototype,
            },
            rtl: {
                type: Boolean,
                reflectToAttribute: true,
            },
        };
    }
    get flyout_() {
        return this.$.flyout;
    }
    connectedCallback() {
        super.connectedCallback();
        this._onResize = this._onResize.bind(this);
        window.addEventListener('resize', this._onResize);
    }
    _onResize() {
        this._updateMetrics();
    }
    _isSeparator(type) {
        return type === 'separator';
    }
    _computeColorStyle(color) {
        return `background: ${color};`;
    }
    _computeSelectedClass(selected) {
        return selected ? 'selected' : '';
    }
    _onBlockCreated() {
        if (this.autoClose) {
            this._createdDebouncer = Debouncer.debounce(
                this._createdDebouncer,
                timeOut.after(200),
                () => {
                    this.close();
                },
            );
        }
    }
    _onFlyoutScrolled(e) {
        this.scroll(0, e.detail);
    }
    _updateMetrics() {
        this._metrics = this.getBoundingClientRect();
    }
    _toolboxDomChanged() {
        this._updateMetrics();
        if (this.targetWorkspace) {
            this.targetWorkspace.resize();
        }
    }
    getMetrics() {
        if (!this._metrics) {
            this._updateMetrics();
        }
        return this._metrics;
    }
    getWidth() {
        return this.getMetrics().width;
    }
    getHeight() {
        return this.getMetrics().height;
    }
    position() {}
    addDeleteStyle() {}
    removeDeleteStyle() {}
    getClientRect() {
        const rect = this.getMetrics();
        return new goog.math.Rect(rect.left, rect.top, rect.width, rect.height);
    }
    close() {
        let categoryEl;
        if (!this.opened) {
            return;
        }
        const category = this.toolbox[this.currentSelected];
        if (category) {
            categoryEl = this.shadowRoot.querySelector(`#category-${category.id}`);
            categoryEl.style.paddingBottom = '';
        }
        this.style.width = '';
        this.$.flyout.style.display = 'none';
        this.set(`toolbox.${this.currentSelected}.selected`, false);
        const e = { type: Blockly.Events.CLOSE_FLYOUT };
        this.prevSelected = this.currentSelected;
        this.currentSelected = undefined;
        this.updateStyles({
            '--selected-color': null,
        });
        if (this.targetWorkspace) {
            this.targetWorkspace.fireChangeListener(e);
        }
        this.targetWorkspace.setResizesEnabled(false);
        this.set('opened', false);
    }
    _targetWorkspaceChanged(ws) {
        if (!ws) {
            return;
        }
        ws.getParentSvg().addEventListener('click', this._targetWorkspaceClicked.bind(this));
    }
    _targetWorkspaceClicked() {
        this.close();
    }
    _selectCategory(e) {
        const category = e.model.get('category');
        const index = e.model.get('index');

        e.stopPropagation();
        e.preventDefault();

        if (category.type === 'separator') {
            return;
        }

        if (typeof this.currentSelected !== 'undefined') {
            const categoryEl = this.shadowRoot.querySelector(`#category-${this.toolbox[this.currentSelected].id}`);
            categoryEl.style.paddingBottom = '';
            this.style.width = '';
            this.$.flyout.style.display = 'none';
            this.set(`toolbox.${this.currentSelected}.selected`, false);
        }

        if (this.currentSelected !== index) {
            const eOpenFlyout = {
                type: Blockly.Events.OPEN_FLYOUT,
                categoryId: category.id,
            };
            const categoryEl = this.shadowRoot.querySelector(`#category-${category.id}`);
            const rect = categoryEl.getBoundingClientRect();
            const buttons = this.shadowRoot.querySelectorAll('button.category, .separator:not([hidden])');
            const buttonTop = categoryEl.offsetTop;
            const onSizeChanged = (eSizeChanged) => {
                const size = (eSizeChanged && eSizeChanged.detail) || this.prevSize;
                let over = false;
                this.prevSize = size;
                this.$.flyout.removeEventListener('size-changed', onSizeChanged);
                this.$.flyout.style.transform = `translate(0px, ${buttonTop + rect.height}px)`;
                categoryEl.style.paddingBottom = `${size.height}px`;
                this.style.width = `${size.width + 35}px`;
                this._scrollIfNeeded(categoryEl);
                this.$.mask.style.display = 'block';
                this.$.mask.style.top = `${rect.top + rect.height}px`;
                const duration = size.height / 3;
                this.style.overflowY = 'hidden';
                for (let i = 0; i < buttons.length; i += 1) {
                    if (over && this._canAnimate) {
                        buttons[i].animate({
                            transform: [`translate(0px, -${size.height - rect.height}px`, 'translate(0px, 0px)'],
                        }, {
                            duration,
                        });
                    } else if (buttons[i] === categoryEl) {
                        over = true;
                    }
                }
                if (this._canAnimate) {
                    this.$.mask.animate({
                        transform: ['translate(0px, 0px)', `translate(0px, ${size.height}px`],
                    }, {
                        duration,
                        fill: 'forwards',
                    }).onfinish = () => {
                        this.style.overflowY = 'auto';
                        this.$.mask.style.display = 'none';
                    };
                } else {
                    this.style.overflowY = 'auto';
                    this.$.mask.style.display = 'none';
                }
            };
            if (this.forceRender) {
                this.currentToolbox = undefined;
                this.prevSelected = undefined;
                this.forceRender = false;
            }
            if (this.prevSelected !== index) {
                this.$.flyout.addEventListener('size-changed', onSizeChanged);
            } else {
                this._sizeDebouncer = Debouncer.debounce(
                    this._sizeDebouncer,
                    microTask,
                    () => {
                        onSizeChanged();
                    },
                );
            }
            this.$.flyout.style.display = 'block';
            this.prevSelected = this.currentSelected;
            this.currentSelected = index;
            this.currentToolbox = category.blocks;
            this.set(`toolbox.${this.currentSelected}.selected`, true);
            this.updateStyles({
                '--selected-color': category.colour,
            });
            this.targetWorkspace.fireChangeListener(eOpenFlyout);
            this.targetWorkspace.setResizesEnabled(false);
            this.set('opened', true);
        } else {
            const eCloseFlyout = {
                type: Blockly.Events.CLOSE_FLYOUT,
            };
            this.prevSelected = this.currentSelected;
            this.currentSelected = undefined;
            this.currentToolbox = undefined;
            this.updateStyles({
                '--selected-color': null,
            });
            if (this.targetWorkspace) {
                this.targetWorkspace.fireChangeListener(eCloseFlyout);
            }
            this.targetWorkspace.setResizesEnabled(true);
            this.set('opened', false);
        }
    }
    _scrollIfNeeded(toEl) {
        const { flyout } = this.$;
        const rect = this.getBoundingClientRect();
        const flyoutRect = flyout.getBoundingClientRect();
        if (flyoutRect.top + flyoutRect.height > rect.top + rect.height) {
            toEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
    }
    getCategoryElement(id) {
        return this.shadowRoot.querySelector(`#category-${id}`);
    }
    getFlyoutBlock(type) {
        const flyout = this.shadowRoot.querySelector('#flyout');
        if (flyout) {
            return flyout.getBlockByType(type);
        }
        return null;
    }
    render() {
        // Ensures the next opened flyout will be re-rendered
        this.prevSelected = null;
        this.forceRender = true;
    }
    dispose() {}
    clearSelection() {}
    get HtmlDiv() {
        return this;
    }
    refreshSelection() {}
    addStyle() {}
    removeStyle() {}
    updateColourFromTheme() {}
}

window.customElements.define('kwc-blockly-toolbox', KwcBlocklyToolbox);
