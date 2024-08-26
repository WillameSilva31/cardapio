import { AxiosPromise } from "axios"
import { useMutation,  useQueryClient } from "@tanstack/react-query";
import { DadoUsuario } from "../interface/DadoUsuario";
import api from "../api";


const posDados = async (data: DadoUsuario): AxiosPromise<any> => {
    const response = await api.post ('/autenticacao/registro', data);
    return response;
}

export function useDadosUsuarioMutate(){
    const queryClient = useQueryClient();
    const mutateUsuario = useMutation({
        mutationFn: posDados,
        retry: 2,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuario-registro'] });
        }
    })

    return mutateUsuario
}