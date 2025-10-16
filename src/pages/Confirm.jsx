import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PageHeader from '../components/PageHeader';
import { useSession } from '../session/SessionContext';
import { useLocale } from '../i18n/LocaleContext';
import { formatCurrency, generateWithdrawalReceipt } from '../utils/receipt';

export default function Confirm() {
  const nav = useNavigate();
  const { qrData, balance, setBalance, pendingWithdrawal, setPendingWithdrawal } = useSession();
  const [processing, setProcessing] = useState(false);
  const { t } = useLocale();

  const { amount, bills } = pendingWithdrawal || { amount: 0, bills: {} };

  const billLines = useMemo(() => {
    return Object.entries(bills || {})
      .filter(([, c]) => c > 0)
      .map(([d, c]) => `${c} x ${formatCurrency(Number(d))}`);
  }, [bills]);

  const cancel = async () => {
    const res = await Swal.fire({
      icon: 'question',
      title: t('confirm.alerts.cancelTitle'),
      text: t('confirm.alerts.cancelText'),
      showCancelButton: true,
      cancelButtonText: t('login.alerts.cancel'),
      confirmButtonText: t('confirm.cancel'),
      confirmButtonColor: '#dc3545',
    });
    if (res.isConfirmed) {
      setPendingWithdrawal(null);
      nav('/withdraw');
    }
  };

  const confirm = async () => {
    if (!pendingWithdrawal) return;
    if (amount > balance) return;
    setProcessing(true);
    try {
      const before = balance;
      const after = before - amount;
      setBalance(after);

      const transactionId = `${Date.now()}-${qrData?.userId || 'user'}`;
      generateWithdrawalReceipt({
        user: qrData,
        amount,
        bills,
        balanceBefore: before,
        balanceAfter: after,
        transactionId,
        date: new Date(),
      });
      await Swal.fire({
        icon: 'success',
        title: t('confirm.alerts.successTitle'),
        text: t('confirm.alerts.successText'),
        timer: 1500,
        showConfirmButton: false,
      });
      setPendingWithdrawal(null);
      nav('/dashboard');
    } finally {
      setProcessing(false);
    }
  };

  if (!pendingWithdrawal) {
    return (
      <div className="container py-4" style={{ maxWidth: 720 }}>
        <p className="text-secondary">{t('withdraw.alerts.needAmountText')}</p>
        <button className="mt-3 btn btn-primary" onClick={() => nav('/withdraw')}>{t('withdraw.back')}</button>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <PageHeader icon="bi-shield-check" title={t('confirm.title')} subtitle={t('confirm.subtitle')} />

      <div className="card shadow-sm mt-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between small text-secondary">
            <div>{t('confirm.user')}</div>
            <div className="fw-medium">{qrData?.name || qrData?.userId}</div>
          </div>
          <div className="d-flex align-items-center justify-content-between small text-secondary mt-2">
            <div>{t('confirm.currentBalance')}</div>
            <div className="fw-medium">{formatCurrency(balance)}</div>
          </div>
          <div className="d-flex align-items-center justify-content-between small text-secondary mt-2">
            <div>{t('confirm.withdrawAmount')}</div>
            <div className="fw-semibold">{formatCurrency(amount)}</div>
          </div>
          <div className="small text-secondary mt-2">
            <div className="mb-1">{t('confirm.details')}</div>
            {billLines.length ? (
              <ul className="ps-4 mb-0">
                {billLines.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            ) : (
              <div>Aucun détail</div>
            )}
          </div>

          <div className="d-flex align-items-center gap-2 mt-3">
            <button className="btn btn-success" onClick={confirm} disabled={processing}>
              {t('confirm.confirm')}
            </button>
            <button className="btn btn-outline-secondary" onClick={cancel} disabled={processing}>{t('confirm.cancel')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
