'use client';

import React, { Suspense, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
  ContactShadows,
  Html,
  Environment,
  MeshDistortMaterial,
  useTexture,
  Line
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, X, FileText, ChevronRight } from 'lucide-react';
import * as THREE from 'three';

const SOCIAL_LINKS = {
  github: 'https://github.com/Archlord12345',
  linkedin: 'https://www.linkedin.com/in/archlord12345/',
  email: 'mailto:contact.ravel.dev@gmail.com',
  cv: 'https://github.com/Archlord12345?tab=repositories'
};

const METEOR_STACKS = [
  { name: 'React', color: '#84dcc6', size: 0.16, speed: 0.38 },
  { name: 'Next.js', color: '#f6bd60', size: 0.17, speed: 0.32 },
  { name: 'TypeScript', color: '#a9def9', size: 0.15, speed: 0.45 },
  { name: 'Node.js', color: '#e4c1f9', size: 0.14, speed: 0.34 },
  { name: 'Three.js', color: '#f28482', size: 0.18, speed: 0.28 },
  { name: 'n8n', color: '#f2cc8f', size: 0.12, speed: 0.52 },
  { name: 'Firebase', color: '#90dbf4', size: 0.13, speed: 0.49 },
  { name: 'Supabase', color: '#95d5b2', size: 0.14, speed: 0.41 }
];

const PROJECTS = [
  {
    id: 1,
    name: 'KERNEL_CHAT',
    description: 'Application de chat intelligente facilitant la collaboration en temps réel.',
    tech: ['n8n', 'React', 'Firebase', 'Node.js'],
    color: '#f6bd60',
    distance: 8,
    size: 0.8,
    speed: 0.5,
    eccentricity: 0.12,
    inclination: 0.1,
    link: 'https://github.com/Archlord12345/KERNEL_CHAT'
  },
  {
    id: 2,
    name: 'KERNEL_MEETING',
    description: 'Plateforme de réunion immersive conçue pour optimiser les échanges virtuels.',
    tech: ['WebRTC', 'Next.js', 'Socket.io', 'Tailwind'],
    color: '#84dcc6',
    distance: 12,
    size: 1.1,
    speed: 0.3,
    eccentricity: 0.2,
    inclination: 0.16,
    link: 'https://github.com/Archlord12345/KERNEL_MEETING'
  },
  {
    id: 3,
    name: 'SOLAR PORTFOLIO',
    description: 'Ce portfolio immersif en 3D présentant mon système solaire de projets.',
    tech: ['Three.js', 'React Three Fiber', 'Framer Motion', 'Next.js'],
    color: '#a9def9',
    distance: 16,
    size: 0.9,
    speed: 0.2,
    eccentricity: 0.08,
    inclination: 0.08,
    link: 'https://github.com/Archlord12345/rave-solar-system-portfolio'
  },
  {
    id: 4,
    name: 'PORFOLIO RAVEL',
    description: 'Une vitrine personnelle mettant en avant mes compétences en développement fullstack.',
    tech: ['TypeScript', 'React', 'Vite', 'Tailwind'],
    color: '#e4c1f9',
    distance: 20,
    size: 0.7,
    speed: 0.15,
    eccentricity: 0.24,
    inclination: 0.2,
    link: 'https://github.com/Archlord12345/porfolioravel'
  }
];

