export async function summarizeText(text: string, targetLanguage: string | null, tonality: string | null, styling: string | null): Promise<string> {
    const response = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            text: text, 
            target_language: targetLanguage, 
            tonality: tonality, 
            styling: styling 
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.summarized_text;
}