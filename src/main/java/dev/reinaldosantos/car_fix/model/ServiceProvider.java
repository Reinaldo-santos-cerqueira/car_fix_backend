package dev.reinaldosantos.car_fix.model;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "service_provider")
@Table(name = "service_provider")
@Getter
@Setter
@NoArgsConstructor
public class ServiceProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String pathToImageCnh;
    private String cnh;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    public ServiceProvider(String pathToImageCnh, String cnh, User user) {
        this.pathToImageCnh = pathToImageCnh;
        this.cnh = cnh;
        this.user = user;
    }
}
