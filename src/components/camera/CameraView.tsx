'use client';

import { useEffect } from 'react';
import { useCamera } from '@/hooks/useCamera';

interface CameraViewProps {
	onReady?: (video: HTMLVideoElement) => void;
	onError?: (error: string) => void;
}

export default function CameraView({ onReady, onError }: CameraViewProps) {
	const { videoRef, isReady, error, startCamera } = useCamera();

	useEffect(() => {
		startCamera();
	}, [startCamera]);

	useEffect(() => {
		if (isReady && videoRef.current) {
			onReady?.(videoRef.current);
		}
	}, [isReady, onReady, videoRef]);

	useEffect(() => {
		if (error) {
			onError?.(error);
		}
	}, [error, onError]);

	return (
		<video
			ref={videoRef}
			className="absolute inset-0 h-full w-full object-cover"
			style={{ transform: 'scaleX(-1)' }}
			playsInline
			muted
			autoPlay
		/>
	);
}
