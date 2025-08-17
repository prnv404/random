
'use client';

import { fetcher } from '@/lib/api';
import type { User } from '@/lib/types';

export const listUsers = (token: string | null): Promise<User[]> => {
    return fetcher<User[]>(`/users`, { token });
};


export const getCurrentOrg = (token: string | null): Promise<{id: string, name: string} | null> => {
     return fetcher<{id: string, name: string} | null>(`/organizations/current`, { token });
}
