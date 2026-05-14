import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

function getAIInstance() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY');
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function askGemini(prompt, history, contextData) {
  try {
    const ai = getAIInstance();
    if (!ai) {
      throw new Error('API key not found. Please provide your Gemini API key.');
    }

    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Create system prompt with context
    const systemInstruction = `You are "SpendSmart AI Assistant", a professional financial AI integrated directly into the user's dashboard.
IMPORTANT: You HAVE full access to the user's actual expense data. The data is provided below. DO NOT say you cannot view their data. ALWAYS use the provided context to answer questions about their spending.
You provide concise, actionable financial advice.
Format your responses with clear spacing and bullet points where helpful.
Don't use markdown headers (like # or ##) unless necessary, keep it simple.

Here is the user's current financial context (currency is INR ₹):
- Total Spending: ₹${contextData.stats.total.toFixed(2)}
- Average per Expense: ₹${contextData.stats.average.toFixed(2)}
- Highest Expense: ₹${contextData.stats.highest.toFixed(2)}

Category Breakdown:
${contextData.categoryBreakdown.map(c => `- ${c.category}: ₹${c.amount.toFixed(2)} (${c.percentage.toFixed(1)}%)`).join('\n')}

Recent Expenses (up to 5):
${contextData.recentExpenses.map(e => `- ${e.title}: ₹${e.amount} on ${e.date}`).join('\n')}

Answer the user's query based on this context. Be encouraging and provide budgeting tips when relevant.`;

    const historyText = history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n\n');
    const fullPrompt = `${systemInstruction}\n\n--- PREVIOUS CHAT HISTORY ---\n${historyText}\n\n--- NEW USER QUERY ---\nUser: ${prompt}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error.message.includes('API key not valid')) {
       throw new Error('Invalid Gemini API Key. Please check your key and try again.');
    }
    throw new Error(error.message || 'Failed to get a response from Gemini. Please try again later.');
  }
}

export function saveApiKey(key) {
  localStorage.setItem('GEMINI_API_KEY', key);
  genAI = null; // force re-init
}

export function hasApiKey() {
  return !!(import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY'));
}
