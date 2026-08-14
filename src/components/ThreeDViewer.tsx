import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Loader2, RotateCcw, Eye, Sparkles } from 'lucide-react';

interface ThreeDViewerProps {
  stlUrl?: string;
  colorHex: string;
  wireframe?: boolean;
  scale?: number;
  autoRotate?: boolean;
}

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  stlUrl: _stlUrl,
  colorHex,
  wireframe = false,
  scale = 1,
  autoRotate = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(autoRotate);
  const [isWireframe, setIsWireframe] = useState<boolean>(wireframe);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 350;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b0f19');
    sceneRef.current = scene;

    const gridHelper = new THREE.GridHelper(10, 20, 0xff5500, 0x1e293b);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 10, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00f0ff, 0.6);
    fillLight.position.set(-5, -2, -5);
    scene.add(fillLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    const geometry = createDefaultGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.3,
      roughness: 0.2,
      wireframe: isWireframe,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    meshRef.current = mesh;
    scene.add(mesh);

    setLoading(false);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (meshRef.current && isRotating && !isDragging.current) {
        meshRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 350;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(colorHex);
    }
  }, [colorHex]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.wireframe = isWireframe;
    }
  }, [isWireframe]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale);
    }
  }, [scale]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !meshRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    meshRef.current.rotation.y += deltaX * 0.01;
    meshRef.current.rotation.x += deltaY * 0.01;

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  function createDefaultGeometry(): THREE.BufferGeometry {
    const geom = new THREE.IcosahedronGeometry(1.8, 1);
    geom.computeVertexNormals();
    return geom;
  }

  const resetView = () => {
    if (meshRef.current) {
      meshRef.current.rotation.set(0, 0, 0);
      meshRef.current.scale.set(1, 1, 1);
    }
  };

  return (
    <div className="relative w-full h-[360px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none group">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-20 text-orange-500">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <span className="text-xs font-mono tracking-widest text-slate-400">CARREGANDO MODELO 3D...</span>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50 flex items-center gap-2 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
        <span className="text-[11px] font-medium text-slate-300">Preview 3D Interativo • Arraste para girar</span>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg">
        <button
          type="button"
          onClick={() => setIsWireframe(!isWireframe)}
          className={`p-2 rounded-lg text-xs font-semibold transition-all ${
            isWireframe ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Alternar Modo Wireframe / Malha 3D"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
            isRotating ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="Alternar Rotação Automática"
        >
          {isRotating ? 'AUTO-ROTAÇÃO ON' : 'PAUSADO'}
        </button>

        <button
          type="button"
          onClick={resetView}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title="Resetar Posição 3D"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
