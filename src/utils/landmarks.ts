import type { NormalizedLandmark, EyePosition } from '@/types';

// MediaPipe Face Landmarker 478 landmark indices
export const IRIS_LEFT = [468, 469, 470, 471, 472] as const;
export const IRIS_RIGHT = [473, 474, 475, 476, 477] as const;
export const EYE_LEFT_OUTLINE = [33, 7, 163, 144, 145, 153, 154, 155, 133] as const;
export const EYE_RIGHT_OUTLINE = [362, 382, 381, 380, 374, 373, 390, 249, 263] as const;

export function getIrisCenter(landmarks: NormalizedLandmark[], indices: readonly number[]): { x: number; y: number } {
	let x = 0;
	let y = 0;
	for (const idx of indices) {
		x += landmarks[idx].x;
		y += landmarks[idx].y;
	}
	return { x: x / indices.length, y: y / indices.length };
}

export function getIrisRadius(landmarks: NormalizedLandmark[], indices: readonly number[], center: { x: number; y: number }): number {
	let maxDist = 0;
	for (const idx of indices) {
		const dx = landmarks[idx].x - center.x;
		const dy = landmarks[idx].y - center.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (dist > maxDist) {
			maxDist = dist;
		}
	}
	return maxDist;
}

export function extractEyePositions(landmarks: NormalizedLandmark[]): { leftEye: EyePosition; rightEye: EyePosition } {
	const leftCenter = getIrisCenter(landmarks, IRIS_LEFT);
	const leftRadius = getIrisRadius(landmarks, IRIS_LEFT, leftCenter);

	const rightCenter = getIrisCenter(landmarks, IRIS_RIGHT);
	const rightRadius = getIrisRadius(landmarks, IRIS_RIGHT, rightCenter);

	return {
		leftEye: { ...leftCenter, radius: leftRadius },
		rightEye: { ...rightCenter, radius: rightRadius },
	};
}

export function getEyeOutlineRect(
	landmarks: NormalizedLandmark[],
	indices: readonly number[],
): { x: number; y: number; width: number; height: number } {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	for (const idx of indices) {
		minX = Math.min(minX, landmarks[idx].x);
		minY = Math.min(minY, landmarks[idx].y);
		maxX = Math.max(maxX, landmarks[idx].x);
		maxY = Math.max(maxY, landmarks[idx].y);
	}

	return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
