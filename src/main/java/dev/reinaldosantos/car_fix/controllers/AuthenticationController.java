package dev.reinaldosantos.car_fix.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import dev.reinaldosantos.car_fix.dto.GenerateTokenDto;
import dev.reinaldosantos.car_fix.dto.LoginDto;
import dev.reinaldosantos.car_fix.dto.PasswordChangeDto;
import dev.reinaldosantos.car_fix.dto.ServiceProviderDto;
import dev.reinaldosantos.car_fix.dto.UserDto;
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

    @PostMapping(path = "/signup/client", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }, produces = {
            MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> signUpClient(
            @Valid @RequestPart("clientData") String clientData,
            @RequestPart("file") MultipartFile file) throws Exception {
        UserDto returnUserCreate = authorizationService.createUserClient(clientData, file);

        return ResponseEntity.status(HttpStatus.CREATED).body(new CreateUserResponseDto(returnUserCreate));
    }

    @PostMapping(path = "/signup/service_provider", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }, produces = {
            MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> signUpSerivceProvider(
            @Valid @RequestPart("serviceProviderData") String serviceProviderData,
            @RequestPart("imageDocumentVehicle") MultipartFile imageDocumentVehicle,
            @RequestPart("imageCnh") MultipartFile imageCnh) throws Exception {
        ServiceProviderDto returnUserServiceProvider = authorizationService
                .createUserServiceProvider(serviceProviderData, imageDocumentVehicle, imageCnh);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(returnUserServiceProvider);

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
