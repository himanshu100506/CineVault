import { useState } from 'react';

// value is 0-5, rounded to the nearest half star
export default function Stars({ value = 0, className = '' }) {
    const v = Math.round(Math.max(0, Math.min(5, value)) * 2) / 2;
    return (
        <span className={`stars ${className}`} role="img" aria-label={`${v} out of 5 stars`}>
            <span className="stars-bg">★★★★★</span>
            <span className="stars-fg" style={{ width: `${(v / 5) * 100}%` }}>★★★★★</span>
        </span>
    );
}

// interactive half-star input; clicking the current value clears it
export function RatingInput({ value = 0, onChange }) {
    const [hover, setHover] = useState(null);
    return (
        <div className="rating-input" onMouseLeave={() => setHover(null)}>
            <Stars value={hover ?? value} className="stars-lg" />
            <div className="rating-hit">
                {Array.from({ length: 10 }, (_, i) => {
                    const v = (i + 1) / 2;
                    return (
                        <button
                            key={v} type="button" aria-label={`Rate ${v} stars`}
                            onMouseEnter={() => setHover(v)}
                            onClick={() => onChange(v === value ? 0 : v)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
