import { DadoComida } from "../interface/DadoComida";
import { useQuery } from "@tanstack/react-query";
import api from "../api";

const fetchDados = async (): Promise<DadoComida[]> => {
    try {
        const response = await api.get('/comidas', {
            timeout: 10000 
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados de comida:', error);
        throw error;
    }
}

export function useDadosComida(){
    const query = useQuery({
        queryFn: fetchDados,
        queryKey: ['dado-comida'],
        retry: true,
        retryDelay: 1000, 
        staleTime: 5 * 60 * 1000, 
    })

    return {
        ...query,
        data: query.data
    }
}