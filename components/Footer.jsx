import Gavin from '@assets/gavin_smellson.gif';

export default function Footer() {
  return (
    <footer id="footer" className="container">
      <p><sup>©</sup> {new Date().getFullYear()} | <span id="gavin-smellson-easter-egg">Gavin Smellson <img src={Gavin.src} alt="Gavin Smellson" /></span> | All rights reserved<sup>®</sup></p>
    </footer>
  );
}