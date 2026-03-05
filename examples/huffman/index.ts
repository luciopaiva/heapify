/**
 * Huffman coding demo — full encode / decode round-trip.
 *
 * Run with:
 *   npm start
 */
import { buildFrequencyTable, buildHuffmanTree, encode, decode } from "./huffman.ts";

// ---------------------------------------------------------------------------
// Demo text — opening paragraph of Alice in Wonderland (public domain)
// ---------------------------------------------------------------------------
const TEXT = `
En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho
tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua,
rocín flaco y galgo corredor. Una olla de algo más vaca que carnero,
salpicón las más noches, duelos y quebrantos los sábados, lantejas los
viernes, algún palomino de añadidura los domingos, consumían las tres
partes de su hacienda. El resto della concluían sayo de velarte, calzas de
velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de
entresemana se honraba con su vellorí de lo más fino. Tenía en su casa una
ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte,
y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la
podadera. Frisaba la edad de nuestro hidalgo con los cincuenta años; era de
complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo
de la caza. Quieren decir que tenía el sobrenombre de Quijada, o Quesada,
que en esto hay alguna diferencia en los autores que deste caso escriben;
aunque, por conjeturas verosímiles, se deja entender que se llamaba
Quejana. Pero esto importa poco a nuestro cuento; basta que en la narración
dél no se salga un punto de la verdad.";
`.replaceAll(/\s+/gmu, " ").trim();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hr(ch = "─", width = 68): string {
    return ch.repeat(width);
}

function pad(s: string, width: number, right = false): string {
    return right ? s.padStart(width) : s.padEnd(width);
}

function charLabel(ch: string): string {
    if (ch === " ")  return "SPACE";
    if (ch === "\n") return "\\n";
    if (ch === "\t") return "\\t";
    return `'${ch}'`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log(hr("═"));
console.log("  Huffman Coding — powered by heapify MinQueue");
console.log(hr("═"));

// 1. Frequency table --------------------------------------------------------
console.log("\n● SAMPLE TEXT\n");
console.log(`  "${TEXT.slice(0, 72)}…"`);
console.log(`\n  Total characters : ${TEXT.length}`);

const freqs = buildFrequencyTable(TEXT);
console.log(`  Distinct symbols : ${freqs.size}`);

// 2. Build tree -------------------------------------------------------------
console.log("\n● BUILDING HUFFMAN TREE\n");
console.log(`  MinQueue capacity set to ${freqs.size} (one slot per distinct symbol).`);
console.log("  Merging nodes — O(n log n) push/pop interleaved operations…\n");

const startMs = performance.now();
const tree = buildHuffmanTree(freqs);
const buildMs = (performance.now() - startMs).toFixed(3);

console.log(`  Tree built in ${buildMs} ms.`);
console.log(`  Total nodes in tree : ${tree.nodes.length} (${freqs.size} leaves + ${freqs.size - 1} internal)`);

// 3. Code table -------------------------------------------------------------
console.log("\n● CODE TABLE  (sorted by code length, then by character)\n");

const tableRows = [...tree.codes.entries()]
    .sort((a, b) => a[1].length - b[1].length || a[0].localeCompare(b[0]));

const header = `  ${"Symbol".padEnd(8)} ${"Freq".padStart(5)}   ${"Code".padEnd(20)} ${"Bits".padStart(4)}`;
console.log(header);
console.log("  " + hr("-", 44));

for (const [ch, code] of tableRows) {
    const freq = freqs.get(ch)!;
    console.log(
        `  ${pad(charLabel(ch), 8)} ${pad(String(freq), 5, true)}   ${pad(code, 20)} ${pad(String(code.length), 4, true)}`
    );
}

// 4. Encode ----------------------------------------------------------------
console.log("\n● ENCODING\n");

const encoded = encode(TEXT, tree.codes);

const originalBits = TEXT.length * 8;
const compressedBits = encoded.length;
const savings = ((1 - compressedBits / originalBits) * 100).toFixed(1);
const ratio   = (compressedBits / originalBits * 100).toFixed(1);

// Weighted average code length
let weightedAvg = 0;
for (const [ch, code] of tree.codes) {
    const freq = freqs.get(ch)!;
    weightedAvg += (freq / TEXT.length) * code.length;
}

console.log(`  Original  : ${TEXT.length} chars × 8 bits = ${originalBits} bits`);
console.log(`  Encoded   : ${compressedBits} bits`);
console.log(`  Avg code  : ${weightedAvg.toFixed(3)} bits / symbol`);
console.log(`  Ratio     : ${ratio}% of original  →  ${savings}% savings`);

// Show a snippet of the encoded bitstream
console.log(`\n  First 64 encoded bits : ${encoded.slice(0, 64)}`);
console.log(`  (…${compressedBits - 64} more bits)`);

// 5. Decode & verify -------------------------------------------------------
console.log("\n● DECODING\n");

const decoded = decode(encoded, tree.nodes, tree.root);
const ok = decoded === TEXT;

console.log(`  Decoded text matches original: ${ok ? "✓  YES" : "✗  NO — something went wrong!"}`);

if (ok) {
    console.log(`\n  Reconstructed: "${decoded.slice(0, 72)}…"`);
}

console.log("\n" + hr("═") + "\n");

if (!ok) process.exit(1);
