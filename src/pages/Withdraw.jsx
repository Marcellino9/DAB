import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PageHeader from '../components/PageHeader';
import { useLocale } from '../i18n/LocaleContext';
import { useSession } from '../session/SessionContext';
import { formatCurrency } from '../utils/receipt';

const DENOMS = [10000, 5000, 2000, 1000, 500];

export default function Withdraw() {
  const nav = useNavigate();
  const { balance, setPendingWithdrawal } = useSession();
  const { t } = useLocale();
  const [amount, setAmount] = useState(0);
  const [customMode, setCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [bills, setBills] = useState(() => Object.fromEntries(DENOMS.map((d) => [d, 0])));
  const [error, setError] = useState('');

  // Helper to compute sum of bills
  const billsSum = useMemo(() => {
    return DENOMS.reduce((acc, d) => acc + d * (bills[d] || 0), 0);
  }, [bills]);

  useEffect(() => {
    setError('');
  }, [amount, billsSum]);

  const presetAmounts = [5000, 10000, 20000, 50000, 100000];

  const onPickAmount = (v) => {
    setAmount(v);
    setCustomMode(false);
    setCustomInput('');
  };

  const onCustomConfirm = () => {
    const v = Number(customInput);
    if (!Number.isFinite(v) || v <= 0) {
      setError(t('withdraw.alerts.invalidAmount'));
      Swal.fire({ icon: 'error', title: t('withdraw.alerts.invalidAmount'), text: t('withdraw.alerts.invalidAmountText') });
      return;
    }
    if (v % 500 !== 0) {
      setError(t('withdraw.alerts.ruleText'));
      Swal.fire({ icon: 'warning', title: t('withdraw.alerts.ruleTitle'), text: t('withdraw.alerts.ruleText') });
      return;
    }
    setAmount(v);
  };

  const incBill = (d) => setBills((prev) => ({ ...prev, [d]: (prev[d] || 0) + 1 }));
  const decBill = (d) => setBills((prev) => ({ ...prev, [d]: Math.max(0, (prev[d] || 0) - 1) }));
  const resetBills = () => setBills(Object.fromEntries(DENOMS.map((d) => [d, 0])));

  const autoDistribute = () => {
    // Greedy distribution for current amount
    let rest = amount;
    const out = {};
    for (const d of DENOMS) {
      const count = Math.floor(rest / d);
      out[d] = count;
      rest -= count * d;
    }
    setBills((prev) => ({ ...prev, ...out }));
  };

  const validate = () => {
    if (amount <= 0) {
      setError(t('withdraw.alerts.needAmountText'));
      Swal.fire({ icon: 'info', title: t('withdraw.alerts.needAmountTitle'), text: t('withdraw.alerts.needAmountText') });
      return;
    }
    if (amount > balance) {
      setError(t('withdraw.alerts.insufficientText'));
      Swal.fire({ icon: 'error', title: t('withdraw.alerts.insufficientTitle'), text: t('withdraw.alerts.insufficientText') });
      return;
    }
    if (billsSum !== amount) {
      setError(t('withdraw.alerts.billsText'));
      Swal.fire({ icon: 'warning', title: t('withdraw.alerts.billsTitle'), text: t('withdraw.alerts.billsText') });
      return;
    }
    setPendingWithdrawal({ amount, bills });
    nav('/confirm');
  };

  const cancel = () => {
    setPendingWithdrawal(null);
    nav('/dashboard');
  };

  const showRules = () => {
    Swal.fire({
      icon: 'info',
      title: t('withdraw.alerts.rulesTitle'),
      html: t('withdraw.alerts.rulesHtml'),
      confirmButtonText: 'OK',
    });
  };

  return (
    <div className="container py-4" style={{ maxWidth: 880 }}>
      <PageHeader icon="bi-cash-coin" title={t('withdraw.title')} subtitle={t('withdraw.subtitle')} />

      <div className="row g-2 mt-2 row-cols-2 row-cols-sm-5">
        {presetAmounts.map((v) => (
          <div key={v} className="col">
            <button
              className={`btn w-100 ${amount === v ? 'btn-primary text-white' : 'btn-outline-primary'}`}
              onClick={() => onPickAmount(v)}
            >
              {formatCurrency(v)}
            </button>
          </div>
        ))}
      </div>

      <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setCustomMode((s) => !s)}>
          {t('withdraw.custom')}
        </button>
        <button className="btn btn-outline-secondary btn-sm" onClick={autoDistribute}>
          {t('withdraw.auto')}
        </button>
        <button className="btn btn-outline-secondary btn-sm" onClick={showRules}>
          {t('withdraw.rules')}
        </button>
      </div>

      {customMode && (
        <div className="d-flex align-items-center gap-2 mt-2">
          <input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Saisir le montant"
            className="form-control"
            style={{ maxWidth: 220 }}
            inputMode="numeric"
          />
          <button className="btn btn-success" onClick={onCustomConfirm}>Valider</button>
        </div>
      )}

      <div className="card shadow-sm mt-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <div className="small text-secondary">{t('withdraw.amount')}</div>
            <div className="fw-semibold">{formatCurrency(amount)}</div>
          </div>

          <div className="row g-2 mt-2">
            {DENOMS.map((d) => (
              <div key={d} className="col-12 col-sm-6 col-md-4">
                <div className="d-flex align-items-center justify-content-between border rounded p-2">
                  <div className="fw-medium">{formatCurrency(d)}</div>
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => decBill(d)}>-</button>
                    <div style={{ width: 32 }} className="text-center">{bills[d] || 0}</div>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => incBill(d)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex align-items-center justify-content-between small mt-3">
            <div className="text-secondary">Somme des billets</div>
            <div className="fw-semibold">{formatCurrency(billsSum)}</div>
          </div>

          {error && <div className="alert alert-danger mt-3 py-2 mb-0 small" role="alert">{error}</div>}

          <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
            <button className="btn btn-primary" onClick={validate}>{t('withdraw.validate')}</button>
            <button className="btn btn-outline-secondary" onClick={() => nav(-1)}>{t('withdraw.back')}</button>
            <button className="btn btn-outline-secondary" onClick={cancel}>{t('withdraw.cancel')}</button>
            <button className="btn btn-outline-secondary" onClick={resetBills}>{t('withdraw.reset')}</button>
          </div>
        </div>
      </div>

      {/* SweetAlert2 remplace la modale d'aide */}
    </div>
  );
}
