'use client';

import { motion } from 'framer-motion';
import type { EyePosition } from '@/types';

interface LockOnFrameProps {
	leftEye: EyePosition;
	rightEye: EyePosition;
	canvasWidth: number;
	canvasHeight: number;
	visible: boolean;
	locked: boolean;
}

export default function LockOnFrame({ leftEye, rightEye, canvasWidth, canvasHeight, visible, locked }: LockOnFrameProps) {
	if (!visible) {
		return null;
	}

	// Mirror X for front camera
	const lx = (1 - leftEye.x) * canvasWidth;
	const ly = leftEye.y * canvasHeight;
	const rx = (1 - rightEye.x) * canvasWidth;
	const ry = rightEye.y * canvasHeight;

	// Calculate bounding box around both eyes with padding
	const padding = 30;
	const left = Math.min(lx, rx) - padding;
	const top = Math.min(ly, ry) - padding * 1.5;
	const width = Math.abs(rx - lx) + padding * 2;
	const height = Math.abs(ry - ly) + padding * 3;

	const borderColor = locked ? 'var(--hud-secondary)' : 'var(--hud-primary)';

	return (
		<motion.div
			className="pointer-events-none absolute"
			style={{ left, top, width, height }}
			initial={{ opacity: 0, scale: 1.3 }}
			animate={{
				opacity: 1,
				scale: 1,
				borderColor,
			}}
			exit={{ opacity: 0, scale: 0.8 }}
			transition={{ type: 'spring', stiffness: 200, damping: 20 }}
		>
			{/* Corner brackets - Top Left */}
			<svg className="absolute -left-px -top-px" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path d="M1 15 L1 1 L15 1" stroke={borderColor} strokeWidth="2" />
			</svg>
			{/* Top Right */}
			<svg className="absolute -right-px -top-px" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path d="M5 1 L19 1 L19 15" stroke={borderColor} strokeWidth="2" />
			</svg>
			{/* Bottom Left */}
			<svg className="absolute -bottom-px -left-px" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path d="M1 5 L1 19 L15 19" stroke={borderColor} strokeWidth="2" />
			</svg>
			{/* Bottom Right */}
			<svg className="absolute -bottom-px -right-px" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path d="M5 19 L19 19 L19 5" stroke={borderColor} strokeWidth="2" />
			</svg>

			{/* Dashed border */}
			<div
				className="h-full w-full"
				style={{
					border: `1px dashed ${borderColor}`,
					opacity: 0.3,
				}}
			/>

			{/* Lock status */}
			{locked && (
				<motion.div
					className="hud-text absolute -top-5 left-0 text-[9px]"
					style={{ color: 'var(--hud-secondary)' }}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
				>
					&#9679; LOCKED ON
				</motion.div>
			)}
		</motion.div>
	);
}
