package dev.reinaldosantos.car_fix.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import dev.reinaldosantos.car_fix.model.Address;

public interface AddressRepository extends JpaRepository<Address, UUID> {

}
