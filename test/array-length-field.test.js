import { assert, fixture } from '@kano/web-tester/helpers.js';
import '../kwc-blockly.js';
import '../blocks.js';

const basic = fixture`
    <kwc-blockly style="height: 400px"></kwc-blockly>
`;


suite('FieldArrayLength', () => {
    let element;
    setup(() => {
        element = basic();
    });
    test('updates the number of items using the UI', (done) => {
        const id = 'test_id';
        const workspace = element.getWorkspace();
        element.loadBlocks(`<xml><block type="lists_create_with" id="${id}"></block></xml>`);
        const block = workspace.getBlockById(id);
        const svgRoot = block.getSvgRoot();

        const prevItems = block.itemCount_;

        assert.equal(prevItems, 3);

        const fieldSvg = svgRoot.querySelector('.blocklyConfigInput');

        setTimeout(() => {
            fieldSvg.dispatchEvent(new Event('pointerdown'));

            const input = document.body.querySelector('.blocklyWidgetDiv kwc-blockly-array-length');
            input.set('value', 7);

            assert.equal(block.itemCount_, 7);
            done();
        }, 100);
    });

    test('loads the mutation into the UI', (done) => {
        const id = 'test_id';
        const workspace = element.getWorkspace();
        element.loadBlocks(`<xml><block type="lists_create_with" id="${id}"><mutation items="7"></mutation></block></xml>`);
        const block = workspace.getBlockById(id);
        const svgRoot = block.getSvgRoot();

        const fieldSvg = svgRoot.querySelector('.blocklyConfigInput');

        
        setTimeout(() => {
            fieldSvg.dispatchEvent(new Event('pointerdown'));
            const input = document.body.querySelector('.blocklyWidgetDiv kwc-blockly-array-length');
            assert.equal(block.itemCount_, 7);
            assert.equal(input.get('value'), 7);
            done();
        }, 100);
    });
});
