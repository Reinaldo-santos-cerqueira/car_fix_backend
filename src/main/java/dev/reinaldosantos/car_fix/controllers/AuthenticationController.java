package dev.reinaldosantos.car_fix.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.reinaldosantos.car_fix.dto.GenerateTokenDto;
import dev.reinaldosantos.car_fix.dto.LoginDto;
import dev.reinaldosantos.car_fix.dto.PasswordChangeDto;
import dev.reinaldosantos.car_fix.dto.ServiceProviderDto;
import dev.reinaldosantos.car_fix.dto.UserDto;
import dev.reinaldosantos.car_fix.record.CreateServiceProviderResponseDto;
import dev.reinaldosantos.car_fix.record.CreateUserResponseDto;
import dev.reinaldosantos.car_fix.record.LoginResponseDto;
import dev.reinaldosantos.car_fix.record.MessageResponse;
import dev.reinaldosantos.car_fix.services.AuthorizationService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    @Autowired
    private AuthorizationService authorizationService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginDto data) {
        LoginResponseDto response = authorizationService.login(data, authenticationManager);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup/client")
    public ResponseEntity<CreateUserResponseDto> signUpClient(@Valid @RequestBody UserDto data) {
        UserDto returnUserCreate = authorizationService.createUserClient(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(new CreateUserResponseDto(returnUserCreate));
    }

    @PostMapping("/signup/serivce_provider")
    public ResponseEntity<CreateServiceProviderResponseDto> signUpSerivceProvider(
            @Valid @RequestBody ServiceProviderDto data) {
        ServiceProviderDto returnUserServiceProvider = authorizationService.createUserServiceProvider(data);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CreateServiceProviderResponseDto(returnUserServiceProvider));
    }

    @PostMapping("/generate_token")
    public ResponseEntity<Map<String, String>> genearateToken(@Valid @RequestBody GenerateTokenDto data) {
        Map<String, String> tokenReturn = authorizationService.generateToken(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(tokenReturn);
    }

    @PatchMapping("/change_password")
    public ResponseEntity<MessageResponse> passwordChange(@Valid @RequestBody PasswordChangeDto data) {
        MessageResponse tokenReturn = authorizationService.changePassword(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(tokenReturn);
    }
}
