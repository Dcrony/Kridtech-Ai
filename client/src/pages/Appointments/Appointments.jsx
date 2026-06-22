import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Clock, User, Phone, CheckCircle, XCircle, AlertCircle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import dayjs from 'dayjs';

const STATUS_BADGE = {
  scheduled:   { bg: '#FFFBEB', color: '#D97706' },
  confirmed:   { bg: '#F0FFF4', color: '#16A34A' },
  completed:   { bg: '#EFF6FF', color: '#2563EB' },
  canceled:    { bg: '#FEF2F2', color: '#DC2626' },
  rescheduled: { bg: '#F5F3FF', color: '#7C3AED' },
  no_show:     { bg: '#FEF2F2', color: '#DC2626' },
};

const StatusIcon = ({ status }) => {
  const props = { style: { width: 15, height: 15, flexShrink: 0 } };
  if (status === 'confirmed' || status === 'completed') return <CheckCircle {...props} style={{ ...props.style, color: status === 'confirmed' ? '#16A34A' : '#2563EB' }} />;
  if (status === 'canceled' || status === 'no_show') return <XCircle {...props} style={{ ...props.style, color: '#DC2626' }} />;
  return <AlertCircle {...props} style={{ ...props.style, color: '#D97706' }} />;
};

const StatusBadge = ({ status }) => {
  const s = STATUS_BADGE[status] || { bg: '#F0F0F0', color: '#888' };
  return (
    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', background: s.bg, color: s.color, padding: '3px 8px', borderRadius: 2 }}>
      {status?.replace('_', ' ')}
    </span>
  );
};

