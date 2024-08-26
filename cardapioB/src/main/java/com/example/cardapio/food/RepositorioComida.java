package com.example.cardapio.food;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RepositorioComida extends JpaRepository<Comida, UUID> {
}
