import { Progress } from "@/components/ui/progress";
import { getCurrentLevel, getProgressToNextLevel, getNextLevel } from "@/lib/progressSystem";

interface ProgressBarProps {
  xp: number;
  className?: string;
}

export function ProgressBar({ xp, className }: ProgressBarProps) {
  const currentLevel = getCurrentLevel(xp);
  const progress = getProgressToNextLevel(xp);
  const nextLevel = getNextLevel(xp);

  return (
    <div className={`space-y-2 ${className}`}>
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
  );
}