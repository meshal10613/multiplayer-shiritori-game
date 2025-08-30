import { useState } from "react";

export default function WordInput({ onSubmit, requiredStart }) {
    const [value, setValue] = useState("");

    const submit = (e) => {
        e.preventDefault();
        onSubmit(value);
        setValue("");
    };

    return (
        <form onSubmit={submit} className="flex items-center justify-center mb-10 join">
            <input
                autoFocus
                placeholder={requiredStart ? `Start with '${requiredStart}'` : "Type a word"}
                value={value}
                className="input join-item rounded-tl-3xl rounded-bl-3xl border-r-0"
                onChange={(e) => setValue(e.target.value)}
            />
            <button type="submit" className="btn w-20 join-item bg-indigo-500 text-white rounded-tr-3xl rounded-br-3xl">Play</button>
        </form>
    );
}
