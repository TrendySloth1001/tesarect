"use client";

import { Github, Linkedin } from "lucide-react";
import { useState } from "react";

const GmailIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
  </svg>
);

const techStack = [
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "NestJS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Express", icon: "https://www.svgrepo.com/show/330398/express.svg", className: "brightness-0 invert" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
  { name: "Dart", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" },
  { name: "Prisma", icon: "https://www.svgrepo.com/show/374002/prisma.svg" },
  { name: "Microservices", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", className: "brightness-0 invert" },
];

export default function Portfolio() {
  const [showToast, setShowToast] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleGmailClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Copy email to clipboard
    navigator.clipboard.writeText('nkumawat8956@gmail.com');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    // Show custom modal
    setTimeout(() => {
      setShowEmailModal(true);
    }, 500);
  };

  const handleOpenEmail = () => {
    setShowEmailModal(false);
    window.location.href = 'mailto:nkumawat8956@gmail.com';
  };

  return (
    <div className="fixed inset-0 z-10 flex items-start justify-center pointer-events-none overflow-y-auto overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 text-center pointer-events-auto min-h-full flex flex-col justify-center">
        {/* Glitch effect container */}
        <div className="relative">
          {/* Terminal-style prompt with typing animation */}
          <div className="text-left mb-4 sm:mb-6 font-mono text-green-400 text-xs md:text-sm opacity-80 animate-[fadeIn_0.5s_ease-in]">
            <span className="text-gray-500">guest@portfolio:~$</span> cat developer.txt
          </div>
          
          {/* Name with subtle glitch effect */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-white mb-3 sm:mb-4 tracking-tight leading-tight relative group animate-[fadeIn_0.8s_ease-in]">
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
          <div className="font-mono text-sm sm:text-base md:text-lg text-green-400 mb-2 animate-[fadeIn_1.2s_ease-in]">
            <span className="text-gray-500">&gt;</span> <span className="text-white">Full Stack Developer</span>
          </div>
          <div className="font-mono text-xs sm:text-sm md:text-base text-cyan-400 mb-6 sm:mb-8 opacity-80 animate-[fadeIn_1.6s_ease-in]">
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
            onClick={handleGmailClick}
            className="group flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg transition-all duration-300 text-white border-2 border-red-400/30 hover:border-red-400 hover:shadow-[0_0_30px_rgba(248,113,113,0.5)] font-mono transform hover:scale-105"
          >
            <GmailIcon />
            <span className="font-medium">Gmail</span>
          </a>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-[slideDown_0.4s_ease-out]">
            <div className="relative group">
              {/* Glowing background effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-pink-600 to-red-600 rounded-xl blur-lg opacity-75 animate-pulse"></div>
              
              {/* Toast content */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl border-2 border-red-400/50 shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Animated border glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 animate-[shimmer_2s_infinite]"></div>
                
                {/* Content wrapper */}
                <div className="relative px-6 py-4 flex items-center gap-4">
                  {/* Checkmark icon with animation */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-[scaleIn_0.5s_ease-out]">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Text content */}
                  <div className="font-mono flex-1">
                    <div className="text-base text-white font-bold flex items-center gap-2">
                      <span className="text-green-400">&gt;</span> 
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Email Copied!
                      </span>
                    </div>
                    <div className="text-sm text-red-400 mt-1 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                      </svg>
                      <span>nkumawat8956@gmail.com</span>
                    </div>
                  </div>
                  
                  {/* Close button */}
                  <button 
                    onClick={() => setShowToast(false)}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-400/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Progress bar */}
                <div className="h-1 bg-gray-800/50">
                  <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 animate-[shrink_3s_linear]"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowEmailModal(false)}
            ></div>
            
            {/* Modal */}
            <div className="relative z-10 animate-[scaleIn_0.4s_ease-out]">
              <div className="relative group">
                {/* Glowing background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
                
                {/* Modal content */}
                <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border-2 border-red-400/50 shadow-2xl overflow-hidden max-w-md">
                  {/* Animated border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 animate-[shimmer_2s_infinite]"></div>
                  
                  {/* Content */}
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-red-400 to-pink-600 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-center mb-3 font-mono">
                      <span className="text-green-400">&gt;</span>{" "}
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Open Email Client?
                      </span>
                    </h3>
                    
                    {/* Message */}
                    <p className="text-gray-400 text-center mb-8 font-mono text-sm">
                      Would you like to compose an email in your default email application?
                    </p>
                    
                    {/* Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowEmailModal(false)}
                        className="flex-1 px-6 py-3 bg-gray-800/50 hover:bg-gray-800 border-2 border-gray-600/30 hover:border-gray-500 rounded-lg font-mono text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleOpenEmail}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 border-2 border-red-400/50 rounded-lg font-mono text-white font-bold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-red-500/50"
                      >
                        Open Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="animate-[fadeIn_2.4s_ease-in]">
          <div className="font-mono text-xs md:text-sm text-gray-400 mb-3 sm:mb-4">
            <span className="text-gray-500">[</span> Tech Stack <span className="text-gray-500">]</span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center items-center">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="group relative flex flex-col items-center justify-center gap-1.5 sm:gap-2 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-lg transition-all duration-300 border border-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                title={tech.name}
              >
                <img 
                  src={tech.icon} 
                  alt={tech.name}
                  className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110 ${tech.className || ''}`}
                />
                <span className="text-[10px] sm:text-xs font-mono text-gray-400 group-hover:text-white transition-colors text-center px-1">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="mt-6 sm:mt-8 font-mono text-[10px] sm:text-xs text-gray-400 flex items-center justify-center gap-2 animate-[fadeIn_2.8s_ease-in]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Available for opportunities</span>
        </div>
        
        {/* Journey Button with roasting message */}
        <div className="mt-6 sm:mt-8 animate-[fadeIn_3.2s_ease-in]">
          <a
            href="/activity"
            className="group relative inline-block"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-black rounded-lg leading-none flex flex-col sm:flex-row items-center gap-2 sm:gap-3 border border-purple-500/50 group-hover:border-purple-500 transition-all duration-300">
              <span className="text-purple-400 group-hover:text-purple-300 transition-colors font-mono text-xs sm:text-sm">
                <span className="text-gray-500">&gt;</span> git log --graph --all
              </span>
              <span className="text-gray-400 group-hover:text-white transition-colors font-mono text-xs sm:text-sm">
                View My Journey
              </span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </a>
          <div className="mt-2 sm:mt-3 font-mono text-[10px] sm:text-xs text-gray-500 italic px-2">
            <span className="text-gray-600">//</span> Warning: May contain bugs, caffeine-induced commits, and 3 AM "fixes"
          </div>
        </div>
        
        {/* Cursor blink effect */}
        <div className="mt-4 sm:mt-6 font-mono text-green-400 text-base sm:text-lg">
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
