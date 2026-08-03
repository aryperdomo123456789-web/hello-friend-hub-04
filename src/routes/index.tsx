import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDashboardStats, getSources, getMuscles, getLiveConnections, getHostHealth } from "@/lib/dashboard.functions";
import { getLbInstallerScript, addMuscle } from "@/lib/muscles.functions";
import { Server, Activity, Database, ShieldCheck, ChevronRight, ArrowUpRight, Moon, Plus, Terminal, Copy, Check, Shield, Users, Monitor, Play, Film, Tv, Globe, AlertTriangle, Search, RefreshCw, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  component: Index,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["dashboard-stats"],
        queryFn: () => getDashboardStats(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["sources"],
        queryFn: () => getSources(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["muscles"],
        queryFn: () => getMuscles(),
      }),
    ]);
  },
});

function Index() {
  const { data: stats } = useSuspenseQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(),
  });

  const { data: sources } = useSuspenseQuery({
    queryKey: ["sources"],
    queryFn: () => getSources(),
  });

  const { data: muscles } = useSuspenseQuery({
    queryKey: ["muscles"],
    queryFn: () => getMuscles(),
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">CDN Voods - Cérebro</h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Gerenciamento centralizado de origens e load balancers (músculos).
              </p>
            </div>
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="w-fit flex items-center gap-1 py-1 px-3 bg-card/50 backdrop-blur-sm border-border/50">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="text-xs uppercase font-semibold">Sistema Ativo</span>
            </Badge>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Origens (XUI)</CardTitle>
              <Database className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sources}</div>
              <p className="text-xs text-muted-foreground mt-1">Conectadas ao painel central</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Músculos (LBs)</CardTitle>
              <Server className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.muscles}</div>
              <p className="text-xs text-muted-foreground mt-1">VPS distribuindo tráfego</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status Global</CardTitle>
              <Activity className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.onlineMuscles} Online</div>
              <p className="text-xs text-muted-foreground mt-1">Dos {stats.muscles} músculos cadastrados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sources List */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Origens Cadastradas</CardTitle>
                  <CardDescription>Servidores XUI de laboratório e produção.</CardDescription>
                </div>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  Adicionar
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sources.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground py-8">Nenhuma origem cadastrada.</p>
                ) : (
                  sources.map((source: any) => (
                    <div key={source.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border/40 hover:border-primary/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Database className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{source.name}</h4>
                          <p className="text-xs text-muted-foreground">{source.ip}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-[10px]">API OK</Badge>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors cursor-pointer" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Muscles List */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Músculos Ativos</CardTitle>
                  <CardDescription>Load Balancers processando tráfego real.</CardDescription>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Instalar VPS
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Novo Músculo (Load Balancer)</DialogTitle>
                      <DialogDescription>
                        Copie o comando abaixo e execute como root na sua nova VPS.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      <div className="bg-zinc-950 rounded-lg p-4 font-mono text-xs text-zinc-300 relative group border border-zinc-800">
                        <div className="flex justify-between items-start mb-2 border-b border-zinc-800 pb-2">
                          <span className="text-zinc-500 italic"># Script de instalação automática</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-zinc-400 hover:text-white"
                            onClick={() => {
                              navigator.clipboard.writeText("curl -sSL https://voods.app/install-lb | bash");
                              toast.success("Comando copiado!");
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <code className="block whitespace-pre-wrap break-all leading-relaxed">
                          curl -sSL https://voods.app/install-lb | bash
                        </code>
                      </div>

                      <div className="space-y-4 pt-2 border-t border-border">
                        <h4 className="text-sm font-semibold">Após a instalação, registre a VPS:</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase text-muted-foreground">Nome do Músculo</label>
                            <Input placeholder="Ex: LB-SaoPaulo-01" className="h-9" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase text-muted-foreground">IP da VPS</label>
                            <Input placeholder="0.0.0.0" className="h-9" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button className="w-full sm:w-auto">Concluir Registro</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {muscles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Nenhum músculo ativo no momento.</p>
                    <p className="text-xs text-muted-foreground/60 max-w-[200px]">Conecte uma VPS para começar a distribuir o tráfego.</p>
                  </div>
                ) : (
                  muscles.map((muscle: any) => (
                    <div key={muscle.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border/40 hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${muscle.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-gray-400'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">{muscle.name}</h4>
                            <Shield className="w-3 h-3 text-primary/60" />
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">{muscle.ip} <span className="text-[10px] text-muted-foreground/40 px-1">•</span> via {muscle.sources?.name || 'Fonte Direta'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={muscle.status === 'online' ? 'default' : 'secondary'} className="text-[10px] h-5">
                          {muscle.status === 'online' ? 'Protegido' : 'Offline'}
                        </Badge>
                        <Terminal className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors cursor-pointer" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="w-5 h-5" />
            <h3 className="font-bold text-lg">Proteção XUI Ativa</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O sistema agora está pronto para proteger seu painel XUI. Ao instalar um <strong>Músculo (LB)</strong>, o tráfego dos clientes passa pela VPS protegida, ocultando o IP real da sua fonte <code>38.190.176.170</code>. Use o script de instalação para configurar automaticamente o Nginx Proxy otimizado.
          </p>
        </div>
      </div>
    </div>
  );
}

