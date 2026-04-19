const fs = require('fs');
const path = require('path');

// Read the environment file
const envPath = path.join(__dirname, '../src/environments/environment.prod.ts');
let content = fs.readFileSync(envPath, 'utf8');

// Replace placeholder with actual environment variable
const groqApiKey = process.env.GROQ_API_KEY || '';
content = content.replace('GROQ_API_KEY_PLACEHOLDER', groqApiKey);

// Write back
fs.writeFileSync(envPath, content);
console.log('✅ Environment variables injected successfully');
