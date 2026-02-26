'use client';

import { motion } from 'framer-motion';

interface PermissionScreenProps {
	onAllow: () => void;
	error?: string | null;
}

export default function PermissionScreen({ onAllow, error }: PermissionScreenProps) {
	return (
		<motion.div
			className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.4 }}
		>
			{/* Camera icon */}
			<motion.div
				className="mb-8"
				initial={{ scale: 0.5, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
			>
				<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="32" cy="34" r="12" stroke="#00e5ff" strokeWidth="1.5" />
					<circle cx="32" cy="34" r="6" fill="#00e5ff" fillOpacity="0.2" stroke="#00e5ff" strokeWidth="1" />
					<rect x="8" y="20" width="48" height="32" rx="4" stroke="#00e5ff" strokeWidth="1.5" />
					<path d="M22 20L26 12H38L42 20" stroke="#00e5ff" strokeWidth="1.5" />
				</svg>
			</motion.div>

			<motion.h2
				className="mb-3 text-xl font-light tracking-wider text-white"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
			>
				카메라 접근 권한
			</motion.h2>

			<motion.p
				className="mb-8 max-w-xs text-center text-sm leading-relaxed text-white/50"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
			>
				AR 체험을 위해 전면 카메라 접근 권한이 필요합니다.
				<br />
				영상은 기기 내에서만 처리되며 서버로 전송되지 않습니다.
			</motion.p>

			{error && (
				<motion.div
					className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
				>
					{error === 'Camera access denied'
						? '카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 접근을 허용해 주세요.'
						: error}
				</motion.div>
			)}

			<motion.button
				className="rounded-full border border-cyan-400/50 px-8 py-3 text-sm tracking-widest text-cyan-400 transition-all hover:border-cyan-400 hover:bg-cyan-400/10"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.7 }}
				whileTap={{ scale: 0.95 }}
				onClick={onAllow}
			>
				카메라 허용
			</motion.button>
		</motion.div>
	);
}
