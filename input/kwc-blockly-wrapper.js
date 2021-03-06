/**
`kwc-blockly-wrapper`

Example:
    <kwc-blockly-wrapper></kwc-blockly-wrapper>

@group Kano Elements
@hero hero.svg
@demo demo/kwc-blockly-wrapper.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@kano/kwc-style/color.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
    _template: html`
        <style>
            :host {
                position: relative;
                @apply --layout-vertical;
                color: white;
                font-family: var(--font-body);
                @apply --shadow-elevation-16dp;
                border-radius: 4px;
                border: 1px solid #23272C;
                background: var(--color-black);
            }
            .content {
                overflow: hidden;
                @apply --layout-vertical;
                border-radius: 4px;
                overflow: hidden
            }
            header h1 {
                font-size: 14px;
                text-transform: uppercase;
                padding: 0px;
                padding-right: 12px;
                margin: 0px;
                @apply --layout-flex;
            }
            header {
                background: #292f35;
                border-bottom: 1px solid #23272C;
                padding: 0px 6px 0px 18px;
                font-weight: 600;
                height: 32px;
                @apply --layout-horizontal;
                @apply --layout-center;
            }
            a.boxclose{
                position: relative;
                width: 7px;
                height: 7px;
                cursor: pointer;
                color: #fff;
                border: 1px solid #83898D;
                border-radius: 5px;
                background: #83898D;
                font-size: 22px;
                font-weight: bold;
                line-height: 2px;
                padding: 4px 5px 6px 4px;
            }
            .boxclose:before {
                content: "×";
            }
            .arrow-down {
                position: absolute;
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 11px solid #23272C;
                bottom: -11px;
                left: 11px;
            }
            .arrow-down::before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border-left: 9px solid transparent;
                border-right: 9px solid transparent;
                border-top: 10px solid var(--kwc-blockly-wrapper-caret-color);
                top: -11px;
                left: -9px;
            }
            .slot-content {
                @apply --layout-flex;
            }
            ::slotted(* .controls) {
                padding: 6px 18px 12px;
                @apply --layout-vertical;
                @apply --layout-start;
            }
            ::slotted(* .controls label) {
                color: #A4A7AA;
                font-size: 12px;
                text-transform: uppercase;
            }
            [hidden] {
                display: none !important;
            }
        </style>
        <div class="arrow-down"></div>
        <div class="content">
            <header>
                <h1>[[title]]</h1>
                <a class="boxclose" id="boxclose" on-tap="_close" hidden\$="[[noCloseButton]]"></a>
            </header>
            <div class="slot-content">
                <slot name="content"></slot>
            </div>
        </div>
`,

    is: 'kwc-blockly-wrapper',

    properties: {
        title: String,
        noCloseButton: {
            type: Boolean,
            value: false,
        },
    },

    _close() {
        this.fire('close');
    },
});
