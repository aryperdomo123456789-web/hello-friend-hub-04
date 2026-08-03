import { useSuspenseQuery } from "@tanstack/react-query";
import { 
  getDashboardStats, 
  getSources, 
  getMuscles, 
  getLiveConnections, 
  getHostHealth,
  getProtectedDomains
} from "@/lib/dashboard.functions";

export function useDashboardData() {
  const statsQuery = useSuspenseQuery({ 
    queryKey: ["dashboard-stats"], 
    queryFn: () => getDashboardStats() 
  });
  
  const sourcesQuery = useSuspenseQuery({ 
    queryKey: ["sources"], 
    queryFn: () => getSources() 
  });
  
  const musclesQuery = useSuspenseQuery({ 
    queryKey: ["muscles"], 
    queryFn: () => getMuscles() 
  });
  
  const liveQuery = useSuspenseQuery({ 
    queryKey: ["live"], 
    queryFn: () => getLiveConnections() 
  });
  
  const healthQuery = useSuspenseQuery({ 
    queryKey: ["health"], 
    queryFn: () => getHostHealth() 
  });

  const domainsQuery = useSuspenseQuery({
    queryKey: ["protected-domains"],
    queryFn: () => getProtectedDomains(),
  });

  return {
    stats: statsQuery.data,
    sources: sourcesQuery.data,
    muscles: musclesQuery.data,
    liveConnections: liveQuery.data,
    health: healthQuery.data,
    domains: domainsQuery.data,
    refetchAll: () => {
      statsQuery.refetch();
      sourcesQuery.refetch();
      musclesQuery.refetch();
      liveQuery.refetch();
      healthQuery.refetch();
      domainsQuery.refetch();
    }
  };
}