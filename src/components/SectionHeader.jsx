import { useEffect, useRef, useState } from 'react';

// fades a header in when it scrolls into view (was initScrollAnimations)
export default function SectionHeader({ children }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible(true),
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return <div ref={ref} className={`section-header fade-in${visible ? ' visible' : ''}`}>{children}</div>;
}
