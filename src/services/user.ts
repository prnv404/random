
'use client';

import { fetcher } from '@/lib/api';
import type { User } from '@/lib/types';

export const listUsers = (token: string | null): Promise<User[]> => {
    return fetcher<User[]>(`/users`, { token });
};


export const getCurrentOrg = (token: string | null): Promise<{id: string, name: string} | null> => {
     return fetcher<{id: string, name: string} | null>(`/organizations/current`, { token });
}

export const getUserProfile = (token: string | null): Promise<User> => {
    return fetcher<User>('/users/profile', { token });
};

type UpdateUserProfilePayload = {
    name?: string;
    phone?: string;
};

export const updateUserProfile = (userId: string, data: UpdateUserProfilePayload, token: string | null): Promise<User> => {
    return fetcher(`/users/${userId}`, {
        method: 'PATCH',
        body: data,
        token
    });
};
