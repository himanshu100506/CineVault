// TMDB client + normalisers. Ratings stay on TMDB's 0-10 scale (same look as the
// original "IMDb rating" badges); the 5-star widgets use rating / 2.

const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/';
const KEY = (import.meta.env.VITE_TMDB_API_KEY || '').trim();

export const hasApiKey = Boolean(KEY);
export const img = (path, size = 'w342') => (path ? `${IMG}${size}${path}` : null);

async function get(path, params = {}) {
    if (!hasApiKey) throw new Error('MISSING_KEY');
    const url = new URL(BASE + path);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });
    const headers = {};
    if (KEY.length > 40) headers.Authorization = `Bearer ${KEY}`; // v4 read token
    else url.searchParams.set('api_key', KEY); // v3 key
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(res.status === 401 ? 'INVALID_KEY' : `TMDB error ${res.status}`);
    return res.json();
}

// share one request between components (e.g. hero + trending row); failures aren't cached
const memo = new Map();
const cached = (key, fn) => {
    if (!memo.has(key)) {
        memo.set(key, fn().catch((e) => { memo.delete(key); throw e; }));
    }
    return memo.get(key);
};

export function normalize(r, forcedType) {
    const mediaType = forcedType || r.media_type || (r.title ? 'movie' : 'tv');
    const date = r.release_date || r.first_air_date || '';
    return {
        key: `${mediaType}-${r.id}`,
        id: r.id,
        mediaType,
        title: r.title || r.name || 'Untitled',
        year: date ? Number(date.slice(0, 4)) : null,
        releaseDate: date,
        rating: r.vote_average ? Math.round(r.vote_average * 10) / 10 : 0, // 0-10
        votes: r.vote_count || 0,
        poster: img(r.poster_path),
        backdrop: img(r.backdrop_path, 'w1280'),
        overview: r.overview || '',
        genreIds: r.genre_ids || [],
    };
}

const list = (data, type) =>
    (data.results || []).filter((r) => r.media_type !== 'person').map((r) => normalize(r, type));

/* ---------- home sections ---------- */
export const getTrending = () =>
    cached('trending', async () =>
        list(await get('/trending/all/week')).filter((i) => i.mediaType === 'movie' || i.mediaType === 'tv')
    );
export const getHollywood = () =>
    cached('hollywood', async () =>
        list(await get('/discover/movie', { with_original_language: 'en', sort_by: 'popularity.desc', 'vote_count.gte': 300 }), 'movie'));
export const getBollywood = () =>
    cached('bollywood', async () =>
        list(await get('/discover/movie', { with_original_language: 'hi', sort_by: 'popularity.desc', 'vote_count.gte': 50 }), 'movie'));
export const getSeries = () => cached('series', async () => list(await get('/tv/popular'), 'tv'));
export const getTopRated = () => cached('top', async () => list(await get('/movie/top_rated'), 'movie'));

// real catalogue sizes for the hero counters
export const getStats = () =>
    cached('stats', async () => {
        const [m, t, h] = await Promise.all([
            get('/discover/movie'),
            get('/discover/tv'),
            get('/discover/movie', { with_original_language: 'hi' }),
        ]);
        return { movies: m.total_results, series: t.total_results, bollywood: h.total_results };
    });

export const getGenres = (type) => cached(`genres-${type}`, async () => (await get(`/genre/${type}/list`)).genres);

/* ---------- filters + search ---------- */
// [value, label, { movie: tmdbGenreId, tv: tmdbGenreId }] - TV uses different genre ids/names
export const GENRE_OPTIONS = [
    ['action', 'Action', { movie: 28, tv: 10759 }],
    ['drama', 'Drama', { movie: 18, tv: 18 }],
    ['comedy', 'Comedy', { movie: 35, tv: 35 }],
    ['thriller', 'Thriller', { movie: 53, tv: 9648 }],
    ['sci-fi', 'Sci-Fi', { movie: 878, tv: 10765 }],
    ['romance', 'Romance', { movie: 10749 }],
    ['horror', 'Horror', { movie: 27 }],
    ['crime', 'Crime', { movie: 80, tv: 80 }],
    ['adventure', 'Adventure', { movie: 12, tv: 10759 }],
    ['fantasy', 'Fantasy', { movie: 14, tv: 10765 }],
];

export async function browseFilters({ type = 'all', genre = 'all', rating = 'all', page = 1 }) {
    const types = type === 'all' ? ['movie', 'tv'] : [type];
    const opt = GENRE_OPTIONS.find((g) => g[0] === genre);
    const parts = await Promise.all(
        types
            .filter((t) => genre === 'all' || opt?.[2][t])
            .map(async (t) => {
                const data = await get(`/discover/${t}`, {
                    page,
                    sort_by: 'popularity.desc',
                    with_genres: genre === 'all' ? undefined : opt[2][t],
                    'vote_average.gte': rating === 'all' ? undefined : rating,
                    'vote_count.gte': rating === 'all' ? 50 : 200,
                });
                return { items: list(data, t), totalPages: Math.min(data.total_pages, 500) };
            })
    );
    // interleave movies and series so "All Types" shows a mix
    const items = [];
    const longest = Math.max(0, ...parts.map((p) => p.items.length));
    for (let i = 0; i < longest; i++) parts.forEach((p) => p.items[i] && items.push(p.items[i]));
    return { items, page, totalPages: Math.max(1, ...parts.map((p) => p.totalPages)) };
}

export async function search(query, page = 1) {
    const data = await get('/search/multi', { query, page, include_adult: false });
    return { items: list(data), page: data.page, totalPages: Math.min(data.total_pages, 500) };
}

/* ---------- details (modal) ---------- */
export async function getDetails(type, id) {
    const d = await get(`/${type}/${id}`, { append_to_response: 'credits,watch/providers,videos' });
    const base = normalize(d, type);
    const crew = d.credits?.crew || [];
    const directors =
        type === 'movie'
            ? crew.filter((c) => c.job === 'Director').map((c) => c.name)
            : (d.created_by || []).map((c) => c.name);

    const regions = d['watch/providers']?.results || {};
    const region = regions.IN || regions.US;
    const flatrate = region?.flatrate || [];
    const rent = (region?.rent || []).filter((p) => !flatrate.some((f) => f.provider_id === p.provider_id));
    const trailer = (d.videos?.results || []).find((v) => v.site === 'YouTube' && v.type === 'Trailer');

    return {
        ...base,
        poster: img(d.poster_path, 'w500'),
        tagline: d.tagline || '',
        genres: (d.genres || []).map((g) => g.name),
        runtime: type === 'movie' ? d.runtime : d.episode_run_time?.[0],
        seasons: d.number_of_seasons,
        episodes: d.number_of_episodes,
        directors,
        cast: (d.credits?.cast || []).slice(0, 8).map((c) => c.name),
        platforms: [...flatrate, ...rent].map((p) => p.provider_name),
        trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
    };
}
