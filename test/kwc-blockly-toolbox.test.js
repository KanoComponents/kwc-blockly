import { assert, fixture } from '@kano/web-tester/helpers.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import '../kwc-blockly.js';
import '../blocks.js';

const basic = fixture`
    <kwc-blockly style="height: 400px"></kwc-blockly>
`;

suite('kwc-blockly-toolbox', () => {
    let element;
    setup(() => {
        element = basic();
    });
    test('can set the toolbox', () => {
        const toolbox = element.getToolbox();
        element.toolbox = [{
            id: 'test',
            name: 'Test',
            blocks: [{
                id: 'math_number',
            }],
        }];
        flush();
        const categories = toolbox.shadowRoot.querySelectorAll('.category');
        assert.lengthOf(categories, 1);
        assert.equal(categories[0].textContent.trim(), 'Test');
    });
});
