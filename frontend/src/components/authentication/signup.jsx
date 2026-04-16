import { useState } from "react"
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log('in submit handler');

    const user = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/routes/auth/signup`, {
      username: username,
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    );
    toast(user.data.message);
    console.log(user);
    setUsername('');
    setEmail('');
    setPassword('');
    if (user.data.message === "User created successfully") {
      setTimeout(() => {
        navigate('/Signin');
      }, 1000);
    }
  }
  return (
    <>
      <div className="auth-page">
        <div className="auth-card">

          <div className="auth-top" style={{ background: '#7a4228' }}>
            <div className="auth-top-circle1" />
            <div className="auth-top-circle2" />
            <div className="steam-wrap">
              <div className="steam-line sl2" />
              <div className="steam-line sl1" />
              <div className="steam-line sl3" />
            </div>
            <div className="bubble" style={{ width: 7, height: 7, bottom: 10, left: 60, animationDelay: '0.3s' }} />
            <div className="bubble" style={{ width: 5, height: 5, bottom: 16, left: 110, animationDelay: '1s' }} />
            <div className="bubble" style={{ width: 9, height: 9, bottom: 8, left: 180, animationDelay: '1.7s' }} />
            <div className="auth-top-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="10" r="5" stroke="white" strokeWidth="1.5" fill="none" />
                <path d="M4 24c0-5.5 4.5-9 10-9s10 3.5 10 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="21" cy="8" r="3" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.2" />
                <path d="M21 6.5v3M19.5 8h3" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="auth-title">Join the brew crew</h2>
            <p className="auth-subtitle">Find cafés you'll love</p>
          </div>

          <svg className="wave-divider" viewBox="0 0 360 28" preserveAspectRatio="none" height="28">
            <path d="M0,0 C60,28 120,0 180,20 C240,40 300,10 360,18 L360,0 Z" fill="#7a4228" />
          </svg>

          <div className="auth-body">
            <div className="input-group">
              <label className="input-label">Username</label>
              <div className="input-row">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="8" cy="5.5" r="3" stroke="#9a5b39" strokeWidth="1.3" />
                  <path d="M2 14c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="#9a5b39" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                </svg>
                <input
                  type="text"
                  name="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-row">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="#9a5b39" strokeWidth="1.3" />
                  <path d="M1 5l7 5 7-5" stroke="#9a5b39" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                </svg>
                <input
                  type="text"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-row">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="3" y="7" width="10" height="7" rx="2" stroke="#9a5b39" strokeWidth="1.3" />
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="#9a5b39" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                  <circle cx="8" cy="10.5" r="1.2" fill="#9a5b39" />
                </svg>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button className="auth-submit" style={{ background: '#7a4228', marginTop: 4 }} onClick={submitHandler}>
              <svg className="btn-wave bw2" viewBox="0 0 640 30" preserveAspectRatio="none">
                <path d="M0,15 C60,0 120,28 180,15 C240,2 300,28 360,15 C420,2 480,28 540,15 C580,6 620,20 640,15 L640,30 L0,30 Z" fill="rgba(255,255,255,0.1)" />
              </svg>
              <svg className="btn-wave bw1" viewBox="0 0 640 30" preserveAspectRatio="none">
                <path d="M0,15 C80,28 160,4 240,15 C320,26 400,4 480,15 C540,22 600,10 640,15 L640,30 L0,30 Z" fill="rgba(255,255,255,0.08)" />
              </svg>
              <span className="btn-label">Create Account</span>
            </button>

            <div className="auth-footer">
              Already have an account? <a onClick={() => navigate('/Signin')}>Sign in</a>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}