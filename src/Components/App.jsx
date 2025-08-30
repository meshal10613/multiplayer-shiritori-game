import React, { useCallback, useState } from "react";
import useCountdown from "../hooks/useCountdown";
import WordInput from "./WordInput";
import passesStructureRules from "../utils/passesStructureRules";
import { isEnglishWord } from "../utils/isEnglishWord";

function App() {
    const playerTime = 10;
    const [players, setPlayers] = useState([
        { name: "Player 1", score: 0 },
        { name: "Player 2", score: 0 },
    ]);
    const [current, setCurrent] = useState(0);
    const [history, setHistory] = useState([]);
    const [lastLetter, setLastLetter] = useState(null);
    const [status, setStatus] = useState("");

    const onExpire = useCallback(() => {
        // penalty current player for timeout
        setPlayers((ps) =>
            ps.map((p, i) => (i === current ? { ...p, score: p.score - 1 } : p))
        );
        setStatus(`${players[current].name} timed out (-1)`);
        setCurrent((c) => 1 - c);
        resetTimer();
    }, [current, players]);

    const { timeLeft, reset: resetTimer } = useCountdown(playerTime, onExpire);

    const handleSubmit = async (input) => {
        const word = input.trim().toLowerCase();
        const structure = passesStructureRules({ word, history, lastLetter });
        if (!structure.ok) {
            // invalid structure, penalize
            setPlayers((ps) =>
                ps.map((p, i) => (i === current ? { ...p, score: p.score - 1 } : p))
            );
            setStatus(`Invalid: ${structure.reason} (-1)`);
            setCurrent((c) => 1 - c);
            resetTimer();
            return;
        }

        const valid = await isEnglishWord(word);
        if (!valid) {
            setPlayers((ps) =>
                ps.map((p, i) => (i === current ? { ...p, score: p.score - 1 } : p))
            );
            setStatus("Not found in dictionary (-1)");
            setCurrent((c) => 1 - c);
            resetTimer();
            return;
        }

        // success
        setHistory((h) => [...h, word]);
        setPlayers((ps) =>
            ps.map((p, i) => (i === current ? { ...p, score: p.score + 1 } : p))
        );
        setLastLetter(word[word.length - 1]);
        setStatus(`Nice! Next must start with '${word[word.length - 1]}'`);
        setCurrent((c) => 1 - c);
        resetTimer();
    };

    return (
    <div className="max-w-3xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-5">
            <img src="./game.png" alt="" className="w-40" />
            <h1 className="text-5xl font-semibold text-center">Shiritori (2-Player)</h1>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3 mb-5">
            <div className="flex items-center justify-between gap-40">
                <p>Turn: {players[current].name}</p>
                <p>Time left: {timeLeft}s</p>
            </div>
            <p>{lastLetter ? `Required start: '${lastLetter}'` : "Any word to start"}</p>
        </div>

        <WordInput 
            onSubmit={handleSubmit} 
            requiredStart={lastLetter} />
        
        <div className="grid grid-cols-2 gap-5 scoreboard border-gray-500 p-3">
            {
                players.map((p, i) => (
                <div key={i} 
                    className={`${i === current ? "active" : ""} flex items-center justify-between border rounded-3xl p-1`}
                >
                    <strong>{p.name}</strong>
                    <span>{p.score}</span>
                </div>
            ))}
        </div>

        <div className="mt-4">
            <div className="grid grid-cols-2 gap-5">
                <ol className="border p-3">
                    {
                        history.map((w, index) => 
                            index % 2 === 0 ? <li key={index}>{w}</li> : null
                        )
                    }
                </ol>
                <ol className="border p-3">
                    {
                        history.map((w, index) => 
                            index % 2 === 1 ? <li key={index}>{w}</li> : null
                        )
                    }
                </ol>
            </div>
        </div>
        <p className="text-center mt-5">{status}</p>
    </div>
    );
}

export default App;
