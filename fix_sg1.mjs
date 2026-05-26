import fs from 'fs';
let content = fs.readFileSync('src/data/processes.ts', 'utf8');

const targetName = 'nombre: "Seguimiento del estado de cada expediente",';
const processStart = content.indexOf(targetName);
if (processStart === -1) {
    console.error("No se encontró el proceso");
    process.exit(1);
}

const startBlock = content.lastIndexOf('  {\n    id:', processStart);
const endBlock = content.indexOf('\n  },', processStart);

let block = content.substring(startBlock, endBlock);

let newCustomization = `customization: {
      options_blocks: [
        { type: "select", label: "Tono Inicial", options: ["Amable", "Conciso"] },
        { type: "select", label: "Frecuencia", options: ["Semanal", "Diaria"] },
        { type: "select", label: "Canal Comunicación", options: ["WhatsApp", "Email", "SMS", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Quieres excluir a algún cliente VIP de este proceso?"
    },`;

// Reemplazar la personalización introducida
block = block.replace(/customization: \{[\s\S]*?free_text_placeholder: "[^"]*"\n    \},/, newCustomization);

content = content.substring(0, startBlock) + block + content.substring(endBlock);
fs.writeFileSync('src/data/processes.ts', content);

const slugMatch = block.match(/slug: "([^"]+)"/);
if (slugMatch) {
    const slug = slugMatch[1];
    let js = fs.readFileSync('scripts/extracted_knowledge.json', 'utf8');
    let j = JSON.parse(js);
    let item = j.find(i => i.slug === slug);
    if(item) {
        item.content = item.content.replace(/## Personalización\n[\s\S]*?(?=\n\n## Demo)/, '## Personalización\nSelecciona el Tono Inicial (Amable, Conciso), Frecuencia (Semanal, Diaria) y Canal Comunicación (WhatsApp, Email...). Indica excepciones VIP.\n');
        fs.writeFileSync('scripts/extracted_knowledge.json', JSON.stringify(j, null, 2));
    }
}
console.log("Fix de UI para Seguimiento completado");
