import React from 'react';

export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 1050 }}>
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" onClick={onClose} />
      <div className="position-relative bg-white rounded shadow w-100" style={{ maxWidth: 520 }}>
        <div className="border-bottom px-3 py-2">
          <h3 className="h5 m-0">{title}</h3>
        </div>
        <div className="px-3 py-3 text-body-secondary">{children}</div>
        {actions && <div className="d-flex justify-content-end gap-2 border-top px-3 py-2">{actions}</div>}
      </div>
    </div>
  );
}
