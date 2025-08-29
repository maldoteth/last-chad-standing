import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ModeToggle } from "@/components/mode-toggle"
import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableFooter,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, CheckCheck, ChevronsUpDown, Copy, MessageSquare, ChevronRight } from "lucide-react"
import { format } from "date-fns"

const Game: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {username}!</h1>
          <p className="text-sm text-gray-500">Here's what's happening in your game.</p>
        </div>
        <Button variant="destructive" size="sm" onClick={handleLogout}>Logout</Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your game efficiently.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline">Start New Game</Button>
            <Button variant="secondary">View Leaderboard</Button>
          </CardContent>
        </Card>

        {/* Daily Quests */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Quests</CardTitle>
            <CardDescription>Complete these to earn rewards.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Post about $LCS Quest */}
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Post about $LCS</p>
                  <p className="text-xs text-muted-foreground">Share content with $LCS</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-yellow-500 font-medium">+50 XP</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Invite a Friend Quest */}
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Invite a Friend</p>
                  <p className="text-xs text-muted-foreground">Expand the community</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-yellow-500 font-medium">+75 XP</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Game Statistics</CardTitle>
            <CardDescription>Track your progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Games Played</TableCell>
                  <TableCell>15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Win Rate</TableCell>
                  <TableCell>60%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Current Level</TableCell>
                  <TableCell>7</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-6 text-center text-gray-500">
        <p>© 2024 LCS Game. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Game;
