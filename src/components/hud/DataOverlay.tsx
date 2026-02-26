'use client';

import { motion } from 'framer-motion';
import type { EyePosition, AppPhase } from '@/types';

interface DataOverlayProps {
	leftEye: EyePosition;
	rightEye: EyePosition;
	phase: AppPhase;
	visible: boolean;
	fps?: number;
}

export default function DataOverlay({ leftEye, rightEye, phase, visible, fps }: DataOverlayProps) {
	if (!visible) {
		return null;
	}

	const formatCoord = (v: number) => v.toFixed(4);

	return (
		<>
			{/* Top-left data */}
			<motion.div
				className="pointer-events-none absolute left-4 top-4 space-y-1"
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.4 }}
			>
				<div className="hud-text text-[9px] text-cyan-400/50">ACUVUE VISION SYS v1.0</div>
				<div className="hud-text text-[9px] text-cyan-400/40">
					STATUS:{' '}
					<span className={phase === 'active' ? 'text-green-400' : 'text-cyan-400'}>{phase.toUpperCase()}</span>
				</div>
				{fps !== undefined && (
					<div className="hud-text text-[9px] text-cyan-400/40">
						FPS: <span className={fps >= 24 ? 'text-green-400' : 'text-orange-400'}>{fps}</span>
					</div>
				)}
			</motion.div>

			{/* Bottom-left eye coordinates */}
			<motion.div
				className="pointer-events-none absolute bottom-16 left-4 space-y-1"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.4, delay: 0.1 }}
			>
				<div className="hud-text text-[9px] text-cyan-400/40">
					L.EYE [{formatCoord(leftEye.x)}, {formatCoord(leftEye.y)}]
				</div>
				<div className="hud-text text-[9px] text-cyan-400/40">
					R.EYE [{formatCoord(rightEye.x)}, {formatCoord(rightEye.y)}]
				</div>
				<div className="hud-text text-[9px] text-cyan-400/40">
					I.RAD [{formatCoord(leftEye.radius)}]
				</div>
			</motion.div>

			{/* Top-right decorative */}
			<motion.div
				className="pointer-events-none absolute right-4 top-4"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.4, delay: 0.2 }}
			>
				<svg width="60" height="40" viewBox="0 0 60 40" fill="none">
					<rect x="0" y="0" width="60" height="2" fill="var(--hud-primary)" opacity="0.2" />
					<rect x="50" y="0" width="10" height="2" fill="var(--hud-primary)" opacity="0.6" />
					<rect x="0" y="8" width="40" height="1" fill="var(--hud-primary)" opacity="0.15" />
					<rect x="0" y="14" width="55" height="1" fill="var(--hud-primary)" opacity="0.1" />
					<rect x="0" y="20" width="30" height="1" fill="var(--hud-primary)" opacity="0.15" />
				</svg>
			</motion.div>

			{/* Scan line effect */}
			{(phase === 'scanning' || phase === 'tracking') && (
				<motion.div
					className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
					animate={{
						top: ['0%', '100%'],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: 'linear',
					}}
				/>
			)}
		</>
	);
}
