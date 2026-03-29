import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { REGISTER_PI, GET_FLEET } from '../queries';

const MODELS = ["Raspberry Pi 4B", "Raspberry Pi 5", "Raspberry Pi Zero W", "Raspberry Pi Zero 2W", "Raspberry Pi 3B+"];

export default function Registration({ visible, setVisible }) {
    const [name, setName] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [id, setId] = useState('');
    const [model, setModel] = useState('');
    const [group, setGroup] = useState('');
    const [registerPi, { loading, error }] = useMutation(REGISTER_PI, {
        refetchQueries: [{ query: GET_FLEET }],
    });

    async function handleSubmit() {
        console.log({ id, name, model, groupId: group || null });
        if (!name || !model) return alert("Name and Model are required.");
        await registerPi({
            variables: {
                name,
                ipAddress,
                model,
                groupId: group || null,
            },
        });
        setVisible(false);

    }

    function handleClose() {
        setName(''); setIpAddress(''); setId(''); setModel(''); setGroup('');
        setVisible(false);
    }

    return (
        <>
            {/* Backdrop */}
            {visible && (
                <div
                    onClick={handleClose}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.25)',
                        zIndex: 100,
                        transition: 'opacity 0.2s',
                    }}
                />
            )}

            {/* Slide-in panel */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 340,
                background: '#fff',
                borderLeft: '1px solid #e5e7eb',
                zIndex: 101,
                display: 'flex',
                flexDirection: 'column',
                transform: visible ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.25s ease',
                fontFamily: 'system-ui, sans-serif',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Register device</div>
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Add a new Pi to your fleet</div>
                    </div>
                    <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}>
                        <XIcon />
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Field label="Device name" placeholder="e.g. Pi-001">
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Pi-001" />
                    </Field>
                    <Field label="IP address" placeholder="192.168.1.10">
                        <input value={ipAddress} onChange={e => setIpAddress(e.target.value)} placeholder="192.168.1.10" style={{ fontFamily: 'monospace' }} />
                    </Field>
                    <Field label="Device ID">
                        <input value={id} onChange={e => setId(e.target.value)} placeholder="e.g. abc-123" />
                    </Field>
                    <Field label="Model">
                        <select value={model} onChange={e => setModel(e.target.value)}>
                            <option value="">Select a model…</option>
                            {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </Field>
                    <Field label="Group">
                        <input value={group} onChange={e => setGroup(e.target.value)} placeholder="e.g. Production" />
                    </Field>
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8 }}>
                    <button
                        onClick={handleClose}
                        style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit} disabled={loading}
                        style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', background: '#185FA5', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </div>
                {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
            </div>
        </>
    );
}

function Field({ label, children }) {
    const inputStyle = {
        width: '100%', padding: '7px 10px',
        border: '1px solid #e5e7eb', borderRadius: 8,
        fontSize: 13, color: '#111', background: '#fff',
        outline: 'none', boxSizing: 'border-box',
        appearance: 'none',
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{label}</label>
            {/* Clone the child input/select with the shared style */}
            {typeof children.type === 'string'
                ? <children.type {...children.props} style={{ ...inputStyle, ...children.props.style }} />
                : children
            }
        </div>
    );
}

function XIcon() {
    return (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    );
}