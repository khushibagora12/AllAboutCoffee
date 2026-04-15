
export default function CoffeeButton({ label, onClick }) {
    return (
        <>
            <button className="btn" onClick={onClick}>
                <span className="label">{label}</span>
                <div className="coffee-wrap">
                    <svg className="wave-svg w1" viewBox="0 0 400 20" preserveAspectRatio="none">
                        <path d="M0,10 C30,0 70,20 100,10 C130,0 170,20 200,10 C230,0 270,20 300,10 C330,0 370,20 400,10 L400,20 L0,20 Z" fill="#9a5b39" />
                    </svg>
                    <svg className="wave-svg w2" viewBox="0 0 400 20" preserveAspectRatio="none">
                        <path d="M0,10 C40,20 80,0 120,10 C160,20 200,0 240,10 C280,20 320,0 360,10 L400,10 L400,20 L0,20 Z" fill="#c47a4a" />
                    </svg>
                    <div className="coffee-fill" />
                    <div className="bubble b1" /><div className="bubble b2" /><div className="bubble b3" />
                </div>
            </button>
        </>
    )
}