import { useState, useMemo } from "react";
import Sparkline from "./Sparkline";
import RegistrationForm from "./Registration";
import { REMOVE_PI } from "../queries";
import { useMutation } from "@apollo/client/react";

const STATIC_FILTERS = ["All", "Online", "Offline", "Pi 4B", "Pi Zero", "Pi 5"];

const STATUS_STYLES = {
    online: { dot: "#1D9E75", badge: { background: "#E1F5EE", color: "#0F6E56" } },
    offline: { dot: "#D85A30", badge: { background: "#FAECE7", color: "#993C1D" } },
    warning: { dot: "#EF9F27", badge: { background: "#FAEEDA", color: "#854F0B" } },
};

function filterPis(pis, filter, search) {
    let result = pis;
    if (filter === "Online") result = result.filter(pi => pi.isOnline);
    else if (filter === "Offline") result = result.filter(pi => !pi.isOnline);
    else if (filter === "Pi 4B") result = result.filter(pi => pi.model?.includes("4B"));
    else if (filter === "Pi Zero") result = result.filter(pi => pi.model?.toLowerCase().includes("zero"));
    else if (filter !== "All") {
        // Treat as a group name filter
        result = result.filter(pi => pi.groupName === filter);
    }
    if (search) {
        const q = search.toLowerCase();
        result = result.filter(pi =>
            pi.name?.toLowerCase().includes(q) ||
            pi.model?.toLowerCase().includes(q) ||
            pi.ipAddress?.toLowerCase().includes(q) ||
            pi.groupName?.toLowerCase().includes(q)
        );
    }
    return result;
}

