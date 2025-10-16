import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../i18n/LocaleContext';

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-0">
      <div className="brand-bar w-100" />
      <div className="container py-4">
        <div className="row gy-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-upc-scan text-brand"></i>
              <span className="fw-semibold">{t('brand', 'Distributeur')}</span>
            </div>
            <div className="text-secondary small mt-1">© {year} {t('footer.rights')}</div>
          </div>
          <div className="col-12 col-md-6">
            <div className="d-flex justify-content-md-end gap-3 small">
              <Link to="/" className="link-secondary text-decoration-none">{t('nav.home')}</Link>
              <Link to="/dashboard" className="link-secondary text-decoration-none">{t('nav.dashboard')}</Link>
              <Link to="/withdraw" className="link-secondary text-decoration-none">{t('nav.withdraw')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
