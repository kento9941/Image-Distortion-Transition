import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from '@react-three/fiber';
import { Plane, useTexture } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import vertex from "../../shaders/vertex-shader.glsl";
import fragment1 from "../../shaders/fragment-shader1.glsl";
import fragment2 from "../../shaders/fragment-shader2.glsl";
import fragment3 from "../../shaders/fragment-shader3.glsl";
import { publicPath } from "../../utils/public-path";

interface Props {
    effect: number,
}

const ScreenPlane = ({ effect }: Props) => {
    const { viewport } = useThree();
    const meshRef = useRef<THREE.Mesh>(null!);

    const images = [
        useTexture(publicPath("images/image1.webp")),
        useTexture(publicPath("images/image2.webp")),
        useTexture(publicPath("images/image3.webp")),
        useTexture(publicPath("images/image4.webp")),
    ];
    const displacement = useTexture(publicPath("images/displacement1.webp"));
    const fragments = [fragment1, fragment2, fragment3];

    const prevIndex = useRef(0);
    const currentIndex = useRef(0);
    const inProgress = useRef(false);
    const progress = useRef(0);

    const shader = useMemo(() => {
        return {
            uniforms: {
                u_currentImage: { value: new THREE.Texture },
                u_prevImage: { value: new THREE.Texture },
                u_displacement: { value: new THREE.Texture },
                u_uvScale: { value: new THREE.Vector2(1, 1) },
                u_progress: { value: 0 }
            },
            vertexShader: vertex,
            fragmentShader: fragments[effect],
        }
    }, []);

    // -----------------------------
    // update aspect ratio for each image
    const updateAspect = (index: number) => {
        const image = images[index].image;
        if (image instanceof HTMLImageElement) {
            const textureAspect = image.width / image.height;
            const aspect = viewport.aspect;
            const ratio = aspect / textureAspect;
            const [x, y] = aspect < textureAspect ? [ratio, 1] : [1, 1 / ratio];
            shader.uniforms.u_uvScale.value.set(x, y);
        }
    };

    useEffect(() => {
        updateAspect(currentIndex.current);
    }, [viewport]);

    // -----------------------------
    // toggle fragment shaders
    useEffect(() => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.fragmentShader = fragments[effect];
            material.needsUpdate = true;
        }
    }, [effect]);

    useFrame((_state, delta)=> {
        // transition progress
        if (inProgress.current && progress.current < 1.0) {
            progress.current += delta * 0.8;
            if (progress.current >= 1.0) {
                progress.current = 1.0;
                inProgress.current = false;
            };

            // progress with easing
            let eased = progress.current;
            if (effect === 0) eased = easeOutExpo(progress.current);
            else if (effect === 1) eased = easeInOutCubic(progress.current);
            else if (effect === 2) eased = easeInOutCubic(progress.current);

            shader.uniforms.u_progress.value = eased;
        };

        shader.uniforms.u_displacement.value = displacement;
        shader.uniforms.u_currentImage.value = images[currentIndex.current];
        shader.uniforms.u_prevImage.value = images[prevIndex.current];
    });

    // -----------------------------
    // easings
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const easeInOutCubic = (t: number) => {
        return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    // -----------------------------
    // scroll event
    const handleWheel = (e: ThreeEvent<WheelEvent>) => {
        // prevent triggering other scroll events
        e.stopPropagation();
        if (inProgress.current) return;

        // stop wheel event until progress is 1.0
        inProgress.current = true;
        progress.current = 0;

        prevIndex.current = currentIndex.current;

        const { deltaX, deltaY } = e.nativeEvent;

        if (deltaX > 0 || deltaY > 0) {
            currentIndex.current = (currentIndex.current + 1) % images.length;
        } else {
            currentIndex.current = (currentIndex.current + images.length - 1) % images.length;
        }

        // update aspect ration when switching images
        updateAspect(currentIndex.current);
    };

    // -----------------------------
    // mobile touch events
    const touchStartPos = useRef(0);

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        touchStartPos.current = e.clientY;
    };

    const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
        if (inProgress.current) return;

        const touchEndPos = e.clientY;
        const distance = touchStartPos.current - touchEndPos;

        if (Math.abs(distance) > 10) {
            // stop touch event until progress is 1.0
            inProgress.current = true;
            progress.current = 0;

            prevIndex.current = currentIndex.current;
            if (distance > 0) {
                currentIndex.current = (currentIndex.current + 1) % images.length;
            } else {
                currentIndex.current = (currentIndex.current + images.length - 1) % images.length;
            }

            updateAspect(currentIndex.current);
        }
    };

    return (
        <Plane 
            ref={meshRef} 
            args={[viewport.width, viewport.height]} 
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
        >
            <shaderMaterial args={[shader]} />
        </Plane>
    )
};

export default ScreenPlane;
