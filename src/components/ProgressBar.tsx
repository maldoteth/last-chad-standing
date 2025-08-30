import { Progress } from "@/components/ui/progress";
import { getCurrentLevel, getProgressToNextLevel } from "@/lib/progressSystem";

interface ProgressBarProps {
  xp: number;
  className?: string;
}

export function ProgressBar({ xp, className }: ProgressBarProps) {
  const currentLevel = getCurrentLevel(xp);
  const progress = getProgressToNextLevel(xp);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">
          Level {currentLevel.level} - {currentLevel.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {currentLevel.level >= 10 ? "10,000+" : `${xp} XP`}
        </span>
      </div>
      
      <Progress value={progress.percentage} className="h-2" />
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>
          {currentLevel.level >= 10 
            ? `${progress.current}/1,000 XP` 
            : `${progress.current}/${progress.total} XP`
          }
        </span>
        <span>Next: Level {currentLevel.level + 1}</span>
      </div>
    </div>
  );
}