import { AxiosError } from "axios";
import { DadoComida } from "../interface/DadoComida";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";

const posDados = async (data: DadoComida): Promise<any> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('Token de autenticação não encontrado');
    }

    try {
        const response = await api.post('/comidas', data, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json', 
            },
            timeout: 15000 
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.message || error.message;
            console.error('Erro ao salvar comida:', errorMessage);
            throw new Error(`Erro ao salvar comida: ${errorMessage}`);
        }
        throw error; 
    }
};   

export function useDadosComidaMutate() {
    const queryClient = useQueryClient();
    
    const mutate = useMutation({
        mutationFn: posDados,
        retry: 2,
        retryDelay: 1000,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dado-comida'] });
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });

    return mutate;
}