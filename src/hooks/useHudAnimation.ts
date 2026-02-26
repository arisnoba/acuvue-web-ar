'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppPhase, HudState } from '@/types';

interface UseHudAnimationReturn {
	hudState: HudState;
	setPhase: (phase: AppPhase) => void;
	triggerScan: () => void;
	triggerLockOn: () => void;
	triggerActivate: () => void;
	reset: () => void;
}

export function useHudAnimation(): UseHudAnimationReturn {
	const [hudState, setHudState] = useState<HudState>({
		phase: 'intro',
		scanProgress: 0,
		lockOnProgress: 0,
	});

	const scanTimerRef = useRef<number | null>(null);
	const lockOnTimerRef = useRef<number | null>(null);

	const setPhase = useCallback((phase: AppPhase) => {
		setHudState((prev) => ({ ...prev, phase }));
	}, []);

	const triggerScan = useCallback(() => {
		setHudState((prev) => ({ ...prev, phase: 'scanning', scanProgress: 0 }));

		let progress = 0;
		const interval = window.setInterval(() => {
			progress += 2;
			if (progress >= 100) {
				window.clearInterval(interval);
				setHudState((prev) => ({ ...prev, scanProgress: 100, phase: 'tracking' }));
			} else {
				setHudState((prev) => ({ ...prev, scanProgress: progress }));
			}
		}, 30);

		scanTimerRef.current = interval;
	}, []);

	const triggerLockOn = useCallback(() => {
		setHudState((prev) => ({ ...prev, phase: 'tracking', lockOnProgress: 0 }));

		let progress = 0;
		const interval = window.setInterval(() => {
			progress += 3;
			if (progress >= 100) {
				window.clearInterval(interval);
				setHudState((prev) => ({ ...prev, lockOnProgress: 100, phase: 'locked' }));
			} else {
				setHudState((prev) => ({ ...prev, lockOnProgress: progress }));
			}
		}, 40);

		lockOnTimerRef.current = interval;
	}, []);

	const triggerActivate = useCallback(() => {
		setHudState((prev) => ({ ...prev, phase: 'active' }));
	}, []);

	const reset = useCallback(() => {
		if (scanTimerRef.current) {
			window.clearInterval(scanTimerRef.current);
		}
		if (lockOnTimerRef.current) {
			window.clearInterval(lockOnTimerRef.current);
		}
		setHudState({ phase: 'intro', scanProgress: 0, lockOnProgress: 0 });
	}, []);

	useEffect(() => {
		return () => {
			if (scanTimerRef.current) {
				window.clearInterval(scanTimerRef.current);
			}
			if (lockOnTimerRef.current) {
				window.clearInterval(lockOnTimerRef.current);
			}
		};
	}, []);

	return { hudState, setPhase, triggerScan, triggerLockOn, triggerActivate, reset };
}
