const fs = require('fs');
const path = require('path');

// Read the template file
const templatePath = path.join(__dirname, '../src/environments/environment.prod.template.ts');
const envPath = path.join(__dirname, '../src/environments/environment.prod.ts');

let content = fs.readFileSync(templatePath, 'utf8');

// Replace placeholder with actual environment variable if it exists
const groqApiKey = process.env.GROQ_API_KEY || '';
if (content.includes('GROQ_API_KEY_PLACEHOLDER')) {
  content = content.replace('GROQ_API_KEY_PLACEHOLDER', groqApiKey);
}

// Write to production environment file
fs.writeFileSync(envPath, content);
console.log('✅ Environment variables injected successfully');
