import fs from 'fs';
import path from 'path';

const directoryPath = 'c:\\Users\\david\\OneDrive\\Desktop\\Dev_immoralia\\immoralia-catalogo-procesos\\scripts\\knowledge\\processes';

async function cleanupMarkdownHeaders() {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        if (path.extname(file) === '.md') {
            const filePath = path.join(directoryPath, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Regex para buscar "(A1)", "(D15)", etc. en la primera línea (header)
            // Buscamos algo parecido a " (X123)" al final de la línea del título
            const cleanedContent = content.replace(/^(# .*?)\s*\([A-Z][0-9]+\)/m, '$1');

            if (content !== cleanedContent) {
                fs.writeFileSync(filePath, cleanedContent, 'utf8');
                console.log(`✓ Limpiado header en: ${file}`);
            }
        }
    }
}

cleanupMarkdownHeaders();
