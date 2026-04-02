import fs from 'fs';

const pages = [
  'AcademiasLanding.tsx', 'AgenciasLanding.tsx', 'ConstruccionLanding.tsx', 
  'EcommerceLanding.tsx', 'GestoriasLanding.tsx', 'InmobiliariaLanding.tsx', 
  'RestauracionLanding.tsx', 'SaludLanding.tsx', 'SportsLanding.tsx'
];

pages.forEach(p => {
  let filepath = 'src/pages/' + p;
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Replace the old block, considering potentially different whitespaces
  const oldStr = `  const handleSolicitarOferta = () => {
    setPendingContact(true);
    setShowOnboarding(true);
  };`;
  
  const newStr = `  const handleSolicitarOferta = () => {
    setShowContactForm(true);
  };`;

  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(filepath, content);
    console.log(`Updated ${p}`);
  } else {
    console.log(`Warning: ${p} did not match the expected string.`);
  }
});
