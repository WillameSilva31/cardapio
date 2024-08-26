package com.example.cardapio.dtos;

import java.util.UUID;

public record RespostaUsuarioDTO(String nome, String token, UUID cozinheiroId, boolean eCozinheiro) {
}

