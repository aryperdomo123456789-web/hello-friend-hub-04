import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Play, Shield, Activity, RefreshCw, Trash2, Power, Terminal } from "lucide-react";
import { Muscle } from "../../types";

interface MuscleListProps {
  muscles: Muscle[];
}

export function MuscleList({ muscles }: MuscleListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
            <th className="px-4 py-4">LB</th>
            <th className="px-4 py-4">INSTALAÇÃO</th>
            <th className="px-4 py-4">SAÚDE</th>
            <th className="px-4 py-4">TELEMETRIA</th>
            <th className="px-4 py-4 text-right">AÇÕES</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {muscles.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground">Nenhum LB cadastrado</td>
            </tr>
          ) : (
            muscles.map((muscle) => (
              <tr key={muscle.id} className="hover:bg-accent/5 transition-colors group">
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{muscle.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{muscle.ip}</span>
                    <span className="text-[9px] text-muted-foreground">root:22 - ubuntu 22.04</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <Badge className="w-fit text-[9px] bg-green-500/20 text-green-500 border-green-500/20 hover:bg-green-500/20">installed</Badge>
                    <span className="text-[9px] text-muted-foreground">sync</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-0.5">
                    <Badge className="w-fit text-[9px] bg-green-500/20 text-green-500 border-green-500/20 hover:bg-green-500/20">ok</Badge>
                    <span className="text-[9px] text-muted-foreground">health=200 cpu=0.7%</span>
                    <span className="text-[9px] text-muted-foreground">tx=0Mbps</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-0.5 text-[9px] text-muted-foreground">
                    <span>CPU: <span className="text-foreground font-bold">67.5%</span></span>
                    <span>RAM livre: <span className="text-foreground font-bold">3465 MB</span></span>
                    <span>Disco livre: <span className="text-foreground font-bold">0 GB</span></span>
                    <span>RX/TX: <span className="text-foreground font-bold">0/0 Mbps</span></span>
                    <span>Sessões: <span className="text-foreground font-bold">0</span></span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold bg-blue-500 text-white border-blue-600 hover:bg-blue-600">Testar</Button>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold bg-cyan-500 text-white border-cyan-600 hover:bg-cyan-600">Instalar</Button>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold bg-green-500 text-white border-green-600 hover:bg-green-600">Sincronizar</Button>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold bg-amber-500 text-white border-amber-600 hover:bg-amber-600">Desativar</Button>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600">Remover</Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}