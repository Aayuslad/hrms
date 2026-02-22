import { axiosClient } from '@/lib/axios-client';
import { queryClient } from '@/lib/query-client';
import type { components } from '@/types/generated/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export type Post = components['schemas']['PostResponse'];
export type CreatePostRequest = components['schemas']['CreatePostRequest'];
export type UpdatePostRequest = components['schemas']['UpdatePostRequest'];
export type CreateCommentRequest =
    components['schemas']['CreateCommentRequest'];
export type UpdateCommentRequest =
    components['schemas']['UpdateCommentRequest'];

const postsQuery = {
    queryKey: ['posts'] as const,
    queryFn: async (): Promise<Post[]> => {
        const { data } = await axiosClient.get<{ data?: Post[] }>(
            '/engagement/posts'
        );
        return data.data || [];
    },
};

export function useGetPosts() {
    return useQuery<Post[], AxiosError>(postsQuery);
}

export const postsLoader = async () => {
    return await queryClient.ensureQueryData(postsQuery);
};

export function useGetPost(id: string) {
    return useQuery<Post, AxiosError>({
        queryKey: ['posts', id],
        queryFn: async (): Promise<Post> => {
            const { data } = await axiosClient.get<{ data?: Post }>(
                `/engagement/posts/${id}`
            );
            return data.data!;
        },
        enabled: !!id,
    });
}

export function useCreatePost() {
    return useMutation({
        mutationFn: async (payload: CreatePostRequest): Promise<void> => {
            await axiosClient.post('/engagement/posts', payload);
        },
        onSuccess: () => {
            toast.success('Post created');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to create post'
            );
            console.error('Failed to create post', error);
        },
    });
}

export function useUpdatePost() {
    return useMutation({
        mutationFn: async (payload: UpdatePostRequest): Promise<void> => {
            await axiosClient.put(`/engagement/posts/${payload.id}`, payload);
        },
        onSuccess: () => {
            toast.success('Post updated');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to update post'
            );
            console.error('Failed to update post', error);
        },
    });
}

export function useDeletePost() {
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosClient.delete(`/engagement/posts/${id}`);
        },
        onSuccess: () => {
            toast.success('Post deleted');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to delete post'
            );
            console.error('Failed to delete post', error);
        },
    });
}

export function useLikePost() {
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosClient.patch(`/engagement/posts/${id}/like`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to like post'
            );
            console.error('Failed to like post', error);
        },
    });
}

export function useUnlikePost() {
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosClient.patch(`/engagement/posts/${id}/unlike`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to unlike post'
            );
            console.error('Failed to unlike post', error);
        },
    });
}

export function useCreateComment() {
    return useMutation({
        mutationFn: async ({
            postId,
            payload,
        }: {
            postId: string;
            payload: CreateCommentRequest;
        }): Promise<void> => {
            await axiosClient.post(
                `/engagement/posts/${postId}/comment`,
                payload
            );
        },
        onSuccess: (_, variables) => {
            toast.success('Comment created');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({
                queryKey: ['post', variables.postId],
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to create comment'
            );
            console.error('Failed to create comment', error);
        },
    });
}

export function useUpdateComment() {
    return useMutation({
        mutationFn: async ({
            postId,
            commentId,
            payload,
        }: {
            postId: string;
            commentId: string;
            payload: UpdateCommentRequest;
        }): Promise<void> => {
            await axiosClient.put(
                `/engagement/posts/${postId}/comment/${commentId}`,
                payload
            );
        },
        onSuccess: (_, variables) => {
            toast.success('Comment updated');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({
                queryKey: ['post', variables.postId],
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to update comment'
            );
            console.error('Failed to update comment', error);
        },
    });
}

export function useDeleteComment() {
    return useMutation({
        mutationFn: async ({
            postId,
            commentId,
        }: {
            postId: string;
            commentId: string;
        }): Promise<void> => {
            await axiosClient.delete(
                `/engagement/posts/${postId}/comment/${commentId}`
            );
        },
        onSuccess: (_, variables) => {
            toast.success('Comment deleted');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({
                queryKey: ['post', variables.postId],
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to delete comment'
            );
            console.error('Failed to delete comment', error);
        },
    });
}

export function useLikeComment() {
    return useMutation({
        mutationFn: async ({
            postId,
            commentId,
        }: {
            postId: string;
            commentId: string;
        }): Promise<void> => {
            await axiosClient.patch(
                `/engagement/posts/${postId}/comment/${commentId}/like`
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['post', variables.postId],
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to like comment'
            );
            console.error('Failed to like comment', error);
        },
    });
}

export function useUnlikeComment() {
    return useMutation({
        mutationFn: async ({
            postId,
            commentId,
        }: {
            postId: string;
            commentId: string;
        }): Promise<void> => {
            await axiosClient.patch(
                `/engagement/posts/${postId}/comment/${commentId}/unlike`
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['post', variables.postId],
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Failed to unlike comment'
            );
            console.error('Failed to unlike comment', error);
        },
    });
}
