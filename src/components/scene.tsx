import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ScreenPlane from './screen-plane';

const Scene = () => {
	return (
		<Canvas
			orthographic
			camera={{ zoom: 1, position: [0, 0, 1] }}
			dpr={[1, 2]}
			style={{ width: "50vw", height: "40vw" }}
		>
			<Suspense fallback={null}>
				<ScreenPlane />
			</Suspense>
		</Canvas>
	)
};

export default Scene;
