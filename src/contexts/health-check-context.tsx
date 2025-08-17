
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkHealth } from '@/services/health';
import { ServerDownPage } from '@/components/server-down-page';
import { Skeleton } from '@/components/ui/skeleton';

interface HealthContextType {
  isServerHealthy: boolean;
  isLoading: boolean;
}

const HealthContext = createContext<HealthContextType>({
  isServerHealthy: false,
  isLoading: true,
});

export const HealthCheckProvider = ({ children }: { children: ReactNode }) => {
  const [isServerHealthy, setIsServerHealthy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const performHealthCheck = async () => {
      try {
        const healthStatus = await checkHealth();
        // Check for a specific property that indicates success, e.g., healthStatus.status === 'ok'
        if (healthStatus && healthStatus.status === 'ok') {
          setIsServerHealthy(true);
        } else {
          setIsServerHealthy(false);
        }
      } catch (error) {
        console.error("Health check failed:", error);
        setIsServerHealthy(false);
      } finally {
        setIsLoading(false);
      }
    };

    performHealthCheck();
  }, []);

  if (isLoading) {
    return (
        <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-10">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4 xl:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
        </main>
    )
  }

  if (!isServerHealthy) {
    return <ServerDownPage />;
  }

  return (
    <HealthContext.Provider value={{ isServerHealthy, isLoading }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealthCheck = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealthCheck must be used within a HealthCheckProvider');
  }
  return context;
};
