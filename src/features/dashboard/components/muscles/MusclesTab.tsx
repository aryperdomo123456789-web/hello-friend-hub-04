import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Status dos Músculos (Load Balancers)
              </CardTitle>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {muscles.length} Ativos
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <MuscleList muscles={muscles} />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg font-bold">Instalação Rápida</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Transforme qualquer VPS Linux (Ubuntu/Debian) em um Músculo de entrega em menos de 2 minutos.
            </p>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Comando de Instalação</label>
              <div className="bg-zinc-950 rounded-xl p-4 font-mono text-[11px] text-zinc-300 border border-zinc-800 relative group overflow-hidden">
                <code className="break-all">curl -sSL https://voods.app/install-lb | bash</code>
                <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/50">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full gap-2 font-bold shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" />
                  Registrar Músculo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Instalar Novo Músculo</DialogTitle>
                  <DialogDescription>Execute como root na sua nova VPS antes de registrar aqui.</DialogDescription>
                </DialogHeader>
                <div className="bg-zinc-950 rounded-lg p-4 font-mono text-xs text-zinc-300 border border-zinc-800 my-4">
                  <code>curl -sSL https://voods.app/install-lb | bash</code>
                </div>
                <DialogFooter>
                  <Button className="w-full">Concluir Registro</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
