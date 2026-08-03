import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2, 
  Power, 
  MoreVertical,
  Calendar,
  Shield,
  Activity,
  RefreshCw
} from "lucide-react";
import { getXuiUsers, deleteXuiUser, toggleXuiUserStatus } from "@/lib/dashboard.functions";
import { XuiUser } from "../../types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function UsersTab() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["xui-users"],
    queryFn: () => getXuiUsers(),
    retry: 1
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteXuiUser({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["xui-users"] });
      toast.success("Usuário removido com sucesso");
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) => 
      toggleXuiUserStatus({ data: { id, enabled } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["xui-users"] });
      toast.success("Status atualizado");
    }
  });

  const filteredUsers = users.filter((u: XuiUser) => 
    u.username.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="space-y-6 outline-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por usuário..." 
              className="pl-9 bg-card/50 border-border/50 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl border-border/50 bg-card/50"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["xui-users"] })}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-10 px-6 rounded-xl font-bold shadow-lg shadow-primary/20">
          <UserPlus className="w-4 h-4" />
          Criar Usuário
        </Button>
      </div>

      <Card className="border-border/50 bg-card/50 overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-border/50 bg-accent/5 py-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-bold">Gerenciamento de Usuários XUI</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
                  <th className="px-6 py-4">Usuário / Senha</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Conexões</th>
                  <th className="px-6 py-4">Expiração</th>
                  <th className="px-6 py-4">Criado em</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                   <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      carregando usuários...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-destructive font-bold">
                      Erro ao carregar usuários: {(error as any).message || "Erro de conexão com o banco"}
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user: XuiUser) => (
                    <tr key={user.id} className="hover:bg-accent/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${user.admin_enabled ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                            {user.admin_enabled ? <Shield className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-foreground">{user.username}</div>
                            {user.password && (
                              <div className="text-[10px] text-muted-foreground font-mono">
                                Pass: {user.password}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] font-bold border-none px-2 py-0.5 ${
                            user.enabled 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {user.enabled ? 'Ativo' : 'Desativado'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-mono font-bold">
                            <span className={user.active_connections > 0 ? 'text-primary' : 'text-muted-foreground'}>
                              {user.active_connections}
                            </span>
                            <span className="text-muted-foreground mx-1">/</span>
                            <span>{user.max_connections}</span>
                          </div>
                          <Activity className={`w-3.5 h-3.5 ${user.active_connections > 0 ? 'text-primary animate-pulse' : 'text-muted-foreground/30'}`} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {user.exp_date ? new Date(user.exp_date * 1000).toLocaleDateString() : 'Sem expiração'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-muted-foreground">
                          {new Date(user.created_at * 1000).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-border/30 hover:bg-accent/50">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl border-border/50 bg-card/95 backdrop-blur-sm">
                            <DropdownMenuItem className="gap-2 text-xs font-bold rounded-lg cursor-pointer">
                              <Edit2 className="w-3.5 h-3.5" /> Editar Usuário
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2 text-xs font-bold rounded-lg cursor-pointer"
                              onClick={() => statusMutation.mutate({ id: user.id, enabled: !user.enabled })}
                            >
                              <Power className="w-3.5 h-3.5" /> {user.enabled ? 'Desativar' : 'Ativar'}
                            </DropdownMenuItem>
                            <div className="h-px bg-border/50 my-1" />
                            <DropdownMenuItem 
                              className="gap-2 text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg cursor-pointer"
                              onClick={() => {
                                if(confirm(`Deseja realmente apagar o usuário ${user.username}?`)) {
                                  deleteMutation.mutate(user.id);
                                }
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Apagar Usuário
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}