import fs from 'fs';

const tsPath = 'src/data/processes.ts';
let tsData = fs.readFileSync(tsPath, 'utf8');

const targetStr = '"Email", "WhatsApp", "Slack/Teams", "Otro"';
const replacementStr = '"Email", "WhatsApp", "Slack", "Teams", "Otro"';

let updatedCount = 0;
while(tsData.includes(targetStr)) {
    tsData = tsData.replace(targetStr, replacementStr);
    updatedCount++;
}

if (updatedCount > 0) {
    fs.writeFileSync(tsPath, tsData);
    console.log('Reemplazos de Slack/Teams completados: ' + updatedCount);
} else {
    console.log('No se encontraron coincidencias.');
}
