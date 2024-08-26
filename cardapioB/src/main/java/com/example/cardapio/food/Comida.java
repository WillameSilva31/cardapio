package com.example.cardapio.food;

import com.example.cardapio.Usuario.Usuario;
import com.example.cardapio.dtos.RequisicaoComidaDTO;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity(name = "comidas")
@Table(name = "comidas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Comida implements Serializable {
    private static final long serialVersionUUID = 1L;

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String nome;
    private String imagem;
    private Integer preco;

    @ManyToOne
    @JoinColumn(name = "cozinheiro_id")
    private Usuario cozinheiro;

    public Comida(String nome, String imagem, Integer preco, Usuario cozinheiro) {
        this.nome = nome;
        this.imagem = imagem;
        this.preco = preco;
        this.cozinheiro = cozinheiro;
    }
}
