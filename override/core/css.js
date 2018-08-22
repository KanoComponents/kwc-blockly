Blockly.Css.CONTENT = Blockly.Css.CONTENT.concat((`
.blocklyWidgetDiv .goog-menu {
    border-radius: 4px !important;
    border: 0px;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.4);
}

.blocklyWidgetDiv .goog-menuitem {
    opacity: 0.6;
    cursor: pointer;
    border: 0px;
    padding: 4px 7em 4px 38px;
}

.blocklyWidgetDiv .blocklyContextMenu .goog-menuitem {
    padding: 4px 7em 4px 28px;
}

.blocklyWidgetDiv .goog-option-selected .goog-menuitem-checkbox, .blocklyWidgetDiv .goog-option-selected .goog-menuitem-icon {
    background: url(/assets/icons/tick.svg) no-repeat 0px 0px !important;
    margin-top: 8px;
    margin-left: 7px;
}

.blocklyWidgetDiv .goog-menuitem-highlight {
    opacity: 0.9;
    background: rgba(0, 0, 0, 0.2);
    padding-top: 4px;
    padding-bottom: 4px;
}

.blocklyWidgetDiv .goog-menuitem-content {
    font: normal 1.5em bariol, Arial !important;
}
`).split('\n'));
