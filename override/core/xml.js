/**
 * Decode an XML list of variables and add the variables to the workspace.
 * @param {!Element} xmlVariables List of XML variable elements.
 * @param {!Blockly.Workspace} workspace The workspace to which the variable
 *     should be added.
 */
Blockly.Xml.domToVariables = function(xmlVariables, workspace) {
    for (var i = 0, xmlChild; xmlChild = xmlVariables.childNodes[i]; i++) {
        console.log('domToVariables loop enter');
        console.log('xmlChild', xmlChild);
        console.log('nodeType', xmlChild.nodeType);
        console.log('Element', Element);
        console.log('Element node', Element.ELEMENT_NODE);

        const EL_NODE = Element.ELEMENT_NODE || 1;
        console.log('EL_NODE', EL_NODE);

        if (xmlChild.nodeType != EL_NODE) {
            console.log('skip');
            continue;  // Skip text nodes.
        }
        var type = xmlChild.getAttribute('type');
        var id = xmlChild.getAttribute('id');
        var name = xmlChild.textContent;

        console.log('domToVariables loop type, id, name', type, id, name);

        if (type == null) {
            throw Error('Variable with id, ' + id + ' is without a type');
        }
        console.log('domToVariables pre createVariable');
        workspace.createVariable(name, type, id);
    }
};