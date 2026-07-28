import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, TorusKnot, Icosahedron, Environment } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function SpinKnot() {
  const ref = useRef<Mesh>(null);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.x += d * 0.25;
    ref.current.rotation.y += d * 0.35;
  });
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <TorusKnot ref={ref} args={[1.1, 0.32, 220, 32]}>
        <MeshDistortMaterial
          color="#7dffb8"
          emissive="#3affaa"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.85}
          distort={0.32}
          speed={2}
        />
      </TorusKnot>
    </Float>
  );
}

function OrbitBits() {
  return (
    <>
      <Float speed={3} floatIntensity={2}>
        <Icosahedron args={[0.35, 0]} position={[2.4, 1.2, -1]}>
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.9} wireframe />
        </Icosahedron>
      </Float>
      <Float speed={2.2} floatIntensity={2.4}>
        <Sphere args={[0.22, 32, 32]} position={[-2.6, -1.1, 0.4]}>
          <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.7} />
        </Sphere>
      </Float>
      <Float speed={1.8} floatIntensity={2}>
        <Icosahedron args={[0.28, 0]} position={[-2.2, 1.6, -0.5]}>
          <meshStandardMaterial color="#7dffb8" emissive="#7dffb8" emissiveIntensity={0.7} wireframe />
        </Icosahedron>
      </Float>
    </>
  );
}

export default function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.4} color="#7dffb8" />
      <pointLight position={[-5, -3, -2]} intensity={1} color="#22d3ee" />
      <SpinKnot />
      <OrbitBits />
      <Environment preset="night" />
    </Canvas>
  );
}
