import '@polymer/polymer/polymer-legacy.js';
import '@kano/kwc-style/typography.js';
import '@kano/kwc-style/button.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<dom-module id="kwc-blockly-style">
    <template>
        <style>
            svg.blocklyMainWorkspaceScrollbar {
                z-index: 0;
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
            }
            ::slotted(* svg.blocklyMainWorkspaceScrollbar) {
                z-index: 0;
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
            }
            svg.blocklyMainWorkspaceScrollbar .blocklyScrollbarHandle {
                fill: var(--kwc-blockly-scrollbars-color, #292f35);
                rx: 3;
                ry: 3;
                opacity: 0.5;
            }
            ::slotted(* svg.blocklyMainWorkspaceScrollbar .blocklyScrollbarHandle) {
                fill: var(--kwc-blockly-scrollbars-color, #292f35);
                rx: 3;
                ry: 3;
                opacity: 0.5;
            }
            svg.blocklyMainWorkspaceScrollbar .blocklyScrollbarBackground:hover+.blocklyScrollbarHandle,
            svg.blocklyMainWorkspaceScrollbar:hover .blocklyScrollbarHandle {
                fill: var(--kwc-blockly-scrollbars-color, #292f35);
                rx: 3;
                ry: 3;
                opacity: 1;
            }
            ::slotted(* svg.blocklyMainWorkspaceScrollbar .blocklyScrollbarBackground:hover+.blocklyScrollbarHandle),
            ::slotted(* svg.blocklyMainWorkspaceScrollbar:hover .blocklyScrollbarHandle) {
                fill: var(--kwc-blockly-scrollbars-color, #292f35);
                rx: 3;
                ry: 3;
                opacity: 1;
            }
            .blocklyConfigInput>rect {
                fill: rgba(0, 0, 0, 0.35);
                cursor: pointer;
            }
            ::slotted(* .blocklyConfigInput>rect) {
                fill: rgba(0, 0, 0, 0.35);
                cursor: pointer;
            }
            .blocklyConfigInput>rect:hover {
                fill: rgba(0, 0, 0, 0.75);
            }
            ::slotted(* .blocklyConfigInput>rect:hover) {
                fill: rgba(0, 0, 0, 0.75);
            }
            .blocklyConfigInput>circle {
                fill: rgba(255, 255, 255, 0.75);
                cursor: pointer;
            }
            ::slotted(* .blocklyConfigInput>circle) {
                fill: rgba(255, 255, 255, 0.75);
                cursor: pointer;
            }
            .blocklyConfigInput:hover>circle {
                fill: white;
            }
            ::slotted(* .blocklyConfigInput:hover>circle) {
                fill: white;
            }
            .blocklyTrash,
            .blocklyZoom {
                fill: white;
            }
            ::slotted(* .blocklyTrash),
            ::slotted(* .blocklyZoom) {
                fill: white;
            }
            .blocklyZoom .button {
                opacity: 0.5;
                cursor: pointer;
            }
            ::slotted(* .blocklyZoom .button) {
                opacity: 0.5;
                cursor: pointer;
            }
            .blocklyZoom .button:hover {
                opacity: 1;
            }
            ::slotted(* .blocklyZoom .button:hover) {
                opacity: 1;
            }
            g.smoothScroll {
                transition: transform 200ms ease-out;
            }
            ::slotted(* g.smoothScroll) {
                transition: transform 200ms ease-out;
            }

            .blocklyTreeRoot>div[role="group"]>div:not([role="treeitem"]) {
                display: none;
            }
            ::slotted(* .blocklyTreeRoot>div[role="group"]>div:not([role="treeitem"])) {
                display: none;
            }

            .blocklyEditableText>rect {
                fill: white;
                fill-opacity: 0.6;
            }
            ::slotted(*.blocklyEditableText>rect) {
                fill: white;
                fill-opacity: 0.6;
            }

            .blocklyLookupField>text {
                font-family: monospace;
                cursor: pointer;
                fill: #223541;
            }
            ::slotted(*.blocklyLookupField>text) {
                font-family: monospace;
                cursor: pointer;
                fill: #223541;
            }

            .blocklySearchOutput>text {
                font-size: 28px;
                transform: translateY(15px);
                fill: #bbbbbb;
            }
            ::slotted(*.blocklySearchOutput>text) {
                font-size: 28px;
                transform: translateY(15px);
                fill: #bbbbbb;
            }

            .searchPlus {
                cursor: pointer;
            }
            ::slotted(* .searchPlus) {
                cursor: pointer;
            }

            .searchPlus rect {
                fill: #bbbbbb;
                stroke: #737373;
                rx: 4;
                ry: 4;
            }
            ::slotted(* .searchPlus rect) {
                fill: #bbbbbb;
                stroke: #737373;
                rx: 4;
                ry: 4;
            }

            .searchPlus text {
                fill: #eaeaea;
            }
            ::slotted(* .searchPlus text) {
                fill: #eaeaea;
            }

            .blocklyPathDark,
            .blocklyPathLight {
                fill: transparent !important;
                stroke-width: 0px !important;
            }

            ::slotted(* .blocklyPathDark),
            ::slotted(* .blocklyPathLight) {
                fill: transparent !important;
                stroke-width: 0px !important;
            }
            .blocklySelected > .blocklyPath {
                stroke-width: 1px !important;
                stroke: rgba(0, 0, 0, 0.5) !important;
                stroke-linejoin: round !important;
            }
            ::slotted(* .blocklySelected > .blocklyPath) {
                stroke-width: 1px !important;
                stroke: rgba(0, 0, 0, 0.5) !important;
                stroke-linejoin: round !important;
            }
            .blocklyHighlightedConnectionPath {
                stroke-width: 2px !important;
            }
            ::slotted(* .blocklyHighlightedConnectionPath) {
                stroke-width: 2px !important;
            }
            text.blocklyText {
                font-family: var(--font-body);
                font-size: 1em;
                fill: white;
            }
            ::slotted(* text.blocklyText) {
                font-family: var(--font-body);
                font-size: 1em;
                fill: white;
            }
            .blocklyEditableText:hover > rect {
                stroke-width: 1px !important;
            }
            ::slotted(* .blocklyEditableText:hover > rect) {
                stroke-width: 1px !important;
            }
            .blocklyEditableText .blocklyText {
                fill: #000;
                font-size: 1em !important;
            }
            ::slotted(* .blocklyEditableText .blocklyText) {
                fill: #000;
                font-size: 1em !important;
            }
            div.blocklyTreeRoot {
                padding: 0px;
            }
            ::slotted(* div.blocklyTreeRoot) {
                padding: 0px;
            }
            span.blocklyTreeLabel {
                font-family: bariol;
                font-size: 14px;
            }
            ::slotted(* span.blocklyTreeLabel) {
                font-family: bariol;
                font-size: 14px;
            }
            div.blocklyTreeRow {
                position: relative;
                height: auto !important;
                line-height: 20px !important;
                padding: 9px 12px !important;
                margin: 0px;
                color: white;
                font-size: 1em;
            }
            ::slotted(* div.blocklyTreeRow) {
                position: relative;
                height: auto !important;
                line-height: 20px !important;
                padding: 9px 12px !important;
                margin: 0px;
                color: white;
                font-size: 1em;
            }
            div.blocklyTreeRow:hover,
            span.blocklyTreeLabel:hover {
                cursor: pointer;
            }
            ::slotted(* div.blocklyTreeRow:hover),
            ::slotted(* span.blocklyTreeLabel:hover) {
                cursor: pointer;
            }
            span.blocklyTreeIcon {
                width: 0px;
            }
            ::slotted(* span.blocklyTreeIcon) {
                width: 0px;
            }
            div.goog-tree-item {
                border: 0px;
                visibility: hidden;
            }
            ::slotted(* div.goog-tree-item) {
                border: 0px;
                visibility: hidden;
            }
            path.blocklyFlyoutBackground {
                fill: #E8E8E8;
                fill-opacity: 1;
            }
            ::slotted(* path.blocklyFlyoutBackground) {
                fill: #E8E8E8;
                fill-opacity: 1;
            }
            rect.blocklyMainBackground {
                opacity: 0 !important;
            }
            ::slotted(* rect.blocklyMainBackground) {
                opacity: 0 !important;
            }
            .initialDrag, ::slotted(.initialDrag) {
                z-index: 1 !important;
            }
            /*  DUPLICATE OF THE STYLES IN KANO CODE. REMOVE WHEN STYLE IS EXPORTED */
            paper-dialog {
                @apply --layout-horizontal;
                z-index: 10;
                background-color: #fff;
                border-radius: 3px;
                overflow: auto;
                color: #292f35;
                font-family: var(--font-body);
            }
            paper-dialog#dialog>* {
                margin: 0px;
                padding: 18px 24px 12px;
            }
            paper-dialog #dialog-content {
                @apply --layout-flex;
            }
            paper-dialog #badge {
                padding: 12px;
                margin: 6px 28px 6px 4px;
                box-sizing: border-box;
                border-radius: 50%;
                background: #ea0923;
            }
            paper-dialog #badge iron-icon {
                transform: rotate(-9deg);
                --iron-icon-width: 24px;
                --iron-icon-height: 24px;
            }
            paper-dialog#dialog h2,
            paper-dialog#dialog h2 {
                font-family: var(--font-body);
                margin: 0px;
                font-weight: bold;
                color: #000;
            }
            paper-dialog div#buttons {
                padding: 18px 0px 0px;
                @apply --layout-start-justified;
            }
            paper-dialog .buttons button {
                @apply --kano-button;
                border-radius: 3px;
                padding: 12px 22px;
                text-shadow: none;
                font-size: 14px;
                min-height: 32px;
                font-weight: bold;
                min-width: 80px;
                color: #8d8d8d;
                background: #e1e1e1;
            }
            paper-dialog .buttons button:not(:first-of-type) {
                margin-left: 7px;
            }

            input {
                width: 100%;
                box-sizing: border-box;
                background-color: #484d53;
                height: 42px;
                border: 0;
                font-family: 'Bariol',Helvetica,Arial,sans-serif;
                font-size: 14px;
                font-weight: 700;
                line-height: 14px;
                color: #fff;
                padding-left: 8px;
                border-radius: 3px;
            }
            input:focus {
                background-color: #4E575E;
                outline: 0;
                border: 2px solid rgba(255,255,255,.25);
            }

        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
