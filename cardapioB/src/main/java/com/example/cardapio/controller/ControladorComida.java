package com.example.cardapio.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cardapio.Usuario.RepositorioUsuario;
import com.example.cardapio.Usuario.Usuario;
import com.example.cardapio.dtos.RequisicaoComidaDTO;
import com.example.cardapio.dtos.RespostaComidaDTO;
import com.example.cardapio.food.Comida;
import com.example.cardapio.food.RepositorioComida;

import lombok.Getter;

@RestController
@RequestMapping("/comidas")
@Getter
public class  ControladorComida {

    private static final Logger logger = LoggerFactory.getLogger(ControladorComida.class);

    @Autowired
    private RepositorioComida repositorioComida;

    @Autowired
    private RepositorioUsuario repositorioUsuario;

    public static ResponseEntity<String> eCozinheiro (Usuario usuario ){
        if (usuario.getECozinheiro()) {}
        logger.warn("Usuário não é um cozinheiro.");
        return new ResponseEntity<>("Apenas cozinheiros podem adicionar pratos.", HttpStatus.FORBIDDEN);
    }

    public static ResponseEntity<String> cozinheiroFezComida (RequisicaoComidaDTO data,Usuario usuario ){
        if (data.cozinheiroId().equals(usuario.getId())) {}
        logger.warn("ID do cozinheiro na requisição não corresponde ao ID do usuário autenticado.");
        return new ResponseEntity<>("Usuário não autorizado a adicionar este prato.", HttpStatus.FORBIDDEN);
    }

    @PostMapping
    public ResponseEntity<String> salvarComida(@RequestBody RequisicaoComidaDTO data, @AuthenticationPrincipal Usuario usuario) {
        eCozinheiro(usuario);

        cozinheiroFezComida(data, usuario);

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

    @DeleteMapping
    public ResponseEntity<String> deletarComida (@RequestBody RequisicaoComidaDTO data, @AuthenticationPrincipal Usuario usuario){

        eCozinheiro(usuario);

        cozinheiroFezComida(data, usuario);

        repositorioComida.deleteById(data.id());
        return new ResponseEntity<>("Comida deletada com sucesso.", HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<String> alterarComida(@RequestBody RequisicaoComidaDTO data, @AuthenticationPrincipal Usuario usuario) {

        eCozinheiro(usuario);

        cozinheiroFezComida(data, usuario);

        Comida comida = repositorioComida.findById(data.id()).get();
        if (!data.nome().isEmpty()) comida.setNome(data.nome());
        if (!data.imagem().isEmpty()) comida.setImagem(data.imagem());
        if (data.preco() != null)  comida.setPreco(data.preco());

        repositorioComida.save(comida);

        return new ResponseEntity<>("comida alterada com sucesso", HttpStatus.CREATED);
    }

    @GetMapping
    public List<RespostaComidaDTO> pegarTodos(){
        List<RespostaComidaDTO> listaComida = repositorioComida.findAll().stream().map(RespostaComidaDTO::new).toList();
        return listaComida;
    }
}
