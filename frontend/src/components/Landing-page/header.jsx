import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <>
      <header className="app-header">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="10" fill="#9a5b39"/>
              <path d="M10 15h16v9a6 6 0 01-6 6h-4a6 6 0 01-6-6v-9z" fill="#efeceb"/>
              <path d="M26 17h2a3 3 0 010 6h-2" stroke="#efeceb" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M13 11 Q15 8 17 11 Q19 8 21 11 Q23 8 25 11" stroke="rgba(255,255,255,0.55)" stroke-width="1.4" fill="none" stroke-linecap="round"/>
              <rect x="10" y="14" width="16" height="2" rx="1" fill="#c47a4a"/>
              <ellipse cx="18" cy="15" rx="6" ry="1.5" fill="rgba(61,44,34,0.15)"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="text-[#3D2C22] fascinate">All About Coffee</span>
            <span className="logo-tagline">find your café</span>
          </div>
        </div>

        <nav className="header-nav">
          <button className="nav-signin" onClick={() => navigate('/Signin')}>Sign In</button>
          <button className="nav-signup" onClick={() => navigate('/Signup')}>Sign Up</button>
        </nav>

      </header>
    </>
  )
}