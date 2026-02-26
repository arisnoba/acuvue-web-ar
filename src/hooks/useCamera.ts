'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CameraConfig } from '@/types';

interface UseCameraReturn {
	videoRef: React.RefObject<HTMLVideoElement | null>;
	stream: MediaStream | null;
	isReady: boolean;
	error: string | null;
	startCamera: () => Promise<void>;
	stopCamera: () => void;
}

const DEFAULT_CONFIG: CameraConfig = {
	width: 640,
	height: 480,
	facingMode: 'user',
};

export function useCamera(config: Partial<CameraConfig> = {}): UseCameraReturn {
	const mergedConfig = { ...DEFAULT_CONFIG, ...config };
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const stopCamera = useCallback(() => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			setStream(null);
			setIsReady(false);
		}
	}, [stream]);

	const startCamera = useCallback(async () => {
		try {
			setError(null);

			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: mergedConfig.facingMode,
					width: { ideal: mergedConfig.width },
					height: { ideal: mergedConfig.height },
				},
				audio: false,
			});

			setStream(mediaStream);

			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream;
				videoRef.current.setAttribute('playsinline', 'true');
				videoRef.current.setAttribute('muted', 'true');
				await videoRef.current.play();
				setIsReady(true);
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Camera access denied';
			setError(message);
		}
	}, [mergedConfig.facingMode, mergedConfig.width, mergedConfig.height]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, [stream]);

	return { videoRef, stream, isReady, error, startCamera, stopCamera };
}
