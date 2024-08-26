package com.example.cardapio.controller;

import com.example.cardapio.Usuario.RepositorioUsuario;
import com.example.cardapio.Usuario.Usuario;
import com.example.cardapio.dtos.RequisicaoComidaDTO;
import com.example.cardapio.dtos.RespostaComidaDTO;
import com.example.cardapio.food.Comida;
import com.example.cardapio.food.RepositorioComida;
import lombok.Getter;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/comidas")
@Getter
public class  ControladorComida {

    private static final Logger logger = LoggerFactory.getLogger(ControladorComida.class);

    @Autowired
    private RepositorioComida repositorioComida;

    @Autowired
    private RepositorioUsuario repositorioUsuario;

    @PostMapping
    public ResponseEntity<String> salvarComida(@RequestBody RequisicaoComidaDTO data, @AuthenticationPrincipal Usuario usuario) {
        // Log para verificar o ID do usuário autenticado
        logger.info("ID do usuário autenticado: {}", usuario.getId());

        // Log para verificar o ID do cozinheiro enviado na requisição
        logger.info("ID do cozinheiro recebido na requisição: {}", data.cozinheiroId());

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

        repositorioComida.save(dadoComida);
        return new ResponseEntity<>("Comida adicionada com sucesso.", HttpStatus.CREATED);
    }

    @GetMapping
    public List<RespostaComidaDTO> pegarTodos(){
        List<RespostaComidaDTO> listaComida = repositorioComida.findAll().stream().map(RespostaComidaDTO::new).toList();
        return listaComida;
    }
}
