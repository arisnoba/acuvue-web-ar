'use client';

import { motion } from 'framer-motion';

interface LoadingScreenProps {
	progress: number;
	message?: string;
}

export default function LoadingScreen({ progress, message = 'AI 모델 로딩 중...' }: LoadingScreenProps) {
	return (
		<motion.div
			className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			{/* Scanning animation */}
			<motion.div className="relative mb-10 h-24 w-24">
				{/* Outer ring */}
				<motion.svg
					className="absolute inset-0"
					viewBox="0 0 96 96"
					animate={{ rotate: 360 }}
					transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
				>
					<circle
						cx="48"
						cy="48"
						r="44"
						fill="none"
						stroke="#00e5ff"
						strokeWidth="1"
						strokeDasharray="20 10"
						opacity="0.3"
					/>
				</motion.svg>

				{/* Progress arc */}
				<svg className="absolute inset-0" viewBox="0 0 96 96">
					<circle
						cx="48"
						cy="48"
						r="38"
						fill="none"
						stroke="#00e5ff"
						strokeWidth="2"
						strokeDasharray={`${progress * 2.39} ${239 - progress * 2.39}`}
						strokeDashoffset="60"
						strokeLinecap="round"
						style={{ transition: 'stroke-dasharray 0.3s ease' }}
					/>
				</svg>

				{/* Center percentage */}
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="hud-text text-lg text-cyan-400">{Math.round(progress)}%</span>
				</div>
			</motion.div>

			<motion.p
				className="hud-text text-xs text-cyan-400/70"
				animate={{ opacity: [0.5, 1, 0.5] }}
				transition={{ duration: 2, repeat: Infinity }}
			>
				{message}
			</motion.p>

			{/* Loading details */}
			<motion.div
				className="mt-6 space-y-1 text-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
			>
				<p className="hud-text text-[9px] text-white/30">
					{progress < 30 && 'INITIALIZING VISION MODULE'}
					{progress >= 30 && progress < 60 && 'DOWNLOADING FACE DETECTION MODEL'}
					{progress >= 60 && progress < 100 && 'CONFIGURING IRIS TRACKER'}
					{progress >= 100 && 'SYSTEM READY'}
				</p>
			</motion.div>
		</motion.div>
	);
}
