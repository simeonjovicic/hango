import { useEffect, useRef, useState } from "react";

const JumpScare = () => {
    const [visible, setVisible] = useState(false);
    const audioRef = useRef(null);
    const firedRef = useRef(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (firedRef.current) return;
            firedRef.current = true;
            setVisible(true);
            const audio = audioRef.current;
            if (audio) {
                audio.volume = 1;
                audio.currentTime = 0;
                audio.play().catch(() => {});
            }
        }, 20000);

        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        setVisible(false);
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    };

    return (
        <>
            <audio ref={audioRef} src="/portfolio/hilfe.mp3" preload="auto" />
            {visible && (
                <div
                    onClick={dismiss}
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center cursor-pointer"
                    aria-hidden="true"
                >
                    <img
                        src="/portfolio/funnysham.jpeg"
                        alt=""
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                </div>
            )}
        </>
    );
};

export default JumpScare;
