import { useAsync } from '../hooks/useAsync.js';
import { getTopRated } from '../api/tmdb.js';
import CardRow from './CardRow.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function TopRated({ onOpen }) {
    const state = useAsync(getTopRated, []);
    return (
        <section className="top-rated-section" id="topRated">
            <div className="container">
                <SectionHeader>
                    <h2 className="section-title"><i className="fas fa-trophy"></i> Top Rated of All Time</h2>
                </SectionHeader>
                <div className="cards-grid"><CardRow state={state} limit={8} skeletons={8} onOpen={onOpen} /></div>
            </div>
        </section>
    );
}
