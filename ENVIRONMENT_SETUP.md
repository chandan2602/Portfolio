# Environment Setup

## Local Development

1. Copy `src/environments/environment.ts` to `src/environments/environment.local.ts`
2. Add your API keys to `environment.local.ts`:
   ```typescript
   export const environment = {
     production: false,
     groqApiKey: 'your-groq-api-key-here',
     apiUrl: 'http://localhost:8000',
   };
   ```
3. Update `angular.json` to use `environment.local.ts` for development

## Production Deployment

For Netlify deployment, set environment variables in Netlify dashboard:
- `GROQ_API_KEY` - Your Groq API key
- `API_URL` - Your backend API URL

The build process will inject these values at build time.
