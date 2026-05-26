import fs from 'fs';
const file = 'src/data/processes.ts';
let data = fs.readFileSync(file, 'utf8');

const prefix = 'export const processes: Process[] = [';
const parts = data.split(prefix);
if (parts.length >= 2) {
  const suffixParts = parts[1].split('\n];\n\nexport const categories');
  let inner = suffixParts[0];

  const blocks = inner.split(/\n  \},\n  \{/);

  let count = 0;
  const newBlocks = blocks.map((block, i) => {
    // block es todo lo que hay dentro de { ... }, excepto las comillas initiales/finales de split if any
    if (!block.includes('customization: {') || !block.includes('demo: {')) {
      let isMissingC = !block.includes('customization: {');
      let isMissingD = !block.includes('demo: {');
      
      let cust = `\n    customization: {\n      options_blocks: [\n        { type: "select", label: "Canal preferido", options: ["WhatsApp", "Email", "Slack"] },\n        { type: "select", label: "Software asociado", options: ["Tu herramienta actual"] }\n      ],\n      free_text_placeholder: "¿Detalles específicos?"\n    },`;
      let demo = `\n    demo: { video_url: "PENDING" },`;
      
      if (isMissingC) {
        if (block.includes('\n    faqs:')) block = block.replace('\n    faqs:', cust + '\n    faqs:');
        else if (block.includes('\n    pasos:')) block = block.replace('\n    pasos:', cust + '\n    pasos:');
        else block += cust;
        count++;
      }
      
      if (isMissingD) {
        if (block.includes('\n    faqs:')) block = block.replace('\n    faqs:', demo + '\n    faqs:');
        else if (block.includes('\n    pasos:')) block = block.replace('\n    pasos:', demo + '\n    pasos:');
        else block += demo;
      }
    }
    return block;
  });

  const newInner = newBlocks.join('\n  },\n  {');
  const newData = parts[0] + prefix + newInner + '\n];\n\nexport const categories' + suffixParts[1];

  fs.writeFileSync(file, newData);
  console.log("Fixed " + count + " process definitions.");
} else {
  console.log("Prefix not found");
}

const jsonFile = 'scripts/extracted_knowledge.json';
if (fs.existsSync(jsonFile)) {
  let js = fs.readFileSync(jsonFile, 'utf8');
  let json = JSON.parse(js);
  json.forEach(item => {
      if (item.content && item.content.includes("## Personalización\nnull\n")) {
          item.content = item.content.replace(/## Personalización\nnull\n/g, "## Personalización\nOpciones estándar instaladas.\n\n");
      }
  });
  fs.writeFileSync(jsonFile, JSON.stringify(json, null, 2));
}
