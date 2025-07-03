import React, { useState } from 'react';
import SocialLinks from '@/components/SocialLinks';
import OrientationPrompt from '@/components/OrientationPrompt';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';
const Index = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    toast
  } = useToast();
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await emailjs.send('service_fweuzbc', 'template_72mnqmt', {
        to_email: email,
        from_name: 'Soma-Cortex Initiative',
        message: 'New notification signup from the consciousness interface.'
      }, 'lrm5ruPzHreaD8EiM');
      toast({
        title: "Successfully Registered",
        description: "You'll be notified when the consciousness interface is ready."
      });
      setEmail('');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to register. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="relative min-h-screen w-screen overflow-hidden">
      {/* Background Video: The Digital Soul */}
      <div className="absolute inset-0 z-0">
        <video src="https://res.cloudinary.com/drqvsqsot/video/upload/v1/LCS_TEASER_1_1_wlqwnc" className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline style={{
        pointerEvents: 'none'
      }} />
        {/* The subtle vignette to draw focus inward */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60"></div>
      </div>

      {/* Mobile Orientation Prompt */}
      <OrientationPrompt />

      {/* Navigation Interface */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-10 py-7 flex justify-between items-center">
        {/* Left Icon - Minimalist Iris */}
        <div className="flex items-center w-16 sm:w-24">
          <img src="/lovable-uploads/ebc2efc2-8d89-4230-921a-5d8b6b3e2e17.png" alt="LCS Fist Logo" className="opacity-70 w-7 h-7 sm:w-6 sm:h-6" />
        </div>

        {/* Center Links */}
        <div className="absolute left-1/2 transform -translate-x-1/2 sm:relative sm:left-auto sm:transform-none flex-1 flex justify-center">
          <SocialLinks />
        </div>

        {/* Right Status */}
        <div className="font-inter text-xs sm:text-sm text-slate-300 w-16 sm:w-24 text-right hidden sm:block">
          PHASE: <span className="text-cyan-400">2/4</span>
        </div>
      </nav>


      {/* The Core Message: Centered Content */}
      <main className="relative z-10 flex h-screen items-center justify-center text-center">
        <div className="max-w-3xl px-8 text-white animate-fade-in">
          <h1 className="font-sora text-6xl font-light tracking-wide"></h1>
          <p className="mt-4 mx-auto max-w-lg font-inter text-base font-normal text-slate-300"></p>
        </div>
      </main>

      {/* Ambient Data: Decorative UI */}
      {/* Right-Side Vertical Label */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30">
        <div className="text-white/40 text-sm uppercase tracking-[0.4em] font-inter" style={{
        writingMode: 'vertical-rl',
        textOrientation: 'mixed'
      }}>
          UNREAL ENGINE 5
        </div>
      </div>

      {/* Bottom-Right Designation */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="text-xs font-inter text-white/60">
          © Last Chad Standing
        </div>
      </div>

      {/* Bottom-Left Log Status */}
      <div className="absolute bottom-4 left-4 z-30">
        <div className="text-xs font-inter text-white/50">
          Closed Alpha Imminent
        </div>
      </div>

      {/* Bottom Center - Get Notified Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="border border-white/20 bg-black/10 backdrop-blur-sm text-white rounded-lg font-inter text-sm transition-colors hover:bg-white/10 hover:border-white/40 py-[8px] px-[28px] font-medium">
              Get Notified
            </button>
          </DialogTrigger>
          <DialogContent className="bg-black/10 border border-white/20 backdrop-blur-sm text-white">
            <DialogHeader>
              <DialogTitle className="font-sora text-xl text-center text-white">Enter Email</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
              <div>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="" className="bg-black/20 border-white/20 text-white placeholder:text-slate-400 focus:border-pink-300/50" required />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 font-inter">
                {isSubmitting ? 'Connecting...' : 'Confirm'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>;
};
export default Index;