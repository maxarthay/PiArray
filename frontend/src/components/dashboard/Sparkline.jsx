import { useMemo } from "react";

/**
 * Sparkline – a tiny SVG line chart.
 *
 * Props:
 *   data      – number[] (required)   e.g. [32, 38, 41, 55, 62]
 *   width     – px width of the SVG   (default 100)
 *   height    – px height of the SVG  (default 28)
 *   color     – stroke colour         (default "#6366f1")
 *   fillColor – gradient fill beneath (default derived from color at 15% opacity, pass null to disable)
 *   lineWidth – stroke width           (default 1.5)
 *   animate   – draw-in animation      (default true)
 */
export default function Sparkline({
    data = [],
    width = 100,
    height = 28,
    color = "#6366f1",
    fillColor,
    lineWidth = 1.5,
    animate = true,
}) {
    // Build polyline points – scale data into [padding .. height-padding]
    const { linePath, areaPath, pathLength } = useMemo(() => {
        if (!data || data.length < 2) return { linePath: "", areaPath: "", pathLength: 0 };

        const padY = 3; // vertical padding so peaks don't clip
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1; // avoid /0

        const points = data.map((v, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - padY - ((v - min) / range) * (height - padY * 2);
            return [x, y];
        });

        const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

        // Closed area path for gradient fill
        const area =
            `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)} ` +
            points.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(" ") +
            ` L${width},${height} L0,${height} Z`;

        // Approximate total polyline length for dash animation
        let len = 0;
        for (let i = 1; i < points.length; i++) {
            const dx = points[i][0] - points[i - 1][0];
            const dy = points[i][1] - points[i - 1][1];
            len += Math.sqrt(dx * dx + dy * dy);
        }

        return { linePath: line, areaPath: area, pathLength: Math.ceil(len) };
    }, [data, width, height]);

    if (!data || data.length < 2) return null;

    const uid = useMemo(() => `sp-${Math.random().toString(36).slice(2, 8)}`, []);

    const resolvedFill = fillColor === null ? "none" : fillColor ?? `${color}22`;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ display: "block", overflow: "visible" }}
        >
            <defs>
                <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Area fill */}
            <path d={areaPath} fill={`url(#${uid})`} />

            {/* Line */}
            <polyline
                points={linePath}
                fill="none"
                stroke={color}
                strokeWidth={lineWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={
                    animate
                        ? {
                              strokeDasharray: pathLength,
                              strokeDashoffset: pathLength,
                              animation: `sparkline-draw 0.8s ease-out forwards`,
                          }
                        : undefined
                }
            />

            {/* Dot at the last data point */}
            <circle
                cx={(width).toFixed(1)}
                cy={(() => {
                    const padY = 3;
                    const min = Math.min(...data);
                    const max = Math.max(...data);
                    const range = max - min || 1;
                    return height - padY - ((data[data.length - 1] - min) / range) * (height - padY * 2);
                })()}
                r={2}
                fill={color}
                style={animate ? { opacity: 0, animation: `sparkline-dot 0.3s ease-out 0.7s forwards` } : undefined}
            />

            <style>{`
                @keyframes sparkline-draw {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes sparkline-dot {
                    to { opacity: 1; }
                }
            `}</style>
        </svg>
    );
}
