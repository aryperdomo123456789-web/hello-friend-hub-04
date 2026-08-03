import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Plus, RefreshCw, Copy, AlertTriangle, Shield, Check, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useDashboardData } from "../../hooks/use-dashboard-data";
import { useServerFn } from "@tanstack/react-start";
import { saveSourceConfig, getSources } from "@/lib/dashboard.functions";
import { toast } from "sonner";

export function DomainsTab() {
  const { domains } = useDashboardData();
  const updateSource = useServerFn(saveSourceConfig);
  const fetchSources = useServerFn(getSources);
  
  const [sourceIp, setSourceIp] = useState("");
  const [sourcePort, setSourcePort] = useState("80");
  const [originType, setOriginType] = useState<'A' | 'CNAME'>('A');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sources = await fetchSources();
        if (sources && sources.length > 0) {
          const s = sources[0] as any;
          setSourceIp(s.ip || "");
          setSourcePort(s.db_port?.toString() || "80");
          setOriginType(s.origin_type || 'A');
        }
      } catch (e) {
        console.error("Erro ao carregar configurações de origem:", e);
      }
    };
    loadData();
  }, [fetchSources]);

  const handleSaveSource = async () => {
    setIsSaving(true);
    try {
      await updateSource({ 
        data: { 
          ip: sourceIp, 
          port: sourcePort, 
          originType,
          apiUrl: `http://${sourceIp}/fejvCHkR` 
        } 
      });
      toast.success("Origem salva com sucesso!");
    } catch (e) {
      toast.error("Erro ao salvar origem.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Origem do XUI Section */}
      <Card className="border-border/50 bg-card/50 overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">1. Origem do XUI (interno — nunca sai para o público)</CardTitle>
              <CardDescription>
                Este painel protege um XUI. Cadastre a origem uma única vez; todos os domínios de proteção usam ela.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Tipo de origem</label>
              <Select value={originType} onValueChange={(val: any) => setOriginType(val)}>
                <SelectTrigger className="bg-background/50 border border-border/50 rounded-lg font-medium">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A — o main do XUI é só IP (ex: 38.190.176.170)</SelectItem>
                  <SelectItem value="CNAME">CNAME — o main do XUI tem DNS (ex: dafonte.uk)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  {originType === 'A' ? 'IP da Origem' : 'Domínio da Origem'}
                </label>
                <Input 
                  value={sourceIp} 
                  onChange={(e) => setSourceIp(e.target.value)}
                  placeholder={originType === 'A' ? "Ex: 38.190.176.170" : "Ex: dafonte.uk"} 
                  className="bg-background/50 font-mono" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Porta do XUI</label>
                <Input 
                  value={sourcePort} 
                  onChange={(e) => setSourcePort(e.target.value)}
                  placeholder="Ex: 80" 
                  className="bg-background/50 font-mono" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleSaveSource} 
                disabled={isSaving}
                className="w-fit gap-2 bg-green-500 hover:bg-green-600 text-white font-bold"
              >
                {isSaving ? "Salvando..." : "Salvar origem"}
              </Button>
              <p className="text-[10px] text-muted-foreground">
                Origem ativa: {originType} · {sourceIp}:{sourcePort}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <div className="rounded-xl border border-border/40 overflow-hidden mb-6 -mx-4 md:mx-0 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[600px] md:min-w-full">
              <thead className="bg-muted/30">
                <tr className="border-b border-border/50 text-[10px] font-bold uppercase text-muted-foreground">
                  <th className="px-4 py-4">TIPO</th>
                  <th className="px-4 py-4">NOME</th>
                  <th className="px-4 py-4">CONTEÚDO</th>
                  <th className="px-4 py-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {domains.length === 0 ? (
                  <>
                    <tr className="hover:bg-accent/5 transition-colors">
                      <td className="px-4 py-4 font-bold text-xs">CNAME</td>
                      <td className="px-4 py-4 font-mono text-xs">meudominio.com</td>
                      <td className="px-4 py-4 font-mono text-xs text-primary italic">cdnvoods.vr766.com (Exemplo)</td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-accent/5 transition-colors">
                      <td className="px-4 py-4 font-bold text-xs">A</td>
                      <td className="px-4 py-4 font-mono text-xs">meudominio.com</td>
                      <td className="px-4 py-4 font-mono text-xs text-primary italic">45.140.192.237 (Exemplo)</td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  </>
                ) : (
                  domains.map((domain: any) => (
                    <tr key={domain.id} className="hover:bg-accent/5 transition-colors">
                      <td className="px-4 py-4 font-bold text-xs uppercase">{domain.type}</td>
                      <td className="px-4 py-4 font-mono text-xs">{domain.domain_name}</td>
                      <td className="px-4 py-4 font-mono text-xs text-primary">{domain.content}</td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
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
