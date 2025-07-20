import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Use3DModelOptions {
  modelPath: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  carouselRef: React.RefObject<HTMLDivElement | null>;
  scale?: number;
  ambientLightIntensity?: number;
  pointLightIntensity?: number;
}

export const use3DModel = ({
  modelPath,
  containerRef,
  carouselRef,
  scale = 10,
  ambientLightIntensity = 3,
  pointLightIntensity = 7,
}: Use3DModelOptions) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!mountRef.current) return;
    const mount = mountRef.current;

    // Initialize Three.js scene
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    // Camera position will be set after model loads

    rendererRef.current = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    rendererRef.current.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(rendererRef.current.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      ambientLightIntensity
    );
    sceneRef.current.add(ambientLight);
    pointLightRef.current = new THREE.PointLight(
      0xffffff,
      pointLightIntensity,
      100
    );
    pointLightRef.current.position.set(10, 10, 10);
    sceneRef.current.add(pointLightRef.current);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      modelRef.current = gltf.scene;
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);
      modelRef.current.scale.set(scale, scale, scale);
      sceneRef.current?.add(modelRef.current);

      // Setup materials for opacity animation
      const materials: THREE.Material[] = [];
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.transparent = true;
              materials.push(mat);
            });
          } else {
            child.material.transparent = true;
            materials.push(child.material);
          }
        }
      });

      // Get the bounding box after scaling to position camera at top of letter B
      const scaledBox = new THREE.Box3().setFromObject(modelRef.current);
      const topY = scaledBox.max.y; // Top of the letter B
      const frontZ = scaledBox.max.z; // Front face of the letter B

      // Position camera very close to the top of letter B, but outside the object
      if (cameraRef.current) {
        cameraRef.current.position.set(
          1.5, // X: centered horizontally
          topY + 0.5, // Y: slightly above the top of the letter
          frontZ + 5 // Z: just outside the front face of the letter
        );
        cameraRef.current.lookAt(0, topY, 0); // Look at the top of the letter
      }

      // Setup scroll-triggered animations - starts very close, zooms out on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: () =>
            carouselRef.current
              ? `${carouselRef.current.offsetTop + carouselRef.current.offsetHeight}px`
              : "bottom top",
          scrub: 1,
        },
      });

      if (cameraRef.current && modelRef.current) {
        modelRef.current.position.set(0, 0, 0);
        cameraRef.current.position.set(0, 0, 8);

        tl.to(cameraRef.current.position, {
          z: 2,
          duration: 0.4,
          ease: "power2.out",
        })
          .to(cameraRef.current.position, {
            z: 10,
            duration: 0.4,
            ease: "power2.in",
          })
          .to(
            modelRef.current.rotation,
            {
              y: Math.PI * 3,
              duration: 0.8,
              ease: "power1.inOut",
            },
            0
          )
          .to(
            cameraRef.current.rotation,
            {
              x: 0,
              y: 0,
              z: 0,
              ease: "power1.inOut",
            },
            0
          )
          .to(
            materials,
            {
              opacity: 0,
              duration: 0.1,
              ease: "power2.out",
            },
            0.52
          );
      }
    });

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      if (pointLightRef.current) {
        pointLightRef.current.position.x = Math.sin(elapsedTime * 0.5) * 10;
        pointLightRef.current.position.y = Math.cos(elapsedTime * 0.5) * 10;
      }

      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect =
          mountRef.current.clientWidth / mountRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(
          mountRef.current.clientWidth,
          mountRef.current.clientHeight
        );
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mount && rendererRef.current?.domElement) {
        mount.removeChild(rendererRef.current.domElement);
      }
    };
  }, [
    modelPath,
    containerRef,
    carouselRef,
    scale,
    ambientLightIntensity,
    pointLightIntensity,
  ]);

  return { mountRef };
};
