import { Badge } from "@/components/ui/badge";
import { UserLine } from "../../types";

interface SubscriberParkTableProps {
  subscribers: any[];
}

export function SubscriberParkTable({ subscribers }: SubscriberParkTableProps) {
  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <table className="w-full text-left border-collapse min-w-[1000px] md:min-w-full">
        <thead>
          <tr className="bg-muted/10 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border/50">
            <th className="px-4 py-3">USUÁRIO</th>
            <th className="px-4 py-3">PLANO</th>
            <th className="px-4 py-3">EM USO</th>
            <th className="px-4 py-3">LIVRES</th>
            <th className="px-4 py-3">DIRECT</th>
            <th className="px-4 py-3">IP FINAL</th>
            <th className="px-4 py-3">SAÍDA</th>
            <th className="px-4 py-3">STATUS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {subscribers.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-xs text-muted-foreground">
                carregando parque de assinantes...
              </td>
            </tr>
          ) : (
            subscribers.map((sub, idx) => (
              <tr key={idx} className="hover:bg-accent/10 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-bold text-sm">{sub.username}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs font-medium">{sub.plan || '1000'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs font-bold">{sub.inUse || '0'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs font-medium">{sub.free || '994'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs font-medium">{sub.direct || '0'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-[11px] font-mono text-muted-foreground">{sub.lastIp || '200.165.218.103'}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="text-[10px] bg-card border-border/50 font-bold px-2 h-5">
                    {sub.exit || 'LB-01'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className={`text-[10px] font-bold uppercase ${sub.status === 'streaming' ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {sub.status || 'idle'}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
