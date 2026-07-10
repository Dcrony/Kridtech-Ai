import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Phone, Eye, EyeOff, Loader2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Left panel — branding */}
      <div style={styles.left} className="vo-left">
        <div style={styles.leftInner}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}><Zap style={{ width: 16, height: 16, color: '#fff' }} /></div>
            <span style={styles.logoText}>VoiceAI</span>
          </div>
          <div style={styles.leftContent}>
            <p style={styles.leftEyebrow}>Trusted by 40+ businesses</p>
            <h2 style={styles.leftHeadline}>
              Every call.<br />
              <span style={styles.outlineText}>Answered.</span>
            </h2>
            <p style={styles.leftSub}>
              Our AI phone agents work 24/7 so your reputation never suffers from a missed call again.
            </p>
            <div style={styles.statRow} className="vo-stat-row">
              {[['98%', 'Answer Rate'], ['50K+', 'Calls Handled'], ['4.9★', 'Avg Rating']].map(([v, l]) => (
                <div key={l} style={styles.stat}>
                  <span style={styles.statValue}>{v}</span>
                  <span style={styles.statLabel}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={styles.right} className="vo-right">
        <div style={styles.formWrap}>
          <div style={{ marginBottom: 36 }}>
            <p style={styles.formEyebrow}>Sign In</p>
            <h1 style={styles.formTitle}>Welcome back</h1>
            <p style={styles.formSub}>Sign in to your AI phone agent dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={styles.input}
                className="vo-input"
                placeholder="you@company.com"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ ...styles.input, paddingRight: 44 }}
                  className="vo-input"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={styles.submitBtn}
              className="vo-submit"
            >
              {isLoading ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.switchLink}>Get started</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  left: {
    width: '45%',
    background: '#0A0A0A',
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 48px',
    boxSizing: 'border-box',
  },
  leftInner: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 'auto',
  },
  logoIcon: {
    width: 30,
    height: 30,
    background: '#fff',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  leftContent: {
    paddingBottom: 60,
  },
  leftEyebrow: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#444',
    marginBottom: 20,
  },
  leftHeadline: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(38px, 4vw, 56px)',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    lineHeight: 1.0,
    color: '#fff',
    marginBottom: 20,
  },
  outlineText: {
    WebkitTextStroke: '2px #fff',
    color: 'transparent',
  },
  leftSub: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.7,
    maxWidth: 320,
    marginBottom: 40,
  },
  statRow: {
    display: 'flex',
    gap: 32,
    flexWrap: 'wrap',
    borderTop: '1px solid #1a1a1a',
    paddingTop: 28,
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  statValue: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.03em',
  },
  statLabel: {
    fontSize: 11,
    color: '#555',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  right: {
    flex: 1,
    minWidth: 0,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 48px',
    boxSizing: 'border-box',
  },
  formWrap: {
    width: '100%',
    maxWidth: 400,
  },
  formEyebrow: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#aaa',
    marginBottom: 10,
  },
  formTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#0A0A0A',
    marginBottom: 6,
  },
  formSub: {
    fontSize: 13,
    color: '#888',
    lineHeight: 1.5,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#0A0A0A',
    letterSpacing: '0.03em',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: 14,
    color: '#0A0A0A',
    background: '#F7F7F7',
    border: '1px solid #E5E5E5',
    borderRadius: 3,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#aaa',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: '#0A0A0A',
    color: '#fff',
    border: '2px solid #0A0A0A',
    borderRadius: 3,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    letterSpacing: '0.01em',
    transition: 'background 0.15s',
  },
  switchText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#aaa',
    marginTop: 24,
  },
  switchLink: {
    color: '#0A0A0A',
    fontWeight: 600,
    textDecoration: 'none',
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  .vo-input:focus { border-color: #0A0A0A !important; background: #fff !important; }
  .vo-submit:hover { background: #1A1AFF !important; border-color: #1A1AFF !important; }

  @media (max-width: 900px) {
    .vo-left { width: 38% !important; padding: 32px 32px !important; }
  }

  @media (max-width: 700px) {
    .vo-left { display: none !important; }
    .vo-right { width: 100% !important; padding: 32px 24px !important; }
  }

  @media (max-width: 480px) {
    .vo-right { padding: 28px 18px !important; }
    .vo-stat-row { gap: 20px !important; }
  }
`;

export default Login;
