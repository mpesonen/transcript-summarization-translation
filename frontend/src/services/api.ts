// API base URL - uses environment variable at build time, falls back to relative path for production
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function summarizeText(text: string, targetLanguage: string | null, tonality: string | null, styling: string | null, modelProvider: string | null): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            text: text, 
            target_language: targetLanguage, 
            tonality: tonality, 
            styling: styling,
            model: modelProvider
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.summarized_text;
}