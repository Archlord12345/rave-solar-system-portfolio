'use client';

import React, { Suspense, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Float, 
  Text, 
  PerspectiveCamera, 
  ContactShadows,
  Html,
  Environment,
  MeshDistortMaterial,
  Sphere,
  useTexture
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, X, FileText, ChevronRight } from 'lucide-react';
import * as THREE from 'three';

const PROJECTS = [
  {
    id: 1,
    name: 'KERNEL_CHAT',
    description: 'Application de chat intelligente pour le groupe KERNEL, facilitant la collaboration en temps réel.',
    tech: ['n8n', 'React', 'Firebase', 'Node.js'],
    color: '#d4af37', // Gold
    distance: 8,
    size: 0.8,
    speed: 0.5,
    link: 'https://github.com/Archlord12345/KERNEL_CHAT'
  },
  {
    id: 2,
    name: 'KERNEL_MEETING',
    description: 'Plateforme de réunion immersive conçue pour optimiser les échanges au sein de KERNEL FORGE.',
    tech: ['WebRTC', 'Next.js', 'Socket.io', 'Tailwind'],
    color: '#e5e4e2', // Chrome
    distance: 12,
    size: 1.1,
    speed: 0.3,
    link: 'https://github.com/Archlord12345/KERNEL_MEETING'
  },
  {
    id: 3,
    name: 'SOLAR PORTFOLIO',
    description: 'Ce portfolio immersif en 3D présentant mon système solaire de projets.',
    tech: ['Three.js', 'React Three Fiber', 'Framer Motion', 'Next.js'],
    color: '#a0a0a0', // Secondary
    distance: 16,
    size: 0.9,
    speed: 0.2,
    link: 'https://github.com/Archlord12345/rave-solar-system-portfolio'
  },
  {
    id: 4,
    name: 'PORFOLIO RAVEL',
    description: 'Une vitrine personnelle mettant en avant mes compétences en développement fullstack.',
    tech: ['TypeScript', 'React', 'Vite', 'Tailwind'],
    color: '#f9f295', // Bright Gold
    distance: 20,
    size: 0.7,
    speed: 0.15,
    link: 'https://github.com/Archlord12345/porfolioravel'
  }
];

function Planet({ project, onSelect }: { project: typeof PROJECTS[0], onSelect: (p: any) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Orbit animation
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * project.speed;
    meshRef.current.position.x = Math.cos(t) * project.distance;
    meshRef.current.position.z = Math.sin(t) * project.distance;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <group>
      {/* Orbit Path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[project.distance - 0.02, project.distance + 0.02, 128]} />
        <meshBasicMaterial color="#d4af37" opacity={0.1} transparent />
      </mesh>

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
          distort={0.3} 
          radius={1}
        />
        
        {/* Label visible au survol */}
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
  
  // Utilisation d'un fallback pour la texture si l'image est manquante
  const [textureError, setTextureError] = useState(false);
  
  // On essaie de charger la texture, si elle échoue on utilise un fallback
  let texture;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    texture = useTexture('/ravel.png', () => {
      console.log("Texture loaded successfully");
    });
  } catch (e) {
    console.warn("Texture /ravel.png not found, using fallback color");
  }

  useFrame((state) => {
    if (!sunRef.current || !glowRef.current) return;
    sunRef.current.rotation.y += 0.005;
    const t = state.clock.getElapsedTime();
    
    // Animation de pulsation douce
    const scale = 2.8 + Math.sin(t * 0.5) * 0.1;
    sunRef.current.scale.set(scale, scale, scale);
    
    // Animation du halo
    glowRef.current.rotation.z -= 0.002;
    glowRef.current.scale.set(scale * 1.2, scale * 1.2, scale * 1.2);
  });

  return (
    <group>
      {/* Le Soleil (Photo de Ravel ou Sphère dorée si manquante) */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={textureError ? null : texture}
          color={textureError ? "#d4af37" : "#ffffff"}
          emissive="#d4af37" 
          emissiveIntensity={textureError ? 1 : 0.4} 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Halo lumineux pour mettre en valeur */}
      <mesh ref={glowRef}>
        <torusGeometry args={[1.1, 0.01, 16, 100]} />
        <meshStandardMaterial 
          color="#d4af37" 
          emissive="#d4af37" 
          emissiveIntensity={5} 
          transparent 
          opacity={0.8}
        />
      </mesh>

      {/* Deuxième anneau de halo */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.005, 16, 100]} />
        <meshStandardMaterial color="#f9f295" emissive="#f9f295" emissiveIntensity={2} />
      </mesh>

      <pointLight intensity={3000} distance={120} color="#d4af37" />
      <pointLight position={[-10, -10, -10]} intensity={800} color="#f9f295" />
      
      <Html position={[0, -3.5, 0]} center>
        <div className="text-center pointer-events-none">
          <h2 className="text-[#d4af37] font-black text-2xl tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">
            RAVEL
          </h2>
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-1" />
        </div>
      </Html>
    </group>
  );
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  return (
    <main className="relative w-full h-screen bg-[#050505] overflow-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-[#d4af37] flex items-center justify-center font-black text-black text-xl group-hover:rotate-12 transition-transform">
            R
          </div>
          <span className="font-bold tracking-tighter text-xl hidden sm:block uppercase text-white">NGHOMSI FEUKOUO RAVEL</span>
        </div>

        <div className="flex gap-4 items-center">
          <div className="hidden md:flex gap-6 text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase">
            <button className="hover:text-[#d4af37] transition-colors">Accueil</button>
            <button className="hover:text-[#d4af37] transition-colors">Projets</button>
            <button className="hover:text-[#d4af37] transition-colors">Contact</button>
          </div>
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#d4af37]/40 text-[#d4af37] bg-[#d4af37]/5 hover:bg-[#d4af37]/20 transition-all text-xs font-bold">
            <FileText size={14} />
            <span>CV</span>
          </a>
        </div>
      </nav>

      {/* 3D Scene */}
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
            {PROJECTS.map((project) => (
              <Planet 
                key={project.id} 
                project={project} 
                onSelect={setSelectedProject} 
              />
            ))}
            <Environment preset="city" />
          </Suspense>
          
          <ContactShadows position={[0, -15, 0]} opacity={0.4} scale={60} blur={2} far={20} />
        </Canvas>
      </div>

      {/* Hero Text Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center px-12 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="text-[#d4af37] font-bold tracking-[0.3em] text-xs uppercase mb-4">Étudiant en Informatique & Développeur Fullstack</h2>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none">
            KERNEL<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f9f295] to-[#d4af37]">FORGE</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed mb-8">
            Expert en automatisation intelligente avec n8n et leader du groupe KERNEL FORGE. Je repousse les limites du possible.
          </p>
          <div className="flex gap-4 pointer-events-auto">
            <button className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#f9f295] text-black font-black rounded-2xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center gap-2">
              Explorer mes projets <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Social Links */}
      <div className="absolute bottom-8 left-8 z-10 flex gap-4">
        <a href="https://github.com/Archlord12345" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all">
          <Github size={20} />
        </a>
        <a href="#" className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all">
          <Linkedin size={20} />
        </a>
        <a href="#" className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all">
          <Mail size={20} />
        </a>
      </div>

      {/* Project Detail Modal */}
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
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-bold mb-4">Technologies Clés</h3>
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
                  <button className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white hover:bg-white/10 transition-all">
                    Code Source
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
