import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function ScrollSculpture({ mode }) {
  const sculpture = useRef(null);
  const goldStone = useRef(null);
  const pearlStone = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useFrame((state, delta) => {
    if (!sculpture.current) return;
    let progress = 0;
    if (mode === "hero") {
      progress = clamp(window.scrollY / (window.innerHeight * 1.1), 0, 1);
    } else {
      const section = document.querySelector(
        mode === "journey" ? "#journey" : ".closing",
      );
      const bounds = section?.getBoundingClientRect();
      if (bounds)
        progress = clamp(
          (window.innerHeight - bounds.top) /
            (window.innerHeight + bounds.height),
          0,
          1,
        );
    }
    if (reducedMotion) progress = 0;

    const targetX = mode === "hero" ? 1.2 - progress * 2.2 : 0;
    const targetY = mode === "hero" ? -progress * 0.65 : 0;
    const targetScale = mode === "hero" ? 1 + progress * 1.25 : 1;
    const ease = 1 - Math.exp(-delta * 2.8);
    sculpture.current.position.x +=
      (targetX - sculpture.current.position.x) * ease;
    sculpture.current.position.y +=
      (targetY - sculpture.current.position.y) * ease;
    sculpture.current.scale.setScalar(targetScale);
    if (reducedMotion) {
      sculpture.current.rotation.set(0, 0, 0);
      if (goldStone.current) goldStone.current.position.y = 0.7;
      if (pearlStone.current) pearlStone.current.position.y = -0.63;
      return;
    }
    sculpture.current.rotation.y += (0.12 + progress * 0.16) * delta;
    sculpture.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.22) * 0.035;
    if (goldStone.current)
      goldStone.current.position.y =
        0.7 + Math.sin(state.clock.elapsedTime * 0.55) * 0.09;
    if (pearlStone.current)
      pearlStone.current.position.y =
        -0.63 + Math.sin(state.clock.elapsedTime * 0.42 + 2) * 0.07;
  });

  if (mode === "journey") {
    return (
      <group ref={sculpture} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]} scale={[0.52, 1.17, 0.36]} castShadow>
          <sphereGeometry args={[1, 40, 40]} />
          <meshPhysicalMaterial
            color="#cbbda6"
            roughness={0.38}
            metalness={0.04}
            clearcoat={0.2}
          />
        </mesh>
        <mesh position={[-0.38, 0.72, 0]} scale={[0.37, 0.3, 0.35]} castShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial color="#ddcbb3" roughness={0.38} />
        </mesh>
        <mesh position={[0.38, 0.72, 0]} scale={[0.37, 0.3, 0.35]} castShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial color="#ddcbb3" roughness={0.38} />
        </mesh>
        <mesh position={[0, -0.89, 0]} scale={[0.36, 0.37, 0.31]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial color="#c2af96" roughness={0.42} />
        </mesh>
        <pointLight
          position={[0, 0.6, 1]}
          color="#e7ba83"
          intensity={1.7}
          distance={3.2}
        />
      </group>
    );
  }

  return (
    <group ref={sculpture} position={[mode === "hero" ? 1.2 : 0, 0, 0]}>
      <mesh
        ref={goldStone}
        scale={[0.78, 0.49, 0.55]}
        rotation={[0.13, 0.2, -0.23]}
        castShadow
      >
        <sphereGeometry args={[1, 56, 56]} />
        <meshPhysicalMaterial
          color="#ab8660"
          roughness={0.24}
          metalness={0.28}
          clearcoat={0.85}
          clearcoatRoughness={0.2}
        />
      </mesh>
      <mesh
        ref={pearlStone}
        position={[-0.45, -0.63, 0.18]}
        scale={[0.48, 0.27, 0.38]}
        rotation={[-0.1, 0.2, 0.18]}
        castShadow
      >
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial
          color="#d8cbb9"
          roughness={0.29}
          metalness={0.14}
          clearcoat={0.85}
        />
      </mesh>
      <mesh
        position={[0.51, -0.45, -0.38]}
        scale={[0.23, 0.16, 0.18]}
        rotation={[0, 0.2, 0.3]}
      >
        <sphereGeometry args={[1, 36, 36]} />
        <meshPhysicalMaterial
          color="#87715d"
          roughness={0.3}
          metalness={0.18}
          clearcoat={0.7}
        />
      </mesh>
    </group>
  );
}

export default function ExperienceScene({ mode }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 700;

  return (
    <div className={`scene-canvas scene-${mode}`} aria-hidden="true">
      <Canvas
        dpr={isMobile ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 5.2], fov: 36 }}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: "low-power" }}
      >
        <ambientLight
          intensity={mode === "hero" || mode === "closing" ? 1.05 : 1.45}
        />
        <directionalLight
          position={[-3, 4, 5]}
          intensity={mode === "hero" ? 2.3 : 1.55}
          color="#fff0db"
        />
        <pointLight position={[3, -1, 2]} intensity={1.1} color="#b49a7a" />
        <AdaptiveDpr />
        <ScrollSculpture mode={mode} />
      </Canvas>
    </div>
  );
}
