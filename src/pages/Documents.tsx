
import { useState } from "react";
import { DocumentSearch } from "@/components/DocumentSearch";
import { GameDocumentation } from "@/components/docs/GameDocumentation";
import { BrandAssets } from "@/components/docs/BrandAssets";
import { TokenCalculators } from "@/components/docs/TokenCalculators";
import { TeamSection } from "@/components/docs/TeamSection";
import { DocumentNavigation } from "@/components/docs/DocumentNavigation";

const Documents = () => {
  const [activeSection, setActiveSection] = useState("game");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "game":
        return <GameDocumentation />;
      case "brand":
        return <BrandAssets />;
      case "token":
        return <TokenCalculators />;
      case "team":
        return <TeamSection />;
      default:
        return <GameDocumentation />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Everything you need to know about MindForge
          </p>
          <DocumentSearch />
        </div>

        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-8">
              <DocumentNavigation 
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>
          </aside>

          <main className="flex-1">
            {renderActiveSection()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Documents;
