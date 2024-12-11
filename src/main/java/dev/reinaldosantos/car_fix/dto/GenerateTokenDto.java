package dev.reinaldosantos.car_fix.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenerateTokenDto {
    @NotNull(message = "Email is required")
    @Email(message = "Please enter valid email")
    private String email;
}
