package dev.reinaldosantos.car_fix.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceDto {
    @NotNull(message = "Please enter valid description")
    private String description;

    @NotNull(message = "Please enter valid title")
    private String title;
}