export default function DashboardGrid({ pis = [], groups = [] }) {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [visible, setVisible] = useState(false);

    const online = pis.filter(pi => pi.isOnline).length;
    const offline = pis.filter(pi => !pi.isOnline).length;
    const visible_pis = filterPis(pis, activeFilter, search);

    // Build filter list: static filters + dynamic group names
    const FILTERS = useMemo(() => {
        const groupNames = groups.map(g => g.name).filter(Boolean);
        return [...STATIC_FILTERS, ...groupNames];
    }, [groups]);

    return (
        <>
            {/* Modal sits outside main so it overlays the whole page */}
            <RegistrationForm visible={visible} setVisible={setVisible} />

            <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, sans-serif", fontSize: 14 }}>
                <main style={{ flex: 1, overflowY: "auto", padding: 24, background: "#fafafa", display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Top bar */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Dashboard</h1>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 10px" }}>
                                <SearchIcon size={13} color="#9ca3af" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search devices…"
                                    style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, width: 160, color: "#111" }}
                                />
                            </div>
                            <button
                                onClick={() => setVisible(true)}
                                style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                            >
                                <PlusIcon size={13} color="#fff" />
                                Add Pi
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                        {[
                            { label: "Total devices", value: pis.length, sub: "across 1 network" },
                            { label: "Online", value: online, sub: `${pis.length ? Math.round(online / pis.length * 100) : 0}% availability`, color: "#0F6E56" },
                            { label: "Offline", value: offline, sub: "last seen 2h ago", color: "#993C1D" },
                            { label: "Avg uptime", value: "18d", sub: "since last reboot" },
                        ].map(({ label, value, sub, color }) => (
                            <div key={label} style={{ background: "#f3f4f6", borderRadius: 8, padding: "14px 16px" }}>
                                <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{label}</div>
                                <div style={{ fontSize: 22, fontWeight: 600, color: color ?? "#111" }}>{value}</div>
                                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div style={{ display: "flex", gap: 8 }}>
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                style={{
                                    fontSize: 12, padding: "5px 12px",
                                    border: `1px solid ${activeFilter === f ? "#9ca3af" : "#e5e7eb"}`,
                                    borderRadius: 20, cursor: "pointer",
                                    background: activeFilter === f ? "#f3f4f6" : "transparent",
                                    color: activeFilter === f ? "#111" : "#6b7280",
                                    fontWeight: activeFilter === f ? 500 : 400,
                                }}
                            >
                                {f}{f === "All" ? ` (${pis.length})` : ""}
                            </button>
                        ))}
                    </div>

                    {/* Device cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                        {visible_pis.map(pi => (
                            <PiCard key={pi.id ?? pi.ip} pi={pi} />
                        ))}
                        {visible_pis.length === 0 && (
                            <p style={{ color: "#9ca3af", fontSize: 13 }}>No devices match your filter.</p>
                        )}
                    </div>

                </main>
            </div>
        </>
    );
}

function cpuColor(usage) {
    if (usage >= 80) return "#dc2626";
    if (usage >= 60) return "#ea580c";
    return "#16a34a";
}

function formatUptime(seconds) {
    if (seconds == null || seconds === 0) return "—";
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

function PiCard({ pi }) {
    const [hovered, setHovered] = useState(false);
    const status = pi.isOnline ? "online" : "offline";
    const { dot, badge } = STATUS_STYLES[status];
    const sparkColor = cpuColor(pi.cpuUsage);
    const [removePi] = useMutation(REMOVE_PI);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "#fff",
                border: `1px solid ${hovered ? "#9ca3af" : "#e5e7eb"}`,
                borderRadius: 12, padding: 16,
                display: "flex", flexDirection: "column", gap: 10,
                cursor: "pointer", transition: "border-color 0.15s",
            }}
        >
            {/* Header: name + status dot */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{pi.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{pi.model}</div>
                    {pi.groupName && (
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block", flexShrink: 0 }} />
                            {pi.groupName}
                        </div>
                    )}
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, marginTop: 3, flexShrink: 0 }} />
            </div>

            {/* IP */}
            <code style={{ fontSize: 12, color: "#6b7280", background: "#f3f4f6", padding: "4px 8px", borderRadius: 4 }}>
                {pi.ipAddress}
            </code>

            {/* Script */}
            {pi.currScript && (
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <TerminalIcon size={12} color="#6366f1" />
                    <span style={{ fontSize: 11, color: "#6366f1", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {pi.currScript}
                    </span>
                </div>
            )}

            {/* ── CPU sparkline ─────────────────────────────── */}
            {pi.cpuHistory && pi.cpuHistory.length >= 2 && (
                <div style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px" }}>CPU</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: sparkColor }}>{pi.cpuUsage}%</span>
                    </div>
                    <Sparkline
                        data={pi.cpuHistory}
                        width={180}
                        height={28}
                        color={sparkColor}
                    />
                </div>
            )}

            {/* ── Footer: status + temp + uptime ───────────── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, ...badge }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                {/* Remove Pi button */}
                <button onClick={() => removePi({ variables: { id: pi.id }, update: (cache) => { cache.evict({ id: cache.identify({ __typename: "RaspberryPi", id: pi.id }) }); cache.gc(); } })} style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20, color: "#dc2626", border: "none", background: "transparent", cursor: "pointer" }}>
                    Remove Pi
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {pi.tempCelsius != null && (
                        <span style={{ fontSize: 11, color: pi.tempCelsius >= 70 ? "#dc2626" : "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
                            <ThermometerIcon size={11} color={pi.tempCelsius >= 70 ? "#dc2626" : "#9ca3af"} />
                            {pi.tempCelsius.toFixed(0)}°C
                        </span>
                    )}
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>{formatUptime(pi.uptime)}</span>
                </div>
            </div>
        </div>
    );
}

// ── Icons ────────────────────────────────────────────────────────────────────
function Icon({ size = 16, children, color = "currentColor" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {children}
        </svg>
    );
}
function SearchIcon(p) { return <Icon {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></Icon>; }
function PlusIcon(p) { return <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>; }
function TerminalIcon(p) { return <Icon {...p}><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></Icon>; }
function ThermometerIcon(p) { return <Icon {...p}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></Icon>; }