import fs from 'fs';

const tsPath = 'src/data/processes.ts';
let tsData = fs.readFileSync(tsPath, 'utf8');

// The ugly block we inserted:
// "Plataforma seleccionada", options: ["WhatsApp", "Herramienta actual", "ERP", "Otro"]
// "¿Detalles específicos?"

const badCustomizationStr = `    customization: {
      options_blocks: [
        { type: "select", label: "Plataforma seleccionada", options: ["WhatsApp", "Herramienta actual", "ERP", "Otro"] }
      ],
      free_text_placeholder: "¿Detalles específicos?"
    },`;

const betterCustomizationStr = `    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack/Teams", "Aún por definir"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },`;

// We also replace single line variants just in case the indentation varied
// We can use a regex that matches the label "Plataforma seleccionada" and replaces the whole customization object

const badBlockRegex = /    customization: \{\s*options_blocks: \[\s*\{ type: "select", label: "Plataforma seleccionada", options: \["WhatsApp", "Herramienta actual", "ERP", "Otro"\] \}\s*\],\s*free_text_placeholder: "¿Detalles específicos\?"\s*\},\n/g;

tsData = tsData.replace(badBlockRegex, betterCustomizationStr + '\n');

// También me aseguro de que no hayan faqs: [] vacíos, aunque React no las renderiza si su longitud es 0, las borro de paso si las hay para mayor limpieza
tsData = tsData.replace(/\s*faqs:\s*\[\s*\],\n/g, '\n');

fs.writeFileSync(tsPath, tsData);

const jsonPath = 'scripts/extracted_knowledge.json';
if (fs.existsSync(jsonPath)) {
  let jsData = fs.readFileSync(jsonPath, 'utf8');
  // actualizamos el texto de la personalización estándar
  jsData = jsData.replace(/Opciones estándar de plataformas activadas en UI./g, 'Opciones de configuración de canales y revisión definidas en UI.');
  fs.writeFileSync(jsonPath, jsData);
}

console.log("Reemplazos de mierda-UI completados.");
