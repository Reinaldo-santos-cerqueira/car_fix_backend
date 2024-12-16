package dev.reinaldosantos.car_fix.model;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "rel_user_service")
@Table(name = "rel_user_service")
@Getter
@Setter
@NoArgsConstructor
public class RelServiceUser {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private Float priceService;
    private Float priceKmTraveled;

    public RelServiceUser(Service service,User user,Float priceService, Float priceKmTraveled){
        this.user=user;
        this.service=service;
        this.priceService = priceService;
        this.priceKmTraveled = priceKmTraveled;
    }
}