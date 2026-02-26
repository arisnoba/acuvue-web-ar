export interface EyePosition {
	x: number;
	y: number;
	radius: number;
}

export interface FaceDetectionResult {
	leftEye: EyePosition;
	rightEye: EyePosition;
	faceDetected: boolean;
	landmarks: NormalizedLandmark[] | null;
}

export interface NormalizedLandmark {
	x: number;
	y: number;
	z: number;
}

export type AppPhase = 'intro' | 'permission' | 'loading' | 'scanning' | 'tracking' | 'locked' | 'active';

export interface HudState {
	phase: AppPhase;
	scanProgress: number;
	lockOnProgress: number;
}

export interface BlurConfig {
	enabled: boolean;
	amount: number;
	radius: number;
	fadeRange: number;
}

export interface CameraConfig {
	width: number;
	height: number;
	facingMode: 'user' | 'environment';
}
