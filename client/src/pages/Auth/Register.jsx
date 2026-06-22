import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Eye, EyeOff, Loader2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    companyName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await register(formData);
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed');
    }
    setIsLoading(false);
  };

  const update = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}><Zap style={{ width: 16, height: 16, color: '#fff' }} /></div>
            <span style={styles.logoText}>VoiceAI</span>
          </div>
          <div style={styles.leftContent}>
            <p style={styles.leftEyebrow}>Get started today</p>
            <h2 style={styles.leftHeadline}>
              Live in<br />
              <span style={styles.outlineText}>48 hours.</span>
            </h2>
            <p style={styles.leftSub}>
              No code. No long-term contracts. We handle the entire build — you just review and approve.
            </p>
            <div style={styles.checklist}>
              {[
                'Every call answered, 24/7',
                'Custom-trained on your business',
                'Appointments booked automatically',
                'Pay per minute — no retainers',
              ].map((item) => (
                <div key={item} style={styles.checkItem}>
                  <div style={styles.checkDot} />
                  <span style={styles.checkText}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={styles.right}>
        <div style={styles.formWrap}>
          <div style={{ marginBottom: 32 }}>
            <p style={styles.formEyebrow}>Create Account</p>
            <h1 style={styles.formTitle}>Start for free</h1>
            <p style={styles.formSub}>Handle every call with AI — live in 48 hours</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name row */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={update('firstName')}
                  style={styles.input}
                  className="vo-input"
                  placeholder="John"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={update('lastName')}
                  style={styles.input}
                  className="vo-input"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={update('email')}
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
                  onChange={update('password')}
                  style={{ ...styles.input, paddingRight: 44 }}
                  className="vo-input"
                  placeholder="Min 8 characters"
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

            {/* Phone + Company row */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={update('phone')}
                  style={styles.input}
                  className="vo-input"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Company</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={update('companyName')}
                  style={styles.input}
                  className="vo-input"
                  placeholder="Company name"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={styles.submitBtn}
              className="vo-submit"
            >
              {isLoading ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> : 'Create Account'}
            </button>

            <p style={styles.terms}>
              By creating an account you agree to our{' '}
              <a href="#" style={styles.termsLink}>Terms of Service</a> and{' '}
              <a href="#" style={styles.termsLink}>Privacy Policy</a>.
            </p>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.switchLink}>Sign in</Link>
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
    width: '40%',
    background: '#0A0A0A',
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 48px',
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
    fontSize: 52,
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
    fontSize: 13,
    color: '#666',
    lineHeight: 1.7,
    maxWidth: 300,
    marginBottom: 36,
  },
  checklist: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    borderTop: '1px solid #1a1a1a',
    paddingTop: 28,
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  checkDot: {
    width: 6,
    height: 6,
    background: '#1A1AFF',
    borderRadius: '50%',
    flexShrink: 0,
  },
  checkText: {
    fontSize: 13,
    color: '#888',
  },
  right: {
    flex: 1,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 48px',
    overflowY: 'auto',
  },
  formWrap: {
    width: '100%',
    maxWidth: 420,
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#0A0A0A',
    letterSpacing: '0.03em',
    marginBottom: 7,
  },
  input: {
    width: '100%',
    padding: '11px 13px',
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
    marginTop: 4,
    letterSpacing: '0.01em',
    transition: 'background 0.15s',
  },
  terms: {
    fontSize: 11,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 1.6,
  },
  termsLink: {
    color: '#888',
    textDecoration: 'underline',
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
  .vo-submit:hover:not(:disabled) { background: #1A1AFF !important; border-color: #1A1AFF !important; }
  @media (max-width: 700px) {
    .vo-left { display: none !important; }
  }
`;

export default Register;