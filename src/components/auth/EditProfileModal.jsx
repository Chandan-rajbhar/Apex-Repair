import React, { useState } from 'react';
import { X, User, Phone, MapPin, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const EditProfileModal = () => {
  const { user, isProfileModalOpen, setProfileModalOpen, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [zip, setZip] = useState(user?.zip || '');

  if (!isProfileModalOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      address,
      city,
      zip
    });
  };

  return (
    <div className="sheet-backdrop" onClick={() => setProfileModalOpen(false)}>
      <div
        className="sheet-container glass-strong card-gloss"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="sheet-drag-handle" />

        <div className="sheet-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span className="badge badge-mint">PORTAL SETTINGS</span>
              <h2 style={{ fontSize: 'var(--fs-title)', color: '#0F2A44', marginTop: 4, fontWeight: 700 }}>Edit Profile</h2>
            </div>
            <button onClick={() => setProfileModalOpen(false)} className="icon-btn-header">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 5 }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    height: 'var(--btn-h)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid rgba(15, 42, 68, 0.14)',
                    padding: '0 14px 0 42px',
                    background: '#FFFFFF',
                    fontSize: 'var(--fs-body)'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 5 }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    height: 'var(--btn-h)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid rgba(15, 42, 68, 0.14)',
                    padding: '0 14px 0 42px',
                    background: '#FFFFFF',
                    fontSize: 'var(--fs-body)'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 5 }}>
                Service Street Address
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }} />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: '100%',
                    height: 'var(--btn-h)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid rgba(15, 42, 68, 0.14)',
                    padding: '0 14px 0 42px',
                    background: '#FFFFFF',
                    fontSize: 'var(--fs-body)'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 5 }}>
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    height: 'var(--btn-h)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid rgba(15, 42, 68, 0.14)',
                    padding: '0 14px',
                    background: '#FFFFFF',
                    fontSize: 'var(--fs-body)'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 5 }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  style={{
                    width: '100%',
                    height: 'var(--btn-h)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid rgba(15, 42, 68, 0.14)',
                    padding: '0 14px',
                    background: '#FFFFFF',
                    fontSize: 'var(--fs-body)'
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block tap-effect shine-sweep"
              style={{ height: 'var(--btn-h)', borderRadius: 'var(--radius)', fontSize: 'var(--fs-body)', marginTop: 8 }}
            >
              <Check size={18} /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

