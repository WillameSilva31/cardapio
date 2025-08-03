import { DadoUsuarioLogin } from "../interface/DadoUsuarioLogin";
import api from "../api";
import { useMutation } from "@tanstack/react-query";

const posDados = async (data: DadoUsuarioLogin): Promise<any> => {
    try {
        const response = await api.post('/autenticacao/login', data, {
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
}

export function useDadosUsuarioLoginMutate(){
    const mutateUsuario = useMutation({
        mutationFn: posDados,
        retry: 1, 
        retryDelay: 2000,
        onSuccess: (data) => {
            try {
                const { nome, token, id, eCozinheiro } = data;
                
                if (token) localStorage.setItem('token', token);
                if (id) localStorage.setItem('cozinheiroId', id.toString());
                console.log('Dados do usuário salvos com sucesso:', data);
                if (nome) localStorage.setItem('cozinheiroNome', nome);
                if (eCozinheiro !== undefined) localStorage.setItem('eCozinheiro', eCozinheiro.toString());
                
            } catch (error) {
                console.error('Erro ao salvar dados do usuário:', error);
            }
        },
        onError: (error) => {
            console.error('Login error:', error);
        }
    });
    
    return mutateUsuario;
}