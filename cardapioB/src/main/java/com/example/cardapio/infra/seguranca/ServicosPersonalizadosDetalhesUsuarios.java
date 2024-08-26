package com.example.cardapio.infra.seguranca;

import com.example.cardapio.Usuario.RepositorioUsuario;
import com.example.cardapio.Usuario.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class ServicosPersonalizadosDetalhesUsuarios implements UserDetailsService {

    @Autowired
    private RepositorioUsuario repositorioUsuario;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = this.repositorioUsuario.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("Usuario não encontrado"));
        return new org.springframework.security.core.userdetails.User(usuario.getEmail(), usuario.getSenha(),  new ArrayList<>());
    }
}
