export default function passesStructureRules({ word, history, lastLetter }) {
    const w = word.trim().toLowerCase();
    // Check the word total letter is minimub 4 or not
    if(w.length < 4){
        return { ok: false, reason: "Minimum 4 letters" };
    }
    // Check that the word is previously used or not
    if(history.includes(w)){
        return { ok: false, reason: "Already used" };
    }
    // Check that the word first letter is the previous word last letter or not
    if(lastLetter && w[0] !== lastLetter){
        return { ok: false, reason: `Must start with '${lastLetter}'` };
    }
    return { ok: true };
}