/**
 * Decode an XML list of variables and add the variables to the workspace.
 * @param {!Element} xmlVariables List of XML variable elements.
 * @param {!Blockly.Workspace} workspace The workspace to which the variable
 *     should be added.
 */
Blockly.Xml.domToVariables = function(xmlVariables, workspace) {
    // Create constant to represent `Element.ELEMENT_NODE` for Edge Legacy
    const EL_NODE = Element.ELEMENT_NODE || 1;

    for (var i = 0, xmlChild; xmlChild = xmlVariables.childNodes[i]; i++) {
        if (xmlChild.nodeType != EL_NODE) {
            continue;  // Skip text nodes.
        }

        var type = xmlChild.getAttribute('type');
        var id = xmlChild.getAttribute('id');
        var name = xmlChild.textContent;

        if (type == null) {
            throw Error('Variable with id, ' + id + ' is without a type');
        }

        workspace.createVariable(name, type, id);
    }
};