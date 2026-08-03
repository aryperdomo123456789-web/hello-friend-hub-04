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
      context.queryClient.ensureQueryData({
        queryKey: ["live"],
        queryFn: () => getLiveConnections(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["health"],
        queryFn: () => getHostHealth(),
      }),
    ]);

  },
});

function Index() {
  const { data: stats } = useSuspenseQuery({ queryKey: ["dashboard-stats"], queryFn: () => getDashboardStats() });
  const { data: sources } = useSuspenseQuery({ queryKey: ["sources"], queryFn: () => getSources() });
  const { data: muscles } = useSuspenseQuery({ queryKey: ["muscles"], queryFn: () => getMuscles() });
  const { data: live } = useSuspenseQuery({ queryKey: ["live"], queryFn: () => getLiveConnections() });
  const { data: health } = useSuspenseQuery({ queryKey: ["health"], queryFn: () => getHostHealth() });


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

        <Tabs defaultValue="live" className="w-full space-y-6">
          <TabsList className="bg-card/50 border border-border/50 p-1 rounded-xl h-auto">
            <TabsTrigger value="live" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="w-4 h-4" />
              Painel Geral
            </TabsTrigger>
            <TabsTrigger value="xui" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Monitor className="w-4 h-4" />
              Gerência XUI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-8 mt-0 outline-none">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card className="col-span-1 border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Conexões</p><div className="text-xl font-bold">{stats.liveConnections}</div></CardContent></Card>
              <Card className="col-span-1 border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Transmitindo</p><div className="text-xl font-bold">{stats.streamingCount}</div></CardContent></Card>
              <Card className="col-span-1 border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Canais</p><div className="text-xl font-bold">{stats.channelsCount}</div></CardContent></Card>
              <Card className="col-span-1 border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Filmes</p><div className="text-xl font-bold">{stats.moviesCount}</div></CardContent></Card>
              <Card className="col-span-1 border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Séries</p><div className="text-xl font-bold">{stats.seriesCount}</div></CardContent></Card>
              <Card className="col-span-1 border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Assinantes</p><div className="text-xl font-bold">{stats.liveConnections}</div></CardContent></Card>
              <Card className="col-span-1 border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">IPs</p><div className="text-xl font-bold">{stats.distinctIps}</div></CardContent></Card>
              <Card className="col-span-1 border-border/50 bg-card/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Slots</p><div className="text-xl font-bold">{stats.slotsSold}</div></CardContent></Card>
            </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Real-time Monitoring Section */}
          <Card className="lg:col-span-2 border-border/50 bg-card/50 overflow-hidden">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    Ao Vivo
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono opacity-70">
                    ao vivo · fonte 1s · consulta 60ms
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-accent/10 p-4 border-b border-border/50 flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="filtrar usuário ou IP" className="pl-9 h-9 bg-background/50 border-border/50" />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                  <Button variant="secondary" size="sm" className="h-8 rounded-full px-4 text-xs font-semibold">todas</Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-4 text-xs font-semibold hover:bg-accent/50">canais</Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-4 text-xs font-semibold hover:bg-accent/50">filmes</Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-4 text-xs font-semibold hover:bg-accent/50">séries</Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-4 text-xs font-semibold hover:bg-accent/50">direct</Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-full px-4 text-xs font-semibold hover:bg-accent/50">só transmitindo</Button>
                </div>
              </div>
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
                    {live.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          nenhuma conexão ativa no momento
                        </td>
                      </tr>
                    ) : (
                      live.map((conn: any) => (
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
            </CardContent>
          </Card>

          {/* Infrastructure Stats (Right Column) */}
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    Origens (XUI)
                  </CardTitle>
                  <Button variant="outline" size="icon" className="h-7 w-7 rounded-full">
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  {sources.map((source: any) => (
                    <div key={source.id} className="p-3 flex items-center justify-between hover:bg-accent/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">{source.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{source.ip}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold text-green-500 border-green-500/20 bg-green-500/5">API OK</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Server className="w-4 h-4 text-primary" />
                    Músculos (LB)
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-full">
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Instalar Novo Músculo</DialogTitle>
                        <DialogDescription>Execute como root na sua nova VPS.</DialogDescription>
                      </DialogHeader>
                      <div className="bg-zinc-950 rounded-lg p-4 font-mono text-xs text-zinc-300 border border-zinc-800 my-4">
                        <code>curl -sSL https://voods.app/install-lb | bash</code>
                      </div>
                      <DialogFooter>
                        <Button className="w-full">Registrar Após Instalar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  {muscles.map((muscle: any) => (
                    <div key={muscle.id} className="p-3 flex items-center justify-between hover:bg-accent/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${muscle.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-400'}`} />
                        <div>
                          <div className="text-xs font-bold">{muscle.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{muscle.ip}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold">{muscle.status === 'online' ? 'Protegido' : 'Off'}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Collapsible Legacy Sections */}
        <div className="space-y-4">
          <Accordion type="single" collapsible className="space-y-4 border-none">
            <AccordionItem value="users" className="border border-border/50 rounded-xl bg-card/50 overflow-hidden px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Users className="w-4 h-4" />
                  Parque de Assinantes (limites e conexões em uso)
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-0">
                <div className="rounded-lg border border-border/40 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted/30">
                      <tr className="border-b border-border/50 text-[10px] font-bold uppercase text-muted-foreground">
                        <th className="px-4 py-3">Usuário</th>
                        <th className="px-4 py-3">Plano</th>
                        <th className="px-4 py-3">Em Uso</th>
                        <th className="px-4 py-3">Direct</th>
                        <th className="px-4 py-3">IP Final</th>
                        <th className="px-4 py-3">Saída</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground italic">nenhum dado disponível</td></tr>
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="health" className="border border-border/50 rounded-xl bg-card/50 overflow-hidden px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Activity className="w-4 h-4 text-primary" />
                  Saúde do Host Final de Direct Source (quem barra a CDN)
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-0">
                <div className="rounded-lg border border-border/40 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted/30">
                      <tr className="border-b border-border/50 text-[10px] font-bold uppercase text-muted-foreground">
                        <th className="px-4 py-3">Host Final</th>
                        <th className="px-4 py-3">Veredito</th>
                        <th className="px-4 py-3 text-right">Falha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {health.length === 0 ? (
                        <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground italic">nenhum host observado na última hora</td></tr>
                      ) : (
                        health.map((h: any) => (
                          <tr key={h.id}>
                            <td className="px-4 py-3 font-mono">{h.host}</td>
                            <td className="px-4 py-3">
                              <Badge variant={h.verdict === 'ok' ? 'default' : 'destructive'} className="text-[10px]">{h.verdict}</Badge>
                            </td>
                            <td className="px-4 py-3 text-right">{h.fail_rate}%</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>


          </TabsContent>

          <TabsContent value="xui" className="space-y-8 mt-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Linhas no XUI</p>
                  <div className="text-2xl font-black">{stats.liveConnections}</div>
                  <Badge variant="outline" className="w-fit text-[10px] mt-1">Total de contas</Badge>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Linhas Ativas</p>
                  <div className="text-2xl font-black text-green-500">{stats.streamingCount}</div>
                  <Badge variant="outline" className="w-fit text-[10px] mt-1 bg-green-500/5 border-green-500/20">Em uso agora</Badge>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Bouquets</p>
                  <div className="text-2xl font-black">0</div>
                  <Badge variant="outline" className="w-fit text-[10px] mt-1">Pacotes ativos</Badge>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Banco XUI</p>
                  <div className="text-2xl font-black text-primary">ON</div>
                  <Badge variant="outline" className="w-fit text-[10px] mt-1 bg-primary/5 border-primary/20">Sincronizado</Badge>
                </CardContent>
              </Card>
            </div>

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
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Porta do banco</label>
                      <Input value="3306" readOnly className="bg-background/50 font-mono text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Nome do banco</label>
                      <Input value="xui" readOnly className="bg-background/50 font-mono text-sm" />
                    </div>
                  </div>
                  <div className="space-y-4">
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
                    <div className="flex items-end h-full pb-1">
                      <Button className="w-full gap-2 shadow-lg shadow-primary/20">
                        <RefreshCw className="w-4 h-4" />
                        Testar Conexão
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border-border/50 bg-card/50 overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Operações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <Plus className="w-6 h-6 text-primary" />
                      <div className="flex flex-col text-center">
                        <span className="font-bold">Criar Usuário</span>
                        <span className="text-[10px] text-muted-foreground font-normal">Nova conta no XUI</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
                      <Play className="w-6 h-6 text-primary" />
                      <div className="flex flex-col text-center">
                        <span className="font-bold">Escolher Bouquets</span>
                        <span className="text-[10px] text-muted-foreground font-normal">Gerenciar pacotes</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-bold uppercase">Proxy Ativo</span>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600">OK</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Sua origem está sendo protegida por {muscles.length} músculo(s) ativo(s). O IP real não é exposto aos clientes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

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


      </div>
    </div>
  );
}

