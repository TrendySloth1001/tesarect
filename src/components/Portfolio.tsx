"use client";

import { Github, Linkedin, Mail } from "lucide-react";

export default function Portfolio() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="max-w-5xl mx-auto px-8 text-center pointer-events-auto">
        {/* Terminal-style prompt */}
        <div className="text-left mb-8 font-mono text-green-400 text-sm md:text-base opacity-80">
          <span className="text-gray-500">guest@portfolio:~$</span> cat developer.txt
        </div>
        
        {/* Name */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-mono font-bold text-white mb-6 tracking-tight leading-tight">
          Nikhil Sohanlal Kumawat
        </h1>
        
        {/* Tagline with typing effect feel */}
        <div className="font-mono text-lg md:text-xl text-green-400 mb-4">
          <span className="text-gray-500">&gt;</span> Full Stack Developer
        </div>
        <div className="font-mono text-base md:text-lg text-cyan-400 mb-12 opacity-80">
          <span className="text-gray-500">&gt;</span> Building the future, one commit at a time
        </div>
        
        {/* Social Links */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <a
            href="https://github.com/TrendySloth1001"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/15 backdrop-blur-md rounded-lg transition-all duration-300 text-white border border-green-400/30 hover:border-green-400/60 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] font-mono"
          >
            <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-medium">GitHub</span>
          </a>
          
          <a
            href="https://www.linkedin.com/in/nikhil-kumawat-78703b32b/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/15 backdrop-blur-md rounded-lg transition-all duration-300 text-white border border-blue-400/30 hover:border-blue-400/60 hover:shadow-[0_0_20px_rgba(96,165,250,0.3)] font-mono"
          >
            <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">LinkedIn</span>
          </a>
          
          <a
            href="mailto:nkumawat8956@gmail.com"
            className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/15 backdrop-blur-md rounded-lg transition-all duration-300 text-white border border-red-400/30 hover:border-red-400/60 hover:shadow-[0_0_20px_rgba(248,113,113,0.3)] font-mono"
          >
            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Email</span>
          </a>
        </div>
        
        {/* Cursor blink effect */}
        <div className="mt-12 font-mono text-green-400 text-xl animate-pulse">
          <span className="inline-block">▊</span>
        </div>
      </div>
    </div>
  );
}
