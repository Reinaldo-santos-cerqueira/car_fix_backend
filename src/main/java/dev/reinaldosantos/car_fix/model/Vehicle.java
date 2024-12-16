package dev.reinaldosantos.car_fix.model;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity(name = "vehicle")
@Table(name = "vehicle")
@NoArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String model;
    private String mark;
    private String plate;
    private String color;
    private String pathToDocument;
    
    public Vehicle(String model, String mark, String plate, String color, String pathToDocument) {
        this.model = model;
        this.mark = mark;
        this.plate = plate;
        this.color = color;
        this.pathToDocument = pathToDocument;
    }
}
