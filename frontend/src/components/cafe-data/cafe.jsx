import { useState } from "react"
import { MapPin } from 'lucide-react';
import Client from "../chat/Client";

export default function Cafe({cafe}) {
    const [imgNo, setImgNo] = useState(0);
    const totalPhotos = cafe?.photos?.length || 1;

    // console.log('cafe data: ', cafe)
    // console.log(props.props.id)
    return (
        <>
            <div className="cafe-page">
 
            {/* cafe name and images */}
            <div className="cafe-hero">
                <img className=""
                    src={`https://places.googleapis.com/v1/${cafe?.photos?.[imgNo]?.name}/media?key=${import.meta.env.VITE_MAPS_KEY}&maxHeightPx=400`}
                    alt={cafe?.displayName}
                />
 
                <a className="maps-pill" href={cafe?.googleMapsURI} target="_blank" rel="noreferrer">
                    <MapPin size={12} color="#4b67b9" fill="#4b67b9"/>
                    Open in Maps
                </a>
 
                <div className="img-nav">
                    <button className="nav-arrow" onClick={() => setImgNo((totalPhotos + imgNo - 1) % totalPhotos)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M9 3L5 7l4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button className="nav-arrow" onClick={() => setImgNo((imgNo + 1) % totalPhotos)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M5 3l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
 
                <div className="img-dots">
                    {cafe?.photos?.slice(0, 8).map((_, i) => (
                        <div key={i} className={`dot ${i === imgNo ? 'on' : ''}`} onClick={() => setImgNo(i)}/>
                    ))}
                </div>
 
                <div className="cafe-hero-overlay">
                    <div className="cafe-hero-name">{cafe?.displayName}</div>
                    <div className="cafe-hero-rating">
                        <svg width="11" height="11" viewBox="0 0 12 12">
                            <path d="M6 1l1.4 2.9L11 4.4l-2.5 2.4.6 3.4L6 8.8 2.9 10.2l.6-3.4L1 4.4l3.6-.5z" fill="#f0a030"/>
                        </svg>
                        {cafe?.rating} · Google Maps
                    </div>
                </div>
            </div>
 
            {/* address */}
            <div className="addr-card">
                <div className="addr-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1C5.2 1 3 3.2 3 6c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5z" stroke="#9a5b39" strokeWidth="1.4" fill="none"/>
                        <circle cx="8" cy="6" r="2" fill="#9a5b39"/>
                    </svg>
                </div>
                <div>
                    <div className="addr-label">Address</div>
                    <div className="addr-text">{cafe?.formattedAddress}</div>
                </div>
            </div>
 
            {/* people list */}
            <div className="section-head">
                <div className="section-title">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="7" cy="6" r="3.5" stroke="#9a5b39" strokeWidth="1.4" fill="none"/>
                        <path d="M1 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#9a5b39" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
                        <circle cx="13" cy="5" r="2.5" stroke="#9a5b39" strokeWidth="1.3" fill="none"/>
                        <path d="M15 12c1.1.5 2 1.6 2 3" stroke="#9a5b39" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                    </svg>
                    People here now
                </div>
            </div>
            <p className="section-sub">Send a request to chat in real time with fellow café goers</p>
 
            {cafe?.id && <Client cafeId={cafe?.id} />}
        </div>
        </>
    )
}