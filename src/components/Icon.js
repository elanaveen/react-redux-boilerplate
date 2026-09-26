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
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
            <path fill="var(--accent)" d="M16 3C8.8 3 3 8.4 3 15c0 3.3 1.4 6.2 3.7 8.4L5.5 29l6-2.8c1.4.5 2.9.8 4.5.8 7.2 0 13-5.4 13-12S23.2 3 16 3z" />
            <path fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" d="M20.2 11.3a5.6 5.6 0 1 0 0 7.4" />
        </svg>
    );
}
