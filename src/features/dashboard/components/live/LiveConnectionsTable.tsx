import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { LiveConnection } from "../../types";

interface LiveConnectionsTableProps {
  connections: LiveConnection[];
}

export function LiveConnectionsTable({ connections }: LiveConnectionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Assinante</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Está Assistindo</th>
            <th className="px-4 py-3">IP</th>
            <th className="px-4 py-3">App</th>
            <th className="px-4 py-3">Entrega</th>
            <th className="px-4 py-3">Saída</th>
            <th className="px-4 py-3 text-right">Ação</th>
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
                    <span className="text-[10px] font-bold text-green-500 uppercase">Live</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-sm text-foreground">{conn.username}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px] px-2 h-5 bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {conn.stream_type}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs font-medium max-w-[150px] truncate">{conn.stream_id}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-[11px] font-mono text-muted-foreground">{conn.ip_address}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-[11px] truncate max-w-[100px] text-muted-foreground">{conn.user_agent || '-'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-[11px] font-bold text-primary">Direta</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px] bg-card border-border/50">
                    {conn.muscles?.name || 'Main'}
                  </Badge>
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
