import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../i18n/LocaleContext';

export default function Navbar() {
  const { locale, switchLocale, t } = useLocale();
  return (
    <nav className="navbar navbar-expand-lg bg-gradient-brand sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-white">
          <i className="bi bi-upc-scan fs-5"></i>
          <span className="fw-semibold">{t('brand', 'Distributeur')}</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link text-white">
                <i className="bi bi-speedometer2 me-1"></i>
                {t('nav.dashboard', 'Tableau de bord')}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/withdraw" className="nav-link text-white">
                <i className="bi bi-cash-coin me-1"></i>
                {t('nav.withdraw', 'Retrait')}
              </Link>
            </li>
            <li className="nav-item dropdown">
              <button className="btn btn-sm btn-light dropdown-toggle ms-lg-2" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-translate me-1"></i>{locale === 'fr' ? 'Français' : 'English'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={() => switchLocale('fr')}>Français</button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => switchLocale('en')}>English</button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
