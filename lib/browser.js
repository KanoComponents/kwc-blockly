const legacyEdgeOrIE = !('reversed' in document.createElement('ol'));

// eslint-disable-next-line import/prefer-default-export
export function isLegacyEdge() {
    return legacyEdgeOrIE;
}
