import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { latLongToVector3 } from '../utils/geoMath';

function Earth({ route, progress, controlsRef }: { route?: any, progress?: number, controlsRef?: React.RefObject<any> }) {
  const globeRef = useRef<THREE.Group>(null);
  const planeRef = useRef<THREE.Group>(null);
  const startMarkerRef = useRef<THREE.Mesh>(null);
  const endMarkerRef = useRef<THREE.Mesh>(null);
  
  const { camera } = useThree();
  const [targetCameraPos, setTargetCameraPos] = useState<THREE.Vector3 | null>(null);
  
  const colorMap = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');

  const radius = 2;

  useEffect(() => {
    if (route && route.fromCoords) {
      // Calculate target camera position to face the departure city
      const dist = camera.position.length();
      const targetDir = latLongToVector3(route.fromCoords[0], route.fromCoords[1], 1).normalize();
      
      // We want the camera to be slightly offset so the route is visible, 
      // but facing the origin is the main goal.
      const target = targetDir.multiplyScalar(dist);
      setTargetCameraPos(target);
    } else {
      setTargetCameraPos(null);
    }
  }, [route, camera]);

  useFrame(() => {
    if (globeRef.current && !route) {
      globeRef.current.rotation.y += 0.001;
    }

    if (targetCameraPos) {
      camera.position.lerp(targetCameraPos, 0.05);
      if (controlsRef?.current) {
        controlsRef.current.update();
      }
      if (camera.position.distanceTo(targetCameraPos) < 0.1) {
        setTargetCameraPos(null);
      }
    }
  });

  // Calculate curve
  const { curve, points } = useMemo(() => {
    if (!route || !route.fromCoords || !route.toCoords) return { curve: null, points: [] };
    
    const start = latLongToVector3(route.fromCoords[0], route.fromCoords[1], radius);
    const end = latLongToVector3(route.toCoords[0], route.toCoords[1], radius);
    
    const distance = start.distanceTo(end);
    const maxAltitude = distance * 0.15; // Arc height based on distance
    
    const numPoints = 60;
    const curvePoints = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      // Interpolate along the straight line, then project onto sphere
      const point = start.clone().lerp(end, t).normalize();
      // Add altitude arc (sine wave)
      const altitude = Math.sin(t * Math.PI) * maxAltitude;
      point.multiplyScalar(radius + altitude + 0.02); // slight offset to avoid z-fighting
      curvePoints.push(point);
    }
    
    const spline = new THREE.CatmullRomCurve3(curvePoints);
    return { curve: spline, points: spline.getPoints(100) };
  }, [route, radius]);

  useFrame(({ camera }) => {
    if (curve && planeRef.current && progress !== undefined) {
      const normalizedProgress = Math.max(0, Math.min(1, progress));
      const position = curve.getPointAt(normalizedProgress);
      planeRef.current.position.copy(position);
      
      // Orient the plane correctly along the curve and sphere surface
      if (normalizedProgress < 0.99) {
        const tangent = curve.getTangentAt(normalizedProgress).normalize();
        const up = position.clone().normalize(); // Up vector points away from earth center
        planeRef.current.up.copy(up);
        planeRef.current.lookAt(position.clone().add(tangent));
      }

      // Scale plane and markers based on camera distance so they get smaller when zoomed in
      const dist = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      const scale = Math.max(0.15, dist / 8);
      planeRef.current.scale.setScalar(scale);
      if (startMarkerRef.current) startMarkerRef.current.scale.setScalar(scale);
      if (endMarkerRef.current) endMarkerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={globeRef}>
      <Sphere args={[radius, 64, 64]}>
        <meshStandardMaterial 
          map={colorMap}
          roughness={0.6}
          metalness={0.1}
        />
      </Sphere>
      
      {route && points.length > 0 && (
        <>
          {/* Flight Path Line */}
          <Line
            points={points}
            color="#0ea5e9"
            lineWidth={3}
            dashed={false}
          />
          
          {/* Start and End Markers */}
          <mesh ref={startMarkerRef} position={points[0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh ref={endMarkerRef} position={points[points.length - 1]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>

          {/* Plane Model */}
          <group ref={planeRef}>
            <group rotation={[0, Math.PI, 0]}> {/* Flipped 180 degrees to fix backwards movement */}
              {/* Fuselage (White) */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.3, 16]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
              {/* Nose (White) */}
              <mesh position={[0, 0, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.025, 0.08, 16]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
              {/* Cockpit Window (Dark) */}
              <mesh position={[0, 0.015, -0.16]} rotation={[-Math.PI / 2.5, 0, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
              {/* Left Wing (Blue) */}
              <mesh position={[-0.12, 0, 0.02]} rotation={[0, -0.5, 0]}>
                 <boxGeometry args={[0.26, 0.008, 0.06]} />
                 <meshStandardMaterial color="#3b82f6" />
              </mesh>
              {/* Right Wing (Blue) */}
              <mesh position={[0.12, 0, 0.02]} rotation={[0, 0.5, 0]}>
                 <boxGeometry args={[0.26, 0.008, 0.06]} />
                 <meshStandardMaterial color="#3b82f6" />
              </mesh>
              {/* Engines (White) */}
              {/* Inner Left */}
              <mesh position={[-0.07, -0.015, 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
                 <cylinderGeometry args={[0.01, 0.01, 0.05, 16]} />
                 <meshStandardMaterial color="#ffffff" />
              </mesh>
              {/* Outer Left */}
              <mesh position={[-0.15, -0.015, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
                 <cylinderGeometry args={[0.008, 0.008, 0.04, 16]} />
                 <meshStandardMaterial color="#ffffff" />
              </mesh>
              {/* Inner Right */}
              <mesh position={[0.07, -0.015, 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
                 <cylinderGeometry args={[0.01, 0.01, 0.05, 16]} />
                 <meshStandardMaterial color="#ffffff" />
              </mesh>
              {/* Outer Right */}
              <mesh position={[0.15, -0.015, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
                 <cylinderGeometry args={[0.008, 0.008, 0.04, 16]} />
                 <meshStandardMaterial color="#ffffff" />
              </mesh>
              {/* Tail (Vertical Stabilizer - White) */}
              <mesh position={[0, 0.05, 0.14]} rotation={[-0.3, 0, 0]}>
                 <boxGeometry args={[0.008, 0.08, 0.06]} />
                 <meshStandardMaterial color="#ffffff" />
              </mesh>
              {/* Tail Accent (Blue) */}
              <mesh position={[0, 0.03, 0.13]} rotation={[-0.3, 0, 0]}>
                 <boxGeometry args={[0.009, 0.04, 0.04]} />
                 <meshStandardMaterial color="#3b82f6" />
              </mesh>
              {/* Left Horizontal Stabilizer (White) */}
              <mesh position={[-0.05, 0, 0.15]} rotation={[0, -0.4, 0]}>
                 <boxGeometry args={[0.1, 0.008, 0.03]} />
                 <meshStandardMaterial color="#ffffff" />
              </mesh>
              {/* Right Horizontal Stabilizer (White) */}
              <mesh position={[0.05, 0, 0.15]} rotation={[0, 0.4, 0]}>
                 <boxGeometry args={[0.1, 0.008, 0.03]} />
                 <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          </group>
        </>
      )}
    </group>
  );
}

export default function Globe({ route, progress }: { route?: any, progress?: number }) {
  const controlsRef = useRef<any>(null);

  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <React.Suspense fallback={null}>
        <Earth route={route} progress={progress} controlsRef={controlsRef} />
      </React.Suspense>
      <OrbitControls 
        ref={controlsRef}
        enableZoom={true} 
        minDistance={2.5} 
        maxDistance={12} 
        enablePan={false} 
        autoRotate={!route} 
        autoRotateSpeed={0.5} 
      />
    </Canvas>
  );
}
