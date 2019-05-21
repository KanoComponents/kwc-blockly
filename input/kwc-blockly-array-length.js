import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

import './kwc-blockly-incr.js';
import './kwc-blockly-wrapper.js';

Polymer({
    _template: html`
        <style>
            :host {
                display: block;
            }
            kwc-blockly-wrapper {
                --kwc-blockly-wrapper-caret-color: var(--color-black);
            }
            kwc-blockly-incr {
                margin-top: 10px;
                background: #464C51;
                font-size: 14px;
            }
        </style>
        <kwc-blockly-wrapper title="List" no-close-button="" on-close="_close">
            <div slot="content">
                <div class="controls">
                    <label for="params">Items</label>
                    <kwc-blockly-incr value="{{value}}" min="1"></kwc-blockly-incr>
                </div>
            </div>
        </kwc-blockly-wrapper>
`,

    is: 'kwc-blockly-array-length',

    properties: {
        value: {
            type: Number,
            notify: true,
        },
    },
});
