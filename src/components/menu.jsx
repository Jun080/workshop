import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import '../cssPages/menu.css';
import Homepage from '../pages/homepage';
import ClientAccount from '../pages/clientAccount';
import CorporateAccount from '../pages/corporateAccount';

const Menu = () => {
  return (
    <Router>
      <div className='menu'>
        <Link to="/">Accueil</Link>
        <Link to="/compte-client">Espace Client</Link>
        <Link to="/compte-entreprise">Espace Entreprise</Link>

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/compte-client" element={<ClientAccount />} />
          <Route path="/compte-entreprise" element={<CorporateAccount />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Menu;
