'use client';

import { motion } from 'framer-motion';

interface IntroScreenProps {
	onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
	return (
		<motion.div
			className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
			initial={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.6 }}
		>
			{/* Animated rings background */}
			<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
				{[...Array(3)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute rounded-full border border-cyan-500/20"
						style={{ width: 200 + i * 120, height: 200 + i * 120 }}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{
							opacity: [0.1, 0.3, 0.1],
							scale: [0.95, 1.05, 0.95],
							rotate: i % 2 === 0 ? 360 : -360,
						}}
						transition={{
							duration: 8 + i * 2,
							repeat: Infinity,
							ease: 'linear',
							delay: i * 0.5,
						}}
					/>
				))}
			</div>

			{/* Logo / Title */}
			<motion.div
				className="relative z-10 flex flex-col items-center gap-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.3 }}
			>
				<motion.div
					className="hud-text text-center text-xs tracking-[0.3em] text-cyan-400/60"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					ACUVUE VISION SYSTEM
				</motion.div>

				<motion.h1
					className="text-center text-3xl font-extralight tracking-wider text-white"
					initial={{ opacity: 0, letterSpacing: '0.5em' }}
					animate={{ opacity: 1, letterSpacing: '0.2em' }}
					transition={{ duration: 1, delay: 0.6 }}
				>
					MULTIFOCAL
					<br />
					<span className="text-cyan-400">AR EXPERIENCE</span>
				</motion.h1>

				<motion.p
					className="max-w-xs text-center text-sm leading-relaxed text-white/50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1 }}
				>
					다초점 렌즈가 선사하는
					<br />
					선명한 시야를 직접 체험하세요
				</motion.p>

				<motion.button
					className="mt-8 rounded-full border border-cyan-400/50 px-10 py-3 text-sm tracking-widest text-cyan-400 transition-all hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.3 }}
					whileTap={{ scale: 0.95 }}
					onClick={onStart}
				>
					START EXPERIENCE
				</motion.button>
			</motion.div>

			{/* Bottom decorative line */}
			<motion.div
				className="absolute bottom-12 h-px w-32 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
				initial={{ scaleX: 0 }}
				animate={{ scaleX: 1 }}
				transition={{ duration: 1.5, delay: 1.5 }}
			/>
		</motion.div>
	);
}
