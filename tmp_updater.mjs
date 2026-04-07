import fs from 'fs';
const file = 'src/data/processes.ts';
let data = fs.readFileSync(file, 'utf8');

// Match cada bloque interno `{ id: "... ", ... }` separando por `  },` o `  }\n]`
const regex = /  \{\r?\n    id: "[\s\S]*?(?=\r?\n  \},\{0,1}\r?\n|\r?\n  \}\r?\n\])/g;

let count = 0;
const newData = data.replace(regex, (match) => {
  let isMissingCustomization = !match.includes('customization:');
  let isMissingDemo = !match.includes('demo:');
  
  if (!isMissingCustomization && !isMissingDemo) {
    return match;
  }
  
  count++;
  let newMatch = match;
  
  if (isMissingCustomization) {
    const cust = `\n    customization: {\n      options_blocks: [\n        { type: "select", label: "Canal principal", options: ["WhatsApp", "Email", "Slack", "Tu vía de comunicación preferida"] },\n        { type: "select", label: "Software asociado", options: ["ERP", "CRM", "Hojas de cálculo", "Otro"] }\n      ],\n      free_text_placeholder: "¿Hay algún requerimiento o herramienta específica que debamos considerar?"\n    },`;
    if (newMatch.includes('    faqs:')) newMatch = newMatch.replace('    faqs:', cust.trimStart() + '\n    faqs:');
    else if (newMatch.includes('    pasos:')) newMatch = newMatch.replace('    pasos:', cust.trimStart() + '\n    pasos:');
    else newMatch += cust;
  }
  
  if (isMissingDemo) {
    const demo = `\n    demo: { video_url: "PENDING" },`;
    if (newMatch.includes('    faqs:')) newMatch = newMatch.replace('    faqs:', demo.trimStart() + '\n    faqs:');
    else if (newMatch.includes('    pasos:')) newMatch = newMatch.replace('    pasos:', demo.trimStart() + '\n    pasos:');
    else newMatch += demo;
  }
  
  return newMatch;
});

fs.writeFileSync(file, newData);

// check JSON
const jsonFile = 'scripts/extracted_knowledge.json';
if (fs.existsSync(jsonFile)) {
  let json = fs.readFileSync(jsonFile, 'utf8');
  json = json.replace(/## Personalización\r?\n(null)?\r?\n/g, '## Personalización\nOpciones de configuración de plataformas estándar habilitadas en UI.\n\n');
  fs.writeFileSync(jsonFile, json);
}

console.log("Fixed " + count + " process definitions.");
