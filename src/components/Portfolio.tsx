"use client";

import { Github, Linkedin } from "lucide-react";

const GmailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
  </svg>
);

const techStack = [
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Express", icon: "https://www.svgrepo.com/show/330398/express.svg", className: "brightness-0 invert" },
  { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  { name: "Dart", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },
  { name: "Prisma", icon: "https://www.svgrepo.com/show/374002/prisma.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", className: "brightness-0 invert" },
];

export default function Portfolio() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
      <div className="max-w-5xl mx-auto px-8 text-center pointer-events-auto">
        {/* Glitch effect container */}
        <div className="relative">
          {/* Terminal-style prompt with typing animation */}
          <div className="text-left mb-6 font-mono text-green-400 text-xs md:text-sm opacity-80 animate-[fadeIn_0.5s_ease-in]">
            <span className="text-gray-500">guest@portfolio:~$</span> cat developer.txt
          </div>
          
          {/* Name with subtle glitch effect */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-white mb-4 tracking-tight leading-tight relative group animate-[fadeIn_0.8s_ease-in]">
            <span className="relative inline-block">
              Nikhil Sohanlal Kumawat
              {/* Glitch layers */}
              <span className="absolute top-0 left-0 text-cyan-400 opacity-0 group-hover:opacity-70 group-hover:animate-[glitch1_0.3s_infinite]" aria-hidden="true">
                Nikhil Sohanlal Kumawat
              </span>
              <span className="absolute top-0 left-0 text-red-400 opacity-0 group-hover:opacity-70 group-hover:animate-[glitch2_0.3s_infinite]" aria-hidden="true">
                Nikhil Sohanlal Kumawat
              </span>
            </span>
          </h1>
          
          {/* Tagline with typing effect feel */}
          <div className="font-mono text-base md:text-lg text-green-400 mb-2 animate-[fadeIn_1.2s_ease-in]">
            <span className="text-gray-500">&gt;</span> <span className="text-white">Full Stack Developer</span>
          </div>
          <div className="font-mono text-sm md:text-base text-cyan-400 mb-8 opacity-80 animate-[fadeIn_1.6s_ease-in]">
            <span className="text-gray-500">&gt;</span> Building the future, one commit at a time
          </div>
        </div>
        
        {/* Social Links with stagger animation */}
        <div className="flex flex-wrap gap-4 justify-center items-center mb-12 animate-[fadeIn_2s_ease-in]">
          <a
            href="https://github.com/TrendySloth1001"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg transition-all duration-300 text-white border-2 border-green-400/30 hover:border-green-400 hover:shadow-[0_0_30px_rgba(74,222,128,0.5)] font-mono transform hover:scale-105"
          >
            <Github className="w-5 h-5 transition-transform duration-300" />
            <span className="font-medium">GitHub</span>
          </a>
          
          <a
            href="https://www.linkedin.com/in/nikhil-kumawat-78703b32b/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg transition-all duration-300 text-white border-2 border-blue-400/30 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] font-mono transform hover:scale-105"
          >
            <Linkedin className="w-5 h-5 transition-transform duration-300" />
            <span className="font-medium">LinkedIn</span>
          </a>
          
          <a
            href="mailto:nkumawat8956@gmail.com"
            className="group flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg transition-all duration-300 text-white border-2 border-red-400/30 hover:border-red-400 hover:shadow-[0_0_30px_rgba(248,113,113,0.5)] font-mono transform hover:scale-105"
          >
            <GmailIcon />
            <span className="font-medium">Gmail</span>
          </a>
        </div>

        {/* Tech Stack */}
        <div className="animate-[fadeIn_2.4s_ease-in]">
          <div className="font-mono text-xs md:text-sm text-gray-400 mb-4">
            <span className="text-gray-500">[</span> Tech Stack <span className="text-gray-500">]</span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="group relative flex flex-col items-center justify-center gap-2 w-24 h-24 md:w-28 md:h-28 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-lg transition-all duration-300 border border-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                title={tech.name}
              >
                <img 
                  src={tech.icon} 
                  alt={tech.name}
                  className={`w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110 ${tech.className || ''}`}
                />
                <span className="text-xs font-mono text-gray-400 group-hover:text-white transition-colors text-center">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="mt-8 font-mono text-xs text-gray-400 flex items-center justify-center gap-2 animate-[fadeIn_2.8s_ease-in]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Available for opportunities</span>
        </div>
        
        {/* Cursor blink effect */}
        <div className="mt-6 font-mono text-green-400 text-lg">
          <span className="inline-block animate-[blink_1s_step-end_infinite]">▊</span>
        </div>
      </div>
      
      {/* Background grid effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(74, 222, 128, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 222, 128, 0.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </div>
  );
}
