import React, { useRef, useEffect } from 'react';

export default function NetworkGraphField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const nodeCount = 60;
    const nodeColor = 'rgba(224, 242, 254, 0.9)';
    const nodeGlowColor = '#e0f2fe';
    const linkDistanceThreshold = 130;
    const mouseRadius = 120;

    class Node {
      constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = 1.8;
      }

      update(w, h) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius && distance > 0) {
            const force = (mouseRadius - distance) / mouseRadius;
            this.x += (dx / distance) * force * 1.2;
            this.y += (dy / distance) * force * 1.2;
          }
        }
      }

      draw(context) {
        context.save();
        context.shadowColor = nodeGlowColor;
        context.shadowBlur = 3;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = nodeColor;
        context.fill();
        context.restore();
      }
    }

    const nodes = Array.from({ length: nodeCount }, () => new Node(width, height));

    // Data Pulses Traveling Along Connector Lines
    class DataPulse {
      constructor() {
        this.reset();
      }

      reset() {
        const startIdx = Math.floor(Math.random() * nodes.length);
        const p1 = nodes[startIdx];
        const validNeighbors = [];

        for (let i = 0; i < nodes.length; i++) {
          if (i === startIdx) continue;
          const dx = p1.x - nodes[i].x;
          const dy = p1.y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDistanceThreshold) {
            validNeighbors.push(nodes[i]);
          }
        }

        if (validNeighbors.length > 0) {
          this.startNode = p1;
          this.targetNode = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
          this.progress = 0;
          this.speed = Math.random() * 0.008 + 0.006;
          this.alive = true;
        } else {
          this.alive = false;
        }
      }

      update() {
        if (!this.alive) {
          this.reset();
          return;
        }

        this.progress += this.speed;

        const dx = this.startNode.x - this.targetNode.x;
        const dy = this.startNode.y - this.targetNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (this.progress >= 1 || dist >= linkDistanceThreshold) {
          this.reset();
        }
      }

      draw(context) {
        if (!this.alive) return;

        const currentX = this.startNode.x + (this.targetNode.x - this.startNode.x) * this.progress;
        const currentY = this.startNode.y + (this.targetNode.y - this.startNode.y) * this.progress;

        context.save();
        context.shadowColor = '#38bdf8';
        context.shadowBlur = 6;
        context.beginPath();
        context.arc(currentX, currentY, 2.2, 0, Math.PI * 2);
        context.fillStyle = 'rgba(56, 189, 248, 0.95)';
        context.fill();
        context.restore();
      }
    }

    const pulseCount = 18;
    const pulses = Array.from({ length: pulseCount }, () => new DataPulse());

    const animate = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(width, height);
        nodes[i].draw(ctx);
      }

      // Draw connector lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < linkDistanceThreshold) {
            const alpha = (1 - distance / linkDistanceThreshold) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update and draw data pulses
      for (let i = 0; i < pulses.length; i++) {
        pulses[i].update();
        pulses[i].draw(ctx);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </div>
  );
}
