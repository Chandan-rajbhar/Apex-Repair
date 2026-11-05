import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCheck,
  Check,
  Truck,
  Shield,
  FileCheck,
  CheckCircle2,
  CalendarCheck2,
  Sparkles,
  Receipt,
  UserCheck,
  Wrench,
  ClipboardCheck,
  Package,
  MessageSquare,
  AlertTriangle,
  Star,
  AlertCircle,
  User,
  Clock,
  ShieldCheck,
  ChevronDown,
  Bell,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

// Map icon string names to actual Lucide components
const ICON_MAP = {
  Truck,
  Shield,
  FileCheck,
  CheckCircle2,
  CalendarCheck2,
  Sparkles,
  Receipt,
  UserCheck,
  Wrench,
  ClipboardCheck,
  Package,
  MessageSquare,
  AlertTriangle,
  Star,
  AlertCircle,
  User,
  Clock,
  ShieldCheck,
  Bell
};

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    toggleRead,
    markAllAsRead,
    resetNotifications
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread'
  const [visibleCount, setVisibleCount] = useState(20);

  // Filter list
  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'unread') return !item.read;
    return true;
  });

  // Paginated visible list
  const displayedNotifications = filteredNotifications.slice(0, visibleCount);
  const hasMore = visibleCount < filteredNotifications.length;
  const remainingCount = filteredNotifications.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  const handleCardClick = (item) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(14px, 3.8vw, 18px)',
        paddingBottom: 'var(--page-pad-bottom, 96px)',
        paddingTop: '4px'
      }}
    >
      {/* 1. Header Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="tap-effect"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid #E3E7F2',
            borderRadius: '9999px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#16264A',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(10, 20, 60, 0.05)'
          }}
          aria-label="Go back"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1
            style={{
              fontSize: 'var(--fs-title, 1.25rem)',
              fontWeight: 700,
              color: '#0E1A36',
              margin: 0,
              lineHeight: 1.2
            }}
          >
            Notifications
          </h1>
          {unreadCount > 0 ? (
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#FFFFFF',
                background: '#FF5A36',
                borderRadius: '9999px',
                padding: '2px 8px',
                lineHeight: 1.2,
                boxShadow: '0 2px 6px rgba(255, 90, 54, 0.3)'
              }}
            >
              {unreadCount} New
            </span>
          ) : (
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: '#1FA971',
                background: 'rgba(31, 169, 113, 0.12)',
                borderRadius: '9999px',
                padding: '2px 8px',
                lineHeight: 1.2
              }}
            >
              All Read
            </span>
          )}
        </div>
      </div>

      {/* 2. Filter Tabs & Mark All As Read Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap'
        }}
      >
        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(230, 237, 248, 0.55)',
            padding: '3px',
            borderRadius: '9999px',
            border: '1px solid rgba(22, 38, 74, 0.08)'
          }}
        >
          <button
            onClick={() => {
              setActiveFilter('all');
              setVisibleCount(20);
            }}
            className="tap-effect"
            style={{
              border: 'none',
              background: activeFilter === 'all' ? '#FFFFFF' : 'transparent',
              color: activeFilter === 'all' ? '#16264A' : '#4A5A78',
              fontWeight: activeFilter === 'all' ? 700 : 500,
              fontSize: '0.76rem',
              padding: '5px 12px',
              borderRadius: '9999px',
              boxShadow: activeFilter === 'all' ? '0 2px 6px rgba(10, 20, 60, 0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            All ({notifications.length})
          </button>

          <button
            onClick={() => {
              setActiveFilter('unread');
              setVisibleCount(20);
            }}
            className="tap-effect"
            style={{
              border: 'none',
              background: activeFilter === 'unread' ? '#FFFFFF' : 'transparent',
              color: activeFilter === 'unread' ? '#16264A' : '#4A5A78',
              fontWeight: activeFilter === 'unread' ? 700 : 500,
              fontSize: '0.76rem',
              padding: '5px 12px',
              borderRadius: '9999px',
              boxShadow: activeFilter === 'unread' ? '0 2px 6px rgba(10, 20, 60, 0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#FF5A36',
                  display: 'inline-block'
                }}
              />
            )}
            <span>({unreadCount})</span>
          </button>
        </div>

        {/* Mark All as Read button */}
        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="tap-effect"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            border: 'none',
            background: 'transparent',
            color: unreadCount > 0 ? '#2F5082' : '#94A3B8',
            fontWeight: 600,
            fontSize: '0.74rem',
            cursor: unreadCount > 0 ? 'pointer' : 'default',
            padding: '4px 8px',
            borderRadius: '6px',
            opacity: unreadCount > 0 ? 1 : 0.6
          }}
          title="Mark all notifications as read"
        >
          <CheckCheck size={15} strokeWidth={2.2} />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* 3. Notification Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2.2vw, 10px)' }}>
        {displayedNotifications.length === 0 ? (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              background: '#FFFFFF',
              borderRadius: 'clamp(14px, 3.8vw, 18px)',
              border: '1px solid #E3E7F2',
              boxShadow: '0 2px 8px rgba(10, 20, 60, 0.04)'
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(47, 80, 130, 0.08)',
                color: '#2F5082',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}
            >
              <CheckCircle2 size={24} strokeWidth={2} />
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0E1A36', marginBottom: 4 }}>
              {activeFilter === 'unread' ? 'All caught up!' : 'No notifications'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#4A5A78', maxWidth: 280, margin: '0 auto 14px auto' }}>
              {activeFilter === 'unread'
                ? 'You have no unread notifications right now.'
                : 'There are no notifications in your activity center.'}
            </div>
            {activeFilter === 'unread' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="tap-effect"
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: '#2F5082',
                  color: '#FFFFFF',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          displayedNotifications.map((n) => {
            const IconComponent = ICON_MAP[n.iconName] || Bell;
            const isUnread = !n.read;

            return (
              <div
                key={n.id}
                onClick={() => handleCardClick(n)}
                className="tap-effect"
                style={{
                  position: 'relative',
                  padding: 'clamp(10px, 2.8vw, 13px)',
                  borderRadius: 'clamp(12px, 3.2vw, 16px)',
                  background: isUnread ? '#F6F9FF' : '#FFFFFF',
                  border: isUnread ? '1.5px solid rgba(47, 80, 130, 0.22)' : '1px solid #E3E7F2',
                  boxShadow: isUnread
                    ? '0 3px 10px rgba(22, 38, 74, 0.06)'
                    : '0 2px 6px rgba(10, 20, 60, 0.03)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'clamp(10px, 2.6vw, 12px)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, border-color 0.15s ease',
                  overflow: 'hidden'
                }}
              >
                {/* Left: Notification Icon Badge */}
                <div
                  style={{
                    width: 'clamp(34px, 9vw, 38px)',
                    height: 'clamp(34px, 9vw, 38px)',
                    borderRadius: 10,
                    background: n.iconBg || 'rgba(47, 80, 130, 0.1)',
                    color: n.iconColor || '#2F5082',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <IconComponent size={18} strokeWidth={2.2} />
                </div>

                {/* Middle: Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Category & Time row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 6,
                      marginBottom: 3
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          fontSize: 'clamp(0.62rem, 2.3vw, 0.68rem)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: isUnread ? '#2F5082' : '#7E92A2'
                        }}
                      >
                        {n.category || 'Notification'}
                      </span>
                      {isUnread && (
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#FF5A36',
                            display: 'inline-block'
                          }}
                          title="Unread"
                        />
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 'clamp(0.62rem, 2.3vw, 0.7rem)',
                        color: '#7E92A2',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {n.time}
                    </span>
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontSize: 'clamp(0.82rem, 3.2vw, 0.88rem)',
                      fontWeight: isUnread ? 700 : 600,
                      color: isUnread ? '#0E1A36' : '#223F6B',
                      lineHeight: 1.3,
                      marginBottom: 2
                    }}
                  >
                    {n.title}
                  </div>

                  {/* Short Description */}
                  <div
                    style={{
                      fontSize: 'clamp(0.72rem, 2.7vw, 0.78rem)',
                      color: '#4A5A78',
                      lineHeight: 1.35
                    }}
                  >
                    {n.desc}
                  </div>
                </div>

                {/* Right: Individual Read/Unread Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRead(n.id);
                  }}
                  className="tap-effect"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '4px',
                    color: isUnread ? '#FF5A36' : '#94A3B8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    flexShrink: 0,
                    alignSelf: 'center'
                  }}
                  title={isUnread ? 'Mark as read' : 'Mark as unread'}
                  aria-label={isUnread ? 'Mark as read' : 'Mark as unread'}
                >
                  {isUnread ? (
                    <Eye size={16} strokeWidth={2} />
                  ) : (
                    <EyeOff size={16} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* 4. "View More" Pagination Button */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <button
            onClick={handleLoadMore}
            className="tap-effect"
            style={{
              width: '100%',
              maxWidth: 320,
              padding: '11px 18px',
              borderRadius: '9999px',
              background: '#FFFFFF',
              border: '1.5px solid #2F5082',
              color: '#2F5082',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(47, 80, 130, 0.1)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>View More Notifications ({remainingCount} remaining)</span>
            <ChevronDown size={16} strokeWidth={2.4} />
          </button>
        </div>
      )}

      {/* Bottom helper text */}
      {notifications.length > 0 && !hasMore && displayedNotifications.length > 20 && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.72rem',
            color: '#7E92A2',
            paddingTop: 8
          }}
        >
          All {filteredNotifications.length} notifications loaded
        </div>
      )}
    </div>
  );
};

