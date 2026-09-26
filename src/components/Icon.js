const PATHS = {
    plus: <path d="M12 5v14M5 12h14" />,
    home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h14V9.5" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
    users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2 .7 3.2 2.5 3.8 5.5" /></>,
    arrowUp: <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />,
    arrowLeft: <path d="M19 12H5M11.5 5.5 5 12l6.5 6.5" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    chevronUp: <path d="m6 15 6-6 6 6" />,
    lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9" /></>,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    checkCircle: <><circle cx="12" cy="12" r="9" /><path d="m8 12.5 3 3 5-6" /></>,
    x: <path d="M6 6l12 12M18 6 6 18" />,
    message: <path d="M4 5.5h16v11H9l-5 4z" />,
    bookmark: <path d="M6 3.5h12V21l-6-4.5L6 21z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
    monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
    logout: <><path d="M15 4h4v16h-4" /><path d="M10 8l-4 4 4 4M6 12h10" /></>,
    sidebar: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M9 4v16" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    hash: <path d="M9 4 7 20M17 4l-2 16M4 9h16M3 15h16" />,
    ghost: <><path d="M5 20V11a7 7 0 0 1 14 0v9l-2.5-2-2.3 2-2.2-2-2.2 2-2.3-2z" /><circle cx="9.5" cy="11" r=".6" /><circle cx="14.5" cy="11" r=".6" /></>,
    trash: <><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13" /></>,
    inbox: <><path d="M3 13.5 5.5 5h13l2.5 8.5V19H3z" /><path d="M3 13.5h5l1 2.5h6l1-2.5h5" /></>,
    sparkle: <path d="M12 3.5c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z" />,
    flame: <path d="M12 21c-3.9 0-7-2.7-7-6.5 0-3.4 2.6-5.3 3.8-8.5.4 2 1.6 3.2 2.7 3.6C11.3 6.3 13 4 15.5 3c-.6 2.8.9 4.6 2 6.3 1 1.5 1.5 3 1.5 4.7C19 18.3 15.9 21 12 21z" />,
    trophy: <><path d="M8 4h8v6a4 4 0 0 1-8 0z" /><path d="M8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 14v3M8.5 20.5h7M9.5 17h5v3.5h-5z" /></>,
    target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r=".8" /></>,
    smile: <><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8M9 9.5h.01M15 9.5h.01" /></>,
    flag: <><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>,
    shield: <><path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6z" /><path d="m9 12 2 2 4-4" /></>,
    eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 5.6A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.8M6.2 6.9C3.8 8.6 2.5 12 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.2-1" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
    edit: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></>,
};

export default function Icon({ name, size = 18, strokeWidth = 1.75, className = '' }) {
    return (
        <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {PATHS[name]}
        </svg>
    );
}

export function Logo({ size = 28 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="logo">
            <rect x="2" y="3" width="26" height="22" rx="8" fill="var(--logo-bg)" />
            <path d="M9 25l-1 5 6-5z" fill="var(--logo-bg)" />
            <path d="M11 11.5l4 7 4-7" fill="none" stroke="var(--logo-fg)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle className="logo-spark" cx="27" cy="5" r="4.2" fill="var(--amber)" stroke="var(--logo-ring)" strokeWidth="1.6" />
        </svg>
    );
}
