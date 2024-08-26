package com.example.cardapio.controller;

import com.example.cardapio.Usuario.RepositorioUsuario;
import com.example.cardapio.dtos.RespostaUsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
public class ControladorUsuario {

    @Autowired
    private RepositorioUsuario repositorioUsuario;

    @GetMapping
    public ResponseEntity<String> pegarUsuario(){
        return ResponseEntity.ok("Sucesso!");
    }
}
