import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Server, Copy, Check, Terminal } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { MuscleList } from "./MuscleList";
import { Muscle } from "../../types";
import { getLbInstallerScript, addMuscle, deployToMuscle } from "@/lib/muscles.functions";
import { toast } from "sonner";

interface MusclesTabProps {
  muscles: Muscle[];
}

export function MusclesTab({ muscles }: MusclesTabProps) {
  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("22");
  const [user, setUser] = useState("root");
  const [pass, setPass] = useState("");
  const [autoInstall, setAutoInstall] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installerScript, setInstallerScript] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    if (!ip || !name) {
      toast.error("Nome e IP são obrigatórios.");
      return;
    }

    try {
      setIsInstalling(true);
      
      // 1. Cadastrar no banco
      await addMuscle({ data: { name, ip, port, user, pass } });
      
      // 2. Se auto-instalar, disparar deploy
      if (autoInstall) {
        toast.info("Iniciando instalação automática via SSH...");
        await deployToMuscle({ data: { ip, pass } });
        toast.success(`VPS ${ip} configurada como Músculo!`);
      } else {
        toast.success("LB cadastrado. Use o script manual se preferir.");
      }

      // Buscar script para exibição manual caso o usuário queira
      const script = await getLbInstallerScript();
      setInstallerScript(script);
      
      // Limpar campos
      setName("");
      setIp("");
      setPass("");
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsInstalling(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installerScript);
    setCopied(true);
    toast.success("Script copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 mt-0 outline-none">
      <div className="space-y-6">
        {/* Painel simples do LB */}
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-bold">Painel simples do LB</CardTitle>
            <p className="text-xs text-muted-foreground">O Cérebro (Main) centraliza a gestão, valida tokens e repassa o tráfego para os Músculos (LBs) que executam a entrega fluida.</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">LBs</span>
                <span className="text-2xl font-bold">{muscles.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Instalados</span>
                <span className="text-2xl font-bold">{muscles.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Saudáveis</span>
                <span className="text-2xl font-bold text-green-500">{muscles.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">TX agregado</span>
                <span className="text-2xl font-bold">0 Mbps</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Usuários no LB</span>
                <span className="text-2xl font-bold">0</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Usuários XUI</span>
                <span className="text-2xl font-bold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 1. Cadastrar LB */}
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-bold text-blue-500">1. Cadastrar e Instalar LB (Músculo)</CardTitle>
            <p className="text-xs text-muted-foreground">Transforme sua VPS limpa em um nó de processamento protegido.</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Nome</label>
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: LB-Laboratorio" 
                  className="bg-background/50 h-9 text-xs" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">IP do LB</label>
                <Input 
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="143.14.168.78" 
                  className="bg-background/50 h-9 text-xs" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Porta SSH</label>
                <Input 
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="22" 
                  className="bg-background/50 h-9 text-xs" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Usuário root</label>
                <Input 
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="root" 
                  className="bg-background/50 h-9 text-xs" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Senha root</label>
                <Input 
                  type="password" 
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="********" 
                  className="bg-background/50 h-9 text-xs" 
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="auto-install" checked={autoInstall} onCheckedChange={(checked) => setAutoInstall(!!checked)} />
                <label htmlFor="auto-install" className="text-xs font-bold text-muted-foreground">Instalar automaticamente via SSH ao salvar</label>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                onClick={handleSave}
                disabled={isInstalling}
                className="bg-green-600 hover:bg-green-700 text-white font-bold h-10 px-8 rounded-lg text-xs"
              >
                {isInstalling ? "Instalando..." : "Salvar e Instalar LB"}
              </Button>

              {installerScript && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-10 text-xs gap-2">
                      <Terminal className="w-4 h-4" /> Ver Script Manual
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Script de Instalação Manual</DialogTitle>
                      <DialogDescription>
                        Caso a instalação automática falhe, execute este script como root na sua VPS.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="relative mt-4">
                      <pre className="bg-black/90 text-green-500 p-4 rounded-lg overflow-x-auto text-[10px] font-mono max-h-[400px]">
                        {installerScript}
                      </pre>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-2 right-2 text-white hover:bg-white/10"
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2. LBs cadastrados */}
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-bold">2. LBs (Músculos) Ativos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MuscleList muscles={muscles} />
          </CardContent>
        </Card>

        {/* 4. Gerenciamento de Tráfego */}
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-bold">4. Redirecionar Tráfego para o LB</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Escopo</label>
                <select className="w-full bg-background/50 border border-border/50 rounded-lg h-10 px-3 text-xs focus:ring-1 focus:ring-primary outline-none">
                  <option>Somente os usuários digitados</option>
                  <option>Todos os usuários</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Usuário(s)</label>
                <textarea 
                  className="w-full bg-background/50 border border-border/50 rounded-lg p-3 text-xs h-32 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="digite um usuário por linha ou separados por vírgula"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Ação</label>
                <select className="w-full bg-background/50 border border-border/50 rounded-lg h-10 px-3 text-xs focus:ring-1 focus:ring-primary outline-none">
                  <option>Mandar para este LB</option>
                  <option>Voltar para o Main</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">LB de destino</label>
                <select className="w-full bg-background/50 border border-border/50 rounded-lg h-10 px-3 text-xs focus:ring-1 focus:ring-primary outline-none">
                  <option value="">Selecione um LB</option>
                  {muscles.map(m => <option key={m.id} value={m.id}>{m.name} ({m.ip})</option>)}
                </select>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 px-8 rounded-lg text-xs">
              Aplicar Regras de Tráfego
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
