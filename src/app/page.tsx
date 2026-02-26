'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import CameraView from '@/components/camera/CameraView';
import CameraCanvas from '@/components/camera/CameraCanvas';
import HudLayer from '@/components/hud/HudLayer';
import LensOverlay from '@/components/lens/LensOverlay';
import BeforeAfterToggle from '@/components/lens/BeforeAfterToggle';
import IntroScreen from '@/components/ui/IntroScreen';
import PermissionScreen from '@/components/ui/PermissionScreen';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { useHudAnimation } from '@/hooks/useHudAnimation';
import type { AppPhase } from '@/types';

export default function HomePage() {
	const [phase, setAppPhase] = useState<AppPhase>('intro');
	const [video, setVideo] = useState<HTMLVideoElement | null>(null);
	const [cameraError, setCameraError] = useState<string | null>(null);
	const [lensActive, setLensActive] = useState(false);
	const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });
	const [fps, setFps] = useState(0);

	const { result: faceResult, isModelLoaded, loadProgress, detect } = useFaceDetection();
	const { hudState, setPhase: setHudPhase, triggerScan, triggerLockOn, triggerActivate } = useHudAnimation();

	const rafRef = useRef<number>(0);
	const fpsCounterRef = useRef({ frames: 0, lastTime: performance.now() });

	// Detection loop
	const detectionLoop = useCallback(() => {
		if (video && video.readyState >= 2) {
			detect(video);

			// FPS counting
			fpsCounterRef.current.frames++;
			const now = performance.now();
			if (now - fpsCounterRef.current.lastTime >= 1000) {
				setFps(fpsCounterRef.current.frames);
				fpsCounterRef.current.frames = 0;
				fpsCounterRef.current.lastTime = now;
			}
		}
		rafRef.current = requestAnimationFrame(detectionLoop);
	}, [video, detect]);

	// Start detection loop when camera and model are ready
	useEffect(() => {
		if (video && isModelLoaded && (phase === 'scanning' || phase === 'tracking' || phase === 'locked' || phase === 'active')) {
			rafRef.current = requestAnimationFrame(detectionLoop);
			return () => cancelAnimationFrame(rafRef.current);
		}
	}, [video, isModelLoaded, phase, detectionLoop]);

	// Phase transitions
	useEffect(() => {
		if (phase === 'loading' && isModelLoaded) {
			const timer = setTimeout(() => {
				setAppPhase('scanning');
				setHudPhase('scanning');
				triggerScan();
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [phase, isModelLoaded, setHudPhase, triggerScan]);

	// When face detected during scanning, progress to tracking
	useEffect(() => {
		if (hudState.phase === 'tracking' && faceResult.faceDetected) {
			triggerLockOn();
		}
	}, [hudState.phase, faceResult.faceDetected, triggerLockOn]);

	// When locked, auto-activate after a brief pause
	// Start with lensActive=false (착용 전: eyes clear, rest blurred)
	useEffect(() => {
		if (hudState.phase === 'locked') {
			const timer = setTimeout(() => {
				triggerActivate();
				setAppPhase('active');
				// Start in "before" state — user toggles to "after"
				setLensActive(false);
			}, 1200);
			return () => clearTimeout(timer);
		}
	}, [hudState.phase, triggerActivate]);

	// Update canvas size from video
	useEffect(() => {
		if (video) {
			const updateSize = () => {
				setCanvasSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			};
			updateSize();
			window.addEventListener('resize', updateSize);
			return () => window.removeEventListener('resize', updateSize);
		}
	}, [video]);

	const handleIntroStart = useCallback(() => {
		setAppPhase('permission');
		setHudPhase('permission');
	}, [setHudPhase]);

	const handleCameraReady = useCallback(
		(videoEl: HTMLVideoElement) => {
			setVideo(videoEl);
			setAppPhase('loading');
			setHudPhase('loading');
		},
		[setHudPhase],
	);

	const handleCameraError = useCallback((error: string) => {
		setCameraError(error);
	}, []);

	const handlePermissionAllow = useCallback(() => {
		// Camera will start via CameraView component
	}, []);

	const handleToggleLens = useCallback(() => {
		setLensActive((prev) => !prev);
	}, []);

	const showCamera = phase !== 'intro';
	const showBlur = phase === 'active' || phase === 'locked';

	return (
		<main className="relative h-full w-full overflow-hidden bg-black">
			{/* Camera feed (base layer) */}
			{showCamera && (
				<CameraView onReady={handleCameraReady} onError={handleCameraError} />
			)}

			{/* WebGL blur canvas (over camera when active) */}
			{showBlur && (
				<CameraCanvas
					video={video}
					leftEye={faceResult.leftEye}
					rightEye={faceResult.rightEye}
					lensActive={lensActive}
					faceDetected={faceResult.faceDetected}
				/>
			)}

			{/* Lens texture overlay */}
			<AnimatePresence>
				{phase === 'active' && faceResult.faceDetected && (
					<LensOverlay
						leftEye={faceResult.leftEye}
						rightEye={faceResult.rightEye}
						canvasWidth={canvasSize.width}
						canvasHeight={canvasSize.height}
						visible={phase === 'active'}
					/>
				)}
			</AnimatePresence>

			{/* HUD overlay */}
			<HudLayer
				hudState={hudState}
				leftEye={faceResult.leftEye}
				rightEye={faceResult.rightEye}
				canvasWidth={canvasSize.width}
				canvasHeight={canvasSize.height}
				faceDetected={faceResult.faceDetected}
				fps={fps}
			/>

			{/* Before/After toggle */}
			<AnimatePresence>
				{phase === 'active' && (
					<BeforeAfterToggle
						isAfter={lensActive}
						onToggle={handleToggleLens}
						visible={phase === 'active'}
					/>
				)}
			</AnimatePresence>

			{/* Screen overlays */}
			<AnimatePresence mode="wait">
				{phase === 'intro' && <IntroScreen key="intro" onStart={handleIntroStart} />}
				{phase === 'permission' && (
					<PermissionScreen key="permission" onAllow={handlePermissionAllow} error={cameraError} />
				)}
				{phase === 'loading' && <LoadingScreen key="loading" progress={loadProgress} />}
			</AnimatePresence>
		</main>
	);
}
