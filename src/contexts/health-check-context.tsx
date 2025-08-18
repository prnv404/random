
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkHealth } from '@/services/health';
import { ServerDownPage } from '@/components/server-down-page';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/lib/api';

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
        if (healthStatus && healthStatus.status === 'ok') {
          setIsServerHealthy(true);
        } else {
          setIsServerHealthy(false);
        }
      } catch (error) {
        console.error("Health check failed:", error);
        if (error instanceof ApiError && error.status === 502) {
          setIsServerHealthy(false);
        } else {
          // For any other error (network, other server errors), assume it's a transient client-side issue and let the app load.
          // The individual components can handle their own data fetching errors.
          setIsServerHealthy(true);
        }
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
