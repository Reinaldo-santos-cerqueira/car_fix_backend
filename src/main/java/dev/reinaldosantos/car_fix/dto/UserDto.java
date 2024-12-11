package dev.reinaldosantos.car_fix.dto;

import dev.reinaldosantos.car_fix.customAnnotations.CpfCnpjValidator;
import dev.reinaldosantos.car_fix.customAnnotations.EnumValidator;
import dev.reinaldosantos.car_fix.customAnnotations.PasswordValidator;
import dev.reinaldosantos.car_fix.enums.TypeUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    @NotNull(message = "Full Name is required")
    @Size(min = 10, max = 256,message = "The name must be between 10 and 256 characters long.")
    private String fullName;
    @NotNull(message = "Phone number is required")
    @Size(min = 11, max = 11,message = "Please enter valid phone number")
    private String phoneNumber;
    @NotNull(message = "Email is required")
    @Email(message = "Please enter valid email")
    private String email;
    @NotNull(message = "Identifier is required")
    @CpfCnpjValidator
    private String identifier;
    @PasswordValidator
    private String password;
    @EnumValidator(enumClass = TypeUser.class, message = "Please enter valid type user")
    private String type;
    @NotNull(message = "Please enter valid neighborhood")
    private String neighborhood;
    @NotNull(message = "Please enter valid  street")
    private String street;
    @NotNull(message = "Please enter valid  number")
    private String number;
    @NotNull(message = "Please enter valid  city")
    private String city;
    @NotNull(message = "Please enter valid  state")
    private String state;
    @NotNull(message = "Please enter valid cep")
    private String cep;
}
