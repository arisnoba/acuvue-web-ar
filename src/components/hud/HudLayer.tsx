'use client';

import { AnimatePresence } from 'framer-motion';
import type { EyePosition, HudState } from '@/types';
import ScanRing from './ScanRing';
import Crosshair from './Crosshair';
import LockOnFrame from './LockOnFrame';
import DataOverlay from './DataOverlay';

interface HudLayerProps {
	hudState: HudState;
	leftEye: EyePosition;
	rightEye: EyePosition;
	canvasWidth: number;
	canvasHeight: number;
	faceDetected: boolean;
	fps?: number;
}

export default function HudLayer({
	hudState,
	leftEye,
	rightEye,
	canvasWidth,
	canvasHeight,
	faceDetected,
	fps,
}: HudLayerProps) {
	const { phase, scanProgress } = hudState;
	const showScan = phase === 'scanning';
	const showCrosshair = phase === 'tracking' || phase === 'locked' || phase === 'active';
	const showLockOn = phase === 'locked' || phase === 'active';
	const showData = faceDetected && phase !== 'intro' && phase !== 'permission' && phase !== 'loading';

	return (
		<div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
			<AnimatePresence mode="wait">
				{showScan && <ScanRing key="scan" progress={scanProgress} visible={showScan} />}
			</AnimatePresence>

			<AnimatePresence>
				{showCrosshair && faceDetected && (
					<>
						<Crosshair
							key="crosshair-left"
							eyePosition={leftEye}
							canvasWidth={canvasWidth}
							canvasHeight={canvasHeight}
							visible={showCrosshair}
							label="L.IRIS"
						/>
						<Crosshair
							key="crosshair-right"
							eyePosition={rightEye}
							canvasWidth={canvasWidth}
							canvasHeight={canvasHeight}
							visible={showCrosshair}
							label="R.IRIS"
						/>
					</>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showLockOn && faceDetected && (
					<LockOnFrame
						key="lockon"
						leftEye={leftEye}
						rightEye={rightEye}
						canvasWidth={canvasWidth}
						canvasHeight={canvasHeight}
						visible={showLockOn}
						locked={phase === 'locked' || phase === 'active'}
					/>
				)}
			</AnimatePresence>

			<DataOverlay
				leftEye={leftEye}
				rightEye={rightEye}
				phase={phase}
				visible={showData}
				fps={fps}
			/>
		</div>
	);
}
