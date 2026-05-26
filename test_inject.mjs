import fs from 'fs';

let mainFile = fs.readFileSync('src/data/processes.ts', 'utf8');
const newProcs = fs.readFileSync('new_processes.ts', 'utf8');

// The new file is: `export const constructorasProcesses = [ ... ];`
// Extract the body inside `[` to `];`
const getItems = (text) => text.substring(text.indexOf('[') + 1, text.lastIndexOf(']'));
const items = getItems(newProcs);

// In main file, we need to find the `];` that closes `export const processes: Process[] = [\n ... \n];`
// Since the file has `export const categories = [ ... ];` below it, we can search for `export const categories` and find the `];` just before it.
const splitToken = 'export const categories = [';
const parts = mainFile.split(splitToken);
if (parts.length === 2) {
  const processesBlock = parts[0];
  const lastBracketIndex = processesBlock.lastIndexOf(']');
  
  if (lastBracketIndex > -1) {
    const before = processesBlock.substring(0, lastBracketIndex);
    const afterBracket = processesBlock.substring(lastBracketIndex);
    
    // Inject components
    const updatedProcessesBlock = before + ',\n' + items + '\n' + afterBracket;
    
    fs.writeFileSync('src/data/processes.ts', updatedProcessesBlock + splitToken + parts[1]);
    console.log('Successfully injected into processes array.');
  } else {
    console.log('Failed to find end of array.');
  }
} else {
  console.log('Failed to find categories block.');
}
