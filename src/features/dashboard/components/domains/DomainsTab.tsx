import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Plus, RefreshCw, Copy, AlertTriangle } from "lucide-react";

export function DomainsTab() {
  return (
    <div className="space-y-8">
      <Card className="border-border/50 bg-card/50 overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">2. Aponte seus domínios na Cloudflare (nuvem cinza / DNS only)</CardTitle>
              <CardDescription>Configure os domínios de proteção para o seu sistema.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-xl border border-border/40 overflow-hidden mb-6">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-muted/30">
                <tr className="border-b border-border/50 text-[10px] font-bold uppercase text-muted-foreground">
                  <th className="px-4 py-4">TIPO</th>
                  <th className="px-4 py-4">NOME</th>
                  <th className="px-4 py-4">CONTEÚDO</th>
                  <th className="px-4 py-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr className="hover:bg-accent/5 transition-colors">
                  <td className="px-4 py-4 font-bold text-xs">CNAME</td>
                  <td className="px-4 py-4 font-mono text-xs">meudominio.com</td>
                  <td className="px-4 py-4 font-mono text-xs text-primary">cdnvoods.vr766.com</td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-accent/5 transition-colors">
                  <td className="px-4 py-4 font-bold text-xs">A</td>
                  <td className="px-4 py-4 font-mono text-xs">meudominio.com</td>
                  <td className="px-4 py-4 font-mono text-xs text-primary">45.140.192.237</td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Cadastrar Novo Domínio
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Sincronizar DNS
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
        <div className="flex items-center gap-2 text-amber-500">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Atenção ao DNS</h3>
        </div>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          Este painel protege um XUI. Cadastre a origem uma única vez; todos os domínios de proteção usam ela. Este dado fica apenas no banco local, nunca vira DNS público e nunca aparece em playlist, player_api ou EPG.
        </p>
      </div>
    </div>
  );
}
