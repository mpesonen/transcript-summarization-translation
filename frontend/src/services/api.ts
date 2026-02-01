export async function summarizeText(text: string): Promise<string> {
    const response = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.summarized_text;
}