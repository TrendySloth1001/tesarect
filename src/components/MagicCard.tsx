'use client';

import { useRef, useEffect } from 'react';

interface MagicCardProps {
  children: React.ReactNode;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
}

export default function MagicCard({
  children,
  enableBorderGlow = true,
  enableTilt = false,
  glowColor = '132, 0, 255',
  clickEffect = true,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (enableBorderGlow) {
      card.style.setProperty('--glow-color', glowColor);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableBorderGlow && !enableTilt) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (enableBorderGlow) {
        const relativeX = (x / rect.width) * 100;
        const relativeY = (y / rect.height) * 100;
        card.style.setProperty('--glow-x', `${relativeX}%`);
        card.style.setProperty('--glow-y', `${relativeY}%`);
        card.style.setProperty('--glow-opacity', '1');
      }

      if (enableTilt) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    };

    const handleMouseLeave = () => {
      if (enableBorderGlow) {
        card.style.setProperty('--glow-opacity', '0');
      }
      if (enableTilt) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        animation: ripple 0.8s ease-out forwards;
      `;

      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('click', handleClick);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('click', handleClick);
    };
  }, [enableBorderGlow, enableTilt, glowColor, clickEffect]);

  return (
    <div
      ref={cardRef}
      className="magic-card-wrapper"
      style={{
        position: 'relative',
        transition: enableTilt ? 'transform 0.2s ease-out' : 'none',
        transformStyle: enableTilt ? 'preserve-3d' : 'flat',
      }}
    >
      {enableBorderGlow && (
        <div
          className="magic-card-glow"
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: 'inherit',
            background: `radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(${glowColor}, 0.8), transparent 40%)`,
            opacity: 'var(--glow-opacity, 0)',
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 20 }}>
        {children}
      </div>
      <style jsx>{`
        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