const Appointments = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [view, setView] = useState('list');

  const { data: appointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await api.get('/appointments?limit=100');
      return res.data.data;
    },
  });

  const { data: upcoming } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      const res = await api.get('/appointments/upcoming');
      return res.data.data;
    },
  });

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf('month').day();
  const calendarDays = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getAppointmentsForDay = (day) => {
    if (!appointments || !day) return [];
    return appointments.filter(apt => {
      const d = dayjs(apt.scheduledDate);
      return d.month() === currentMonth.month() && d.year() === currentMonth.year() && d.date() === day;
    });
  };

  const isToday = (day) => day && dayjs().date() === day && dayjs().month() === currentMonth.month() && dayjs().year() === currentMonth.year();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", padding: 28, background: '#F7F7F7', minHeight: '100%' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .vo-view-btn { background: none; border: 1px solid #E5E5E5; padding: 7px 14px; font-size: 12px; font-weight: 600; color: #aaa; cursor: pointer; font-family: Inter, sans-serif; transition: all 0.15s; }
        .vo-view-btn:first-child { border-radius: 3px 0 0 3px; border-right: none; }
        .vo-view-btn:last-child { border-radius: 0 3px 3px 0; }
        .vo-view-btn.active { background: #0A0A0A; border-color: #0A0A0A; color: #fff; }
        .vo-view-btn:not(.active):hover { border-color: #0A0A0A; color: #0A0A0A; }
        .vo-new-btn { display: flex; align-items: center; gap: 7px; padding: 9px 18px; background: #0A0A0A; color: #fff; border: 2px solid #0A0A0A; border-radius: 3px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: Inter, sans-serif; transition: background 0.15s; }
        .vo-new-btn:hover { background: #1A1AFF; border-color: #1A1AFF; }
        .vo-table-row:hover { background: #FAFAFA; }
        .vo-cal-nav { background: none; border: 1px solid #E5E5E5; border-radius: 3px; padding: 6px; cursor: pointer; color: #888; display: flex; transition: all 0.15s; }
        .vo-cal-nav:hover { border-color: #0A0A0A; color: #0A0A0A; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 2 }}>Appointments</h1>
          <p style={{ fontSize: 13, color: '#aaa' }}>Manage your scheduled meetings</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex' }}>
            <button onClick={() => setView('list')} className={`vo-view-btn${view === 'list' ? ' active' : ''}`}>List</button>
            <button onClick={() => setView('calendar')} className={`vo-view-btn${view === 'calendar' ? ' active' : ''}`}>Calendar</button>
          </div>
          <button className="vo-new-btn">
            <Plus style={{ width: 15, height: 15 }} /> New Appointment
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <>
          {/* Upcoming cards */}
          {upcoming && upcoming.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 3, padding: 24, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>Next Up</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em', marginBottom: 18 }}>Coming in 24 hours</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#E5E5E5' }}>
                {upcoming.map((apt) => (
                  <div key={apt.id} style={{ background: '#fff', padding: '18px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, background: '#0A0A0A', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CalendarDays style={{ width: 14, height: 14, color: '#fff' }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>{apt.title}</p>
                          <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{apt.contactName}</p>
                        </div>
                      </div>
                      <StatusIcon status={apt.status} />
                    </div>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#888' }}>
                        <Clock style={{ width: 11, height: 11 }} />
                        {dayjs(apt.scheduledDate).format('MMM D, h:mm A')}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#888' }}>
                        <Phone style={{ width: 11, height: 11 }} />
                        {apt.duration}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table */}
          <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 3, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                  {['Title', 'Contact', 'Date & Time', 'Duration', 'Status', 'Source'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments?.map((apt) => (
                  <tr key={apt.id} className="vo-table-row" style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>{apt.title}</p>
                      {apt.description && <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{apt.description}</p>}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, background: '#0A0A0A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{apt.contactName?.[0]}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: '#0A0A0A' }}>{apt.contactName}</p>
                          <p style={{ fontSize: 11, color: '#aaa' }}>{apt.contactPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: '#555' }}>
                      {dayjs(apt.scheduledDate).format('MMM D, YYYY h:mm A')}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: '#555' }}>{apt.duration} min</td>
                    <td style={{ padding: '14px 20px' }}><StatusBadge status={apt.status} /></td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: '#aaa', textTransform: 'capitalize' }}>
                      {apt.source?.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
                {(!appointments || appointments.length === 0) && (
                  <tr>
                    <td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center', fontSize: 13, color: '#ccc' }}>
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Calendar View */
        <div style={{ background: '#fff', border: '1px solid #E5E5E5', borderRadius: 3, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.03em' }}>
              {currentMonth.format('MMMM YYYY')}
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} className="vo-cal-nav">
                <ChevronLeft style={{ width: 16, height: 16 }} />
              </button>
              <button onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))} className="vo-cal-nav">
                <ChevronRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>

          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 2 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#bbb', padding: '8px 0' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: '#E5E5E5' }}>
            {calendarDays.map((day, idx) => {
              const dayApts = getAppointmentsForDay(day);
              const today = isToday(day);
              return (
                <div key={idx} style={{ background: day ? '#fff' : '#F7F7F7', minHeight: 90, padding: '10px 8px' }}>
                  {day && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{
                          fontSize: 12, fontWeight: today ? 700 : 500,
                          color: today ? '#fff' : '#0A0A0A',
                          background: today ? '#0A0A0A' : 'transparent',
                          borderRadius: today ? '50%' : 0,
                          width: today ? 22 : 'auto', height: today ? 22 : 'auto',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{day}</span>
                        {dayApts.length > 0 && (
                          <span style={{ fontSize: 9, fontWeight: 600, color: '#1A1AFF', background: 'rgba(26,26,255,0.08)', padding: '1px 5px', borderRadius: 2 }}>{dayApts.length}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {dayApts.slice(0, 2).map(apt => (
                          <div key={apt.id} style={{ fontSize: 9, fontWeight: 600, padding: '2px 5px', background: '#0A0A0A', color: '#fff', borderRadius: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {dayjs(apt.scheduledDate).format('h:mm')} {apt.title}
                          </div>
                        ))}
                        {dayApts.length > 2 && (
                          <p style={{ fontSize: 9, color: '#aaa', fontWeight: 500 }}>+{dayApts.length - 2} more</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;