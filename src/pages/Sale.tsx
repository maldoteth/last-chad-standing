import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { GlowButton } from '@/components/ui/spotlight-card';
import { supabase } from '@/integrations/supabase/client';

const ENTRY_SIZES = ['Under 10k', '10-25k', '25k+'] as const;
const SHARD_COLS = 8;
const SHARD_ROWS = 6;

const Sale = () => {
  const [phase, setPhase] = useState<'video' | 'ended' | 'shattering' | 'form'>('video');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shards, setShards] = useState<Array<{
    x: number; y: number; w: number; h: number;
    tx: number; ty: number; rotate: number; delay: number;
    sx: number; sy: number; sw: number; sh: number;
  }>>([]);

  const [form, setForm] = useState({
    name: '',
    contact: '',
    wallet: '',
    socials: '',
    entrySize: '' as string,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.wallet.trim() || !form.entrySize) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('sale_interests' as any).insert({
        name: form.name.trim(),
        contact: form.contact.trim(),
        wallet: form.wallet.trim(),
        socials: form.socials.trim() || null,
        entry_size: form.entrySize,
      });
      if (error) throw error;
      toast.success('Submitted successfully!');
      setForm({ name: '', contact: '', wallet: '', socials: '', entrySize: '' });
    } catch (err: any) {
      console.error('Sale interest submission error:', err);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }, []);

  const handleVideoEnd = () => {
    setPhase('ended');
  };

  const handleShatter = () => {
    const frameDataUrl = captureFrame();
    if (!frameDataUrl) {
      setPhase('form');
      return;
    }

    // Create shards from the captured frame
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const shardW = vw / SHARD_COLS;
    const shardH = vh / SHARD_ROWS;

    const newShards: typeof shards = [];
    for (let row = 0; row < SHARD_ROWS; row++) {
      for (let col = 0; col < SHARD_COLS; col++) {
        const centerX = col * shardW + shardW / 2;
        const centerY = row * shardH + shardH / 2;
        const dx = centerX - vw / 2;
        const dy = centerY - vh / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const force = 300 + Math.random() * 500;

        newShards.push({
          x: col * shardW,
          y: row * shardH,
          w: shardW + 1, // +1 to avoid gaps
          h: shardH + 1,
          tx: Math.cos(angle) * force + (Math.random() - 0.5) * 200,
          ty: Math.sin(angle) * force + (Math.random() - 0.5) * 200 + 200,
          rotate: (Math.random() - 0.5) * 720,
          delay: (dist / (Math.sqrt(vw * vw + vh * vh) / 2)) * 0.15,
          // Source coords in the original image
          sx: (col / SHARD_COLS) * 100,
          sy: (row / SHARD_ROWS) * 100,
          sw: (1 / SHARD_COLS) * 100,
          sh: (1 / SHARD_ROWS) * 100,
        });
      }
    }

    // Store frame as CSS background on the shards container
    const container = document.getElementById('shatter-container');
    if (container) container.dataset.frame = frameDataUrl;

    setShards(newShards);
    setPhase('shattering');

    setTimeout(() => setPhase('form'), 1200);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video overlay */}
      {(phase === 'video' || phase === 'ended') && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-end pb-[15vh] xl:pb-[33vh]">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnd}
            className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
          >
            <source src="/videos/sale-intro.mp4" type="video/mp4" />
          </video>

          {/* Button appears when video ends */}
          {phase === 'ended' && (
            <div className="relative z-10 animate-fade-in">
              <GlowButton onClick={handleShatter} className="px-10 py-4 text-base">
                Register Interest
              </GlowButton>
            </div>
          )}
        </div>
      )}

      {/* Shatter pieces */}
      {phase === 'shattering' && (
        <div id="shatter-container" className="fixed inset-0 z-50 pointer-events-none">
          {shards.map((shard, i) => {
            const frameUrl = document.getElementById('shatter-container')?.dataset.frame;
            return (
              <div
                key={i}
                className="absolute overflow-hidden"
                style={{
                  left: shard.x,
                  top: shard.y,
                  width: shard.w,
                  height: shard.h,
                  animation: `shatter-piece 0.9s ${shard.delay}s cubic-bezier(0.25, 0, 0.6, 1) forwards`,
                }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: frameUrl ? `url(${frameUrl})` : undefined,
                    backgroundSize: `${window.innerWidth}px ${window.innerHeight}px`,
                    backgroundPosition: `-${shard.x}px -${shard.y}px`,
                  }}
                />
              </div>
            );
          })}
          <style>{`
            @keyframes shatter-piece {
              0% {
                transform: translate(0, 0) rotate(0deg) scale(1);
                opacity: 1;
              }
              100% {
                transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.3);
                opacity: 0;
              }
            }
          `}
          {shards.map((shard, i) => `
            #shatter-container > div:nth-child(${i + 1}) {
              --tx: ${shard.tx}px;
              --ty: ${shard.ty}px;
              --rot: ${shard.rotate}deg;
            }
          `).join('')}
          </style>
        </div>
      )}

      {/* Form - always rendered underneath, revealed after shatter */}
      <div
        className={`min-h-screen flex items-center justify-center px-4 py-12 transition-opacity duration-500 ${
          phase === 'form' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Strategic Sale</h1>
            <p className="text-white/50 text-sm mt-1">Express your interest below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">Contact Email or Telegram</label>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                maxLength={255}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
              placeholder="email@example.com or @telegram"
              />
            </div>

            <div>
              <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">Social Links <span className="text-white/30">(optional)</span></label>
              <input
                name="socials"
                value={form.socials}
                onChange={handleChange}
                maxLength={500}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors"
                placeholder="X, Discord, etc."
              />
            </div>

            <div>
              <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">Wallet Address</label>
              <input
                name="wallet"
                value={form.wallet}
                onChange={handleChange}
                maxLength={255}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-white/30 transition-colors"
                placeholder="0x..."
              />
            </div>

            <div>
              <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">Entry Size</label>
              <div className="grid grid-cols-3 gap-2">
                {ENTRY_SIZES.map(size => (
                  <GlowButton
                    key={size}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, entrySize: size }))}
                    className={`py-3 ${
                      form.entrySize === size
                        ? 'border-blue-500/70 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                        : ''
                    }`}
                  >
                    {size}
                  </GlowButton>
                ))}
              </div>
            </div>

            <GlowButton type="submit" disabled={submitting} className="mt-2 py-3.5">
              {submitting ? 'Submitting...' : 'Submit Interest'}
            </GlowButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sale;
