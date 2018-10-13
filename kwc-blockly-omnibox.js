import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-styles/shadow.js';

class KwcBlocklyOmnibox extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                display: block;
                border-radius: 4px;
                overflow: hidden;
                @apply --shadow-elevation-16dp;
                z-index: 0;
                background: #152028;
            }
            input {
                width: 100%;
                color: white;
                font-family: monospace;
                border: 0px;
                padding: 6px 9px;
                font-size: 16px;
                box-sizing: border-box;
                background-color: transparent;
            }
            input:focus {
                outline: none;
                /* Need design for focused input */
            }
            .extra {
                background-color: #0f181e;
                min-height: 30px;
                border-top: 1px solid #1D2930;
            }
            .input-wrapper {
                @apply --layout-horizontal;
                @apply --layout-center;
                position: relative;
                background-color: #0f181e;
            }
            .input-wrapper input {
                @apply --layout-flex;
            }
            .input-wrapper .input-label {
                font-family: monospace;
                color: white;
                padding-left: 10px;
            }
            .results {
                overflow: auto;
                max-height: 300px;
            }
            .result {
                @apply --layout-horizontal;
                @apply --layout-center;
                border: 0px;
                border-top: 1px solid #1D2930;
                color: white;
                padding: 6px 10px;
                font-family: monospace;
                cursor: pointer;
                width: 100%;
                text-align: left;
                background: transparent;
                font-size: 14px;
            }
            .result:hover, .result:focus, .result.selected {
                outline: none;
                background: #37464F;
            }
            .result .label {
                @apply --layout-flex;
            }
            .result .color {
                width: 10px;
                height: 10px;
                border-radius: 2px;
                margin-right: 10px;
            }
        </style>
        <div class="input-wrapper">
            <input id="input" type="text" value="{{query::input}}" placeholder="Type">
        </div>
        <div class="results">
            <template is="dom-repeat" items="[[results]]" as="result">
                <button class\$="result [[_computeSelectedClass(index, selected)]]" on-tap="_onResultTapped">
                    <div class="color" style\$="[[_computeBlockStyle(result, qts)]]"></div>
                    <div class="label">[[_computeBlockLabel(result, qts)]]</div>
                </button>
            </template>
        </div>
        <div class="extra"></div>
        <iron-a11y-keys target="[[_target]]" keys="down" on-keys-pressed="_onDownPressed"></iron-a11y-keys>
        <iron-a11y-keys target="[[_target]]" keys="up" on-keys-pressed="_onUpPressed"></iron-a11y-keys>
        <iron-a11y-keys target="[[_target]]" keys="enter" on-keys-pressed="_onEnterPressed"></iron-a11y-keys>
`;
    }
    static get properties() {
        return {
            query: {
                type: String,
                observer: '_queryChanged',
            },
            results: Array,
            targetWorkspace: Object,
            noDrag: {
                type: Boolean,
                value: false,
            },
            filter: {
                type: Function,
                observer: '_filterChanged',
            },
            qts: Number,
            selected: Number,
            _target: Object,
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this._target = this.$.input;
    }
    _blockCreated() {
        this.dispatchEvent(new CustomEvent('close'));
    }
    _filterChanged() {
        this.lookup();
    }
    _queryChanged() {
        this.set('hint', '');
        this._resultDebouncer = Debouncer.debounce(
            this._resultDebouncer,
            timeOut.after(200),
            () => {
                this.lookup();
            },
        );
    }
    lookup() {
        let results = this.targetWorkspace.search(this.query || '');
        if (typeof this.filter === 'function') {
            results = results.filter(this.filter);
        }
        this.set('selected', 0);
        this.set('results', results);
        // Update the query timestamp to force
        // a computation on the labels if the results didn't change
        this.set('qts', Date.now());
    }
    _computeBlockLabel(block) {
        return block.toAPIString(this.query || '', this.targetWorkspace);
    }
    _computeBlockStyle(result) {
        return `background: ${result.getColour()};`;
    }
    focus() {
        this.$.input.focus();
        this.$.input.select();
    }
    clear() {
        this.query = '';
    }
    _onResultTapped(e) {
        const block = e.model.get('result');
        this.dispatchEvent(new CustomEvent('confirm', { detail: { selected: block } }));
    }
    _onEnterPressed() {
        this.dispatchEvent(new CustomEvent('confirm', { detail: { selected: this.results[this.selected] } }));
    }
    _onDownPressed(e) {
        this.selected = Math.min(this.selected + 1, this.results.length - 1);
        e.preventDefault();
        e.stopPropagation();
    }
    _onUpPressed(e) {
        this.selected = Math.max(this.selected - 1, 0);
        e.preventDefault();
        e.stopPropagation();
    }
    _computeSelectedClass(index, selected) {
        return index === selected ? 'selected' : '';
    }
}

customElements.define('kwc-blockly-omnibox', KwcBlocklyOmnibox);