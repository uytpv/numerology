import * as fs from 'fs';
import { cleanAndFormatText } from './cleanTextHelper';

const kb = JSON.parse(fs.readFileSync('c:/Users/UY/works/numerology/backend/src/ai/knowledge/knowledge_base_252.json', 'utf8'));
const raw = kb['life_path_11'].full_description;
console.log('=== BEFORE ===\n', raw.slice(0, 400));
console.log('\n=== AFTER ===\n', cleanAndFormatText(raw));
