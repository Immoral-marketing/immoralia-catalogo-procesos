import fs from 'fs';

const tsPath = 'src/data/processes.ts';
let tsData = fs.readFileSync(tsPath, 'utf8');

// Dividimos el array por `  {` y reconstruiremos
let preArray = tsData.split('export const processes: Process[] = [\n')[0];
let postArrayRaw = tsData.split('export const processes: Process[] = [\n')[1];
let postArray = postArrayRaw.split('\n];\n')[1];

let processesRaw = postArrayRaw.split('\n];\n')[0];

let blocks = processesRaw.split('  {\n');
let count = 0;

let newBlocks = blocks.map((block, i) => {
  if (!block.trim() || !block.includes('id:')) return block;
  
  let newBlock = block;
  let isMissingCust = !newBlock.includes('customization:');
  let isMissingDemo = !newBlock.includes('demo:');
  
  if (isMissingCust || isMissingDemo) count++;
  
  if (isMissingCust) {
    const cust = `    customization: {\n      options_blocks: [\n        { type: "select", label: "Plataforma seleccionada", options: ["WhatsApp", "Herramienta actual", "ERP", "Otro"] }\n      ],\n      free_text_placeholder: "¿Detalles específicos?"\n    },\n`;
    
    if (newBlock.includes('    faqs:')) newBlock = newBlock.replace('    faqs:', cust + '    faqs:');
    else if (newBlock.includes('    pasos:')) newBlock = newBlock.replace('    pasos:', cust + '    pasos:');
    else newBlock = newBlock.replace(/\r?\n  \}(,)?$/, '\n' + cust + '  }$1');
  }
  
  if (isMissingDemo) {
    const demo = `    demo: { video_url: "PENDING" },\n`;
    if (newBlock.includes('    faqs:')) newBlock = newBlock.replace('    faqs:', demo + '    faqs:');
    else if (newBlock.includes('    pasos:')) newBlock = newBlock.replace('    pasos:', demo + '    pasos:');
    else newBlock = newBlock.replace(/\r?\n  \}(,)?$/, '\n' + demo + '  }$1');
  }
  
  return newBlock;
});

let newTsData = preArray + 'export const processes: Process[] = [\n' + newBlocks.join('  {\n') + '\n];\n' + postArray;
fs.writeFileSync(tsPath, newTsData);
console.log('Fixed ' + count + ' processes in processes.ts');

const jsonPath = 'scripts/extracted_knowledge.json';
if (fs.existsSync(jsonPath)) {
  let jsonString = fs.readFileSync(jsonPath, 'utf8');
  jsonString = jsonString.replace(/## Personalización\\nnull\\n/g, '## Personalización\\nOpciones estándar activadas.\\n\\n');
  jsonString = jsonString.replace(/## Personalización\nnull\n/g, '## Personalización\nOpciones estándar activadas.\n\n');
  fs.writeFileSync(jsonPath, jsonString);
  console.log('Fixed extracted_knowledge.json');
}
