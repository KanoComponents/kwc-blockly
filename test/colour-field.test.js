import '../kwc-blockly.js';
import '../blocks.js';

const basic = fixture`
    <kwc-blockly style="height: 400px"></kwc-blockly>
`;

suite('ColourField', () => {
    let element;
    setup(() => {
        element = basic();
    });
    test('uses kwc-color-picker', (done) => {
        const id = 'test_id';
        const workspace = element.getWorkspace();
        element.loadBlocks(`<xml><block type="colour_picker" id="${id}"></block></xml>`);
        const svgRoot = workspace.getBlockById(id).getSvgRoot();

        const fieldSvg = svgRoot.querySelector('.blocklyEditableText');

        setTimeout(() => {
            fieldSvg.dispatchEvent(new PointerEvent('pointerdown', {
                pointerId: 1,
                bubbles: true,
                cancelable: true,
                pointerType: 'mouse',
                clientX: 1,
                clientY: 1,
            }));
            fieldSvg.dispatchEvent(new PointerEvent('pointerup', {
                pointerId: 1,
                bubbles: true,
                cancelable: true,
                pointerType: 'mouse',
                clientX: 1,
                clientY: 1,
            }));
            assert.isNotNull(document.body.querySelector('.blocklyWidgetDiv kwc-color-picker'));
            done();
        }, 100);
    });
});
