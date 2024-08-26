package com.example.cardapio.dtos;

import jakarta.validation.constraints.NotNull;

public record RequisicaoUsuarioLoginDTO( @NotNull String senha,@NotNull String email) {
}
