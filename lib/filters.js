export const createFilters = (Blockly, options) => {
    const defs = Blockly.utils.createSvgElement('defs', {});
    // Each filter/pattern needs a unique ID for the case of multiple Blockly
    // instances on a page.  Browser behaviour becomes undefined otherwise.
    // https://neil.fraser.name/news/2015/11/01/
    const rnd = String(Math.random()).substring(2);
    /*
      <filter id="blocklyEmbossFilter837493">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
        <feSpecularLighting in="blur" surfaceScale="1" specularConstant="0.5"
                            specularExponent="10" lighting-color="white"
                            result="specOut">
          <fePointLight x="-5000" y="-10000" z="20000" />
        </feSpecularLighting>
        <feComposite in="specOut" in2="SourceAlpha" operator="in"
                     result="specOut" />
        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic"
                     k1="0" k2="1" k3="1" k4="0" />
      </filter>
    */
    const embossFilter = Blockly.utils.createSvgElement('filter',
        { 'id': 'blocklyEmbossFilter' + rnd }, defs);
    Blockly.utils.createSvgElement('feGaussianBlur',
        { 'in': 'SourceAlpha', 'stdDeviation': 1, 'result': 'blur' }, embossFilter);
    const feSpecularLighting = Blockly.utils.createSvgElement('feSpecularLighting',
        {
            'in': 'blur',
            'surfaceScale': 1,
            'specularConstant': 0.5,
            'specularExponent': 10,
            'lighting-color': 'white',
            'result': 'specOut'
        },
        embossFilter);
    Blockly.utils.createSvgElement('fePointLight',
        { 'x': -5000, 'y': -10000, 'z': 20000 }, feSpecularLighting);
    Blockly.utils.createSvgElement('feComposite',
        {
            'in': 'specOut',
            'in2': 'SourceAlpha',
            'operator': 'in',
            'result': 'specOut'
        }, embossFilter);
    Blockly.utils.createSvgElement('feComposite',
        {
            'in': 'SourceGraphic',
            'in2': 'specOut',
            'operator': 'arithmetic',
            'k1': 0,
            'k2': 1,
            'k3': 1,
            'k4': 0
        }, embossFilter);
    /*
      <pattern id="blocklyDisabledPattern837493" patternUnits="userSpaceOnUse"
               width="10" height="10">
        <rect width="10" height="10" fill="#aaa" />
        <path d="M 0 0 L 10 10 M 10 0 L 0 10" stroke="#cc0" />
      </pattern>
    */
    const disabledPattern = Blockly.utils.createSvgElement('pattern',
        {
            'id': 'blocklyDisabledPattern' + rnd,
            'patternUnits': 'userSpaceOnUse',
            'width': 10,
            'height': 10
        }, defs);
    Blockly.utils.createSvgElement('rect',
        { 'width': 10, 'height': 10, 'fill': '#aaa' }, disabledPattern);
    Blockly.utils.createSvgElement('path',
        { 'd': 'M 0 0 L 10 10 M 10 0 L 0 10', 'stroke': '#cc0' }, disabledPattern);

    const gridPattern = Blockly.Grid.createDom(rnd, options.gridOptions, defs);

    return {
        embossFilter,
        disabledPattern,
        gridPattern,
        defs,
    }
};
