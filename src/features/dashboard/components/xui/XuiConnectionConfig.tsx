import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, Copy, Loader2 } from "lucide-react";
import { testXuiConnection, saveSourceConfig, getSources } from "@/lib/dashboard.functions";
import { toast } from "sonner";

export function XuiConnectionConfig() {
  const [config, setConfig] = useState({
    ip: "38.190.176.170",
    port: "3306",
    database: "xui",
    user: "bancovods",
    password: "bancovods",
    apiUrl: "http://38.190.176.170/fejvCHkR",
    apiToken: "EAFD11794F03C3E3BFDA8FAFD6500809"
  });
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const sources = await getSources();
        if (sources && sources.length > 0) {
          const s = sources[0] as any;
          if (s) {
            setConfig({
              ip: s.ip || "",
              port: String(s.db_port || "3306"),
              database: s.db_name || "xui",
              user: s.db_user || "",
              password: s.db_password || "",
              apiUrl: s.api_url || "",
              apiToken: s.api_token || ""
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    }
    loadConfig();
  }, []);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const result = await testXuiConnection({ data: config });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao tentar conectar com o banco de dados.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveSourceConfig({ data: config });
      if (result.success) {
        toast.success("Configurações salvas com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao salvar configurações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-4 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">1. Conexão do XUI</CardTitle>
            <CardDescription>Configure a comunicação direta com o seu painel de origem.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">IP/host do banco do XUI</label>
              <Input value={config.ip} onChange={(e) => handleChange("ip", e.target.value)} className="bg-background/50 font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Porta do banco</label>
                <Input value={config.port} onChange={(e) => handleChange("port", e.target.value)} className="bg-background/50 font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Nome do banco</label>
                <Input value={config.database} onChange={(e) => handleChange("database", e.target.value)} className="bg-background/50 font-mono text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Usuário DB</label>
                <Input value={config.user} onChange={(e) => handleChange("user", e.target.value)} className="bg-background/50 font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Senha DB</label>
                <Input value={config.password} onChange={(e) => handleChange("password", e.target.value)} type="password" name="password" className="bg-background/50 font-mono text-sm" />
              </div>
            </div>
          </div>
          <div className="space-y-4 flex flex-col">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">API URL do XUI</label>
              <Input value={config.apiUrl} onChange={(e) => handleChange("apiUrl", e.target.value)} className="bg-background/50 font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">API token</label>
              <div className="relative">
                <Input value={config.apiToken} onChange={(e) => handleChange("apiToken", e.target.value)} type="password" name="apiToken" className="bg-background/50 font-mono text-sm pr-10" />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-end gap-3 pt-4">
              <Button 
                onClick={handleTest} 
                disabled={isTesting}
                className="flex-1 gap-2 shadow-lg shadow-primary/20 bg-green-600 hover:bg-green-700"
              >
                {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Testar Conexão
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 gap-2 shadow-lg shadow-primary/20"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Salvar Configurações
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

