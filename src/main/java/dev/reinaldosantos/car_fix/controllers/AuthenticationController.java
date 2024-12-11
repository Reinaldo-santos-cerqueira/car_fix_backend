package dev.reinaldosantos.car_fix.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.reinaldosantos.car_fix.config.TokenService;
import dev.reinaldosantos.car_fix.dto.LoginDto;
import dev.reinaldosantos.car_fix.dto.ServiceProviderDto;
import dev.reinaldosantos.car_fix.dto.UserDto;
import dev.reinaldosantos.car_fix.model.User;
import dev.reinaldosantos.car_fix.record.CreateServiceProviderResponseDto;
import dev.reinaldosantos.car_fix.record.CreateUserResponseDto;
import dev.reinaldosantos.car_fix.record.LoginResponseDto;
import dev.reinaldosantos.car_fix.services.AuthorizationService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private AuthorizationService authorizationService;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginDto data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getPassword());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDto(token));
    }

    @PostMapping("/signup/client")
    public ResponseEntity<CreateUserResponseDto> signUpClient(@Valid @RequestBody UserDto data) {
        UserDto returnUserCreate = authorizationService.createUserClient(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(new CreateUserResponseDto(returnUserCreate));
    }

    @PostMapping("/signup/serivce_provider")
    public ResponseEntity<CreateServiceProviderResponseDto> signUpSerivceProvider(@Valid @RequestBody ServiceProviderDto data) {
        ServiceProviderDto returnUserServiceProvider =  authorizationService.createUserServiceProvider(data);       
        return ResponseEntity.status(HttpStatus.CREATED).body(new CreateServiceProviderResponseDto(returnUserServiceProvider));
    }

}
