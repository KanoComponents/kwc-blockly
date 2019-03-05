import { assert, fixture } from '@kano/web-tester/helpers.js';
import '../kwc-blockly.js';
import '../blocks.js';

const basic = fixture`
    <kwc-blockly></kwc-blockly>
`;
const shadow = fixture`
    <kwc-blockly shadow-light="0.3"></kwc-blockly>
`;

const BLOCK_ID = 'block';
const SHADOW_ID = 'shadow';

const XML =
`
<xml>
<block id="${BLOCK_ID}" type="math_arithmetic">
<value name="A">
    <shadow id="${SHADOW_ID}" type="math_number"></shadow>
</value>
</block>
</xml>
`;

function getBlockFill(block) {
    let blockRoot = block.getSvgRoot(),
        blockPath = blockRoot.querySelector('.blocklyPath');
    return blockPath.getAttribute('fill');
}

function assertShadowColor(workspace, light) {
    let block = workspace.getBlockById(BLOCK_ID),
        blockFill = getBlockFill(block),
        shadow = workspace.getBlockById(SHADOW_ID),
        shadowFill = getBlockFill(shadow),
        rgb = goog.color.hexToRgb(blockFill),
        lightenedRbg = goog.color.lighten(rgb, light),
        lightenedColor = goog.color.rgbArrayToHex(lightenedRbg);
    assert.equal(shadowFill, lightenedColor);
}

suite('kwc-blockly shadow color', () => {
    test('Use 0.6 by default', () => {
        let element = basic();
        element.loadBlocks(XML);
        let workspace = element.getWorkspace();
        assertShadowColor(workspace, 0.6);
    });

    test('Use workspace defined shadow light', () => {
        let element = shadow();
        element.loadBlocks(XML);
        let workspace = element.getWorkspace();
        assertShadowColor(workspace, 0.3);
    });

    test('Use block defined shadow light', () => {
        let element = shadow();
        Blockly.Blocks.math_number.shadowLight = 0.1;
        element.loadBlocks(XML);
        let workspace = element.getWorkspace();
        assertShadowColor(workspace, 0.1);
    });
});