function SkillMeteor({
  stack,
  index
}: {
  stack: typeof METEOR_STACKS[0],
  index: number
}) {
  const meteorRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const lane = 23 + (index % 3) * 3;

  useFrame((state) => {
    if (!meteorRef.current || !tailRef.current) return;
    const t = state.clock.getElapsedTime() * stack.speed + index * 1.25;

    const x = Math.sin(t) * lane;
    const z = Math.cos(t * 1.1) * (lane - 6);
    const y = Math.sin(t * 2.2) * 2 + (index % 5) - 2;

    meteorRef.current.position.set(x, y, z);
    meteorRef.current.rotation.x += 0.03;
    meteorRef.current.rotation.y += 0.02;

    tailRef.current.position.set(x - 1.2, y, z + 0.6);
    tailRef.current.lookAt(x + 2, y, z - 1.5);
  });

  return (
    <group>
      <mesh ref={tailRef}>
        <cylinderGeometry args={[0.02, 0.12, 2.2, 8]} />
        <meshStandardMaterial
          color={stack.color}
          emissive={stack.color}
          emissiveIntensity={1.2}
          transparent
          opacity={0.4}
        />
      </mesh>

      <mesh
        ref={meteorRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <dodecahedronGeometry args={[stack.size, 0]} />
        <meshStandardMaterial
          color={stack.color}
          emissive={stack.color}
          emissiveIntensity={hovered ? 2.8 : 1.7}
          metalness={0.3}
          roughness={0.25}
        />

        <Html distanceFactor={8} position={[0, stack.size + 0.4, 0]}>
          <div className="rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur pointer-events-none">
            {stack.name}
          </div>
        </Html>
      </mesh>
    </group>
  );
}

function Planet({ project, index, onSelect }: { project: typeof PROJECTS[0], index: number, onSelect: (p: any) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const semiMajorAxis = project.distance;
  const semiMinorAxis = useMemo(
    () => semiMajorAxis * Math.sqrt(1 - project.eccentricity ** 2),
    [semiMajorAxis, project.eccentricity]
  );
  const orbitRotation = useMemo<[number, number, number]>(
    () => [project.inclination, index * 0.8, 0],
    [project.inclination, index]
  );
  const orbitPoints = useMemo(
    () => new THREE.EllipseCurve(0, 0, semiMajorAxis, semiMinorAxis, 0, Math.PI * 2, false, 0)
      .getPoints(220)
      .map((point) => new THREE.Vector3(point.x, 0, point.y)),
    [semiMajorAxis, semiMinorAxis]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * project.speed;
    const theta = t + index;
    meshRef.current.position.x = Math.cos(theta) * semiMajorAxis;
    meshRef.current.position.z = Math.sin(theta) * semiMinorAxis;
    meshRef.current.position.y = Math.sin(theta * 2 + index) * project.inclination * 2;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <group rotation={orbitRotation}>
      <Line
        points={orbitPoints}
        color={project.color}
        transparent
        opacity={hovered ? 0.45 : 0.22}
        lineWidth={hovered ? 1.6 : 1.1}
      />

      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[project.size, 32, 32]} />
        <MeshDistortMaterial
          color={project.color}
          speed={hovered ? 4 : 2}
          distort={0.25}
          radius={1}
        />

        <Html distanceFactor={10} position={[0, project.size + 0.5, 0]}>
          <div className={`px-2 py-1 rounded-lg backdrop-blur-md transition-all duration-300 whitespace-nowrap pointer-events-none ${hovered ? 'bg-white/20 scale-110' : 'bg-black/40'}`}>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white">{project.name}</span>
          </div>
        </Html>
      </mesh>
    </group>
  );
}

function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/ravel.png');

  useFrame((state) => {
    if (!sunRef.current || !glowRef.current) return;
    sunRef.current.rotation.y += 0.005;
    const t = state.clock.getElapsedTime();

    const scale = 2.8 + Math.sin(t * 0.5) * 0.1;
    sunRef.current.scale.set(scale, scale, scale);

    glowRef.current.rotation.z -= 0.002;
    glowRef.current.scale.set(scale * 1.2, scale * 1.2, scale * 1.2);
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          color="#ffffff"
          emissive="#d4af37"
          emissiveIntensity={0.45}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      <mesh ref={glowRef}>
        <torusGeometry args={[1.1, 0.01, 16, 100]} />
        <meshStandardMaterial
          color="#f6bd60"
          emissive="#f6bd60"
          emissiveIntensity={4}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.005, 16, 100]} />
        <meshStandardMaterial color="#a9def9" emissive="#a9def9" emissiveIntensity={1.7} />
      </mesh>

      <pointLight intensity={3000} distance={120} color="#f6bd60" />
      <pointLight position={[-10, -10, -10]} intensity={800} color="#84dcc6" />

      <Html position={[0, -3.5, 0]} center>
        <div className="text-center pointer-events-none">
          <h2 className="text-[#f6bd60] font-black text-2xl tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(246,189,96,0.8)]">
            RAVEL
          </h2>
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-[#84dcc6] to-transparent mx-auto mt-1" />
        </div>
      </Html>
    </group>
  );
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  return (
    <main className="relative w-full h-screen bg-gradient-to-b from-[#030711] via-[#070d1a] to-[#040507] overflow-hidden text-white">
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-xl bg-[#040812]/65 border-b border-cyan-200/10">
        <button
          type="button"
          onClick={() => setSelectedProject(null)}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f6bd60] to-[#f28482] flex items-center justify-center font-black text-black text-xl group-hover:rotate-12 transition-transform">
            R
          </div>
          <span className="font-bold tracking-tighter text-xl hidden sm:block uppercase text-white">NGHOMSI FEUKOUO RAVEL</span>
        </button>

        <div className="flex gap-4 items-center">
          <div className="hidden md:flex gap-6 text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase">
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="hover:text-[#84dcc6] transition-colors"
            >
              Accueil
            </button>
            <button
              type="button"
              onClick={() => setSelectedProject(PROJECTS[0])}
              className="hover:text-[#84dcc6] transition-colors"
            >
              Projets
            </button>
            <a href={SOCIAL_LINKS.email} className="hover:text-[#84dcc6] transition-colors">Contact</a>
          </div>
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          <a href={SOCIAL_LINKS.cv} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#84dcc6]/40 text-[#84dcc6] bg-[#84dcc6]/10 hover:bg-[#84dcc6]/20 transition-all text-xs font-bold">
            <FileText size={14} />
            <span>CV</span>
          </a>
        </div>
      </nav>

      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 25, 40], fov: 45 }}>
          <OrbitControls
            enablePan={false}
            maxDistance={80}
            minDistance={15}
            autoRotate={!selectedProject}
            autoRotateSpeed={0.3}
          />

          <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.2} />

          <Suspense fallback={null}>
            <Sun />
            {PROJECTS.map((project, index) => (
              <Planet
                key={project.id}
                project={project}
                index={index}
                onSelect={setSelectedProject}
              />
            ))}
            {METEOR_STACKS.map((stack, index) => (
              <SkillMeteor key={stack.name} stack={stack} index={index} />
            ))}
            <Environment preset="city" />
          </Suspense>

          <ContactShadows position={[0, -15, 0]} opacity={0.4} scale={60} blur={2} far={20} />
        </Canvas>
      </div>

      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center px-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="text-[#84dcc6] font-bold tracking-[0.3em] text-xs uppercase mb-4">Étudiant en Informatique & Développeur Fullstack</h2>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-none uppercase">
            NGHOMSI FEUKOUO<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f6bd60] via-[#a9def9] to-[#e4c1f9]">RAVEL</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md leading-relaxed mb-8">
            Expert en automatisation intelligente avec n8n. Passionné par la création de solutions innovantes et l'exploration technologique.
          </p>
          <div className="flex gap-4 pointer-events-auto">
            <button
              type="button"
              onClick={() => setSelectedProject(PROJECTS[0])}
              className="px-8 py-4 bg-gradient-to-r from-[#f6bd60] via-[#84dcc6] to-[#a9def9] text-black font-black rounded-2xl hover:shadow-[0_0_30px_rgba(132,220,198,0.4)] transition-all flex items-center gap-2"
            >
              Explorer mes projets <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-8 z-10 flex gap-4">
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:text-[#84dcc6] hover:border-[#84dcc6]/40 transition-all">
          <Github size={20} />
        </a>
        <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:text-[#84dcc6] hover:border-[#84dcc6]/40 transition-all">
          <Linkedin size={20} />
        </a>
        <a href={SOCIAL_LINKS.email} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:text-[#84dcc6] hover:border-[#84dcc6]/40 transition-all">
          <Mail size={20} />
        </a>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-0 right-0 h-full w-full md:w-[500px] bg-black/90 backdrop-blur-2xl border-l border-white/10 p-12 z-50 flex flex-col"
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-2xl transition-colors text-white"
            >
              <X size={24} />
            </button>

            <div className="mt-16">
              <div
                className="w-16 h-16 rounded-2xl mb-8 rotate-12 shadow-2xl"
                style={{ backgroundColor: selectedProject.color }}
              />
              <h2 className="text-4xl font-black mb-6 text-white tracking-tighter uppercase">{selectedProject.name}</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-10">
                {selectedProject.description}
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#84dcc6] font-bold mb-4">Technologies Clés</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tech.map((t) => (
                      <span key={t} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-12 flex flex-col gap-4">
                  <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black hover:bg-gray-200 transition-all">
                    Voir le projet <ExternalLink size={18} />
                  </a>
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white hover:bg-white/10 transition-all"
                  >
                    Code Source
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
