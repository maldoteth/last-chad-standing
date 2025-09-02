import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, 
  Star, 
  Users, 
  GamepadIcon, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Zap, 
  Shield, 
  Target,
  Crown,
  Sword,
  Heart,
  Coins,
  Gift,
  Settings,
  User,
  MessageSquare,
  Bell,
  Calendar,
  Award,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Home,
  Search,
  Filter,
  SortAsc,
  Eye,
  ThumbsUp,
  Share2,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  Copy,
  Mail,
  Phone,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  Discord,
  Steam,
  Apple,
  PlayCircle
} from 'lucide-react';
import { VideoBackground } from '@/components/VideoBackground';
import { OrientationPrompt } from '@/components/OrientationPrompt';
import { PreOrderDialog } from '@/components/PreOrderDialog';
import { useToast } from '@/hooks/use-toast';

const Game = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showOrientationPrompt, setShowOrientationPrompt] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowVideo(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      } else {
        if (videoRef.current) {
          videoRef.current.play();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.innerWidth < window.innerHeight) {
        setShowOrientationPrompt(true);
      } else {
        setShowOrientationPrompt(false);
      }
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    handleOrientationChange();

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (loading) {
      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          return newProgress > 99 ? 99 : newProgress;
        });
      }, 100);
    } else {
      setProgress(100);
    }

    return () => clearInterval(intervalId);
  }, [loading]);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <VideoBackground showVideo={showVideo} videoRef={videoRef} isMuted={isMuted} onEnded={handleVideoEnded} />
      <OrientationPrompt showOrientationPrompt={showOrientationPrompt} />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 bg-black/50 backdrop-blur-md z-20 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <a href="#" className="text-lg font-bold">
              <img src="/logo-white.svg" alt="Your Logo" className="h-8" />
            </a>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button variant="ghost" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-full h-1/2 bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black via-transparent to-black"></div>
          </div>
          
          <div className="text-center z-10 max-w-4xl mx-auto">
            {/* Hero Content */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
              Immerse Yourself in the World of Aetheria
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Embark on an epic journey filled with magic, adventure, and endless possibilities.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary">
                <Zap className="mr-2 h-4 w-4" />
                Fast-Paced Combat
              </Badge>
              <Badge variant="secondary">
                <Users className="mr-2 h-4 w-4" />
                Massively Multiplayer
              </Badge>
              <Badge variant="secondary">
                <Globe className="mr-2 h-4 w-4" />
                Open World
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <PreOrderDialog>
                <Button 
                  size="lg" 
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Pre-order now
                </Button>
              </PreOrderDialog>
              
              <Button variant="outline" size="lg" className="text-white hover:bg-white/10 transition-all duration-300">
                <Eye className="mr-2 h-5 w-5" />
                Watch Trailer
              </Button>
            </div>
            
            {/* Stats Section */}
            <div className="mt-12 flex flex-wrap justify-center gap-8">
              <div className="flex flex-col items-center">
                <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                <span className="font-bold text-xl">250K+</span>
                <span className="text-sm text-gray-400">Players Worldwide</span>
              </div>
              <div className="flex flex-col items-center">
                <Star className="h-8 w-8 text-blue-500 mb-2" />
                <span className="font-bold text-xl">4.8/5</span>
                <span className="text-sm text-gray-400">Average Rating</span>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                <span className="font-bold text-xl">98%</span>
                <span className="text-sm text-gray-400">Positive Reviews</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <Card className="bg-black/50 backdrop-blur-md border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Dynamic Combat System</h3>
                    <Sword className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-gray-300">
                    Engage in thrilling battles with a variety of weapons, skills, and abilities. Master the art of combat and become a legendary warrior.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature Card 2 */}
              <Card className="bg-black/50 backdrop-blur-md border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Vast Open World</h3>
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-gray-300">
                    Explore a sprawling world filled with diverse landscapes, hidden dungeons, and challenging quests. Discover the secrets of Aetheria.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature Card 3 */}
              <Card className="bg-black/50 backdrop-blur-md border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Player-Driven Economy</h3>
                    <Coins className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-gray-300">
                    Participate in a dynamic economy where players control the prices of goods and services. Become a master trader or a skilled artisan.
                  </p>
                </CardContent>
              </Card>

              {/* Feature Card 4 */}
              <Card className="bg-black/50 backdrop-blur-md border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Guilds and Alliances</h3>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-gray-300">
                    Join forces with other players to form powerful guilds and alliances. Conquer territories, battle rival factions, and dominate the world of Aetheria.
                  </p>
                </CardContent>
              </Card>

              {/* Feature Card 5 */}
              <Card className="bg-black/50 backdrop-blur-md border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Character Customization</h3>
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-gray-300">
                    Create a unique character with a wide range of customization options. Choose your race, class, skills, and appearance to forge your own destiny.
                  </p>
                </CardContent>
              </Card>

              {/* Feature Card 6 */}
              <Card className="bg-black/50 backdrop-blur-md border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Regular Updates</h3>
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-gray-300">
                    Experience a constantly evolving world with regular updates, new content, and exciting events. The adventure never ends in Aetheria.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-black/50 backdrop-blur-md p-8">
          <div className="container mx-auto text-center">
            <p className="text-gray-400">
              &copy; 2023 Aetheria Online. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Game;
