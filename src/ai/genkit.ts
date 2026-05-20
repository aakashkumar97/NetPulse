import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Check for API key presence and log a helpful warning on the server
if (typeof process !== 'undefined' && !process.env.GOOGLE_GENAI_API_KEY && !process.env.GEMINI_API_KEY) {
  console.warn('⚠️ NETVIGIL AI: Missing Gemini API Key. Please ensure GOOGLE_GENAI_API_KEY or GEMINI_API_KEY is set in your environment variables.');
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
