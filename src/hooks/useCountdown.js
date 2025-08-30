import { useEffect, useRef, useState } from "react";

export default function useCountdown(seconds, onExpire) {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const intervalRef = useRef(null);

    const reset = (newSeconds = seconds) => {
        clearInterval(intervalRef.current);
        setTimeLeft(newSeconds);
        intervalRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(intervalRef.current);
                    onExpire?.();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        reset(seconds);
        return () => clearInterval(intervalRef.current);
    }, []);

    return { timeLeft, reset };
};