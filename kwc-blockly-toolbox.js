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
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import './blockly.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './kwc-blockly-flyout.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
    _template: html`
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
            button.category {
                display: block;
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
        <kwc-blockly-flyout id="flyout" padding-left="0" toolbox="[[currentToolbox]]" target-workspace="[[targetWorkspace]]" on-block-created="_onBlockCreated" auto-close="[[autoClose]]"></kwc-blockly-flyout>
        <div id="mask" class="mask"></div>
        <template is="dom-repeat" items="[[toolbox]]" as="category" on-dom-change="_toolboxDomChanged">
            <button type="button" class\$="category [[_computeSelectedClass(category.selected)]]" on-tap="_selectCategory" id\$="category-[[category.id]]" hidden\$="[[_isSeparator(category.type)]]">
                <div class="color" style\$="[[_computeColorStyle(category.colour)]]"></div>
                <div class="category-label">[[category.name]]</div>
            </button>
            <div class="separator" hidden\$="[[!_isSeparator(category.type)]]"></div>
        </template>
`,

    is: 'kwc-blockly-toolbox',

    properties: {
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
    },

    get flyout_() {
        return this.$.flyout;
    },

    attached() {
        this._onResize = this._onResize.bind(this);
        window.addEventListener('resize', this._onResize);
    },

    _onResize() {
        this._updateMetrics();
    },

    _isSeparator(type) {
        return type === 'separator';
    },

    _computeColorStyle(color) {
        return `background: ${color};`;
    },

    _computeSelectedClass(selected) {
        return selected ? 'selected' : '';
    },

    _onBlockCreated() {
        this.debounce('onBlockCreated', () => {
            if (this.autoClose) {
                this.close();
            }
        });
    },

    _updateMetrics() {
        this._metrics = this.getBoundingClientRect();
    },

    _toolboxDomChanged() {
        this._updateMetrics();
        if (this.targetWorkspace) {
            this.targetWorkspace.resize();
        }
    },

    getMetrics() {
        if (!this._metrics) {
            this._updateMetrics();
        }
        return this._metrics;
    },

    getWidth() {
        return this.getMetrics().width;
    },

    getHeight() {
        return this.getMetrics().height;
    },

    position() {},
    addDeleteStyle() {},
    removeDeleteStyle() {},

    getClientRect() {
        const rect = this.getMetrics();
        return new goog.math.Rect(rect.left, rect.top, rect.width, rect.height);
    },

    close() {
        let category,
            categoryEl,
            e;
        if (!this.opened) {
            return;
        }
        category = this.toolbox[this.currentSelected];
        if (category) {
            categoryEl = this.$$(`#category-${category.id}`),
            categoryEl.style.paddingBottom = '';
        }
        this.style.width = '';
        this.$.flyout.style.display = 'none';
        this.set(`toolbox.${this.currentSelected}.selected`, false);
        e = { type: Blockly.Events.CLOSE_FLYOUT };
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
    },

    _targetWorkspaceChanged(ws) {
        if (!ws) {
            return;
        }
        ws.getParentSvg().addEventListener('click', this._targetWorkspaceClicked.bind(this));
    },

    _targetWorkspaceClicked() {
        this.close();
    },

    _selectCategory(e) {
        let category = e.model.get('category'),
            target = e.target,
            index = e.model.get('index');

        e.stopPropagation();
        e.preventDefault();

        if (category.type === 'separator') {
            return;
        }

        if (typeof this.currentSelected !== 'undefined') {
            const categoryEl = this.$$(`#category-${this.toolbox[this.currentSelected].id}`);
            categoryEl.style.paddingBottom = '';
            this.style.width = '';
            this.$.flyout.style.display = 'none';
            this.set(`toolbox.${this.currentSelected}.selected`, false);
        }

        if (this.currentSelected !== index) {
            let e = {
                    type: Blockly.Events.OPEN_FLYOUT,
                    categoryId: category.id,
                },
                categoryEl = this.$$(`#category-${category.id}`),
                rect = categoryEl.getBoundingClientRect(),
                buttons = dom(this.root).querySelectorAll('button.category, .separator:not([hidden])'),
                buttonTop = categoryEl.offsetTop,
                onSizeChanged;
            onSizeChanged = (e) => {
                let size = e && e.detail || this.prevSize,
                    over = false,
                    duration;
                this.prevSize = size;
                this.$.flyout.removeEventListener('size-changed', onSizeChanged);
                this.transform(`translate(0px, ${buttonTop + rect.height}px)`, this.$.flyout);
                categoryEl.style.paddingBottom = `${size.height}px`;
                this.style.width = `${size.width + 35}px`;
                this._scrollIfNeeded(categoryEl);
                this.$.mask.style.display = 'block';
                this.$.mask.style.top = `${rect.top + rect.height}px`;
                duration = size.height / 3;
                this.style.overflowY = 'hidden';
                for (let i = 0; i < buttons.length; i++) {
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
                this.async(onSizeChanged);
            }
            this.$.flyout.style.display = 'block';
            this.currentSelected = index;
            this.currentToolbox = category.blocks;
            this.set(`toolbox.${this.currentSelected}.selected`, true);
            this.updateStyles({
                '--selected-color': category.colour,
            });
            this.targetWorkspace.fireChangeListener(e);
            this.targetWorkspace.setResizesEnabled(false);
            this.set('opened', true);
        } else {
            const e = {
                type: Blockly.Events.CLOSE_FLYOUT,
            };
            this.prevSelected = this.currentSelected;
            this.currentSelected = undefined;
            this.currentToolbox = undefined;
            this.updateStyles({
                '--selected-color': null,
            });
            if (this.targetWorkspace) {
                this.targetWorkspace.fireChangeListener(e);
            }
            this.targetWorkspace.setResizesEnabled(true);
            this.set('opened', false);
        }
    },

    _scrollIfNeeded(toEl) {
        let flyout = this.$.flyout,
            flyoutRect,
            rect;
        rect = this.getBoundingClientRect();
        flyoutRect = flyout.getBoundingClientRect();
        if (flyoutRect.top + flyoutRect.height > rect.top + rect.height) {
            toEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
    },

    getCategoryElement(id) {
        return this.$$(`#category-${id}`);
    },

    getFlyoutBlock(type) {
        const flyout = this.$$('#flyout');
        if (flyout) {
            return flyout.getBlockByType(type);
        }
    },

    render() {
        // Ensures the next opened flyout will be re-rendered
        this.prevSelected = null;
        this.forceRender = true;
    },

    dispose() {},
    clearSelection() {},

    get HtmlDiv() {
        return this;
    },

    refreshSelection() {},
});
