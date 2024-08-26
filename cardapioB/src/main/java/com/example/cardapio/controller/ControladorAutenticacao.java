package com.example.cardapio.controller;

import com.example.cardapio.Usuario.RepositorioUsuario;
import com.example.cardapio.Usuario.Usuario;
import com.example.cardapio.dtos.RequisicaoUsuarioLoginDTO;
import com.example.cardapio.dtos.RequisicaoUsuarioRegistroDTO;
import com.example.cardapio.dtos.RespostaUsuarioDTO;
import com.example.cardapio.infra.seguranca.TokenServico;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Optional;

@RestController
@RequestMapping("/autenticacao")
@RequiredArgsConstructor
public class ControladorAutenticacao {
    private final RepositorioUsuario repositorioUsuario;

    private final PasswordEncoder codificadorSenha;

    private final TokenServico tokenServico;
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody RequisicaoUsuarioLoginDTO body){
        Usuario usuario = this.repositorioUsuario.findByEmail(body.email()).orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
        if (codificadorSenha.matches( body.senha(), usuario.getSenha())) {
            String token =this.tokenServico.gerarToken(usuario);
            return ResponseEntity.ok(new RespostaUsuarioDTO(usuario.getNome(),token,usuario.getId(),usuario.getECozinheiro()));
        }
        return  ResponseEntity.badRequest().build();
    }

    @PostMapping("/registro")
    public ResponseEntity register(@RequestBody RequisicaoUsuarioRegistroDTO body){
        Optional<Usuario> usuario = this.repositorioUsuario.findByEmail(body.email());

        if(usuario.isEmpty()) {
            Usuario novoUsuario = new Usuario();
            novoUsuario.setSenha(codificadorSenha.encode(body.senha()));
            novoUsuario.setEmail(body.email());
            novoUsuario.setNome((body.nome()));
            novoUsuario.setECozinheiro(body.e_cozinheiro());
            this.repositorioUsuario.save(novoUsuario);

            String token = this.tokenServico.gerarToken(novoUsuario);
            return ResponseEntity.ok(new RespostaUsuarioDTO(novoUsuario.getNome(), token, novoUsuario.getId(), novoUsuario.getECozinheiro()));
        }
        return ResponseEntity.badRequest().build();
    }
}
