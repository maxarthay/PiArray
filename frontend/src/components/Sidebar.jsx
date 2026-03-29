import { useState } from "react";

const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutIcon },
    { label: "Map", icon: WifiIcon },
    // { label: "Logs", icon: ListIcon },
    // { label: "SSH Access", icon: TerminalIcon },
    // { label: "Network", icon: WifiIcon },
    // { label: "Settings", icon: SettingsIcon },
];

export default function Sidebar({ activeNav, onNavChange }) {
    const [active, setActive] = useState(activeNav ?? "Dashboard");

    function handleClick(label) {
        setActive(label);
        onNavChange?.(label);
    }

    return (
        <aside style={{
            width: 256,
            height: "100vh",
            borderRight: "1px solid #e5e7eb",
            padding: "16px 0",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            background: "#fff",
        }}>
            {/* Logo */}
            <div style={{
                padding: "4px 16px 16px",
                fontWeight: 600,
                fontSize: 15,
                borderBottom: "1px solid #e5e7eb",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
            }}>
                <MonitorIcon size={18} /> PiFleet
            </div>

            {/* Nav items */}
            {NAV_ITEMS.map(({ label, icon: Icon }) => (
                <button
                    key={label}
                    onClick={() => handleClick(label)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 16px",
                        margin: "0 8px",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        background: active === label ? "#f3f4f6" : "transparent",
                        color: active === label ? "#111" : "#6b7280",
                        fontWeight: active === label ? 500 : 400,
                        fontSize: 13,
                        textAlign: "left",
                    }}
                >
                    <Icon size={15} /> {label}
                </button>
            ))}
        </aside>
    );
}

// ── Icon components ──────────────────────────────────────────────────────────
function Icon({ size = 16, children }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {children}
        </svg>
    );
}
function MonitorIcon(p) { return <Icon {...p}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></Icon>; }
function LayoutIcon(p) { return <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Icon>; }
function ServerIcon(p) { return <Icon {...p}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M6 14h.01M10 10h4M10 14h4" /></Icon>; }
function ListIcon(p) { return <Icon {...p}><path d="M3 12h18M3 6h18M3 18h18" /></Icon>; }
function TerminalIcon(p) { return <Icon {...p}><path d="M9 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></Icon>; }
function WifiIcon(p) { return <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" /></Icon>; }
function SettingsIcon(p) { return <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /></Icon>; }
