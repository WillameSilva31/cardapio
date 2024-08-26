package com.example.cardapio.Usuario;


import com.example.cardapio.dtos.RequisicaoUsuarioLoginDTO;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity(name = "usuarios")
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")

public class Usuario implements Serializable {
    private static final long serialVersionUUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String nome;
    private String email;
    private String senha;
    private Boolean eCozinheiro;
}
