"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlasmaProps {
  color?: string;
  speed?: number;
  opacity?: number;
  interactive?: boolean;
}

const PlasmaPlane = ({ color, speed, opacity }: PlasmaProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const { clock } = state;
    const time = clock.getElapsedTime() * (speed || 0.6);

    const position = meshRef.current.geometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);

      const x = vertex.x;
      const y = vertex.y;

      vertex.z =
        Math.sin(x * 0.5 + time) * 0.5 +
        Math.cos(y * 0.3 + time * 0.8) * 0.5 +
        Math.sin((x + y) * 0.2 + time * 0.5) * 0.3;

      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    position.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20, 50, 50]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
    </mesh>
  );
};

export default function Plasma({
  color = "#f97316",
  speed = 0.6,
  opacity = 0.7,
  interactive = true,
}: PlasmaProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 3, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <PlasmaPlane color={color} speed={speed} opacity={opacity} />
      </Canvas>
    </div>
  );
}
