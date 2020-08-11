/**
 * Decode an XML DOM and create blocks on the workspace.
 * @param {!Element} xml XML DOM.
 * @param {!Blockly.Workspace} workspace The workspace.
 * @return {Array.<string>} An array containing new block IDs.
 */
Blockly.Xml.domToWorkspace = function(xml, workspace) {
    console.log('domToWorkspace xml', xml);
    console.log('domToWorkspace workspace', workspace);
    if (xml instanceof Blockly.Workspace) {
      var swap = xml;
      xml = workspace;
      workspace = swap;
      console.warn('Deprecated call to Blockly.Xml.domToWorkspace, ' +
                   'swap the arguments.');
    }

    var width;  // Not used in LTR.
    if (workspace.RTL) {
      width = workspace.getWidth();
    }
    var newBlockIds = [];  // A list of block IDs added by this call.
    Blockly.Field.startCache();
    // Safari 7.1.3 is known to provide node lists with extra references to
    // children beyond the lists' length.  Trust the length, do not use the
    // looping pattern of checking the index for an object.
    var childCount = xml.childNodes.length;
    var existingGroup = Blockly.Events.getGroup();
    if (!existingGroup) {
      Blockly.Events.setGroup(true);
    }

    // Disable workspace resizes as an optimization.
    if (workspace.setResizesEnabled) {
      workspace.setResizesEnabled(false);
    }
    var variablesFirst = true;
    try {
      for (var i = 0; i < childCount; i++) {
        var xmlChild = xml.childNodes[i];
        var name = xmlChild.nodeName.toLowerCase();
        if (name == 'block' ||
            (name == 'shadow' && !Blockly.Events.recordUndo)) {
          // Allow top-level shadow blocks if recordUndo is disabled since
          // that means an undo is in progress.  Such a block is expected
          // to be moved to a nested destination in the next operation.
          var block = Blockly.Xml.domToBlock(xmlChild, workspace);
          newBlockIds.push(block.id);
          var blockX = xmlChild.hasAttribute('x') ?
              parseInt(xmlChild.getAttribute('x'), 10) : 10;
          var blockY = xmlChild.hasAttribute('y') ?
              parseInt(xmlChild.getAttribute('y'), 10) : 10;
          if (!isNaN(blockX) && !isNaN(blockY)) {
            block.moveBy(workspace.RTL ? width - blockX : blockX, blockY);
          }
          variablesFirst = false;
        } else if (name == 'shadow') {
          throw TypeError('Shadow block cannot be a top-level block.');
        } else if (name == 'comment') {
          if (workspace.rendered) {
            Blockly.WorkspaceCommentSvg.fromXml(xmlChild, workspace, width);
          } else {
            Blockly.WorkspaceComment.fromXml(xmlChild, workspace);
          }
        } else if (name == 'variables') {
          if (variablesFirst) {
            console.log('before domToVariables run');
            console.log('domToWorkspace xmlChild', xmlChild);
            Blockly.Xml.domToVariables(xmlChild, workspace);
          } else {
            throw Error('\'variables\' tag must exist once before block and ' +
                'shadow tag elements in the workspace XML, but it was found in ' +
                'another location.');
          }
          variablesFirst = false;
        }
      }
    } finally {
      if (!existingGroup) {
        Blockly.Events.setGroup(false);
      }
      Blockly.Field.stopCache();
    }
    // Re-enable workspace resizing.
    if (workspace.setResizesEnabled) {
      workspace.setResizesEnabled(true);
    }
    Blockly.Events.fire(new Blockly.Events.FinishedLoading(workspace));
    return newBlockIds;
  };

/**
 * Decode an XML list of variables and add the variables to the workspace.
 * @param {!Element} xmlVariables List of XML variable elements.
 * @param {!Blockly.Workspace} workspace The workspace to which the variable
 *     should be added.
 */
Blockly.Xml.domToVariables = function(xmlVariables, workspace) {
    console.log('domToVariables xmlVariables received', xmlVariables);
    for (var i = 0, xmlChild; xmlChild = xmlVariables.childNodes[i]; i++) {
        console.log('domToVariables loop enter');
        console.log('xmlChild', xmlChild);
        console.log('nodeType', xmlChild.nodeType);
        console.log('Element', Element);
        console.log('Element node', Element.ELEMENT_NODE);

      if (xmlChild.nodeType != Element.ELEMENT_NODE) {
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