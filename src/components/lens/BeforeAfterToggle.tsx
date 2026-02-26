'use client';

import { motion } from 'framer-motion';

interface BeforeAfterToggleProps {
	isAfter: boolean;
	onToggle: () => void;
	visible: boolean;
}

export default function BeforeAfterToggle({ isAfter, onToggle, visible }: BeforeAfterToggleProps) {
	if (!visible) {
		return null;
	}

	return (
		<motion.div
			className="absolute bottom-8 left-1/2 z-40 -translate-x-1/2"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.4 }}
		>
			<button
				className="flex items-center gap-3 rounded-full border border-white/20 bg-black/60 px-6 py-3 backdrop-blur-sm"
				onClick={onToggle}
			>
				<span className={`hud-text text-xs transition-colors ${!isAfter ? 'text-white' : 'text-white/30'}`}>
					착용 전
				</span>

				{/* Toggle switch */}
				<div className="relative h-6 w-12 rounded-full bg-white/10">
					<motion.div
						className="absolute top-1 h-4 w-4 rounded-full"
						style={{
							backgroundColor: isAfter ? 'var(--hud-secondary)' : 'var(--hud-primary)',
						}}
						animate={{ left: isAfter ? 28 : 4 }}
						transition={{ type: 'spring', stiffness: 500, damping: 30 }}
					/>
				</div>

				<span className={`hud-text text-xs transition-colors ${isAfter ? 'text-green-400' : 'text-white/30'}`}>
					착용 후
				</span>
			</button>

			{/* Subtle hint text */}
			<motion.p
				className="mt-2 text-center text-[10px] text-white/20"
				animate={{ opacity: [0.2, 0.5, 0.2] }}
				transition={{ duration: 3, repeat: Infinity }}
			>
				탭하여 전환
			</motion.p>
		</motion.div>
	);
}
