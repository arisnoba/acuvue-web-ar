import type { EyePosition } from '@/types';

/**
 * Exponential Moving Average (EMA) smoother for reducing jitter.
 */
export class EMASmoother {
	private alpha: number;
	private prev: EyePosition | null = null;

	constructor(alpha = 0.3) {
		this.alpha = alpha;
	}

	smooth(current: EyePosition): EyePosition {
		if (!this.prev) {
			this.prev = { ...current };
			return current;
		}

		const smoothed: EyePosition = {
			x: this.alpha * current.x + (1 - this.alpha) * this.prev.x,
			y: this.alpha * current.y + (1 - this.alpha) * this.prev.y,
			radius: this.alpha * current.radius + (1 - this.alpha) * this.prev.radius,
		};

		this.prev = { ...smoothed };
		return smoothed;
	}

	reset(): void {
		this.prev = null;
	}
}

/**
 * Linear interpolation between two values.
 */
export function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * Math.min(1, Math.max(0, t));
}

/**
 * Smoothly interpolate an EyePosition.
 */
export function lerpEyePosition(a: EyePosition, b: EyePosition, t: number): EyePosition {
	return {
		x: lerp(a.x, b.x, t),
		y: lerp(a.y, b.y, t),
		radius: lerp(a.radius, b.radius, t),
	};
}
