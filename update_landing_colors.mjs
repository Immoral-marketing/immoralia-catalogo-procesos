import fs from 'fs';
import path from 'path';

const pages = {
  'AcademiasLanding.tsx': '#818cf8',
  'AgenciasLanding.tsx': '#8b5cf6',
  'ConstruccionLanding.tsx': '#f59e0b',
  'EcommerceLanding.tsx': '#f43f5e',
  'GestoriasLanding.tsx': '#0ea5e9',
  'InmobiliariaLanding.tsx': '#10b981',
  'RestauracionLanding.tsx': '#f97316',
  'SaludLanding.tsx': '#ec4899',
  'SportsLanding.tsx': '#06b6d4'
};

Object.entries(pages).forEach(([filename, color]) => {
  const filePath = path.join('src', 'pages', filename);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the ContactForm call
  // We look for n8nHosting={n8nHosting} and add accentColor right after
  const target = 'n8nHosting={n8nHosting}';
  const replacement = `n8nHosting={n8nHosting}\n          accentColor="${color}"`;
  
  if (content.includes(target) && !content.includes(`accentColor="${color}"`)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filename} with color ${color}`);
  } else {
    console.log(`Skipped ${filename} (not found or already updated)`);
  }
});
