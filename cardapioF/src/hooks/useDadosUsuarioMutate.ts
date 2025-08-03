import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DadoUsuario } from "../interface/DadoUsuario";
import api from "../api";

const posDados = async (data: DadoUsuario): Promise<any> => {
    try {
        const response = await api.post('/autenticacao/registro', data, {
            timeout: 15000
        });
        return response.data;
    } catch (error) {
        console.error('Erro no registro:', error);
        throw error;
    }
}

export function useDadosUsuarioMutate(){
    const queryClient = useQueryClient();
    
    const mutateUsuario = useMutation({
        mutationFn: posDados,
        retry: 2,
        retryDelay: 1000,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuario-registro'] });
        },
        onError: (error) => {
            console.error('Registration error:', error);
        }
    });

    return mutateUsuario;
}