import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ScreenPlane from './screen-plane';

interface Props {
    effect: number,
}

const Scene = ({ effect }: Props) => {
	return (
		<Canvas
			orthographic
			camera={{ zoom: 1, position: [0, 0, 1] }}
			dpr={[1, 2]}
			className="!w-[80vw] !h-[64vw] landscape:!w-[50vw] landscape:!h-[40vw]"
		>
			<Suspense fallback={null}>
				<ScreenPlane effect={effect} />
			</Suspense>
		</Canvas>
	)
};

export default Scene;
