import * as React from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import '../cssPages/menu.css';

import imgLogo from '../img/logo.svg'
import Homepage from "../pages/homepage.jsx";
import AboutUs from "../pages/aboutUs.jsx";
import ClientAccount from "../pages/clientAccount.jsx";
import Sponsors from "../pages/sponsors.jsx";
import Tournament from "../pages/tournamentList.jsx";
import CorporateAccount from "../pages/corporateAccount.jsx";
import TournamentDetails from "../pages/tournamentDetails.jsx";

const Menu = () => {
  return (
      <Router>
          <div className='menu'>
              <Link to="/">
                  <img src={imgLogo} alt="logo Hyphen" className='logo-menu'/>
              </Link>
              <div className="link d-flex align-items-center">
                  <Link to="/qui-sommes-nous">Qui sommes-nous</Link>
                  <Link to="/partenaires">Partenaires</Link>
                  <Link to="/tournois">Tournois</Link>
                  <Link to="/compte-client" className='btn btn-cassis'>Espace Client</Link>
                  <Link to="/compte-entreprise" className='btn btn-peach'>Espace Entreprise</Link>
              </div>
          </div>

          <div className='routes-menu'>
              <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/tournois/:id" component={TournamentDetails} />
                  <Route path="/qui-sommes-nous" element={<AboutUs />} />
                  <Route path="/compte-client" element={<ClientAccount />} />
                  <Route path="/partenaires" element={<Sponsors />} />
                  <Route path="/tournois" element={<Tournament />} />
                  <Route path="/compte-entreprise" element={<CorporateAccount />} />
              </Routes>
          </div>
      </Router>

  );
};

export default Menu;
