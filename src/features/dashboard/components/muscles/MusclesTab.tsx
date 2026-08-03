import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Server, Plus, Copy } from "lucide-react";
import { MuscleList } from "./MuscleList";
import { Muscle } from "../../types";

interface MusclesTabProps {
  muscles: Muscle[];
}

export function MusclesTab({ muscles }: MusclesTabProps) {
  return (
    <div className="space-y-8 mt-0 outline-none">
      <div className="space-y-6">
        {/* Painel simples do LB */}
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-bold">Painel simples do LB</CardTitle>
            <p className="text-xs text-muted-foreground">Fluxo que importa aqui: cadastrar o LB, instalar, acompanhar a saúde e escolher se o tráfego fica no main ou vai para o LB.</p>
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
                <span className="text-2xl font-bold">16</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Usuários XUI</span>
                <span className="text-2xl font-bold">16</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 1. Cadastrar LB */}
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-bold text-blue-500">1. Cadastrar LB</CardTitle>
            <p className="text-xs text-muted-foreground">Preencha só o necessário para instalar.</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Nome</label>
                <Input placeholder="LB-01" className="bg-background/50 h-9 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">IP do LB</label>
                <Input placeholder="143.14.168.78" className="bg-background/50 h-9 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Porta SSH</label>
                <Input placeholder="22" className="bg-background/50 h-9 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Usuário root</label>
                <Input placeholder="root" className="bg-background/50 h-9 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Senha root</label>
                <Input type="password" placeholder="********" className="bg-background/50 h-9 text-xs" />
              </div>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="ativo" className="w-4 h-4 rounded border-border" defaultChecked />
                <label htmlFor="ativo" className="text-xs font-bold text-muted-foreground">ativo</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="auto-install" className="w-4 h-4 rounded border-border" defaultChecked />
                <label htmlFor="auto-install" className="text-xs font-bold text-muted-foreground">instalar automaticamente ao salvar</label>
              </div>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold h-9 px-6 rounded-lg text-xs">
              Salvar LB
            </Button>
          </CardContent>
        </Card>

        {/* 2. LBs cadastrados */}
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-bold">2. LBs cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MuscleList muscles={muscles} />
          </CardContent>
        </Card>

        {/* 4. Mandar usuários para o LB */}
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-bold">4. Mandar usuários para o LB</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Escopo</label>
                <select className="w-full bg-background/50 border border-border/50 rounded-lg h-10 px-3 text-xs">
                  <option>Somente os usuários digitados</option>
                  <option>Todos os usuários</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Usuário(s)</label>
                <textarea 
                  className="w-full bg-background/50 border border-border/50 rounded-lg p-3 text-xs h-32"
                  placeholder="digite um usuário por linha ou separados por vírgula"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Ação</label>
                <select className="w-full bg-background/50 border border-border/50 rounded-lg h-10 px-3 text-xs">
                  <option>Mandar para este LB</option>
                  <option>Voltar para o Main</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">LB de destino</label>
                <select className="w-full bg-background/50 border border-border/50 rounded-lg h-10 px-3 text-xs">
                  <option>—</option>
                  {muscles.map(m => <option key={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold h-9 px-8 rounded-lg text-xs">
              Aplicar
            </Button>
            
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-[10px] font-bold text-muted-foreground uppercase">
                    <th className="px-4 py-3">USUÁRIO</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3">LB</th>
                    <th className="px-4 py-3">ATUALIZADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {[
                    "P2on2325154215633", "33366", "351916620784", "4Jknjjujtsuper",
                    "556196805325", "Magoopdokjm32000", "QgNS3UPeUh", "THunder2355625"
                  ].map(user => (
                    <tr key={user} className="hover:bg-accent/5">
                      <td className="px-4 py-3 text-xs font-bold">{user}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-green-500/20 text-green-500 border-none text-[9px] h-5">lb</Badge>
                      </td>
                      <td className="px-4 py-3 text-[10px] font-mono">LB-01 143.14.168.78</td>
                      <td className="px-4 py-3 text-[10px] text-muted-foreground">2026-07-31T13:04:52-03:00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
