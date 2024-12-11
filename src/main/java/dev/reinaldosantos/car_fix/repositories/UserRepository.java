package dev.reinaldosantos.car_fix.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import dev.reinaldosantos.car_fix.model.User;

public interface UserRepository  extends JpaRepository<User, UUID> {

    UserDetails findByEmail(String email);
    User findByIdentifier(String identifier);
}
