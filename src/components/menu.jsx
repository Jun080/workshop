import * as React from 'react';
import {BrowserRouter as Router, NavLink, Route, Routes} from 'react-router-dom';
import '../cssPages/menu.css';

import imgLogo from '../img/logo.png'
import Homepage from "../pages/homepage.jsx";
import AboutUs from "../pages/aboutUs.jsx";
import ClientAccount from "../pages/clientAccount.jsx";
import Events from "../pages/events.jsx";
import Tournament from "../pages/tournamentList.jsx";
import CorporateAccount from "../pages/corporateAccount.jsx";
import TournamentDetails from "../pages/tournamentDetails.jsx";
import ShowCaseDetails from "../pages/showCaseDetails.jsx";
import MentoringDetails from "../pages/mentoringDetails.jsx";

const Menu = () => {
  return (
      <Router>
          <div className='menu'>
              <NavLink to="/">
                  <img src={imgLogo} alt="logo Hyphen" className='logo-menu'/>
              </NavLink>
              <div className="link d-flex align-items-center">
                  <NavLink to="/qui-sommes-nous" className='underline'>Qui sommes-nous</NavLink>
                  <NavLink to="/evenements" className='underline'>Evenements</NavLink>
                  <NavLink to="/tournois" className='underline'>Tournois</NavLink>
                  <NavLink to="/compte-client" className='btn btn-cassis'>Espace Client</NavLink>
                  <NavLink to="/compte-entreprise" className='btn btn-peach'>Espace Entreprise</NavLink>
              </div>
          </div>

          <div className='routes-menu'>
              <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/tournois/:id" element={<TournamentDetails />} />
                  <Route path="/showcases/:id" element={<ShowCaseDetails />} />
                  <Route path="/mentorings/:id" element={<MentoringDetails />} />
                  <Route path="/qui-sommes-nous" element={<AboutUs />} />
                  <Route path="/compte-client" element={<ClientAccount />} />
                  <Route path="/evenements" element={<Events />} />
                  <Route path="/tournois" element={<Tournament />} />
                  <Route path="/compte-entreprise" element={<CorporateAccount />} />
              </Routes>
          </div>
      </Router>

  );
};

export default Menu;
