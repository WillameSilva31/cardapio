package com.example.cardapio.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;


public record RequisicaoComidaDTO( UUID id, @NotBlank String nome, @NotNull String imagem, @NotNull Integer preco, @NotNull UUID cozinheiroId) {
}
