'use client';

import { motion } from 'framer-motion';
import type { EyePosition } from '@/types';

interface CrosshairProps {
	eyePosition: EyePosition;
	canvasWidth: number;
	canvasHeight: number;
	visible: boolean;
	label?: string;
}

export default function Crosshair({ eyePosition, canvasWidth, canvasHeight, visible, label }: CrosshairProps) {
	if (!visible) {
		return null;
	}

	// Mirror X for front camera display
	const x = (1 - eyePosition.x) * canvasWidth;
	const y = eyePosition.y * canvasHeight;
	const size = 40;

	return (
		<motion.div
			className="pointer-events-none absolute"
			style={{
				left: x - size / 2,
				top: y - size / 2,
				width: size,
				height: size,
			}}
			initial={{ opacity: 0, scale: 2 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.5 }}
			transition={{ type: 'spring', stiffness: 300, damping: 20 }}
		>
			<svg width={size} height={size} viewBox="0 0 40 40" fill="none">
				{/* Horizontal line */}
				<line x1="0" y1="20" x2="15" y2="20" stroke="var(--hud-primary)" strokeWidth="1" opacity="0.6" />
				<line x1="25" y1="20" x2="40" y2="20" stroke="var(--hud-primary)" strokeWidth="1" opacity="0.6" />
				{/* Vertical line */}
				<line x1="20" y1="0" x2="20" y2="15" stroke="var(--hud-primary)" strokeWidth="1" opacity="0.6" />
				<line x1="20" y1="25" x2="20" y2="40" stroke="var(--hud-primary)" strokeWidth="1" opacity="0.6" />
				{/* Center dot */}
				<circle cx="20" cy="20" r="2" fill="var(--hud-primary)" opacity="0.8" />
				{/* Corner brackets */}
				<path d="M4 4 L4 10 M4 4 L10 4" stroke="var(--hud-primary)" strokeWidth="1.5" />
				<path d="M36 4 L36 10 M36 4 L30 4" stroke="var(--hud-primary)" strokeWidth="1.5" />
				<path d="M4 36 L4 30 M4 36 L10 36" stroke="var(--hud-primary)" strokeWidth="1.5" />
				<path d="M36 36 L36 30 M36 36 L30 36" stroke="var(--hud-primary)" strokeWidth="1.5" />
			</svg>

			{/* Label */}
			{label && (
				<motion.span
					className="hud-text absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] text-cyan-400/60"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
				>
					{label}
				</motion.span>
			)}
		</motion.div>
	);
}
