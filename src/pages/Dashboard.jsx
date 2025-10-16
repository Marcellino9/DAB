import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSession } from '../session/SessionContext';
import { useLocale } from '../i18n/LocaleContext';
import { formatCurrency } from '../utils/receipt';

export default function Dashboard() {
  const { qrData, balance, changePin, logout } = useSession();
  const nav = useNavigate();
  const { t } = useLocale();
  const [busy, setBusy] = useState(false);

  const openChangePin = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: t('dashboard.changePin'),
      html: `
        <input type="password" id="pin1" class="swal2-input" placeholder="Nouveau PIN" inputmode="numeric" minlength="4" />
        <input type="password" id="pin2" class="swal2-input" placeholder="Confirmer PIN" inputmode="numeric" minlength="4" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: t('login.alerts.cancel'),
      confirmButtonText: t('login.alerts.confirm'),
      preConfirm: () => {
        const pin1 = document.getElementById('pin1').value;
        const pin2 = document.getElementById('pin2').value;
        if (!pin1 || pin1.length < 4) {
          Swal.showValidationMessage('PIN doit contenir au moins 4 chiffres.');
          return false;
        }
        if (pin1 !== pin2) {
          Swal.showValidationMessage('Les PIN ne correspondent pas.');
          return false;
        }
        return [pin1, pin2];
      },
    });
    if (isConfirmed && formValues) {
      changePin(formValues[0]);
      await Swal.fire({ icon: 'success', title: t('dashboard.changePin') + ' ✓', timer: 1000, showConfirmButton: false });
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 880 }}>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h1 className="h4 fw-semibold mb-0">{t('dashboard.hello')}, {qrData?.name || t('confirm.user')}</h1>
          <small className="text-secondary">ID: {qrData?.userId}</small>
        </div>
        <button className="btn btn-link text-danger p-0" onClick={() => { logout(); nav('/'); }}>{t('dashboard.logout')}</button>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <div className="text-secondary small">{t('dashboard.balance')}</div>
          <div className="display-6 fw-bold">{formatCurrency(balance)}</div>

          <div className="row g-2 mt-3">
            <div className="col-12 col-sm-4">
              <Link to="/withdraw" className="btn btn-primary w-100">{t('dashboard.withdraw')}</Link>
            </div>
            <div className="col-12 col-sm-4">
              <button className="btn btn-light w-100" onClick={openChangePin} disabled={busy}>{t('dashboard.changePin')}</button>
            </div>
            <div className="col-12 col-sm-4">
              <button className="btn btn-light w-100" onClick={() => nav(0)}>{t('dashboard.refresh')}</button>
            </div>
          </div>
        </div>
      </div>

      {/* SweetAlert2 remplace la modale pour le changement de PIN */}
    </div>
  );
}
