import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { LiveConnection } from "../../types";

interface LiveConnectionsTableProps {
  connections: LiveConnection[];
}

export function LiveConnectionsTable({ connections }: LiveConnectionsTableProps) {
  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <table className="w-full text-left border-collapse min-w-[1000px] md:min-w-full">
        <thead>
          <tr className="bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
            <th className="px-4 py-3">ESTADO</th>
            <th className="px-4 py-3">ASSINANTE</th>
            <th className="px-4 py-3">TIPO</th>
            <th className="px-4 py-3">ESTÁ ASSISTINDO</th>
            <th className="px-4 py-3">IP</th>
            <th className="px-4 py-3">APP</th>
            <th className="px-4 py-3">UPTIME</th>
            <th className="px-4 py-3">ENTREGA</th>
            <th className="px-4 py-3">SAÍDA</th>
            <th className="px-4 py-3">ÚLTIMO DADO</th>
            <th className="px-4 py-3 text-right">AÇÃO</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {connections.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">
                nenhuma conexão ativa no momento
              </td>
            </tr>
          ) : (
            connections.map((conn) => (
              <tr key={conn.id} className="hover:bg-accent/20 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    <span className="text-[10px] font-bold text-green-500 uppercase">transmitindo</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-sm text-foreground">{conn.username}</div>
                  <div className="text-[10px] text-muted-foreground">dafonte.uk</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/20 font-bold h-5">
                    filme
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs font-bold truncate max-w-[200px]">{conn.stream_id}</div>
                  <div className="text-[10px] text-muted-foreground">mp4 · #808908</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-[11px] font-mono font-bold text-muted-foreground">{conn.ip_address}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-[11px] truncate max-w-[120px] text-muted-foreground font-medium">{conn.user_agent || 'ExoPlayer'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-[11px] text-muted-foreground font-medium">47m 27s</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground">direct source</span>
                    <span className="text-[10px] text-muted-foreground/70">208.115.235.100</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px] bg-card border-border/50 font-bold px-2 py-0 h-5">
                    {conn.muscles?.name || 'LB-01'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="text-[10px] font-bold text-muted-foreground">14s</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
