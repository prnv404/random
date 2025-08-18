
'use client';

class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}


type FetcherOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
    token?: string | null;
};

type ApiResponse<T> = {
    success: boolean;
    requestId: string;
    error: string | null;
    data: T;
}

const getBaseUrl = () => {
    // Use a single environment variable for the base URL.
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
        throw new Error('API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your .env file.');
    }
    return baseUrl;
};

export const fetcher = async <T>(url: string, options: FetcherOptions = {}): Promise<T> => {
    const baseUrl = getBaseUrl();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers,
    };
    
    if (options.token) {
        headers['Authorization'] = `Bearer ${options.token}`;
    }

    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : null,
        });
        
        if (response.status === 204) {
            return null as T;
        }

        const responseData: ApiResponse<T> = await response.json();

        if (!response.ok || !responseData.success) {
            const errorMessage = responseData.error || `Request failed with status ${response.status}`;
            throw new ApiError(errorMessage, response.status);
        }

        return responseData.data;

    } catch (error) {
        console.error('API Fetcher Error:', error);
        if (error instanceof ApiError) {
            throw error; // Re-throw ApiError with status
        }
        if (error instanceof Error) {
            throw new ApiError(`API request failed: ${error.message}`, 0); // 0 for network or other client-side errors
        }
        throw new ApiError('An unknown error occurred during the API request.', 0);
    }
};

export { ApiError };
