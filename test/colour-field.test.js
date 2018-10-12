import * as interactions from '@polymer/iron-test-helpers/mock-interactions.js';
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
            interactions.down(fieldSvg, { x: 5, y: 5 });
            interactions.up(fieldSvg, { x: 5, y: 5 });
            assert.isNotNull(document.body.querySelector('.blocklyWidgetDiv kwc-color-picker'));
            done();
        }, 100);
    });
});
