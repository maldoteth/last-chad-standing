import React, { useState } from 'react';
import { toast } from 'sonner';
import { GlowButton } from '@/components/ui/spotlight-card';

const ENTRY_SIZES = ['Under 10k', '10-25k', '25k+'] as const;

const Sale = () => {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    wallet: '',
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
    // TODO: hook up to backend
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Submitted successfully!');
    setForm({ name: '', contact: '', wallet: '', entrySize: '' });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          
          <h1 className="text-2xl font-bold text-white tracking-tight">Private Sale</h1>
          <p className="text-white/50 text-sm mt-1">Express your interest below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
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

          {/* Contact */}
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

          {/* Wallet */}
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

          {/* Entry Size */}
          <div>
            <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">Entry Size</label>
            <div className="grid grid-cols-3 gap-2">
              {ENTRY_SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, entrySize: size }))}
                  className={`py-3 rounded-lg text-sm font-medium transition-all border ${
                    form.entrySize === size
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <GlowButton type="submit" disabled={submitting} className="mt-2 py-3.5">
            {submitting ? 'Submitting...' : 'Submit Interest'}
          </GlowButton>
        </form>
      </div>
    </div>
  );
};

export default Sale;
