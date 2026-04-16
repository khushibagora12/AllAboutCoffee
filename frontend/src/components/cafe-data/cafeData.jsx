import { useEffect, useState } from 'react';
import Cafe from './cafe';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react';

export default function CafeData() {
    const [cafes, setCafes] = useState([]);
    const [token, setToken] = useState("");
    const [cafe, setCafe] = useState(false);
    const [props, setProps] = useState({});
    const [filter, setFilter] = useState('all');

    const socket = new useRef(null);
    const navigate = useNavigate()

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        async function loadPlace() {
            (g => {
                var h, a, k,
                    p = "The Google Maps JavaScript API",
                    c = "google",
                    l = "importLibrary",
                    q = "__ib__",
                    m = document,
                    b = window;

                b = b[c] || (b[c] = {});
                var d = b.maps || (b.maps = {}),
                    r = new Set,
                    e = new URLSearchParams,
                    u = () => h || (h = new Promise(async (f, n) => {
                        await (a = m.createElement("script"));
                        e.set("libraries", [...r] + "");
                        for (k in g)
                            e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                        e.set("callback", c + ".maps." + q);
                        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                        d[q] = f;
                        a.onerror = () => h = n(Error(p + " could not load."));
                        // a.nonce = m.querySelector("script[nonce]")?.nonce || ""; 
                        m.head.append(a)
                    }));
                d[l]
                    ? console.warn(p + " only loads once. Ignoring:", g)
                    : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
            }
            )
                ({
                    key: import.meta.env.VITE_MAPS_KEY,
                    v: "weekly",
                });
            const { Place } = await google.maps.importLibrary("places");

            navigator.geolocation.getCurrentPosition(async (position) => {
                const center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,

                };
                const request = {
                    fields: [
                        'displayName',
                        'formattedAddress',
                        'googleMapsURI',
                        'photos',
                        'rating',
                        'reviews'
                    ],
                    locationRestriction: {
                        center,
                        radius: 2000,
                    },
                    // optional parameters
                    includedPrimaryTypes: ["cafe"], //category selected by user
                    maxResultCount: 10, // n most popular matches
                };
                const { places } = await Place.searchNearby(request);
                console.log("places: ", places)
                setCafes(places)

            },
                (error) => {
                    console.log(error)
                    toast('Please turn on your location and refresh')
                })
        }
        loadPlace()
    }, [])
    const filtered = () => {
        if (filter === 'rated') return [...cafes].sort((a, b) => b.rating - a.rating);
        return cafes;
    }
    const logoutHandler = () => {
        localStorage.setItem('token', '');
        localStorage.setItem('username', '');
        localStorage.setItem('userId', '');
        navigate('/Signin')
    }
    if (token) {
        return (
            <>
                
                <div className={cafe ? 'hidden' : ''}>
                    <div className="cd-hero">
                        
                        <div className="cd-hero-c1" />
                        <div className="cd-hero-c2" />
                        <button className="logout-btn" onClick={() => logoutHandler()}>Logout</button>

                        <h2 className="cd-hero-title">Cafés near you</h2>
                        <div className="cd-hero-badge">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <circle cx="6" cy="6" r="4.5" stroke="white" strokeWidth="1.2" />
                                <path d="M6 3.5v3l2 1.2" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                            Within 2 km · Updated just now
                        </div>

                    </div>

                    {/* normal or sorted */}
                    <div className="cd-chips">
                        <div className={`cd-chip ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All</div>
                        <div className={`cd-chip ${filter === 'rated' ? 'on' : ''}`} onClick={() => setFilter('rated')}>Top rated</div>
                    </div>

                    <div className="cd-count">
                        <strong>{cafes.length} cafés</strong> found nearby
                    </div>

                    {/* cafe list */}
                    <div className="cd-list">
                        {filtered().map((c, idx) => (
                            <div key={idx} className="cd-card" onClick={() => { setProps(c); setCafe(true); }}>
                                <div className="cd-card-img">
                                    <img
                                        src={`https://places.googleapis.com/v1/${c?.photos[0].name}/media?key=${import.meta.env.VITE_MAPS_KEY}&maxHeightPx=400`}
                                        alt={c?.displayName}
                                    />
                                </div>
                                <div className="cd-card-body">
                                    <div className="cd-card-name">{c?.displayName}</div>
                                    <div className="cd-card-addr">{c?.formattedAddress}</div>
                                    <div className="cd-card-footer">
                                        <div className="cd-rating">
                                            <svg width="11" height="11" viewBox="0 0 12 12">
                                                <path d="M6 1l1.4 2.9L11 4.4l-2.5 2.4.6 3.4L6 8.8 2.9 10.2l.6-3.4L1 4.4l3.6-.5z" fill="#f0a030" />
                                            </svg>
                                            {c?.rating}
                                        </div>
                                    </div>
                                </div>
                                <div className="cd-card-arrow">
                                    <div className="cd-arrow-btn">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M3 7h8M7 3l4 4-4 4" stroke="#9a5b39" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                
                {cafe && (<div className={cafe ? '' : 'hidden'}>
                    <Cafe cafe={props} socket={socket}/>
                    <button className="cd-back-btn" onClick={() => {
                        setCafe(false)
                        if(socket.current){
                            socket.current.emit('leave-cafe', {cafeId : socket.cafeId});
                            socket.current.disconnect();
                            console.log("leave cafe")
                        }
                    }}>
                        <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                            <path d="M11 7H3M7 3L3 7l4 4" stroke="#9a5b39" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to cafés
                    </button>
                </div>)}

                <ToastContainer />
            </>
        )
    }
    return (<p>You are not logged in</p>)
}