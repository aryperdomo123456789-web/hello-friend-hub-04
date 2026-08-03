import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDashboardStats, getSources, getMuscles } from "@/lib/dashboard.functions";
import { Server, Activity, Database, ShieldCheck, ChevronRight, ArrowUpRight, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  Instalar VPS
                </Badge>
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
                    <div key={muscle.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border/40">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${muscle.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-400'}`} />
                        <div>
                          <h4 className="font-semibold text-sm">{muscle.name}</h4>
                          <p className="text-xs text-muted-foreground">{muscle.ip} • via {muscle.sources?.name || 'Indefinido'}</p>
                        </div>
                      </div>
                      <Badge variant={muscle.status === 'online' ? 'default' : 'secondary'}>
                        {muscle.status === 'online' ? 'Online' : 'Offline'}
                      </Badge>
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
            <Activity className="w-5 h-5" />
            <h3 className="font-bold text-lg">Próximos Passos do Backup</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O "Cérebro" agora tem os dados do laboratório (XUI: 38.190.176.170). O próximo passo é implementar o instalador SSH para converter qualquer VPS comum em um "Músculo" configurado com Nginx Proxy otimizado para IPTV.
          </p>
        </div>
      </div>
    </div>
  );
}

