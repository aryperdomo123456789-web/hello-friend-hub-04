import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Muscle } from "../../types";

interface MuscleListProps {
  muscles: Muscle[];
}

export function MuscleList({ muscles }: MuscleListProps) {
  return (
    <div className="divide-y divide-border/40">
      {muscles.map((muscle) => (
        <div key={muscle.id} className="p-3 flex items-center justify-between hover:bg-accent/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${muscle.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-400'}`} />
            <div>
              <div className="text-xs font-bold">{muscle.name}</div>
              <div className="text-[10px] text-muted-foreground font-mono">{muscle.ip}</div>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-bold">{muscle.status === 'online' ? 'Protegido' : 'Off'}</Badge>
        </div>
      ))}
    </div>
  );
}
