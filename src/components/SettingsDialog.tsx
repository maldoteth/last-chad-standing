import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { user } = usePrivy();
  const { profile, loading, createProfile, updateProfile, uploadAvatar } = useProfile();
  const [username, setUsername] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
    }
  }, [profile]);

  const handleUsernameUpdate = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      if (!profile) {
        await createProfile();
      }
      
      await updateProfile({ username: username.trim() });
    } catch (error: any) {
      if (error?.code === '23505') {
        toast({
          title: "Username taken",
          description: "This username is already taken. Please choose another one.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!profile) {
        await createProfile();
      }
      await uploadAvatar(file);
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }
  };

  const displayName = profile?.username || user?.email?.address?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border border-gray-700/50 shadow-2xl relative overflow-hidden">
        {/* Liquid glass metallic background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/30" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.02) 75%),
            linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.01) 25%, rgba(255,255,255,0.01) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.01) 75%)
          `,
          backgroundSize: '4px 4px'
        }} />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-white text-xl font-bold flex items-center space-x-2">
            <div className="w-6 h-6 bg-white/10 rounded-md flex items-center justify-center">
              📦
            </div>
            <span>My Locker</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 relative z-10">
          {/* Profile Picture Section with metallic border */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="p-1 rounded-full bg-gradient-to-br from-white/20 via-white/10 to-transparent border border-white/20 backdrop-blur-md shadow-2xl">
                <Avatar className="h-24 w-24 bg-white/5 border-2 border-white/10">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="text-2xl font-bold text-white bg-gradient-to-br from-gray-800 to-gray-900">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute -bottom-2 -right-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full cursor-pointer hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Camera className="h-4 w-4 text-white" />
                )}
              </label>
              
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={loading}
              />
            </div>
            
            <p className="text-sm text-gray-300 text-center">
              Click the camera icon to upload a new profile picture
            </p>
          </div>

          {/* Username Section with glass input */}
          <div className="space-y-3">
            <Label htmlFor="username" className="text-white font-medium">Username</Label>
            <div className="flex space-x-3">
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading || isUpdating}
                className="bg-white/5 backdrop-blur-md border border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 focus:bg-white/10 transition-all duration-300"
              />
              <Button 
                onClick={handleUsernameUpdate}
                disabled={loading || isUpdating || !username.trim() || username === profile?.username}
                size="sm"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 px-6"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>

          {/* Email Display with glass effect */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Email</Label>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md p-3">
              <div className="text-gray-300 text-sm">
                {user?.email?.address || ""}
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Your email cannot be changed here
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};