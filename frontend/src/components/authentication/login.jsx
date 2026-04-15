import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export default function Signin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log('in submit handler');

        const user = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/routes/auth/signin`, {
            email: email,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );
        console.log(user);
        console.log(user.data);
        console.log(user.data.token);
        console.log(user.data.userId);


        localStorage.setItem('token', user.data.token);
        localStorage.setItem('userId', user.data.userId);
        localStorage.setItem('username', user.data.username);


        toast(user.data.message);
        if (user.data.message === "logged in successfully") {
            setTimeout(() => {
                navigate('/cafeData');
            }, 1000);
        }
        setEmail('');
        setPassword('');
    }
    return (
        <>

            <div className="auth-page overflow-clip">
                <div className="auth-card">

                    <div className="auth-top">
                        <div className="auth-top-circle1" />
                        <div className="auth-top-circle2" />
                        <div className="steam-wrap">
                            <div className="steam-line sl1" />
                            <div className="steam-line sl2" />
                            <div className="steam-line sl3" />
                        </div>
                        <div className="bubble" style={{ width: 8, height: 8, bottom: 12, left: 40, animationDelay: '0s' }} />
                        <div className="bubble" style={{ width: 5, height: 5, bottom: 8, left: 90, animationDelay: '0.8s' }} />
                        <div className="bubble" style={{ width: 6, height: 6, bottom: 14, left: 150, animationDelay: '1.4s' }} />
                        <div className="auth-top-icon">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                <path d="M6 10h16v8a6 6 0 01-6 6H12a6 6 0 01-6-6v-8z" fill="white" />
                                <path d="M22 12h2a3 3 0 010 6h-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                <path d="M10 7 Q12 4 14 7 Q16 4 18 7" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                                <rect x="6" y="9" width="16" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
                            </svg>
                        </div>
                        <h2 className="auth-title">Welcome back</h2>
                        <p className="auth-subtitle">Your next café awaits ☕</p>
                    </div>

                    <svg className="wave-divider" viewBox="0 0 360 28" preserveAspectRatio="none" height="28">
                        <path d="M0,0 C60,28 120,0 180,20 C240,40 300,10 360,18 L360,0 Z" fill="#9a5b39" />
                    </svg>

                    <div className="auth-body">
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
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>


                        <button className="auth-submit" onClick={submitHandler}>
                            <svg className="btn-wave bw1" viewBox="0 0 640 30" preserveAspectRatio="none">
                                <path d="M0,15 C60,0 120,28 180,15 C240,2 300,28 360,15 C420,2 480,28 540,15 C580,6 620,20 640,15 L640,30 L0,30 Z" fill="rgba(255,255,255,0.1)" />
                            </svg>
                            <svg className="btn-wave bw2" viewBox="0 0 640 30" preserveAspectRatio="none">
                                <path d="M0,15 C80,28 160,4 240,15 C320,26 400,4 480,15 C540,22 600,10 640,15 L640,30 L0,30 Z" fill="rgba(255,255,255,0.08)" />
                            </svg>
                            <span className="btn-label">Sign In</span>
                        </button>

                        <div className="auth-footer">
                            New here? <a onClick={() => navigate('/Signup')}>Create an account</a>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}