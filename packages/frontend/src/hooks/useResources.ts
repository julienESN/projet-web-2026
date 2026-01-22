import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../contexts';
import { ResourceResponseSchema } from 'contracts';
import type { ResourceResponse, CreateResourceDto, UpdateResourceDto } from 'contracts';

const PaginatedResponseSchema = z.object({
  data: z.array(ResourceResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export function useResources() {
  const { token } = useAuth();
  const [resources, setResources] = useState<ResourceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetching with high limit to mimic "all resources" for the dashboard
      const response = await api.get('/resources?limit=100', {
        token,
        schema: PaginatedResponseSchema,
      });
      setResources(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors du chargement des ressources');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const createResource = async (data: CreateResourceDto) => {
    if (!token) return;
    try {
      await api.post('/resources', data, { token, schema: ResourceResponseSchema });
      await fetchResources();
    } catch (err) {
      throw err;
    }
  };

  const updateResource = async (id: string, data: UpdateResourceDto) => {
    if (!token) return;
    try {
      await api.put(`/resources/${id}`, data, { token, schema: ResourceResponseSchema });
      await fetchResources();
    } catch (err) {
      throw err;
    }
  };

  const deleteResource = async (id: string) => {
    if (!token) return;
    try {
      await api.delete(`/resources/${id}`, { token });
      await fetchResources();
    } catch (err) {
      throw err;
    }
  };

  return {
    resources,
    isLoading,
    error,
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
  };
}
