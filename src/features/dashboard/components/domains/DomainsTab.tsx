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
  const [domainsInput, setDomainsInput] = useState("");

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

  const handleProtectDomains = () => {
    if (!domainsInput.trim()) {
      toast.error("Digite pelo menos um domínio.");
      return;
    }
    toast.info("Função de processamento em massa será conectada ao Cérebro.");
    setDomainsInput("");
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
              <CardTitle className="text-lg font-bold">2. Cadastre os domínios de proteção</CardTitle>
              <CardDescription>Domínios que você apontou para a VPS (um por linha)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <textarea
            value={domainsInput}
            onChange={(e) => setDomainsInput(e.target.value)}
            placeholder={"meudominio.com\noutrodominio.com\ncdn3.meudominio.com"}
            className="w-full h-40 bg-background/50 border border-border/50 rounded-lg p-3 font-mono text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
          />
          <Button 
            onClick={handleProtectDomains}
            className="w-fit gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-6 h-auto text-base rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            Proteger domínios
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4 bg-muted/20">
          <CardTitle className="text-lg font-bold">Domínios protegidos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
              <thead className="bg-muted/30">
                <tr className="border-b border-border/50 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                  <th className="px-6 py-4">DOMÍNIO PÚBLICO (ENTREGUE AO CLIENTE)</th>
                  <th className="px-6 py-4">ORIGEM XUI (OCULTA)</th>
                  <th className="px-6 py-4 text-center">STATUS</th>
                  <th className="px-6 py-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {domains.length === 0 ? (
                  <>
                    <tr className="hover:bg-accent/5 transition-colors group">
                      <td className="px-6 py-4 font-medium text-xs">
                        <div className="flex flex-col">
                          <span className="text-foreground">http(s)://voods.suafontee.com/get.php?username=...</span>
                          <span className="text-[10px] text-muted-foreground/60 mt-0.5">&password=...&type=m3u_plus</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold border border-border/50">A</span>
                          <span className="text-muted-foreground">38.190.176.170:80</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ATIVO
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="destructive" size="sm" className="h-8 px-4 text-[10px] font-bold uppercase rounded-lg">
                          Remover
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-accent/5 transition-colors group">
                      <td className="px-6 py-4 font-medium text-xs">
                        <div className="flex flex-col">
                          <span className="text-foreground">http(s)://dafonte.uk/get.php?username=...</span>
                          <span className="text-[10px] text-muted-foreground/60 mt-0.5">&password=...&type=m3u_plus</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold border border-border/50">A</span>
                          <span className="text-muted-foreground">38.190.176.170:80</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ATIVO
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="destructive" size="sm" className="h-8 px-4 text-[10px] font-bold uppercase rounded-lg">
                          Remover
                        </Button>
                      </td>
                    </tr>
                  </>
                ) : (
                  domains.map((domain: any) => (
                    <tr key={domain.id} className="hover:bg-accent/5 transition-colors group">
                      <td className="px-6 py-4 font-medium text-xs">
                        <div className="flex flex-col">
                          <span className="text-foreground">http(s)://{domain.domain_name}/get.php?username=...</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold border border-border/50 uppercase">{domain.type}</span>
                          <span className="text-muted-foreground">{domain.content}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border border-emerald-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ATIVO
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="destructive" size="sm" className="h-8 px-4 text-[10px] font-bold uppercase rounded-lg">
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


      <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
        <div className="flex items-center gap-2 text-amber-500">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Atenção ao DNS</h3>
        </div>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          O domínio público do cliente aponta SEMPRE PARA O MAIN DO SISTEMA. A origem XUI fica oculta no banco de dados, protegendo contra vazamentos. Playlists e APIs são reescritas e entregues pelo domínio público protegido.
        </p>
      </div>
    </div>
  );
}
