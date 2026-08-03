import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <Card className={`col-span-1 border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all duration-300 ${className}`}>
      <CardContent className="p-2 sm:p-3 flex flex-col items-start justify-center">
        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider group-hover:text-primary transition-colors">{label}</p>
        <div className="text-lg sm:text-xl font-black tabular-nums tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}
