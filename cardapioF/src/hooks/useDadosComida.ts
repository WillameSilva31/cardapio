import { AxiosPromise } from "axios"
import { DadoComida } from "../interface/DadoComida";
import { useQuery } from "@tanstack/react-query";
import api from "../api";


const fetchDados = async (): AxiosPromise<DadoComida[]> => {
    const response = await api.get('/comidas')
    return response;
}

export function useDadosComida(){
    const query = useQuery({
        queryFn: fetchDados,
        queryKey: ['dado-comida'],
        retry: 2
    })

    return {
        ...query,
        data: query.data?.data
    }
}