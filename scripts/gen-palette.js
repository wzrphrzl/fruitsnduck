// Generates src/lib/colorpalette.js from the Figma design-token export (DTCG format).
// Run with: npm run palette
// Do NOT edit src/lib/colorpalette.js by hand — change the colors in Figma (FND-CLAUDE),
// re-export the variables to src/lib/fnd-color-palette-75.json, then re-run this.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, '../src/lib/fnd-color-palette-75.json');
const OUT = resolve(here, '../src/lib/colorpalette.js');

// "Yellow-Orange" → "yellowOrange", "dark bright" → "darkBright", "darker 2" → "darker2"
function camelize(name) {
    return name
        .trim()
        .split(/[\s-]+/)
        .map((word, i) =>
            i === 0
                ? word.toLowerCase()
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join('');
}

const tokens = JSON.parse(readFileSync(SRC, 'utf8'));

// Flatten Fnd.<Group>.<Shade> → palette[group][shade] = '#HEX'
const palette = {};
for (const [groupName, shades] of Object.entries(tokens.Fnd)) {
    const group = {};
    for (const [shadeName, token] of Object.entries(shades)) {
        group[camelize(shadeName)] = token.$value.hex.toUpperCase();
    }
    palette[camelize(groupName)] = group;
}

// Pretty-print as a JS module.
const body = Object.entries(palette)
    .map(([group, shades]) => {
        const entries = Object.entries(shades)
            .map(([k, v]) => `        ${k}: '${v}',`)
            .join('\n');
        return `    ${group}: {\n${entries}\n    },`;
    })
    .join('\n');

const output = `// AUTO-GENERATED from src/lib/fnd-color-palette-75.json — DO NOT EDIT BY HAND.
// Source of truth = Figma variables (FND-CLAUDE). Regenerate with: npm run palette
export const palette = {
${body}
};
`;

writeFileSync(OUT, output);
console.log(`✓ src/lib/colorpalette.js generated (${Object.keys(palette).length} color groups)`);
