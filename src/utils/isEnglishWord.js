export async function isEnglishWord(word) {
    try {
        const res = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
        );
        if (!res.ok) return false;
        const data = await res.json();
        // data is an array with meanings if valid
        return Array.isArray(data) && data.length > 0 && data[0]?.meanings?.length > 0;
    } catch {
        return false;
    }
}
