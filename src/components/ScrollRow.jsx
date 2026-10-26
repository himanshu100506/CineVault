import { useAsync } from '../hooks/useAsync.js';
import CardRow from './CardRow.jsx';
import SectionHeader from './SectionHeader.jsx';

// Hollywood / Bollywood / Web Series rows
export default function ScrollRow({ id, title, icon, fetcher, onOpen }) {
    const state = useAsync(fetcher, []);
    return (
        <section className="movies-section" id={id}>
            <div className="container">
                <SectionHeader>
                    <h2 className="section-title"><i className={`fas fa-${icon}`}></i> {title}</h2>
                </SectionHeader>
                <div className="cards-scroll-wrapper">
                    <div className="cards-scroll"><CardRow state={state} onOpen={onOpen} /></div>
                </div>
            </div>
        </section>
    );
}
