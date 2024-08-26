import { AxiosPromise } from "axios";
import { DadoUsuarioLogin } from "../interface/DadoUsuarioLogin";
import api from "../api";
import { useMutation } from "@tanstack/react-query";


const posDados = async (data: DadoUsuarioLogin): AxiosPromise<any> => {
    const response = await api.post ('/autenticacao/login', data);
    return response;
}

export function useDadosUsuarioLoginMutate(){
    const mutateUsuario = useMutation({
        mutationFn: posDados,
        retry: 2,
        onSuccess: (data) => {
            const token = data.data.token;
            localStorage.setItem('token', token);

            const cozinheiroId = data.data.cozinheiroId
            localStorage.setItem('cozinheiroId',cozinheiroId)

            const eCozinheiro = data.data.eCozinheiro
            localStorage.setItem('eCozinheiro', eCozinheiro.toString());
        }
    })
    return mutateUsuario
}