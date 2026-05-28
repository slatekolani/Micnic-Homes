import { useEffect, useRef, useState } from 'react';

interface Props {
    value: number;
    suffix?: string;
    duration?: number;
}

export default function AnimatedCounter({ value, suffix = '', duration = 1200 }: Props) {
    const ref = useRef<HTMLSpanElement | null>(null);
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.35 },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started) return;

        let frame = 0;
        let animationFrame = 0;
        const totalFrames = Math.max(1, Math.round(duration / 16));

        const tick = () => {
            frame += 1;
            const progress = Math.min(frame / totalFrames, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(value * eased));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(tick);
            }
        };

        animationFrame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationFrame);
    }, [duration, started, value]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}
