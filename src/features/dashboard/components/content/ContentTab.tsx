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

  const filterData = (data: any[]) => (data || []).filter(item => 
    (item.name || item.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 max-w-md">
        <Input 
          placeholder="Pesquisar conteúdo..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card/50 border-border/50"
        />
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="bg-card/50 border border-border/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="categories" className="rounded-lg gap-2 font-bold data-[state=active]:bg-primary">
            <LayoutGrid className="w-4 h-4" /> Categorias
          </TabsTrigger>
          <TabsTrigger value="live" className="rounded-lg gap-2 font-bold data-[state=active]:bg-primary">
            <Tv className="w-4 h-4" /> Canais
          </TabsTrigger>
          <TabsTrigger value="movies" className="rounded-lg gap-2 font-bold data-[state=active]:bg-primary">
            <Film className="w-4 h-4" /> Filmes
          </TabsTrigger>
          <TabsTrigger value="series" className="rounded-lg gap-2 font-bold data-[state=active]:bg-primary">
            <Layers className="w-4 h-4" /> Séries
          </TabsTrigger>
          <TabsTrigger value="episodes" className="rounded-lg gap-2 font-bold data-[state=active]:bg-primary">
            <PlayCircle className="w-4 h-4" /> Episódios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <ContentTable title="Categorias" items={filterData(categories)} columns={["ID", "Nome", "Tipo"]} />
        </TabsContent>

        <TabsContent value="live">
          <ContentTable title="Canais ao Vivo" items={filterData(liveStreams)} columns={["ID", "Capa", "Nome", "Categoria"]} />
        </TabsContent>

        <TabsContent value="movies">
          <ContentTable title="Filmes VOD" items={filterData(movies)} columns={["ID", "Capa", "Nome", "Categoria"]} />
        </TabsContent>

        <TabsContent value="series">
          <ContentTable title="Séries de TV" items={filterData(series)} columns={["ID", "Nome", "Categoria"]} />
        </TabsContent>

        <TabsContent value="episodes">
          <ContentTable title="Episódios" items={filterData(episodes)} columns={["ID", "Série ID", "Título", "Temporada", "Episódio"]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentTable({ title, items, columns }: { title: string, items: any[], columns: string[] }) {
  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden rounded-2xl">
      <CardHeader className="border-b border-border/50 bg-accent/5 py-4">
        <CardTitle className="text-lg font-bold">{title} ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
                {columns.map(col => <th key={col} className="px-6 py-4">{col}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-accent/10 transition-colors">
                  {columns.map(col => (
                    <td key={col} className="px-6 py-4 text-sm">
                      {renderCell(col, item)}
                    </td>
                  ))}
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground">
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
    case "ID": return item.id;
    case "Nome": return <span className="font-bold">{item.name}</span>;
    case "Tipo": return <Badge variant="outline" className="uppercase text-[10px]">{item.type}</Badge>;
    case "Capa": return item.stream_icon ? <img src={item.stream_icon} className="w-10 h-14 object-cover rounded-lg bg-muted" alt="" /> : <div className="w-10 h-14 bg-muted rounded-lg" />;
    case "Categoria": return item.category_id;
    case "Série ID": return item.series_id;
    case "Título": return <span className="font-bold">{item.title}</span>;
    case "Temporada": return item.season_num;
    case "Episódio": return item.episode_num;
    default: return "";
  }
}
