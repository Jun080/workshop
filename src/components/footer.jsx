import React from 'react';
import '../cssPages/footer.css'
import imgLogo from "../img/logo.png";
import logoJO from "../img/logo-jo.svg";
import iconInsta from "../img/instagram.svg";
import iconTwitch from "../img/twitch.svg";

const Footer = ({ label, url }) => {

    return (
        <div className='footer'>
            <div className='footer-inner'>
                <div>
                    <img src={imgLogo} alt="logo Hyphen" className='logo-footer'/>
                    <div className='social-media'>
                        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><img src={iconInsta} alt="icon Instagram" className='icon-social-media'/></a>
                        <a href="https://www.twitch.tv/" target="_blank" rel="noreferrer"><img src={iconTwitch} alt="icon twitch" className='icon-social-media'/></a>
                        <a href="https://olympics.com/fr/paris-2024" target="_blank" rel="noreferrer"><img src={logoJO} alt="logo jeux olympiques" className='icon-jo'/></a>
                    </div>
                    <div className='social-media'>

                    </div>
                </div>
                <div className='link'>
                    <a href="/">Accueil</a>
                    <a href="/qui-sommes-nous">Qui somme-nous</a>
                    <a href="/evenements">Evenements</a>
                    <a href="/tournois">Tournois</a>
                </div>
                <div>
                <a href="/compte-client" className="btn btn-cassis">Compte client</a>
                <a href="/compte-entreprise" className="btn btn-peach">Compte entreprise</a>
                </div>
            </div>
        </div>
    );
};

export default Footer;