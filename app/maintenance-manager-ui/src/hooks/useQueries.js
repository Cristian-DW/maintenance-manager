import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

/**
 * Hook to fetch maintenance requests with pagination
 */
export function useMaintenanceRequests(page = 0, pageSize = 10, filters = {}) {
    return useQuery({
        queryKey: ['maintenanceRequests', page, pageSize, filters],
        queryFn: async () => {
            const skip = page * pageSize;
            const params = new URLSearchParams({
                $top: pageSize.toString(),
                $skip: skip.toString(),
                $count: 'true',
                $expand: 'asset,requestedBy,assignedTo'
            });

            // Add filters
            if (filters.status) {
                params.append('$filter', `status eq '${filters.status}'`);
            }

            const res = await api.get(`/MaintenanceRequests?${params.toString()}`);

            return {
                data: res.data?.value || res.data || [],
                total: res.data?.['@odata.count'] || 0
            };
        },
        staleTime: 5000, // 5 seconds - faster updates for user stats
        keepPreviousData: true
    });
}

/**
 * Hook to create a maintenance request
 */
export function useCreateMaintenanceRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.post('/MaintenanceRequests', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['maintenanceRequests']);
        }
    });
}

/**
 * Hook to update a maintenance request
 */
export function useUpdateMaintenanceRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => api.patch(`/MaintenanceRequests(${id})`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['maintenanceRequests']);
        }
    });
}

/**
 * Hook to delete a maintenance request
 */
export function useDeleteMaintenanceRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/MaintenanceRequests(${id})`),
        onSuccess: () => {
            queryClient.invalidateQueries(['maintenanceRequests']);
        }
    });
}

/**
 * Hook to fetch assets with pagination
 */
export function useAssets(page = 0, pageSize = 10) {
    return useQuery({
        queryKey: ['assets', page, pageSize],
        queryFn: async () => {
            const skip = page * pageSize;
            const params = new URLSearchParams({
                $top: pageSize.toString(),
                $skip: skip.toString(),
                $count: 'true'
            });

            const res = await api.get(`/Assets?${params.toString()}`);

            return {
                data: res.data?.value || res.data || [],
                total: res.data?.['@odata.count'] || 0
            };
        },
        staleTime: 60000, // 1 minute
        keepPreviousData: true
    });
}

/**
 * Hook to fetch all assets (for dropdowns)
 */
export function useAllAssets() {
    return useQuery({
        queryKey: ['assets', 'all'],
        queryFn: async () => {
            const res = await api.get('/Assets');
            return res.data?.value || res.data || [];
        },
        staleTime: 300000 // 5 minutes
    });
}

/**
 * Hook to create an asset
 */
export function useCreateAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.post('/Assets', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['assets']);
        }
    });
}

/**
 * Hook to fetch users
 */
export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await api.get('/Users');
            return res.data?.value || res.data || [];
        },
        staleTime: 300000 // 5 minutes
    });
}

/**
 * Hook to fetch tech users
 */
export function useTechUsers() {
    return useQuery({
        queryKey: ['users', 'tech'],
        queryFn: async () => {
            const res = await api.get("/Users?$filter=role eq 'TECH'");
            return res.data?.value || res.data || [];
        },
        staleTime: 300000 // 5 minutes
    });
}

/**
 * Hook to fetch dashboard statistics
 */
export function useDashboardStats() {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const [requestsRes, assetsRes, usersRes] = await Promise.all([
                api.get('/MaintenanceRequests'),
                api.get('/Assets'),
                api.get('/Users')
            ]);

            const requests = requestsRes.data?.value || requestsRes.data || [];
            const assets = assetsRes.data?.value || assetsRes.data || [];
            const users = usersRes.data?.value || usersRes.data || [];

            return {
                requests,
                assets,
                users
            };
        },
        staleTime: 60000 // 1 minute
    });
}

/**
 * Hook to update an asset
 */
export function useUpdateAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => api.patch(`/Assets('${id}')`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['assets']);
        }
    });
}

/**
 * Hook to delete an asset
 */
export function useDeleteAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/Assets('${id}')`),
        onSuccess: () => {
            queryClient.invalidateQueries(['assets']);
        }
    });
}

/**
 * Hook to create a user
 */
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.post('/Users', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => api.patch(`/Users('${id}')`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/Users('${id}')`),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    });
}

// ==================== NOTIFICATIONS ====================

/**
 * Hook to fetch notifications for current user
 */
export function useNotifications() {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await api.get('/Notifications?$expand=relatedRequest&$orderby=createdAt desc');
            return res.data?.value || res.data || [];
        },
        refetchInterval: 30000, // Poll every 30 seconds
        staleTime: 10000 // 10 seconds
    });
}

/**
 * Hook to mark notification as read
 */
export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.patch(`/Notifications('${id}')`, {
            isRead: true,
            readAt: new Date().toISOString()
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        }
    });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await api.get('/Notifications?$filter=isRead eq false');
            const unread = res.data?.value || res.data || [];

            // Mark all unread as read
            await Promise.all(
                unread.map(notification =>
                    api.patch(`/Notifications('${notification.ID}')`, {
                        isRead: true,
                        readAt: new Date().toISOString()
                    })
                )
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        }
    });
}
