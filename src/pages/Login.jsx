import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { decodeQRFromFile, parseQRPayload } from '../utils/qr';
import { useSession } from '../session/SessionContext';
import { useLocale } from '../i18n/LocaleContext';

export default function Login() {
  const nav = useNavigate();
  const { loginWithQR, verifyPin, qrData } = useSession();
  const { t } = useLocale();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null); // { url, name }
  const fileInputRef = useRef(null);

  const expiredAtText = useMemo(() => {
    if (!qrData?.expiresAt) return null;
    try {
      return new Date(qrData.expiresAt).toLocaleString();
    } catch {
      return qrData.expiresAt;
    }
  }, [qrData]);

  const handleFile = async (file) => {
    if (!file) return;
    setPreview({ url: URL.createObjectURL(file), name: file.name });
    setLoading(true);
    setError('');
    try {
      const payload = await decodeQRFromFile(file);
      
      if (!payload) {
        setError('QR code invalide.');
        return;
      }
      const data = parseQRPayload(payload);
      if (!data) {
        setError('Données du QR non reconnues.');
        return;
      }
      // Check expiration
      const now = Date.now();
      const exp = new Date(data.expiresAt).getTime();
      if (isNaN(exp) || now > exp) {
        await Swal.fire({
          icon: 'error',
          title: t('login.alerts.expiredTitle'),
          text: t('login.alerts.expiredText'),
          confirmButtonText: t('login.alerts.ok'),
        });
        return;
      }
      loginWithQR(data);
      const result = await Swal.fire({
        title: t('login.alerts.pinTitle'),
        input: 'password',
        inputAttributes: { inputmode: 'numeric', maxlength: 8 },
        inputPlaceholder: t('login.alerts.pinPlaceholder'),
        showCancelButton: true,
        cancelButtonText: t('login.alerts.cancel'),
        confirmButtonText: t('login.alerts.confirm'),
        preConfirm: (val) => {
          if (!val) {
            Swal.showValidationMessage(t('login.alerts.pinRequired'));
          }
          return val;
        },
      });
      if (result.isConfirmed) {
        const ok = await verifyPin(result.value);
        
        if (ok) {
          await Swal.fire({ icon: 'success', title: t('login.alerts.pinOk'), timer: 1000, showConfirmButton: false });
          nav('/dashboard');
        } else {
          await Swal.fire({ icon: 'error', title: t('login.alerts.pinError'), confirmButtonText: t('login.alerts.ok') });
        }
      }
    } catch (err) {
      setError(t('login.alerts.readError'));
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
    e.target.value = '';
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const clearPreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column align-items-center gap-3">
        <h1 className="h3 fw-bold">{t('login.title')}</h1>
        <div className="w-100" style={{ maxWidth: 680 }}>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <p className="small text-secondary mb-2">{t('login.subtitle')}</p>
                {preview && (
                  <button className="btn btn-sm btn-outline-secondary" onClick={clearPreview} title="Effacer">
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>

              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`border border-2 rounded-3 p-4 text-center ${dragOver ? 'border-primary bg-primary-subtle' : 'border-secondary-subtle bg-light'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                aria-label="Déposer ou sélectionner une image contenant le QR"
              >
                <i className="bi bi-qr-code-scan display-6 text-primary"></i>
                <div className="mt-2 fw-semibold">{t('login.dropHere')}</div>
                <div className="text-secondary small">{t('login.orBrowse')}</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="d-none"
                />
              </div>

              {preview && (
                <div className="d-flex align-items-center gap-3 mt-3">
                  <img src={preview.url} alt="aperçu qr" className="rounded border" style={{ width: 72, height: 72, objectFit: 'cover' }} />
                  <div className="small text-secondary">
                    <div className="text-body fw-medium">{preview.name}</div>
                    {loading ? <div>{t('login.reading')}</div> : <div>{t('login.ready')}</div>}
                  </div>
                </div>
              )}

              {error && <div className="alert alert-danger mt-3 py-2 mb-0 small" role="alert">{error}</div>}
              {qrData && !loading && (
                <div className="mt-3 p-3 bg-light rounded small text-secondary">
                  <div>{t('login.user')}: <span className="fw-medium">{qrData.name}</span></div>
                  <div>{t('login.expiresAt')}: <span className="fw-medium">{expiredAtText}</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
