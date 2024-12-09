package dev.reinaldosantos.car_fix.model;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "service_provider")
@Table(name = "service_provider")
@Getter
@Setter
@AllArgsConstructor
public class ServiceProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String pathToImageCnh;
    private String cnh;
    @OneToOne
    @JoinColumn(name = "person_id")
    private User person;
    
}
