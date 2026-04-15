import { useEffect, useRef, useState } from "react"
import { io } from 'socket.io-client';
import { ToastContainer, toast } from "react-toastify";
import { UserPlus } from 'lucide-react';


const avatarColors = [
    { bg: '#faeeda', color: '#854F0B' },
    { bg: '#e1f5ee', color: '#085041' },
    { bg: '#eeedfe', color: '#3C3489' },
    { bg: '#faece7', color: '#712B13' },
    { bg: '#e6f1fb', color: '#0C447C' },
];
const getAvatarStyle = (name = '') => avatarColors[(name.charCodeAt(0) || 0) % avatarColors.length];
const getInitials = (name = '') => (name || '??').slice(0, 2).toUpperCase();

export default function Client({ cafeId }) {
    const [msg, setMsg] = useState('');
    const [messages, setMessages] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [chatWith, setChatWith] = useState('');
    const [chatWithName, setChatWithName] = useState('');
    const [permission, setPermission] = useState(false);
    const [permissionMsg, setPermissionMsg] = useState('');
    const [requests, setRequests] = useState([]);
    const [showReq, setShowReq] = useState(false);

    const socket = useRef(null);
    console.log("cafe id: ", cafeId);

    //socket
    useEffect(() => {
        if (!cafeId) return;
        if (socket.current) {
            socket.current.disconnect();
        }

        socket.current = io(import.meta.env.VITE_BACKEND_URL, {
            "auth": {
                "token": localStorage.getItem('token'),
                "myUserId": localStorage.getItem('userId'),
                "username": localStorage.getItem('username'),
                "cafeId": cafeId
            },
        })

        socket.current.on('connect', () => {
            console.log("connected to server");
        });
        socket.current.on('users', (users) => {
            setAllUsers(() => [...users]);
        });
        socket.current.on('disconnect', () => {
            console.log("disconnected")
        });
        socket.current.on('request', (req) => {
            setRequests(prev => [...prev, { username: req.username, id: req.id, show: true }])
        })
        socket.current.on('response', (msg) => {
            // console.log('per msg: ', msg)
            setPermissionMsg(msg)
        })
        socket.current.on('message', (msg) => {
            console.log("message from server: ", { msg });
            const message = {
                'msg': msg.msg,
                'from': 'client'
            }
            setMessages(prev => [...prev, message]);
        })
        socket.current.on('chatDisconnect', () => {
            setPermission(false);
        })
        return () => {
            socket.current?.off();
            socket.current?.disconnect();
        };

    }, [cafeId])


    //request
    useEffect(() => {
        console.log("perm from user: ", permissionMsg)
        if (permissionMsg === 'accepted') {
            setPermission(true);
            toast('request accepted')

        } else if (permissionMsg === 'denied') {
            toast('request denied')
        }
    }, [permissionMsg])

    //search people
    const searchHandler = async (clientuserId) => {
        setChatWith(clientuserId);
        // console.log(clientuserId);
        socket.current.emit('request', { chatWith: clientuserId });
        toast('request sent')
    }
    // send response to request
    const requestHandler = async (clientuserId, status) => {
        setChatWith(clientuserId);
        // console.log(clientuserId);
        socket.current.emit('response', { chatWith: clientuserId, status });

    }
    //send message
    const sendHandler = () => {
        if (!chatWith) return;
        // console.log("sending message: ", msg);
        const message = {
            'msg': msg,
            'from': 'me'
        }
        setMessages(prev => [...prev, message]);
        socket.current.emit('message', { msg, chatWith });
        setMsg('');
    }
    const bottomRef = useRef();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);

    return (
        <>
            {/* requests */}
            <button
                className={`req-bell ${showReq ? 'hidden' : ''}`}
                onClick={() => setShowReq(true)}
            >
                <UserPlus size={18} />
                {requests.filter(r => r.show).length > 0 && (
                    <span className="bell-badge">{requests.filter(r => r.show).length}</span>
                )}
            </button>

            {/* request list*/}
            <div className={(showReq && !permission) ? 'req-section' : 'cl-hidden'}>
                <div className="req-header">
                    <button className="back-link" onClick={() => setShowReq(false)}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M9 3L5 7l4 4" stroke="#9a5b39" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back
                    </button>
                    <span className="req-title">Incoming requests</span>
                </div>

                {requests.filter(r => r.show).length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="9" cy="8" r="4" stroke="#9a5b39" strokeWidth="1.4" fill="none" />
                                <path d="M2 20c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#9a5b39" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                                <path d="M17 10v5M14.5 12.5h5" stroke="#9a5b39" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="empty-title">No pending requests</div>
                        <div className="empty-sub">You're all caught up!</div>
                    </div>
                ) : (
                    <div className="person-list">
                        {requests.filter(r => r.show).map((req, idx) => (
                            <div key={idx} className="person-card">
                                <div className="person-avatar" style={getAvatarStyle(req.username)}>
                                    {getInitials(req.username)}
                                    <div className="online-dot" />
                                </div>
                                <div className="person-info">
                                    <div className="person-name">{req.username}</div>
                                    <div className="person-status">Wants to chat with you</div>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button className="accept-btn" onClick={() => {
                                        requestHandler(req.id, "accepted")
                                        setChatWithName(req.username)
                                        setShowReq(false)
                                        setPermission(true)
                                        req.show = false;
                                    }}>✓</button>
                                    <button className="deny-btn" onClick={() => {
                                        requestHandler(req.id, "denied")
                                        req.show = false;
                                    }}>✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* user list */}
            <div className={(showReq || permission) ? 'cl-hidden' : 'users-section'}>
                <div className="users-top-row">
                    <span className="users-count">
                        {allUsers.filter(u => u.username !== localStorage.getItem('username')).length} people nearby
                    </span>
                </div>

                <div className="person-list">
                    {allUsers.filter(u => u.username !== localStorage.getItem('username')).length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="9" cy="8" r="4" stroke="#9a5b39" strokeWidth="1.4" fill="none" />
                                    <path d="M2 20c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#9a5b39" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                                    <path d="M17 10v5M14.5 12.5h5" stroke="#9a5b39" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="empty-title">No one here yet</div>
                            <div className="empty-sub">Be the first to check in at this café!</div>
                        </div>
                    ) : (
                        allUsers.filter(u => u.username !== localStorage.getItem('username')).map((user, idx) => (
                            <div key={idx} className="person-card" onClick={() => searchHandler(user.userId)}>
                                <div className="person-avatar" style={getAvatarStyle(user.username)}>
                                    {getInitials(user.username)}
                                    <div className="online-dot" />
                                </div>
                                <div className="person-info">
                                    <div className="person-name">{user.username}</div>
                                    <div className="person-status">At this café now</div>
                                </div>
                                <button className="connect-btn" onClick={(e) => { e.stopPropagation(); searchHandler(user.userId); setChatWithName(user.username) }}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                    Connect
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* chat*/}
            <div className={permission ? 'chat-section' : 'cl-hidden'}>
                <div className="chat-header">
                    <div className="chat-header-left">
                        <div className="chat-avatar-sm" style={getAvatarStyle(chatWith)}>
                            {getInitials(chatWithName)}
                            <div className="online-dot" />
                        </div>
                        <div>
                            <div className="chat-name">{chatWithName || 'User'}</div>
                            <div className="chat-status">Active now</div>
                        </div>
                    </div>
                    <button className="disconnect-btn" onClick={() => {
                        socket.current?.emit('chatDisconnect', { chatWith });
                        setPermission(false)
                    }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 2l10 10M12 2L2 12" stroke="#A32D2D" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        End chat
                    </button>
                </div>

                <div className="chat-messages">
                    {messages.length === 0 && (
                        <div className="chat-empty">Say hi! ☕</div>
                    )}
                    {messages.map((m, idx) => (
                        <div key={idx}>
                        {
                            m.from === 'client' && (<div className="bubble-row theirs">
                                <div className="bubble-comm bubble-theirs">{m.msg}</div>
                            </div>)
                        }
                        {
                            m.from === 'me' && (<div className="bubble-row mine">
                                <div className="bubble-comm bubble-mine">{m.msg}</div>
                            </div>)
                        }
                        </div>
                    ))}

                    <div ref={bottomRef} />
                </div>

                <div className="chat-input-row">
                    <input
                        className="chat-input"
                        type="text"
                        name="msg"
                        id="msg"
                        value={msg}
                        placeholder="Type a message..."
                        onChange={(e) => setMsg(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendHandler()}
                    />
                    <button className="send-btn" onClick={sendHandler}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14 8L2 2l3 6-3 6 12-6z" fill="white" />
                        </svg>
                    </button>
                </div>

            </div>

            <ToastContainer position="bottom-right" />
        </>
    )
}