import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";
import { Source } from "../../types";

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  return (
    <div className="divide-y divide-border/40">
      {sources.map((source) => (
        <div key={source.id} className="p-3 flex items-center justify-between hover:bg-accent/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold">{source.name}</div>
              <div className="text-[10px] text-muted-foreground font-mono">{source.ip}</div>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-bold text-green-500 border-green-500/20 bg-green-500/5">API OK</Badge>
        </div>
      ))}
    </div>
  );
}
