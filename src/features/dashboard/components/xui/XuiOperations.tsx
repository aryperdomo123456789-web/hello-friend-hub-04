import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Play, Shield, ShieldCheck } from "lucide-react";

interface XuiOperationsProps {
  muscleCount: number;
}

export function XuiOperations({ muscleCount }: XuiOperationsProps) {
  return (
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
            Sua origem está sendo protegida por {muscleCount} músculo(s) ativo(s). O IP real não é exposto aos clientes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
