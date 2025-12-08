import React, { useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Target,
    RotateCcw,
    ChevronRight,
} from "lucide-react"
import * as LucideIcons from "lucide-react";
import { ObjectiveCategory, ObjectiveType, useRank } from "@/context/rankData"
import { toast } from "@/hooks/use-toast";
import { useProfile } from "@/context/profileContext";

type ObjectivesView = "weekly" | "daily" | "quests"

interface ObjectivesCardProps {
    objectivesView: ObjectivesView
    setObjectivesView: (view: ObjectivesView) => void
    isObjectivesGlowing?: boolean
}

interface ObjectiveItemProps {
    icon: React.ReactNode
    title: string
    progress: string;
    type: ObjectiveType;
    catergory: ObjectiveCategory;
    handleObjective: (type: ObjectiveType, category: ObjectiveCategory) => void
}

const ObjectiveItem = React.memo(({ icon, title, progress, type, catergory, handleObjective }: ObjectiveItemProps) => (
    <div
        className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
        onClick={(e) => handleObjective(type, catergory)}
    >
        <div className="flex items-center space-x-3">
            {icon}
            <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{progress}</p>
            </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </div>
))
ObjectiveItem.displayName = "ObjectiveItem"

export default function ObjectivesCard({
    objectivesView,
    setObjectivesView,
    isObjectivesGlowing,
}: ObjectivesCardProps) {
    const { objectivesData, objectivesUserData, isLoading } = useRank();
    const { profile } = useProfile()
    const webUrl = `https://www.lastchadstanding.site/?ref=${profile?.ref_code || ''}`
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({ title: "Copied to clipboard!" })
    }
    const handleSwitchView = useCallback(() => {
        setObjectivesView(objectivesView === "weekly" ? "daily" : "weekly");
    }, [objectivesView, setObjectivesView]);

    const filteredObjectives = useMemo(
        () => objectivesData?.filter((obj) => obj?.category === objectivesView),
        [objectivesData, objectivesView]
    );
    const handleObjective = (type: ObjectiveType, category: ObjectiveCategory) => {
        if (type === 'invitation') {
            handleCopy(webUrl)
        }
    }
    if (isLoading) {
        return (
            <Card className="bg-black border-gray-700 flex items-center justify-center h-48">
                <span className="text-gray-400 text-sm animate-pulse">
                    Loading objectives...
                </span>
            </Card>
        );
    }

    return (
        <Card
            className={`bg-black border-gray-700 transition-all duration-500 ease-in-out cursor-pointer hover:bg-black/80 ${isObjectivesGlowing
                ? "ring-1 ring-primary/30 shadow-lg shadow-primary/20"
                : ""
                }`}
        >
            <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>
                            {objectivesView === "weekly"
                                ? "Weekly Objectives"
                                : objectivesView === "daily"
                                    ? "Daily Objectives"
                                    : "Quests"}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-white/10"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSwitchView();
                        }}
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {filteredObjectives && filteredObjectives.length > 0 ? (
                    filteredObjectives.map((obj, i) => {
                        const IconComponent =
                            LucideIcons[obj.icon as keyof typeof LucideIcons];
                        const progressData = objectivesUserData?.find(item => item?.objective_id === obj?.id) || null
                        return (
                            <ObjectiveItem
                                key={i}
                                icon={
                                    <CircleIcon
                                        Icon={IconComponent}
                                    />
                                }
                                handleObjective={handleObjective}
                                catergory={obj.category}
                                type={obj.type}
                                title={obj.title}
                                progress={`${progressData?.currentCount || 0}/${obj.targetCount} • ${obj.rewardXP} XP`}
                            />
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-400">
                        No {objectivesView} objectives available.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
// ------------------------------
// Helper components
// ------------------------------
const CircleIcon = ({ bg = "bg-white", Icon, text = "text-primary-foreground" }: { bg?: string; Icon: any; text?: string }) => (
    <div className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${text}`} />
    </div>
)

const ImageCircle = ({ bg, src }: { bg: string; src: string }) => (
    <div className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center`}>
        <img src={src} alt="" className="w-4 h-4" />
    </div>
)
