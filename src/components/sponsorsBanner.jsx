import * as React from 'react';
import '../cssPages/sponsorsBanner.css';

import accor from "../img/sponsors/accor.png";
import airbnb from "../img/sponsors/airbnb.png";
import alibaba from "../img/sponsors/alibaba.png";
import allianz from "../img/sponsors/allianz.png";
import atos from "../img/sponsors/atos.png";
import bridgestone from "../img/sponsors/bridgestone.png";
import coca from "../img/sponsors/coca.png";
import deloitte from "../img/sponsors/deloitte.png";
import intel from "../img/sponsors/intel.png";
import omega from "../img/sponsors/omega.png";
import p_g from "../img/sponsors/p&g.png";
import panasonic from "../img/sponsors/panasonic.png";
import samsung from "../img/sponsors/samsung.png";
import toyota from "../img/sponsors/toyota.png";
import visa from "../img/sponsors/visa.png";

const SponsorsBanner = () => {
    return (
            <div className='banner-sponsors'>
                <div className='banner-track'>
                    <img src={airbnb} alt="logo airbnb" className='banner-logo'/>
                    <img src={alibaba} alt="logo alibaba" className='banner-logo'/>
                    <img src={allianz} alt="logo allianz" className='banner-logo'/>
                    <img src={atos} alt="logo atos" className='banner-logo'/>
                    <img src={coca} alt="logo coca" className='banner-logo'/>
                    <img src={intel} alt="logo intel" className='banner-logo'/>
                    <img src={omega} alt="logo omega" className='banner-logo'/>
                    <img src={panasonic} alt="logo panasonic" className='banner-logo'/>
                    <img src={samsung} alt="logo samsung" className='banner-logo'/>
                    <img src={toyota} alt="logo toyota" className='banner-logo'/>
                    <img src={visa} alt="logo visa" className='banner-logo'/>
                    <img src={bridgestone} alt="logo bridgestone" className='banner-logo'/>
                    <img src={deloitte} alt="logo deloitte" className='banner-logo'/>
                    <img src={p_g} alt="logo p_g" className='banner-logo'/>
                    <img src={accor} alt="logo accor" className='banner-logo'/>
                </div>
            </div>
    );
};

export default SponsorsBanner;
