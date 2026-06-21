
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Clock, User, Phone, CheckCircle, XCircle, AlertCircle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import dayjs from 'dayjs';

const Appointments = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [view, setView] = useState('list'); // list or calendar

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'canceled': return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-primary-400" />;
      default: return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      scheduled: 'badge-warning',
      confirmed: 'badge-success',
      completed: 'badge-info',
      canceled: 'badge-danger',
      rescheduled: 'badge-purple',
      no_show: 'badge-danger',
    };
    return map[status] || 'badge-info';
  };

  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf('month').day();
  const calendarDays = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getAppointmentsForDay = (day) => {
    if (!appointments) return [];
    return appointments.filter(apt => {
      const aptDate = dayjs(apt.scheduledDate);
      return aptDate.month() === currentMonth.month() && aptDate.year() === currentMonth.year() && aptDate.date() === day;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Appointments</h1>
          <p className="text-slate-400 mt-1">Manage your scheduled meetings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === 'list' ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                view === 'calendar' ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Calendar
            </button>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Appointment
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <>
          {/* Upcoming Section */}
          {upcoming && upcoming.length > 0 && (
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Up Next (24h)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map((apt) => (
                  <div key={apt.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                          <CalendarDays className="w-5 h-5 text-primary-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{apt.title}</p>
                          <p className="text-xs text-slate-500">{apt.contactName}</p>
                        </div>
                      </div>
                      {getStatusIcon(apt.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {dayjs(apt.scheduledDate).format('MMM D, h:mm A')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {apt.duration}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Appointments Table */}
          <div className="glass-panel overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Title</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Contact</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Date & Time</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Duration</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {appointments?.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-200">{apt.title}</p>
                      {apt.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{apt.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-300">{apt.contactName}</p>
                          <p className="text-xs text-slate-500">{apt.contactPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">
                        {dayjs(apt.scheduledDate).format('MMM D, YYYY h:mm A')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{apt.duration} min</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusBadge(apt.status)}`}>{apt.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400 capitalize">{apt.source?.replace('_', ' ')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Calendar View */
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {currentMonth.format('MMMM YYYY')}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`min-h-[100px] p-2 rounded-lg border ${
                  day ? 'border-slate-800 bg-slate-900/50' : 'border-transparent'
                } ${
                  day && dayjs().date() === day && dayjs().month() === currentMonth.month() 
                    ? 'ring-1 ring-primary-500/50' : ''
                }`}
              >
                {day && (
                  <>
                    <span className={`text-sm font-medium ${
                      dayjs().date() === day && dayjs().month() === currentMonth.month()
                        ? 'text-primary-400' : 'text-slate-400'
                    }`}>{day}</span>
                    <div className="mt-1 space-y-1">
                      {getAppointmentsForDay(day).map(apt => (
                        <div
                          key={apt.id}
                          className="text-[10px] px-1.5 py-0.5 bg-primary-500/20 text-primary-300 rounded truncate"
                        >
                          {dayjs(apt.scheduledDate).format('h:mm')} {apt.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;

