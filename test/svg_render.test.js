import '../kwc-blockly.js';

const basic = fixture`
    <kwc-blockly style="height: 400px;"></kwc-blockly>
`;

const COLOR = '#ff00ff';

Blockly.Blocks.svg_render_01 = {
    init() {
        const json = {
            id: 'svg_render_01',
            colour: COLOR,
            message0: 'Block type 1 %1 %2',
            args0: [
                {
                    type: 'input_dummy',
                },
                {
                    type: 'input_statement',
                    name: 'DO',
                }],
            previousStatement: null,
            nextStatement: null,
        };
        this.jsonInit(json);
    },
};
Blockly.Blocks.svg_render_02 = {
    init() {
        const json = {
            id: 'svg_render_02',
            message0: 'Block type 2',
            colour: COLOR,
            nextStatement: null,
        };
        this.jsonInit(json);
    },
};
Blockly.Blocks.svg_render_03 = {
    init() {
        const json = {
            id: 'svg_render_03',
            message0: 'Block type 3',
            colour: COLOR,
            previousStatement: null,
            nextStatement: null,
        };
        this.jsonInit(json);
    },
};

Blockly.Blocks.svg_render_04 = {
    init() {
        const json = {
            id: 'svg_render_04',
            message0: 'Block type 4 %1',
            args0: [{
                type: 'input_value',
                name: 'INPUT0',
            }],
            colour: COLOR,
            previousStatement: null,
            nextStatement: null,
        };
        this.jsonInit(json);
    },
};

Blockly.Blocks.svg_render_05 = {
    init() {
        const json = {
            id: 'svg_render_05',
            message0: 'Block type 4 %1 Extra text',
            args0: [{
                type: 'input_value',
                name: 'INPUT0',
            }],
            colour: COLOR,
            previousStatement: null,
            nextStatement: null,
        };
        this.jsonInit(json);
    },
};

Blockly.Blocks.svg_render_06 = {
    init() {
        const json = {
            id: 'svg_render_05',
            message0: 'Block type 4 %1 %2',
            args0: [{
                type: 'input_value',
                name: 'INPUT0',
            }, {
                type: 'input_value',
                name: 'INPUT1',
            }],
            colour: COLOR,
            previousStatement: null,
            nextStatement: null,
        };
        this.jsonInit(json);
    },
};

suite('kwc-blockly rendering', () => {
    test('Empty statement', () => {
        const element = basic();
        const topId = 'top_block';
        const bottomId = 'bottom_block';
        element.loadBlocks(`<xml><block id="${topId}" type="svg_render_01"><next><block id="${bottomId}" type="svg_render_01"></block></next></xml>`);
        const workspace = element.getWorkspace();
        const bottomBlock = workspace.getBlockById(bottomId);
        const bottomRoot = bottomBlock.getSvgRoot();
        const bottomTransform = bottomRoot.getAttribute('transform');
        assert.equal(bottomTransform, 'translate(0,88)');
    });

    test('Statement with block', () => {
        const element = basic();
        const topId = 'top_block';
        const bottomId = 'bottom_block';
        element.loadBlocks(`<xml><block id="${topId}" type="svg_render_01"><value name="DO"><block id="${bottomId}" type="svg_render_01"></block></value></xml>`);
        const workspace = element.getWorkspace();
        const bottomBlock = workspace.getBlockById(bottomId);
        const bottomRoot = bottomBlock.getSvgRoot();
        const bottomTransform = bottomRoot.getAttribute('transform');
        assert.equal(bottomTransform, 'translate(6,36)');
    });

    test('Previous/Next statement', () => {
        const element = basic();
        const topId = 'top_block';
        const bottomId = 'bottom_block';
        element.loadBlocks(`
<xml>
<block type="svg_render_02" id="${topId}">
<next>
    <block type="svg_render_03" id="${bottomId}"></block>
</next>
</block>
</xml>
`);
        const workspace = element.getWorkspace();
        const bottomBlock = workspace.getBlockById(bottomId);
        const bottomRoot = bottomBlock.getSvgRoot();
        const bottomTransform = bottomRoot.getAttribute('transform');
        assert.equal(bottomTransform, 'translate(0,35)');
    });

    test('Previous/Next statement with input', () => {
        const element = basic();
        const topId = 'top_block';
        const bottomId = 'bottom_block';
        element.loadBlocks(`
<xml>
<block type="svg_render_04" id="${topId}">
<next>
    <block type="svg_render_03" id="${bottomId}"></block>
</next>
</block>
</xml>
`);
        const workspace = element.getWorkspace();
        const bottomBlock = workspace.getBlockById(bottomId);
        const bottomRoot = bottomBlock.getSvgRoot();
        const bottomTransform = bottomRoot.getAttribute('transform');
        assert.equal(bottomTransform, 'translate(0,35)');
    });

    test('Previous/Next statement with input and extra text', () => {
        const element = basic();
        const topId = 'top_block';
        const bottomId = 'bottom_block';
        element.loadBlocks(`
<xml>
<block type="svg_render_05" id="${topId}">
<next>
    <block type="svg_render_05" id="${bottomId}"></block>
</next>
</block>
</xml>
`);
        const workspace = element.getWorkspace();
        const bottomBlock = workspace.getBlockById(bottomId);
        const bottomRoot = bottomBlock.getSvgRoot();
        const bottomTransform = bottomRoot.getAttribute('transform');
        assert.equal(bottomTransform, 'translate(0,46)');
    });

    test('Inline inputs report the right height', () => {
        const element = basic();
        const topId = 'top_block';
        element.loadBlocks(`
<xml>
<block type="svg_render_06" x="0" y="400" id="${topId}">
<value name="INPUT0">
    <shadow type="math_arithmetic"></shadow>
</value>
<value name="INPUT1">
    <shadow type="math_arithmetic"></shadow>
</value>
</block>
</xml>
`);
        const workspace = element.getWorkspace();
        const topBlock = workspace.getBlockById(topId);
        const topRoot = topBlock.getSvgRoot();
        const topPath = topRoot.querySelector('.blocklyPath');
        const topBBox = topPath.getBBox();
        assert.equal(Math.floor(topBBox.height), 96);
    });
});
