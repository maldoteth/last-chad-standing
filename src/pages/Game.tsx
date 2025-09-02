import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

export default function Game() {
  const [showOrientationPrompt, setShowOrientationPrompt] = useState(false);
  const [isPreOrderDialogOpen, setIsPreOrderDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [soundVolume, setSoundVolume] = useState(50);
  const [musicVolume, setMusicVolume] = useState(50);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkOrientation = useCallback(() => {
    if (window.innerWidth < window.innerHeight) {
      setShowOrientationPrompt(true);
    } else {
      setShowOrientationPrompt(false);
    }
  }, []);

  useEffect(() => {
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, [checkOrientation]);

  const handlePreOrder = () => {
    setIsPreOrderDialogOpen(true);
  };

  const closePreOrderDialog = () => {
    setIsPreOrderDialogOpen(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const submitPreOrder = async () => {
    try {
      const response = await fetch(
        "https://api.example.com/preorder", // Replace with your actual API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        toast({
          title: "Pre-order submitted!",
          description: "Thank you for pre-ordering!",
        });
        navigate("/preorder-success");
      } else {
        toast({
          variant: "destructive",
          title: "Error submitting pre-order.",
          description: "Please try again later.",
        });
        navigate("/preorder-cancel");
      }
    } catch (error) {
      console.error("Pre-order submission failed:", error);
      toast({
        variant: "destructive",
        title: "Pre-order submission failed.",
        description: "Please check your internet connection and try again.",
      });
    } finally {
      closePreOrderDialog();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {showOrientationPrompt && (
        <div className="fixed top-0 left-0 w-full h-full bg-black text-white z-50 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold mb-4">
            Please rotate your device
          </p>
          <p className="text-lg">
            For the best experience, play in landscape mode.
          </p>
        </div>
      )}

      {/* Video Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        <video
          src="/bg_video.mp4"
          autoPlay
          loop
          muted
          className="min-w-full min-h-full absolute object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-white mb-8 drop-shadow-md">
          Game Title
        </h1>

        {/* Aspect Ratio Container */}
        <div className="w-full max-w-md">
          <AspectRatio ratio={16 / 9}>
            <img
              src="/placeholder.png"
              alt="Game Screenshot"
              className="rounded-lg object-cover aspect-video"
            />
          </AspectRatio>
        </div>

        {/* Settings Button */}
        <div className="absolute top-8 right-8 z-20">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.343 3.94c.096-.304.566-.304.662 0l2.497 7.905a.52.52 0 0 0 .515.343h5.985c.449 0 .679.538.342.838l-3.65 3.654a.52.52 0 0 0-.147.531l.876 2.783c.114.364-.258.616-.599.49l-2.87-1.022a.52.52 0 0 0-.531 0l-2.87 1.022c-.341.126-.713-.126-.598-.49l.876-2.783a.52.52 0 0 0-.147-.531L3.94 8.076c-.337-.3-.107-.838.342-.838h5.985a.52.52 0 0 0 .515-.343l2.497-7.905Z"
                  />
                </svg>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white text-black">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>
                  Adjust your game preferences here.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sound" className="text-right">
                    Sound Volume
                  </Label>
                  <Slider
                    id="sound"
                    defaultValue={[soundVolume]}
                    max={100}
                    step={1}
                    className="col-span-3"
                    onValueChange={(value) => setSoundVolume(value[0])}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="music" className="text-right">
                    Music Volume
                  </Label>
                  <Slider
                    id="music"
                    defaultValue={[musicVolume]}
                    max={100}
                    step={1}
                    className="col-span-3"
                    onValueChange={(value) => setMusicVolume(value[0])}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notifications" className="text-right">
                    Enable Notifications
                  </Label>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={(checked) =>
                      setNotificationsEnabled(checked)
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Play Button */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <Button
            onClick={handlePreOrder}
            size="lg"
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
          >
            Pre-order now
          </Button>
        </div>

        {/* Pre-Order Dialog */}
        <Dialog open={isPreOrderDialogOpen} onOpenChange={setIsPreOrderDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white text-black">
            <DialogHeader>
              <DialogTitle>Pre-order Now</DialogTitle>
              <DialogDescription>
                Enter your email to pre-order and receive exclusive updates!
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  className="col-span-3"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="secondary" onClick={closePreOrderDialog}>
                Cancel
              </Button>
              <Button type="submit" onClick={submitPreOrder}>
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
      </div>
    </div>
  );
}
