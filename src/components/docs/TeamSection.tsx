
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TeamSection() {
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "CEO & Founder",
      description: "Blockchain gaming veteran with 10+ years experience",
      expertise: ["Strategy", "Leadership", "Blockchain"]
    },
    {
      name: "Sarah Williams",
      role: "CTO",
      description: "Former senior engineer at major gaming studios",
      expertise: ["Development", "Architecture", "Smart Contracts"]
    },
    {
      name: "Mike Johnson",
      role: "Game Director",
      description: "Award-winning game designer and creative director",
      expertise: ["Game Design", "User Experience", "Creative Direction"]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-4">Meet the Team</h2>
        <p className="text-lg text-muted-foreground">
          The talented individuals behind MindForge's development.
        </p>
      </div>

      <div className="grid gap-6">
        {teamMembers.map((member) => (
          <Card key={member.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{member.name}</span>
                <Badge variant="secondary">{member.role}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{member.description}</p>
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profit Share Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            MindForge implements a transparent profit-sharing model where token holders receive a percentage of game revenue based on their stake. Revenue is distributed quarterly, with detailed reports provided to the community.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
