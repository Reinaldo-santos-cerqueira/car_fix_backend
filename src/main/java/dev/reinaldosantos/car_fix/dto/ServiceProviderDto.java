package dev.reinaldosantos.car_fix.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceProviderDto {   
    @NotNull(message = "Please enter valid  cnh")
    @Size(min = 11,max = 11,message = "Please enter valid ")
    private String cnh;
    @Valid
    private UserDto userDto;
    @NotNull(message = "The service list should be not null.")
    @NotEmpty(message = "The service list should be not empty.")
    @Valid
    private List<RelServiceUserDto> listServicesID;
}
