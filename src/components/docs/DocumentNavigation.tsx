
import { cn } from "@/lib/utils";

interface DocumentNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DocumentNavigation({ activeSection, onSectionChange }: DocumentNavigationProps) {
  const sections = [
    { id: "game", label: "Game Documentation" },
    { id: "brand", label: "Brand Assets" },
    { id: "token", label: "Token Information" },
    { id: "team", label: "Team & Profit Share" }
  ];

  return (
    <nav className="space-y-2">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
        Sections
      </h3>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={cn(
            "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
            activeSection === section.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}
