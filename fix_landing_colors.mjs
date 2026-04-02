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
  let changed = false;

  // 1. Update ContactForm
  // Original:
  // <ContactForm 
  //   isOpen={showContactForm}
  //   onClose={() => setShowContactForm(false)}
  //   selectedProcesses={selectedProcesses}
  //   n8nHosting={n8nHosting}
  // />
  const cfTarget = 'n8nHosting={n8nHosting}';
  if (content.includes(cfTarget) && !content.includes(`accentColor="${color}"`) && content.includes('<ContactForm')) {
    content = content.replace(cfTarget, `n8nHosting={n8nHosting}\n          accentColor="${color}"`);
    changed = true;
  }

  // 2. Update LeadCaptureModal and OnboardingModal (they often have default #8b5cf6)
  // We seek for accentColor="#8b5cf6" and replace it with the specific one for that page
  // But ONLY if it's NOT AgenciasLanding (which IS #8b5cf6)
  if (color !== '#8b5cf6') {
     const defaultColorStr = 'accentColor="#8b5cf6"';
     if (content.includes(defaultColorStr)) {
       // Replace all occurrences of the default color with the page-specific color
       content = content.split(defaultColorStr).join(`accentColor="${color}"`);
       changed = true;
     }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Successfully updated ${filename}`);
  } else {
    console.log(`No changes needed for ${filename}`);
  }
});
