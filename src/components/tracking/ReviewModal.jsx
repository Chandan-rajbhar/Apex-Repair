import React, { useState } from 'react';
import { X, Star, Check } from 'lucide-react';

export const ReviewModal = ({ isOpen, onClose, onSubmitReview, technicianName = 'Marcus Vance' }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview({ rating, comment });
    onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet-container glass-strong card-gloss"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="sheet-drag-handle" />

        <div className="sheet-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <span className="badge badge-mint">SERVICE FEEDBACK</span>
              <h3 style={{ fontSize: 'var(--fs-title)', color: '#0F2A44', marginTop: 4, fontWeight: 700 }}>
                Review Your Master Technician
              </h3>
            </div>
            <button onClick={onClose} className="icon-btn-header">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: 'var(--fs-card)', color: '#0F2A44', fontWeight: 700, marginBottom: 10 }}>
                How was your repair experience with {technicianName}?
              </div>

              {/* Star selector */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="tap-effect"
                    style={{ padding: 4 }}
                  >
                    <Star
                      size={32}
                      fill={star <= rating ? '#F59E0B' : 'transparent'}
                      color={star <= rating ? '#F59E0B' : '#CBD5E1'}
                    />
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 'var(--fs-small)', color: 'var(--orange-600)', fontWeight: 700, marginTop: 6 }}>
                {rating === 5 ? 'Exceptional 5-Star Craftsmanship' : `${rating} Stars Selected`}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: 6 }}>
                Comments or Technician Notes
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Marcus arrived on time, was polite, and fixed our Samsung refrigerator compressor quickly..."
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #CBD5E1',
                  padding: 'var(--space-3)',
                  fontSize: 'var(--fs-body)',
                  resize: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block tap-effect shine-sweep"
              style={{ height: 'var(--btn-h)', borderRadius: 'var(--radius)', fontSize: 'var(--fs-body)' }}
            >
              <Check size={18} /> Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

