package com.example.cardapio.controller;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.cardapio.Usuario.RepositorioUsuario;
import com.example.cardapio.Usuario.Usuario;
import com.example.cardapio.dtos.RequisicaoComidaDTO;
import com.example.cardapio.dtos.RespostaComidaDTO;
import com.example.cardapio.food.Comida;
import com.example.cardapio.food.RepositorioComida;

@RestController
@RequestMapping("/comidas")
public class ControladorComida {

    private static final Logger logger = LoggerFactory.getLogger(ControladorComida.class);

    @Autowired
    private RepositorioComida repositorioComida;

    @Autowired
    private RepositorioUsuario repositorioUsuario;

    @PostMapping
    public ResponseEntity<String> salvarComida(@RequestBody RequisicaoComidaDTO data,
                                               @AuthenticationPrincipal Usuario usuario) {
        if (!usuario.getECozinheiro()) {
            logger.warn("Usuário não é um cozinheiro.");
            return new ResponseEntity<>("Apenas cozinheiros podem adicionar pratos.", HttpStatus.FORBIDDEN);
        }

        if (!data.cozinheiroId().equals(usuario.getId())) {
            logger.warn("ID do cozinheiro na requisição não corresponde ao ID do usuário autenticado.");
            return new ResponseEntity<>("Usuário não autorizado a adicionar este prato.", HttpStatus.FORBIDDEN);
        }

        Usuario cozinheiro = repositorioUsuario.findById(data.cozinheiroId())
                .orElseThrow(() -> new RuntimeException("Cozinheiro não encontrado"));

        Comida dadoComida = new Comida();
        dadoComida.setNome(data.nome());
        dadoComida.setImagem(data.imagem());
        dadoComida.setPreco(data.preco());
        dadoComida.setCozinheiro(cozinheiro);
        dadoComida.setCozinheiroNome(cozinheiro.getNome());

        repositorioComida.save(dadoComida);
        return new ResponseEntity<>("Comida adicionada com sucesso.", HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<String> deletarComida(@RequestBody RequisicaoComidaDTO data,
                                                @AuthenticationPrincipal Usuario usuario) {

        logger.info("Tentando deletar comida. ID: {}, Usuario: {}", data.id(), usuario.getEmail());

        if (!usuario.getECozinheiro()) {
            logger.warn("Usuário não é um cozinheiro.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas cozinheiros podem deletar pratos.");
        }

        if (!data.cozinheiroId().equals(usuario.getId())) {
            logger.warn("ID do cozinheiro na requisição não corresponde ao ID do usuário autenticado.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Usuário não autorizado a deletar este prato.");
        }

        Comida comida = repositorioComida.findById(data.id())
                .orElseThrow(() -> new RuntimeException("Comida não encontrada"));

        if (!comida.getCozinheiro().getId().equals(usuario.getId())) {
            logger.warn("Comida não pertence ao cozinheiro autenticado.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Você só pode deletar seus próprios pratos.");
        }

        repositorioComida.deleteById(data.id());
        logger.info("Comida deletada com sucesso. ID: {}", data.id());

        return ResponseEntity.ok("Comida deletada com sucesso.");
    }

    @PutMapping
    public ResponseEntity<String> alterarComida(@RequestBody RequisicaoComidaDTO data,
                                                @AuthenticationPrincipal Usuario usuario) {

        if (!usuario.getECozinheiro()) {
            logger.warn("Usuário não é um cozinheiro.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Apenas cozinheiros podem alterar pratos.");
        }

        if (!data.cozinheiroId().equals(usuario.getId())) {
            logger.warn("ID do cozinheiro na requisição não corresponde ao ID do usuário autenticado.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Usuário não autorizado a alterar este prato.");
        }

        Comida comida = repositorioComida.findById(data.id())
                .orElseThrow(() -> new RuntimeException("Comida não encontrada"));

        // Verificar se a comida pertence ao cozinheiro
        if (!comida.getCozinheiro().getId().equals(usuario.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Você só pode alterar seus próprios pratos.");
        }

        if (data.nome() != null && !data.nome().isEmpty()) {
            comida.setNome(data.nome());
        }
        if (data.imagem() != null && !data.imagem().isEmpty()) {
            comida.setImagem(data.imagem());
        }
        if (data.preco() != null) {
            comida.setPreco(data.preco());
        }

        repositorioComida.save(comida);
        return ResponseEntity.ok("Comida alterada com sucesso.");
    }

    @GetMapping
    public List<RespostaComidaDTO> pegarTodos() {
        return repositorioComida.findAll().stream()
                .map(RespostaComidaDTO::new)
                .toList();
    }
}