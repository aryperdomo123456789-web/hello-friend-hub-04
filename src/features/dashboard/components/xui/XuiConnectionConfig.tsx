import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, Copy } from "lucide-react";

export function XuiConnectionConfig() {
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
              <Input value="38.190.176.170" readOnly className="bg-background/50 font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Porta do banco</label>
                <Input value="3306" readOnly className="bg-background/50 font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Nome do banco</label>
                <Input value="xui" readOnly className="bg-background/50 font-mono text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Usuário DB</label>
                <Input value="bancovods" readOnly className="bg-background/50 font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Senha DB</label>
                <Input value="bancovods" readOnly type="password" className="bg-background/50 font-mono text-sm" />
              </div>
            </div>
          </div>
          <div className="space-y-4 flex flex-col">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">API URL do XUI</label>
              <Input value="http://38.190.176.170/fejvCHkR" readOnly className="bg-background/50 font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">API token</label>
              <div className="relative">
                <Input value="EAFD11794F03C3E3BFDA8FAFD6500809" readOnly type="password" className="bg-background/50 font-mono text-sm pr-10" />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-end gap-3 pt-4">
              <Button className="flex-1 gap-2 shadow-lg shadow-primary/20 bg-green-600 hover:bg-green-700">
                <RefreshCw className="w-4 h-4" />
                Testar Conexão
              </Button>
              <Button className="flex-1 gap-2 shadow-lg shadow-primary/20">
                Salvar Configurações
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
