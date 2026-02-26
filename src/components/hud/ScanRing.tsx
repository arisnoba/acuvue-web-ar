'use client';

import { motion } from 'framer-motion';

interface ScanRingProps {
	progress: number;
	visible: boolean;
}

export default function ScanRing({ progress, visible }: ScanRingProps) {
	if (!visible) {
		return null;
	}

	return (
		<motion.div
			className="pointer-events-none absolute inset-0 flex items-center justify-center"
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 1.2 }}
			transition={{ duration: 0.5 }}
		>
			{/* Outer rotating ring */}
			<motion.svg
				className="absolute h-64 w-64"
				viewBox="0 0 256 256"
				animate={{ rotate: 360 }}
				transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
			>
				<circle
					cx="128"
					cy="128"
					r="120"
					fill="none"
					stroke="var(--hud-primary)"
					strokeWidth="0.5"
					strokeDasharray="8 4"
					opacity="0.3"
				/>
				<circle
					cx="128"
					cy="128"
					r="110"
					fill="none"
					stroke="var(--hud-primary)"
					strokeWidth="1"
					strokeDasharray={`${progress * 6.91} ${691 - progress * 6.91}`}
					strokeDashoffset="173"
					strokeLinecap="round"
				/>
			</motion.svg>

			{/* Counter-rotating inner ring */}
			<motion.svg
				className="absolute h-48 w-48"
				viewBox="0 0 192 192"
				animate={{ rotate: -360 }}
				transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
			>
				<circle
					cx="96"
					cy="96"
					r="88"
					fill="none"
					stroke="var(--hud-primary)"
					strokeWidth="0.5"
					strokeDasharray="3 8"
					opacity="0.4"
				/>
				{/* Tick marks */}
				{[...Array(12)].map((_, i) => {
					const angle = (i * 30 * Math.PI) / 180;
					const x1 = 96 + 80 * Math.cos(angle);
					const y1 = 96 + 80 * Math.sin(angle);
					const x2 = 96 + 86 * Math.cos(angle);
					const y2 = 96 + 86 * Math.sin(angle);
					return (
						<line
							key={i}
							x1={x1}
							y1={y1}
							x2={x2}
							y2={y2}
							stroke="var(--hud-primary)"
							strokeWidth="1"
							opacity={i % 3 === 0 ? 0.8 : 0.3}
						/>
					);
				})}
			</motion.svg>

			{/* Scan text */}
			<motion.div
				className="hud-text absolute bottom-1/4 text-xs text-cyan-400/70"
				animate={{ opacity: [0.3, 1, 0.3] }}
				transition={{ duration: 1.5, repeat: Infinity }}
			>
				SCANNING FACE... {Math.round(progress)}%
			</motion.div>
		</motion.div>
	);
}
