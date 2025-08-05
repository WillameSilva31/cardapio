package com.example.cardapio.dtos;


import com.example.cardapio.food.Comida;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;


public record RespostaComidaDTO(UUID id, @NotBlank String nome, @NotNull String imagem, @NotNull Integer preco,@NotNull UUID cozinheiroId, @NotNull String cozinheiroNome) {
    public RespostaComidaDTO(Comida comida) {
        this(comida.getId(),comida.getNome(), comida.getImagem(), comida.getPreco(),comida.getCozinheiro().getId(),comida.getCozinheiroNome());
    }
}
