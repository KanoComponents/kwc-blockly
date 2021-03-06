/**
`kwc-blockly-function-definition`

Example:
    <kwc-blockly-function-definition></kwc-blockly-function-definition>

@group Kano Elements
@hero hero.svg
@demo demo/kwc-blockly-function-definition.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@kano/kwc-style/typography.js';
import '@kano/kwc-style/color.js';
import '../kwc-blockly-flyout.js';
import './kwc-blockly-wrapper.js';
import './kwc-blockly-incr.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style>
            :host {
                display: block;
            }
            .blocks {
                padding: 0px 0px 0px 12px;
                background: var(--color-abbey);
                @apply --layout-flex;
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
                --kwc-blockly-wrapper-caret-color: var(--color-abbey);
            }
            [slot="content"] {
                min-width: 220px;
                max-width: 325px;
                max-height: 325px;
                overflow: auto;
            }
        </style>
        <kwc-blockly-wrapper title="Functions" on-close="_close">
            <div slot="content">
                <div class="controls">
                    <label for="params">Parameters</label>
                    <kwc-blockly-incr value="{{value.parameters}}" min="0"></kwc-blockly-incr>
                    <label for="rtn">
                        <input id="rtn" type="checkbox" checked="{{value.returns::change}}">
                        <span></span><div id="cb-label">Returns</div>
                    </label>
                </div>
                <div class="blocks">
                    <kwc-blockly-flyout target-workspace="[[targetWorkspace]]" toolbox="[[_toolbox]]" padding-left="0" min-width="100"></kwc-blockly-flyout>
                </div>
            </div>
        </kwc-blockly-wrapper>
`,

    is: 'kwc-blockly-function-definition',

    properties: {
        value: {
            type: Object,
            value: () => ({ parameters: 0, returns: false }),
            notify: true,
        },
        targetWorkspace: Object,
        toolbox: {
            type: Array,
            observer: '_toolboxChanged',
        },
    },

    _close() {
        this.fire('close-tapped');
    },

    _toolboxChanged() {
        this.debounce('updateToolbox', () => {
            this.renderToolbox();
        }, 100);
    },

    renderToolbox() {
        this._toolbox = this.toolbox;
    },
});
