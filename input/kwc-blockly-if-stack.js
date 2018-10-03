import '@polymer/polymer/polymer-legacy.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

import './kwc-blockly-wrapper.js';
import './kwc-blockly-incr.js';

Polymer({
    _template: html`
        <style>
            :host {
                display: block;
            }
            label {
                font-weight: 600;
                font-size: 14px;
            }
            label[for=rtn]{
                @apply --layout-horizontal;
                @apply --layout-center;
                text-transform: capitalize;
                color: white;
                cursor: pointer;
                margin-top: 10px;
            }
            kwc-blockly-incr {
                margin-top: 10px;
                background: #464C51;
                font-size: 14px;
            }
            label input {
                display: none;/* <-- hide the default checkbox */
            }
            label span {/* <-- style the artificial checkbox */
                height: 12px;
                width: 12px;
                border: 1px solid #464C51;
                background-color: #464C51;
                border-radius: 3px;
                display: inline-block;
                margin-right: 5px;
                position: relative;
            }
            [type=checkbox]:checked + span:before {/* <-- style its checked state..with a ticked icon */
                content: '\\2714';
                position: absolute;
                top: -2px;
                left: 2px;
            }
            #cb-label {
                position: relative;
                text-transform: capitalize;
                display: inline-block;
                color: white;
            }
            kwc-blockly-wrapper {
                --kwc-blockly-wrapper-caret-color: var(--color-black);
            }
        </style>
        <kwc-blockly-wrapper title="If / Else / Else If" no-close-button="" on-close="_close">
            <div slot="content">
                <div class="controls">
                    <label for="params">Else If</label>
                    <kwc-blockly-incr value="{{value.elseIfs}}" min="0"></kwc-blockly-incr>
                    <label for="rtn">
                        <input id="rtn" type="checkbox" checked="{{value.else::change}}">
                        <span></span><div id="cb-label">Else</div>
                    </label>
                </div>
            </div>
        </kwc-blockly-wrapper>
`,

    is: 'kwc-blockly-if-stack',

    properties: {
        value: {
            type: Object,
            value: () => ({ elseIfs: 0, else: false }),
            notify: true,
        },
    },
});
