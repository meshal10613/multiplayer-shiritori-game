export default function passesStructureRules({ word, history, lastLetter }) {
    const w = word.trim().toLowerCase();
    if(w.length < 4){
        return { ok: false, reason: "Minimum 4 letters" };
    }
    if(history.includes(w)){
        return { ok: false, reason: "Already used" };
    }
    if(lastLetter && w[0] !== lastLetter){
        return { ok: false, reason: `Must start with '${lastLetter}'` };
    }
    return { ok: true };
}