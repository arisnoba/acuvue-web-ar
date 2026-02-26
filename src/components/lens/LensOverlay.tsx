'use client';

import { motion } from 'framer-motion';
import type { EyePosition } from '@/types';

interface LensOverlayProps {
	leftEye: EyePosition;
	rightEye: EyePosition;
	canvasWidth: number;
	canvasHeight: number;
	visible: boolean;
}

export default function LensOverlay({ leftEye, rightEye, canvasWidth, canvasHeight, visible }: LensOverlayProps) {
	if (!visible) {
		return null;
	}

	const renderLens = (eye: EyePosition) => {
		const x = (1 - eye.x) * canvasWidth;
		const y = eye.y * canvasHeight;
		const r = Math.max(eye.radius * canvasWidth * 2.5, 20);

		return (
			<motion.div
				className="pointer-events-none absolute"
				style={{
					left: x - r,
					top: y - r,
					width: r * 2,
					height: r * 2,
				}}
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.5 }}
				transition={{ type: 'spring', stiffness: 200, damping: 15 }}
			>
				<svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
					{/* Outer lens ring */}
					<circle
						cx="50"
						cy="50"
						r="48"
						stroke="var(--hud-primary)"
						strokeWidth="0.5"
						opacity="0.3"
					/>
					{/* Inner lens circle */}
					<circle
						cx="50"
						cy="50"
						r="35"
						stroke="var(--hud-primary)"
						strokeWidth="0.3"
						opacity="0.2"
					/>
					{/* Lens reflection highlight */}
					<ellipse
						cx="40"
						cy="40"
						rx="12"
						ry="8"
						fill="white"
						opacity="0.05"
						transform="rotate(-30 40 40)"
					/>
					{/* Center iris indicator */}
					<circle
						cx="50"
						cy="50"
						r="4"
						fill="var(--hud-primary)"
						opacity="0.15"
					/>
				</svg>
			</motion.div>
		);
	};

	return (
		<div className="pointer-events-none absolute inset-0 z-20">
			{renderLens(leftEye)}
			{renderLens(rightEye)}
		</div>
	);
}
