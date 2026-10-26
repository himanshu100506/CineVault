import { useRef, useState } from 'react';
import { useAsync } from '../hooks/useAsync.js';
import { getTrending } from '../api/tmdb.js';
import CardRow from './CardRow.jsx';
import SectionHeader from './SectionHeader.jsx';

const CARD_WIDTH = 235;

export default function Trending({ onOpen }) {
    const state = useAsync(getTrending, []);
    const carouselRef = useRef(null);
    const [position, setPosition] = useState(0);

    const next = () => {
        const el = carouselRef.current;
        if (!el) return;
        const maxScroll = Math.max(0, el.scrollWidth - el.parentElement.offsetWidth);
        setPosition((p) => Math.min(p + CARD_WIDTH * 3, maxScroll));
    };
    const prev = () => setPosition((p) => Math.max(p - CARD_WIDTH * 3, 0));

    return (
        <section className="trending-section" id="trending">
            <div className="container">
                <SectionHeader>
                    <h2 className="section-title"><i className="fas fa-fire"></i> Trending Now</h2>
                    <div className="carousel-controls">
                        <button className="carousel-btn prev" onClick={prev}><i className="fas fa-chevron-left"></i></button>
                        <button className="carousel-btn next" onClick={next}><i className="fas fa-chevron-right"></i></button>
                    </div>
                </SectionHeader>
                <div className="carousel-wrapper">
                    <div className="carousel" ref={carouselRef} style={{ transform: `translateX(-${position}px)` }}>
                        <CardRow state={state} limit={15} onOpen={onOpen} />
                    </div>
                </div>
            </div>
        </section>
    );
}
