const fs = require('fs');
const file = 'src/data/processes.ts';
let data = fs.readFileSync(file, 'utf8');

const regex = /(  \{\r?\n    id: "[\s\S]*?(?=\r?\n  \},|\r?\n  \}\r?\n\]))/g;

let count = 0;
let newData = data.replace(regex, (match) => {
  // Ignorar si no parece un bloque de proceso válido
  if (!match.includes('id:')) return match;
  
  let isMissingCustomization = !match.includes('customization:');
  let isMissingDemo = !match.includes('demo:');
  
  if (!isMissingCustomization && !isMissingDemo) {
    return match; // está bien
  }
  
  count++;
  let newMatch = match;
  
  if (isMissingCustomization) {
    const cust = `\n    customization: {\n      options_blocks: [\n        { type: "select", label: "Canal preferido", options: ["WhatsApp", "Email", "Slack"] },\n        { type: "select", label: "Software asociado", options: ["Tu herramienta actual"] }\n      ],\n      free_text_placeholder: "¿Detalles específicos?"\n    },`;
    
    if (newMatch.includes('\n    faqs:')) {
        newMatch = newMatch.replace('\n    faqs:', cust + '\n    faqs:');
    } else if (newMatch.includes('\n    pasos:')) {
        newMatch = newMatch.replace('\n    pasos:', cust + '\n    pasos:');
    } else {
        newMatch += cust;
    }
  }
  
  if (isMissingDemo) {
    const demo = `\n    demo: { video_url: "PENDING" },`;
    if (newMatch.includes('\n    faqs:')) {
        newMatch = newMatch.replace('\n    faqs:', demo + '\n    faqs:');
    } else if (newMatch.includes('\n    pasos:')) {
        newMatch = newMatch.replace('\n    pasos:', demo + '\n    pasos:');
    } else {
        newMatch += demo;
    }
  }
  
  return newMatch;
});

fs.writeFileSync(file, newData);

const jsonFile = 'scripts/extracted_knowledge.json';
if (fs.existsSync(jsonFile)) {
  let js = fs.readFileSync(jsonFile, 'utf8');
  let json = JSON.parse(js);
  json.forEach(item => {
      // Fix null text explicitly matched in JSON
      if (item.content && item.content.includes("## Personalización\\nnull\\n")) {
          item.content = item.content.replace(/## Personalización\\nnull\\n/g, "## Personalización\\nBloque configurado en UI\\n\\n");
      }
      if (item.content && item.content.includes("## Personalización\nnull\n")) {
          item.content = item.content.replace(/## Personalización\nnull\n/g, "## Personalización\nBloque configurado en UI\n\n");
      }
  });
  fs.writeFileSync(jsonFile, JSON.stringify(json, null, 2));
}

console.log("Fixed " + count + " process definitions.");
