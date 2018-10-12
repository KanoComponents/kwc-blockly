import '../kwc-blockly.js';
import '../blocks.js';

const basic = fixture`
    <kwc-blockly style="height: 400px"></kwc-blockly>
`;


function scroll(node, delta) {
    const event = new CustomEvent('mousewheel');

    event.deltaX = delta.x || 0;
    event.deltaY = delta.y || 0;

    node.dispatchEvent(event);
}

suite('kwc-blockly', () => {
    let element;
    setup(() => {
        element = basic();
    });
    test('instantiating the element works', () => {
        assert(element instanceof customElements.get('kwc-blockly'));
    });

    test('Loads the color of blocks', () => {
        const color = '#fff000';
        const id = 'test_block';
        const workspace = element.getWorkspace();
        Blockly.Blocks.math_number.customColor = color;
        element.loadBlocks(`<xml><block id="${id}" type="math_number"></block></xml>`);
        const block = workspace.getBlockById(id);
        const svgRoot = block.getSvgRoot();
        const svgPath = svgRoot.querySelector('.blocklyPath');
        assert.equal(svgPath.getAttribute('fill'), color);
    });

    test('Scrolls the workspace', () => {
        const workspace = element.getWorkspace();
        const canvas = workspace.getCanvas();
        const prevTransform = canvas.getAttribute('transform');
        scroll(workspace.getParentSvg(), { x: -45, y: 0 });
        assert.notEqual(prevTransform, canvas.getAttribute('transform'));
    });
});

suite('kwc-blockly shadow color', () => {
    let element;
    setup((done) => {
        element = basic();
        element.addEventListener('blockly-ready', () => done());
    });
    test('Uses 0.6 by default', () => {
        const id = 'test01';
        element.loadBlocks(`
<xml>
<block id="${id}" type="math_arithmetic">
<value name="A">
    <shadow type="math_number"></shadow>
</value>
</block>
</xml>
`);
    });
});
