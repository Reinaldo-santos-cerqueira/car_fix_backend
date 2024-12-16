package dev.reinaldosantos.car_fix.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import dev.reinaldosantos.car_fix.model.RelServiceUser;

public interface RelServiceUserRepository extends JpaRepository<RelServiceUser, UUID> {

}
