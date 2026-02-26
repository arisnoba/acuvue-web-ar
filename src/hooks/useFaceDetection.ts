'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FaceDetectionResult } from '@/types';
import { extractEyePositions } from '@/utils/landmarks';
import { EMASmoother } from '@/utils/smoothing';

interface UseFaceDetectionReturn {
	result: FaceDetectionResult;
	isModelLoaded: boolean;
	loadProgress: number;
	error: string | null;
	detect: (video: HTMLVideoElement) => void;
}

const DEFAULT_RESULT: FaceDetectionResult = {
	leftEye: { x: 0.35, y: 0.4, radius: 0.02 },
	rightEye: { x: 0.65, y: 0.4, radius: 0.02 },
	faceDetected: false,
	landmarks: null,
};

export function useFaceDetection(): UseFaceDetectionReturn {
	const [result, setResult] = useState<FaceDetectionResult>(DEFAULT_RESULT);
	const [isModelLoaded, setIsModelLoaded] = useState(false);
	const [loadProgress, setLoadProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const faceLandmarkerRef = useRef<any>(null);
	const lastVideoTimeRef = useRef<number>(-1);
	const leftSmootherRef = useRef(new EMASmoother(0.3));
	const rightSmootherRef = useRef(new EMASmoother(0.3));

	// Initialize MediaPipe FaceLandmarker
	useEffect(() => {
		let cancelled = false;

		async function init() {
			try {
				setLoadProgress(10);

				const vision = await import('@mediapipe/tasks-vision');
				const { FaceLandmarker, FilesetResolver } = vision;

				if (cancelled) {
					return;
				}
				setLoadProgress(30);

				const filesetResolver = await FilesetResolver.forVisionTasks(
					'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
				);

				if (cancelled) {
					return;
				}
				setLoadProgress(60);

				const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
					baseOptions: {
						modelAssetPath:
							'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
						delegate: 'GPU',
					},
					runningMode: 'VIDEO',
					numFaces: 1,
					outputFaceBlendshapes: false,
					outputFacialTransformationMatrixes: false,
				});

				if (cancelled) {
					return;
				}

				faceLandmarkerRef.current = landmarker;
				setLoadProgress(100);
				setIsModelLoaded(true);
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : 'Failed to load face detection model');
				}
			}
		}

		init();

		return () => {
			cancelled = true;
			faceLandmarkerRef.current?.close();
		};
	}, []);

	const detect = useCallback((video: HTMLVideoElement) => {
		if (!faceLandmarkerRef.current || video.readyState < 2) {
			return;
		}

		// Only process when a new video frame is available
		// video.currentTime stays the same between frames — skip duplicates
		const currentTime = video.currentTime;
		if (currentTime === lastVideoTimeRef.current) {
			return;
		}
		lastVideoTimeRef.current = currentTime;

		try {
			// Use performance.now() as the timestamp but only when video frame has changed
			const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());

			if (results.faceLandmarks && results.faceLandmarks.length > 0) {
				const landmarks = results.faceLandmarks[0];
				const { leftEye, rightEye } = extractEyePositions(landmarks);

				const smoothedLeft = leftSmootherRef.current.smooth(leftEye);
				const smoothedRight = rightSmootherRef.current.smooth(rightEye);

				setResult({
					leftEye: smoothedLeft,
					rightEye: smoothedRight,
					faceDetected: true,
					landmarks: landmarks as unknown as FaceDetectionResult['landmarks'],
				});
			} else {
				setResult((prev) => ({
					...prev,
					faceDetected: false,
				}));
			}
		} catch {
			// Detection frame skip — non-critical, will retry next frame
		}
	}, []);

	return { result, isModelLoaded, loadProgress, error, detect };
}
