import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'ACUVUE - Multifocal Lens AR Experience',
	description: 'Experience the clarity of ACUVUE multifocal contact lenses through augmented reality simulation.',
	keywords: ['ACUVUE', 'contact lens', 'AR', 'multifocal', 'vision simulation'],
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<body>{children}</body>
		</html>
	);
}
