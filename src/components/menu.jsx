import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import '../cssPages/menu.css';
import Homepage from '../pages/homepage';
import ClientAccount from '../pages/clientAccount';
import Sponsors from '../pages/sponsors';
import CorporateAccount from '../pages/corporateAccount';

const Menu = () => {
  return (
    <Router>
      <div className='menu d-flex justify-content-between m-5'>
        <Link to="/">Accueil</Link>
        <Link to="/partenaires">Partenaires</Link>
        <Link to="/compte-client">Espace Client</Link>
        <Link to="/compte-entreprise">Espace Entreprise</Link>
      </div>
      

      <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/compte-client" element={<ClientAccount />} />
          <Route path="/partenaires" element={<Sponsors />} />
          <Route path="/compte-entreprise" element={<CorporateAccount />} />
        </Routes>
    </Router>
  );
};

export default Menu;
