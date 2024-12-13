package dev.reinaldosantos.car_fix.dto;

import dev.reinaldosantos.car_fix.customAnnotations.PasswordValidator;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeDto {
    @NotNull(message = "Email is required")
    @Email(message = "Please enter valid email")
    private String email;
    @NotNull(message = "Please enter token")
    private String tokenPasswordChange;
    @PasswordValidator
    private String password;

}
