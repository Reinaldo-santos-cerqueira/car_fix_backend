package dev.reinaldosantos.car_fix.model;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity(name = "address")
@Table(name = "address")
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String neighborhood;
    private String street;
    private String number;
    private String city;
    private String state;
    public Address(String neighborhood, String street, String number, String city, String state) {
        this.neighborhood = neighborhood;
        this.street = street;
        this.number = number;
        this.city = city;
        this.state = state;
    }

}