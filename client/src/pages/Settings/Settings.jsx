import React, { useState } from 'react';
import { useAuthStore } from '../../context/authStore';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Save, 
  Loader2,
  X
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    timezone: user?.timezone || 'UTC',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
    leadAlerts: true,
    handoffAlerts: true,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const res = await api.patch('/auth/profile', profileData);
      updateUser(res.data.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
    setIsLoading(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await api.patch('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    }
    setIsLoading(false);
  };

  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Singapore',
    'Australia/Sydney', 'Pacific/Auckland'
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }} className="text-black">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');

        .settings-display-font { font-family: 'Syne', sans-serif; }

        .settings-section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
        }

        .settings-card {
          background: #fff;
          border: 1px solid #E5E5E5;
          border-radius: 2px;
        }

        .settings-hairline {
          height: 1px;
          background: #E5E5E5;
        }

        .settings-accent-dot {
          width: 6px;
          height: 6px;
          background: #1A1AFF;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }

        .settings-tab {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
          text-align: left;
          background: transparent;
          border: none;
          border-left: 2px solid transparent;
          color: #888;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .settings-tab:hover { color: #0A0A0A; background: #F7F7F7; }
        .settings-tab.active {
          color: #0A0A0A;
          background: #F7F7F7;
          border-left: 2px solid #1A1AFF;
        }

        .settings-input {
          width: 100%;
          background: #fff;
          border: 1px solid #E5E5E5;
          border-radius: 2px;
          padding: 11px 14px;
          font-size: 14px;
          color: #0A0A0A;
          outline: none;
          transition: border-color 0.15s;
        }
        .settings-input:focus { border-color: #0A0A0A; }
        .settings-input:disabled { opacity: 0.5; cursor: not-allowed; background: #F7F7F7; }

        .settings-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 8px;
        }

        .settings-btn-primary {
          background: #0A0A0A;
          color: #fff;
          padding: 12px 24px;
          border-radius: 2px;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.01em;
          border: 2px solid #0A0A0A;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s, border-color 0.15s;
        }
        .settings-btn-primary:hover { background: #1A1AFF; border-color: #1A1AFF; }
        .settings-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .settings-toggle {
          position: relative;
          width: 44px;
          height: 24px;
          border-radius: 2px;
          border: 1px solid #E5E5E5;
          background: #F0F0F0;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .settings-toggle.on { background: #0A0A0A; border-color: #0A0A0A; }
        .settings-toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 18px;
          height: 18px;
          background: #fff;
          border-radius: 1px;
          transition: transform 0.15s;
        }
        .settings-toggle.on .settings-toggle-knob { transform: translateX(20px); }

        .settings-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
        }
      `}</style>

      <div style={{ marginBottom: 40 }}>
        <p className="settings-section-label" style={{ marginBottom: 12 }}>Account</p>
        <h1 className="settings-display-font" style={{ fontSize: 'clamp(26px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#0A0A0A' }}>
          Settings
        </h1>
        <p style={{ fontSize: 14, color: '#888', marginTop: 8 }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: 'flex', gap: 32 }}>
        {/* Sidebar Tabs */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div className="settings-card" style={{ padding: 6 }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon style={{ width: 16, height: 16 }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'profile' && (
            <div className="settings-card" style={{ padding: 36 }}>
              <p className="settings-section-label" style={{ marginBottom: 8 }}>Profile</p>
              <h2 className="settings-display-font" style={{ fontSize: 20, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.01em', marginBottom: 28 }}>
                Profile Information
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <div style={{ width: 64, height: 64, background: '#0A0A0A', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>{user?.firstName} {user?.lastName}</p>
                  <p style={{ fontSize: 13, color: '#888' }}>{user?.email}</p>
                </div>
              </div>

              <div className="settings-hairline" style={{ marginBottom: 28 }} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                <div>
                  <label className="settings-label">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label">Company</label>
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                    className="settings-input"
                  />
                </div>
                <div>
                  <label className="settings-label">Timezone</label>
                  <select
                    value={profileData.timezone}
                    onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                    className="settings-input"
                  >
                    {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                <button
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                  className="settings-btn-primary"
                >
                  {isLoading ? <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> : <Save style={{ width: 14, height: 14 }} />}
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-card" style={{ padding: 36 }}>
              <p className="settings-section-label" style={{ marginBottom: 8 }}>Notifications</p>
              <h2 className="settings-display-font" style={{ fontSize: 20, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.01em', marginBottom: 28 }}>
                Notification Preferences
              </h2>

              <div>
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive email notifications for important events' },
                  { key: 'smsAlerts', label: 'SMS Alerts', description: 'Get text messages for urgent notifications' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
                  { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly performance summaries' },
                  { key: 'leadAlerts', label: 'Lead Alerts', description: 'Get notified when a high-value lead is identified' },
                  { key: 'handoffAlerts', label: 'Handoff Alerts', description: 'Notifications when human intervention is needed' },
                ].map((setting, i) => (
                  <React.Fragment key={setting.key}>
                    <div className="settings-row">
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>{setting.label}</p>
                        <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{setting.description}</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings({
                          ...notificationSettings,
                          [setting.key]: !notificationSettings[setting.key]
                        })}
                        className={`settings-toggle ${notificationSettings[setting.key] ? 'on' : ''}`}
                      >
                        <div className="settings-toggle-knob" />
                      </button>
                    </div>
                    {i < 5 && <div className="settings-hairline" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-card" style={{ padding: 36 }}>
              <p className="settings-section-label" style={{ marginBottom: 8 }}>Security</p>
              <h2 className="settings-display-font" style={{ fontSize: 20, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.01em', marginBottom: 28 }}>
                Change Password
              </h2>

              <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="settings-label">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="settings-input"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="settings-label">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="settings-input"
                    placeholder="Min 8 characters"
                  />
                </div>
                <div>
                  <label className="settings-label">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="settings-input"
                    placeholder="Confirm new password"
                  />
                </div>
                <div>
                  <button
                    onClick={handlePasswordChange}
                    disabled={isLoading}
                    className="settings-btn-primary"
                  >
                    {isLoading ? <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> : <Shield style={{ width: 14, height: 14 }} />}
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="settings-card" style={{ padding: 36 }}>
              <p className="settings-section-label" style={{ marginBottom: 8 }}>Billing</p>
              <h2 className="settings-display-font" style={{ fontSize: 20, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.01em', marginBottom: 28 }}>
                Billing & Usage
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#E5E5E5', marginBottom: 28 }}>
                <div style={{ background: '#fff', padding: '24px 24px' }}>
                  <p className="settings-section-label">Current Plan</p>
                  <p className="settings-display-font" style={{ fontSize: 24, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.02em', marginTop: 8 }}>Pay Per Minute</p>
                  <p style={{ fontSize: 13, color: '#1A1AFF', marginTop: 4, fontWeight: 600 }}>$0.09 / minute</p>
                </div>
                <div style={{ background: '#fff', padding: '24px 24px' }}>
                  <p className="settings-section-label">This Month</p>
                  <p className="settings-display-font" style={{ fontSize: 24, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.02em', marginTop: 8 }}>$124.50</p>
                  <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>1,383 minutes used</p>
                </div>
                <div style={{ background: '#fff', padding: '24px 24px' }}>
                  <p className="settings-section-label">Active Agents</p>
                  <p className="settings-display-font" style={{ fontSize: 24, fontWeight: 800, color: '#0A0A0A', letterSpacing: '-0.02em', marginTop: 8 }}>3</p>
                  <p style={{ fontSize: 13, color: '#1A8754', marginTop: 4, fontWeight: 600 }}>All active</p>
                </div>
              </div>

              <div style={{ border: '1px solid #E5E5E5', padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>Usage Breakdown</h3>
                  <span style={{ fontSize: 12, color: '#888' }}>Last 30 days</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { label: 'Inbound Calls', minutes: 850, cost: 76.50 },
                    { label: 'Outbound Calls', minutes: 320, cost: 28.80 },
                    { label: 'After-Hours', minutes: 213, cost: 19.17 },
                  ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 13, color: '#333' }}>{item.label}</span>
                          <span style={{ fontSize: 12, color: '#888' }}>{item.minutes} min</span>
                        </div>
                        <div style={{ width: '100%', height: 4, background: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}>
                          <div 
                            style={{ height: '100%', background: '#1A1AFF', borderRadius: 2, width: `${(item.minutes / 850) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span style={{ marginLeft: 20, fontSize: 13, fontWeight: 600, color: '#0A0A0A', width: 64, textAlign: 'right' }}>
                        ${item.cost.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;