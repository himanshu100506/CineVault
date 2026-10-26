export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <a href="#" className="logo"><i className="fas fa-film"></i> CineVault</a>
                        <p>Your ultimate destination for discovering movies and web series from around the world.</p>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#trending">Trending</a></li>
                            <li><a href="#hollywood">Hollywood</a></li>
                            <li><a href="#bollywood">Bollywood</a></li>
                            <li><a href="#webseries">Web Series</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Categories</h4>
                        <ul>
                            <li><a href="#">Action</a></li>
                            <li><a href="#">Drama</a></li>
                            <li><a href="#">Comedy</a></li>
                            <li><a href="#">Thriller</a></li>
                            <li><a href="#">Sci-Fi</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 CineVault. All rights reserved. Made with <i className="fas fa-heart"></i></p>
                    <p className="footer-tmdb">Movie data and ratings provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
                </div>
            </div>
        </footer>
    );
}
