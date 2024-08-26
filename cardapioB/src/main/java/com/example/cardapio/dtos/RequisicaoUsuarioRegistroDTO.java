package com.example.cardapio.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RequisicaoUsuarioRegistroDTO(@NotBlank String nome, @NotNull String email,@NotNull String senha, Boolean e_cozinheiro) {
}
