import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

const deleteComida = async (id: string) => {
    const token = localStorage.getItem('token');
    const cozinheiroId = localStorage.getItem('cozinheiroId');

    if (!token) {
        throw new Error('Token de autenticação não encontrado');
    }

    try {
        const response = await api.delete('/comidas', {        
            headers: {
                'Authorization': `Bearer ${token}`,  
                'Content-Type': 'application/json', 
            },
            data: { id, cozinheiroId }
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao deletar comida:', error);
        throw error;
    }
}


export function useDeleteDadosComida() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteComida,
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: ['dado-comida'] 
            });
        },
        onError: (error) => {
            console.error('Erro ao deletar comida:', error);
        }
    });

    return {
        ...mutation,
        deleteComida: mutation.mutateAsync
    }
}