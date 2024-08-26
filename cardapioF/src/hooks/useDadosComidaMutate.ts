
import { AxiosError } from "axios";
import { DadoComida } from "../interface/DadoComida";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";


const posDados = async (data: DadoComida): Promise<any> => {
    const token = localStorage.getItem('token');
    try {
        const response = await api.post('/comidas', data, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json', 
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            alert(`Erro ao salvar comida:${error.message}`);
        }
        throw error; 
    }
};   

export function useDadosComidaMutate() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: posDados,
        retry: 2,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dado-comida'] });
        }
    });

    return mutate;
}