/**
 * Call Groq API for AI responses
 */
export async function getGroqCompletion(
  prompt: string,
  apiKey: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ text: string; error?: string }> {
  try {
    const messages = conversationHistory
      ? [...conversationHistory, { role: 'user' as const, content: prompt }]
      : [{ role: 'user' as const, content: prompt }];

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b', // Fast and good quality
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        text: '',
        error: error.error?.message || 'Failed to get AI response',
      };
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || '';

    return { text };
  } catch (error) {
    console.error('Groq API error:', error);
    return {
      text: '',
      error: 'Failed to connect to Groq API',
    };
  }
}

/**
 * Quick grammar/suggestion fix for selected text
 */
export async function fixTextWithAI(
  text: string,
  apiKey: string,
  type: 'grammar' | 'improve'
): Promise<{ text: string; error?: string }> {
  const prompts = {
    grammar: `Fix any grammar, spelling, and punctuation errors in this text. Return ONLY the corrected text, nothing else:\n\n${text}`,
    improve: `Improve this text to make it clearer and more professional. Return ONLY the improved text, nothing else:\n\n${text}`,
  };

  return getGroqCompletion(prompts[type], apiKey);
}
