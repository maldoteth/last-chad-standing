import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCurrentLevel, getProgressToNextLevel, getNextLevel, LEVELS } from "@/lib/progressSystem";

interface ProgressBarProps {
  xp: number;
  className?: string;
}

export function ProgressBar({ xp, className }: ProgressBarProps) {
  const currentLevel = getCurrentLevel(xp);
  const progress = getProgressToNextLevel(xp);
  const nextLevel = getNextLevel(xp);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={`space-y-2 cursor-pointer hover:bg-muted/50 rounded-md p-2 transition-colors ${className}`}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">
              {currentLevel.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {xp} XP
            </span>
          </div>
          
          <Progress value={progress.percentage} className="h-2" />
          
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            {nextLevel ? (
              <>
                <span>{progress.current}/{progress.total} XP</span>
                <span>Next: {nextLevel.name}</span>
              </>
            ) : (
              <span className="text-primary font-medium">Max Level Reached!</span>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-black/10 backdrop-blur-md border border-white/20 text-white z-50">
        <div className="px-3 py-2 text-xs font-medium opacity-75 border-b border-white/10">
          XP Progress Levels
        </div>
        {LEVELS.map((level, index) => {
          const isCurrentLevel = xp >= level.minXp && xp < level.maxXp;
          const isUnlocked = xp >= level.minXp;
          
          return (
            <DropdownMenuItem key={level.name} className="flex items-center justify-between px-3 py-2 hover:bg-white/10">
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isCurrentLevel ? 'text-primary font-medium' : isUnlocked ? 'text-white' : 'text-white/50'}`}>
                  {level.name}
                </span>
                {isCurrentLevel && (
                  <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded-full border border-primary/30">
                    Current
                  </span>
                )}
              </div>
              <span className={`text-xs ${isUnlocked ? 'text-white/70' : 'text-white/40'}`}>
                {level.maxXp === Infinity ? `${level.minXp.toLocaleString()}+ XP` : `${level.minXp.toLocaleString()}-${level.maxXp.toLocaleString()} XP`}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}