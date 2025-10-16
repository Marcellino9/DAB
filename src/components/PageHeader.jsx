import React from 'react';

export default function PageHeader({ icon, title, subtitle }) {
  return (
    <div className="py-3 mb-3 border-bottom bg-body-tertiary rounded">
      <div className="container d-flex align-items-center gap-3">
        {icon && <i className={`bi ${icon} fs-3 text-primary`}></i>}
        <div>
          <h1 className="h4 fw-bold mb-0">{title}</h1>
          {subtitle && <div className="text-secondary small">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}
