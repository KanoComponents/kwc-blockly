import { assert, fixture } from '@kano/web-tester/helpers.js';
import * as interactions from '@polymer/iron-test-helpers/mock-interactions.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import '../kwc-blockly.js';
import '../blocks.js';

const basic = fixture`
    <kwc-blockly style="height: 400px"></kwc-blockly>
`;

function isHidden(el) {
    return (el.offsetParent === null);
}

function omniboxInput(omnibox, value) {
    omnibox.$.input.value = value;
    omnibox.$.input.dispatchEvent(new Event('input'));
    omnibox._resultDebouncer.flush();
    flush();
}

function omniboxClickResult(omnibox, index) {
    const results = [...omnibox.shadowRoot.querySelectorAll('.result')];
    const result = results[index];
    interactions.click(result);
}

function assertAddedBlockWithValue(workspace, type, field, value) {
    const blocks = workspace.getAllBlocks();
    assert.lengthOf(blocks, 1);
    const [firstBlock] = blocks;
    assert.equal(firstBlock.type, type);
    assert.equal(firstBlock.getFieldValue(field), value);
}

suite('kwc-blockly-omnibox', () => {
    let element;
    setup(() => {
        element = basic();
    });
    test('can open the omnibox', () => {
        element.toolbox = [{
            id: 'test',
            name: 'Test',
            blocks: [{
                id: 'math_number',
            }],
        }];
        const { omnibox } = element.$;
        assert(isHidden(omnibox));
        element._openOmnibox();
        assert(!isHidden(omnibox));
    });
    test('focuses the input when opened', () => {
        element.toolbox = [{
            id: 'test',
            name: 'Test',
            blocks: [{
                id: 'math_number',
            }],
        }];
        const { omnibox } = element.$;
        element._openOmnibox();
        assert.equal(element.shadowRoot.activeElement, omnibox);
        assert.equal(omnibox.shadowRoot.activeElement, omnibox.$.input);
    });
    test('can add number block', () => {
        element.toolbox = [{
            id: 'test',
            name: 'Test',
            blocks: [{
                id: 'math_number',
            }],
        }];
        const injectedValue = Math.floor(Math.random() * 1000);
        const { omnibox } = element.$;
        element._openOmnibox();
        omniboxInput(omnibox, injectedValue);
        const results = [...omnibox.shadowRoot.querySelectorAll('.result')];
        assert.lengthOf(results, 1);
        const [firstResult] = results;
        assert(firstResult.classList.contains('selected'));
        interactions.click(firstResult);
        const workspace = element.getWorkspace();
        assertAddedBlockWithValue(workspace, 'math_number', 'NUM', injectedValue);
    });
    test('can add colour block', () => {
        element.toolbox = [{
            id: 'test',
            name: 'Test',
            blocks: [{
                id: 'colour_picker',
            }],
        }];
        const { omnibox } = element.$;
        element._openOmnibox();
        omniboxInput(omnibox, '#ff00ff');
        omniboxClickResult(omnibox, 0);
        const workspace = element.getWorkspace();
        assertAddedBlockWithValue(workspace, 'colour_picker', 'COLOUR', '#ff00ff');
    });
});
