import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getXuiCategories, getXuiStreams, getXuiEpisodes } from "@/lib/xui-content.functions";
import { LayoutGrid, Tv, Film, PlayCircle, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ContentTab() {
  const [search, setSearch] = useState("");
  const [activeTypeTab, setActiveTypeTab] = useState("categories");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");

  const { data: categories = [] } = useQuery({
    queryKey: ["xui-categories"],
    queryFn: () => getXuiCategories(),
  });

  const { data: liveStreams = [] } = useQuery({
    queryKey: ["xui-streams-live"],
    queryFn: () => getXuiStreams({ data: { type: 'live' } }),
  });

  const { data: movies = [] } = useQuery({
    queryKey: ["xui-streams-movie"],
    queryFn: () => getXuiStreams({ data: { type: 'movie' } }),
  });

  const { data: series = [] } = useQuery({
    queryKey: ["xui-streams-series"],
    queryFn: () => getXuiStreams({ data: { type: 'series' } }),
  });

  const { data: episodes = [] } = useQuery({
    queryKey: ["xui-episodes"],
    queryFn: () => getXuiEpisodes(),
  });

  const filterData = (data: any[], type?: string) => {
    let filtered = data || [];
    
    // Global text search
    if (search) {
      filtered = filtered.filter(item => 
        (item.name || item.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.id?.toString() || "").includes(search)
      );
    }

    // Category filtering
    if (type && activeCategoryFilter !== "all") {
      filtered = filtered.filter(item => item.category_id?.toString() === activeCategoryFilter);
    }

    return filtered;
  };

  const movieCategories = categories.filter(c => c.type === 'movie');
  const liveCategories = categories.filter(c => c.type === 'live');
  const seriesCategories = categories.filter(c => c.type === 'series');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative w-full max-w-md">
          <Input 
            placeholder="Pesquisar em tudo..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card/50 border-border/50 pl-4 h-11 rounded-xl focus-visible:ring-primary"
          />
        </div>

        {activeTypeTab !== "categories" && activeTypeTab !== "episodes" && (
          <select 
            className="bg-card/50 border border-border/50 rounded-xl h-11 px-4 text-sm outline-none focus:ring-1 focus:ring-primary min-w-[200px]"
            value={activeCategoryFilter}
            onChange={(e) => setActiveCategoryFilter(e.target.value)}
          >
            <option value="all">Todas as Categorias</option>
            {(activeTypeTab === "live" ? liveCategories : 
              activeTypeTab === "movies" ? movieCategories : 
              seriesCategories).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}
      </div>

      <Tabs defaultValue="categories" value={activeTypeTab} onValueChange={setActiveTypeTab} className="w-full">
        <TabsList className="bg-card/50 border border-border/50 p-1 rounded-xl mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="categories" className="rounded-lg gap-2 font-bold data-[state=active]:bg-primary flex-1">
            <LayoutGrid className="w-4 h-4" /> Categorias
          </TabsTrigger>
          <TabsTrigger value="live" className="rounded-lg gap-2 font-bold data-[state=active]:bg-primary flex-1">
            <Tv className="w-4 h-4" /> Canais
          </TabsTrigger>
          <TabsTrigger value="movies" className="rounded-lg gap-2 font-bold data-[state=active]:bg-primary flex-1">
            <Film className="w-4 h-4" /> Filmes
          </TabsTrigger>
          <TabsTrigger value="series" className="rounded-lg gap-2 font-bold data-[state=active]:bg-primary flex-1">
            <Layers className="w-4 h-4" /> Séries
          </TabsTrigger>
          <TabsTrigger value="episodes" className="rounded-lg gap-2 font-bold data-[state=active]:bg-primary flex-1">
            <PlayCircle className="w-4 h-4" /> Episódios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ContentTable title="Categorias Canais" items={filterData(liveCategories)} columns={["ID", "Nome"]} />
            <ContentTable title="Categorias Filmes" items={filterData(movieCategories)} columns={["ID", "Nome"]} />
            <ContentTable title="Categorias Séries" items={filterData(seriesCategories)} columns={["ID", "Nome"]} />
          </div>
        </TabsContent>

        <TabsContent value="live">
          <ContentTable title="Canais ao Vivo" items={filterData(liveStreams, 'live')} columns={["ID", "Capa", "Nome"]} />
        </TabsContent>

        <TabsContent value="movies">
          <ContentTable title="Filmes VOD" items={filterData(movies, 'movies')} columns={["ID", "Capa", "Nome"]} />
        </TabsContent>

        <TabsContent value="series">
          <ContentTable title="Séries de TV" items={filterData(series, 'series')} columns={["ID", "Nome"]} />
        </TabsContent>

        <TabsContent value="episodes">
          <ContentTable title="Episódios" items={filterData(episodes)} columns={["ID", "Série", "Título", "Temporada", "Episódio"]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentTable({ title, items, columns }: { title: string, items: any[], columns: string[] }) {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden rounded-2xl shadow-sm">
      <CardHeader className="border-b border-border/50 bg-accent/5 py-4">
        <CardTitle className="text-md font-bold flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{items.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-card/95 backdrop-blur-sm z-10 shadow-sm">
              <tr className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
                {columns.map(col => <th key={col} className="px-4 py-3">{col}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-accent/10 transition-colors group">
                  {columns.map(col => (
                    <td key={col} className="px-4 py-3 text-sm">
                      {renderCell(col, item)}
                    </td>
                  ))}
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground italic">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function renderCell(col: string, item: any) {
  switch (col) {
    case "ID": return <span className="text-muted-foreground font-mono text-xs">{item.id}</span>;
    case "Nome": return <span className="font-bold">{item.name}</span>;
    case "Tipo": return <Badge variant="outline" className="uppercase text-[9px] px-1.5 h-4">{item.type}</Badge>;
    case "Capa": return item.stream_icon ? <img src={item.stream_icon} className="w-8 h-12 object-cover rounded-md bg-muted shadow-sm group-hover:scale-105 transition-transform" alt="" /> : <div className="w-8 h-12 bg-muted rounded-md" />;
    case "Categoria": return <span className="text-xs text-muted-foreground">{item.category_id}</span>;
    case "Série": return <span className="text-xs font-medium text-muted-foreground">{item.series_id || item.series_name}</span>;
    case "Título": return <span className="font-bold text-xs">{item.title}</span>;
    case "Temporada": return <Badge variant="secondary" className="h-5 text-[10px]">T{item.season_num}</Badge>;
    case "Episódio": return <Badge variant="outline" className="h-5 text-[10px]">E{item.episode_num}</Badge>;
    default: return "";
  }
}
