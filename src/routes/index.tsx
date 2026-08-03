import { createFileRoute } from "@tanstack/react-router";
import { 
  getDashboardStats, 
  getSources, 
  getMuscles, 
  getLiveConnections, 
  getHostHealth 
} from "@/lib/dashboard.functions";
import { 
  Server, 
  Activity, 
  ShieldCheck, 
  Plus, 
  Shield, 
  Monitor, 
  RefreshCw,
  Search,
  Globe
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";

// Refactored Imports
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { LiveConnectionsTable } from "@/features/dashboard/components/live/LiveConnectionsTable";
import { SourceList } from "@/features/dashboard/components/live/SourceList";
import { MuscleList } from "@/features/dashboard/components/muscles/MuscleList";
import { XuiConnectionConfig } from "@/features/dashboard/components/xui/XuiConnectionConfig";
import { XuiOperations } from "@/features/dashboard/components/xui/XuiOperations";
import { DomainsTab } from "@/features/dashboard/components/domains/DomainsTab";
import { MusclesTab } from "@/features/dashboard/components/muscles/MusclesTab";


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
  const { 
    stats, 
    sources, 
    muscles, 
    liveConnections, 
    refetchAll 
  } = useDashboardData();

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
          <TabsList className="bg-card/50 border border-border/50 p-1 rounded-xl h-auto flex-wrap justify-start">
            <TabsTrigger value="live" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="w-4 h-4" />
              Rastreamento ao Vivo
            </TabsTrigger>
            <TabsTrigger value="xui" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Monitor className="w-4 h-4" />
              Gerência XUI
            </TabsTrigger>
            <TabsTrigger value="domains" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Globe className="w-4 h-4" />
              Domínios
            </TabsTrigger>
            <TabsTrigger value="lb" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Server className="w-4 h-4" />
              Músculos (LB)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-8 mt-0 outline-none">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <StatCard label="Conexões" value={stats.liveConnections} />
              <StatCard label="Transmitindo" value={stats.streamingCount} />
              <StatCard label="Canais" value={stats.channelsCount} />
              <StatCard label="Filmes" value={stats.moviesCount} />
              <StatCard label="Séries" value={stats.seriesCount} />
              <StatCard label="Assinantes" value={stats.liveConnections} />
              <StatCard label="IPs" value={stats.distinctIps} />
              <StatCard label="Slots" value={stats.slotsSold} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-border/50 bg-card/50 overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <CardTitle className="text-xl font-bold flex items-center gap-2">Ao Vivo</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-mono opacity-70">
                        ao vivo · fonte 1s · consulta 60ms
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => refetchAll()}>
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
                    </div>
                  </div>
                  <LiveConnectionsTable connections={liveConnections} />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-border/50 bg-card/50">
                  <CardHeader className="pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-primary" />
                        Origens (XUI)
                      </CardTitle>
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-full">
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/40">
                    <SourceList sources={sources} />
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
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-full">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <MuscleList muscles={muscles} />
                </CardContent>
              </Card>

              </div>
            </div>
          </TabsContent>

          <TabsContent value="xui" className="space-y-8 mt-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Linhas no XUI" value={stats.liveConnections} />
              <StatCard label="Linhas Ativas" value={stats.streamingCount} className="text-green-500" />
              <StatCard label="Bouquets" value={0} />
              <StatCard label="Banco XUI" value="ON" className="text-primary" />
            </div>
            <XuiConnectionConfig />
            <XuiOperations muscleCount={muscles.length} />
          </TabsContent>
          
          <TabsContent value="domains" className="space-y-8 mt-0 outline-none">
            <DomainsTab />
          </TabsContent>

          <TabsContent value="lb" className="space-y-8 mt-0 outline-none">
            <MusclesTab muscles={muscles} />
          </TabsContent>
        </Tabs>

        <footer className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="w-5 h-5" />
            <h3 className="font-bold text-lg">Proteção XUI Ativa</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O sistema centralizado (Cérebro) gerencia seus Músculos (LBs) para garantir que sua fonte XUI permaneça oculta e segura.
          </p>
        </footer>
      </div>
    </div>
  );
}
