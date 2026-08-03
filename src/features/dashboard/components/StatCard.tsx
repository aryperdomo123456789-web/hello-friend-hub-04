import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <Card className={`col-span-1 border-border/50 bg-card/50 overflow-hidden ${className}`}>
      <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center space-y-1">
        <p className="text-[9px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider text-center line-clamp-1">{label}</p>
        <div className="text-sm sm:text-xl font-black tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}
