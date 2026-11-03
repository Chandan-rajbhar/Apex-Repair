import React from 'react';
import { X, Printer, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '../../data/appliancesData';

export const InvoiceModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const quote = booking.quote;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet-container glass-strong card-gloss"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
        role="dialog"
        aria-modal="true"
      >
        <div className="sheet-drag-handle" />

        <div className="sheet-body">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--grad-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                AP
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#0F2A44' }}>Official Invoice & Receipt</h3>
                <div style={{ fontSize: '0.68rem', color: '#7E92A2' }}>Booking #{booking.id}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={handlePrint}
                className="icon-btn-header"
                title="Print or Save as PDF"
              >
                <Printer size={16} />
              </button>
              <button onClick={onClose} className="icon-btn-header">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15, 42, 68, 0.1)',
            borderRadius: 18,
            padding: 16,
            marginBottom: 16
          }} id="printable-invoice">
            {/* Meta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F2A44' }}>{COMPANY_INFO.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Licensed & Certified Appliance Dispatch</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Phone: {COMPANY_INFO.phone}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-mint">PAID & VERIFIED</span>
                <div style={{ fontSize: '0.68rem', color: '#7E92A2', marginTop: 4 }}>
                  Date: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div style={{ fontSize: '0.72rem', color: '#4A5D6E', marginBottom: 14 }}>
              <strong>Customer: </strong> {booking.customerName} &bull; {booking.customerPhone}<br />
              <strong>Service Address: </strong> {booking.address}<br />
              <strong>Appliance: </strong> {booking.brand} {booking.applianceName} ({booking.modelNumber || 'Standard'})<br />
              <strong>Master Technician: </strong> {booking.technician?.name || 'Marcus Vance'}
            </div>

            {/* Line Items Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: '#0F2A44', borderBottom: '1px solid #CBD5E1', paddingBottom: 4 }}>
                <span>Item Description</span>
                <span>Amount</span>
              </div>
              {quote?.breakdown?.map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#334155' }}>
                  <span>{b.item}</span>
                  <span>{b.waived ? '-$79.00 (Credited)' : `$${b.price.toFixed(2)}`}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B' }}>
                <span>Subtotal</span>
                <span>${quote?.subtotal?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B' }}>
                <span>Sales Tax</span>
                <span>${quote?.tax?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.96rem', fontWeight: 800, color: '#0F2A44' }}>
                <span>Total Cleared</span>
                <span style={{ color: '#1E7B5A' }}>${quote?.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* 90-Day Guarantee Stamp */}
            <div style={{
              marginTop: 14,
              padding: 10,
              borderRadius: 12,
              background: '#E8F6EF',
              border: '1px dashed #1E7B5A',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <ShieldCheck size={20} color="#1E7B5A" />
              <div style={{ fontSize: '0.68rem', color: '#1E7B5A', lineHeight: 1.3 }}>
                <strong>90-Day Factory Warranty Active:</strong> All replacement components and craftsmanship guaranteed through{' '}
                {new Date(Date.now() + 7776000000).toLocaleDateString()}.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handlePrint}
              className="btn btn-primary tap-effect shine-sweep"
              style={{ flex: 1 }}
            >
              <Printer size={16} /> Print / Download PDF
            </button>
            <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

