import fs from 'fs';

const tsPath = 'src/data/processes.ts';
let tsData = fs.readFileSync(tsPath, 'utf8');

const targetStr = '"Email", "WhatsApp", "Slack/Teams", "Aún por definir"';
const replacementStr = '"Email", "WhatsApp", "Slack/Teams", "Otro"';

// Reemplazar globalmente
let updatedCount = 0;
while(tsData.includes(targetStr)) {
    tsData = tsData.replace(targetStr, replacementStr);
    updatedCount++;
}

if (updatedCount > 0) {
    fs.writeFileSync(tsPath, tsData);
    console.log('Reemplazos completados: ' + updatedCount);
} else {
    console.log('No se encontraron coincidencias. Revisa si el texto exacto es diferente.');
}
