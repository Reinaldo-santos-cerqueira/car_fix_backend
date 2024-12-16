package dev.reinaldosantos.car_fix.dto;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RelServiceUserDto {
    @NotNull(message="Price per km traveled is required")
    private Float priceKmTraveled;
    @NotNull(message="Price of service is required")
    private Float priceService;
    @NotNull(message = "Service is required")
    private UUID serviceId;
}
