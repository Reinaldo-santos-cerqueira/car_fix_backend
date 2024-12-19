package dev.reinaldosantos.car_fix.services;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import dev.reinaldosantos.car_fix.dto.ServiceProviderDto;
import dev.reinaldosantos.car_fix.config.TokenService;
import dev.reinaldosantos.car_fix.dto.GenerateTokenDto;
import dev.reinaldosantos.car_fix.dto.LoginDto;
import dev.reinaldosantos.car_fix.dto.PasswordChangeDto;
import dev.reinaldosantos.car_fix.dto.RelServiceUserDto;
import dev.reinaldosantos.car_fix.dto.UserDto;
import dev.reinaldosantos.car_fix.enums.TypeUser;
import dev.reinaldosantos.car_fix.enums.UserRole;
import dev.reinaldosantos.car_fix.exception.FieldAlreadyExistsException;
import dev.reinaldosantos.car_fix.exception.InternalServerErrorCustom;
import dev.reinaldosantos.car_fix.exception.NotRegisterFieldException;
import dev.reinaldosantos.car_fix.exception.UnauthorizedException;
import dev.reinaldosantos.car_fix.model.Address;
import dev.reinaldosantos.car_fix.model.RelServiceUser;
import dev.reinaldosantos.car_fix.model.RelUserVehicle;
import dev.reinaldosantos.car_fix.model.Service;
import dev.reinaldosantos.car_fix.model.ServiceProvider;
import dev.reinaldosantos.car_fix.model.User;
import dev.reinaldosantos.car_fix.model.Vehicle;
import dev.reinaldosantos.car_fix.record.LoginResponseDto;
import dev.reinaldosantos.car_fix.record.MessageResponse;
import dev.reinaldosantos.car_fix.repositories.AddressRepository;
import dev.reinaldosantos.car_fix.repositories.RelServiceUserRepository;
import dev.reinaldosantos.car_fix.repositories.RelUserVehicleRepository;
import dev.reinaldosantos.car_fix.repositories.ServiceProviderRepository;
import dev.reinaldosantos.car_fix.repositories.ServiceRepository;
import dev.reinaldosantos.car_fix.repositories.UserRepository;
import dev.reinaldosantos.car_fix.repositories.VehicleRepository;
import dev.reinaldosantos.car_fix.utils.RandomCodeGenerator;
import jakarta.transaction.Transactional;

@org.springframework.stereotype.Service
public class AuthorizationService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private RelServiceUserRepository relServiceUserRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    RelUserVehicleRepository relUserVehicleRepository;
    @Autowired
    FileStorageService fileStorageService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email);
    }

    @Transactional(rollbackOn = Exception.class)
    public UserDto createUserClient(String clientData, MultipartFile file) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        UserDto userDto = objectMapper.readValue(clientData, UserDto.class);
        String pathImageDocumentVehicle = fileStorageService.saveFileWithRandomName(file);
        try {
            this.checkIfEmailOrIdentifierExists(userDto);
            Address savedAddress = this.createAddres(userDto);
            User createUser = this.createUser(userDto, savedAddress);
            Vehicle createdVehicle = this.creatVehicle(userDto, pathImageDocumentVehicle);
            this.createRelUserVehicle(createUser, createdVehicle);
            userDto.setPassword(null);
            return userDto;
        } catch (FieldAlreadyExistsException e) {
            fileStorageService.deleteFile(pathImageDocumentVehicle);
            throw new FieldAlreadyExistsException(e.getFieldName());
        } catch (Exception e) {
            fileStorageService.deleteFile(pathImageDocumentVehicle);
            throw new InternalServerErrorCustom(e.getMessage());
        }

    }

    @Transactional(rollbackOn = Exception.class)
    public ServiceProviderDto createUserServiceProvider(String serviceProviderData, MultipartFile imageDocumentVehicle,
            MultipartFile imageCnh) throws Exception {
        String pathImageDocumentVehicle = fileStorageService.saveFileWithRandomName(imageDocumentVehicle);
        String pathImageCnh = fileStorageService.saveFileWithRandomName(imageCnh);
        try {

            ObjectMapper objectMapper = new ObjectMapper();
            ServiceProviderDto serviceProviderDto = objectMapper.readValue(serviceProviderData,
                    ServiceProviderDto.class);
            this.checkIfEmailOrIdentifierExists(serviceProviderDto.getUserDto());
            this.checkIfCnhAndServicesExists(serviceProviderDto);
            Address savedAddress = this.createAddres(serviceProviderDto.getUserDto());
            User userCreated = this.createUser(serviceProviderDto.getUserDto(), savedAddress);
            Vehicle createdVehicle = this.creatVehicle(serviceProviderDto.getUserDto(), pathImageDocumentVehicle);
            this.createServiceProvider(serviceProviderDto, userCreated, pathImageCnh);
            this.createRelServiceUser(serviceProviderDto, userCreated);
            this.createRelUserVehicle(userCreated, createdVehicle);

            serviceProviderDto.getUserDto().setPassword(null);
            return serviceProviderDto;
        } catch (FieldAlreadyExistsException e) {
            fileStorageService.deleteFile(pathImageCnh);
            fileStorageService.deleteFile(pathImageDocumentVehicle);
            throw new FieldAlreadyExistsException(e.getFieldName());
        } catch (NotRegisterFieldException e) {
            fileStorageService.deleteFile(pathImageCnh);
            fileStorageService.deleteFile(pathImageDocumentVehicle);
            throw new NotRegisterFieldException(e.getFieldName());
        } catch (Exception e) {
            fileStorageService.deleteFile(pathImageCnh);
            fileStorageService.deleteFile(pathImageDocumentVehicle);
            throw new InternalServerErrorCustom(e.getMessage());
        }
    }

    private boolean checkIfEmailOrIdentifierExists(UserDto userDto) {
        if (userRepository.findByEmail(userDto.getEmail()) != null) {
            throw new FieldAlreadyExistsException("email");
        }
        if (userRepository.findByIdentifier(userDto.getIdentifier()) != null) {
            throw new FieldAlreadyExistsException("identifier");
        }
        return false;
    }

    private boolean checkIfCnhAndServicesExists(ServiceProviderDto serviceProviderDto) {
        if (serviceProviderRepository.findByCnh(serviceProviderDto.getCnh()) != null) {
            throw new FieldAlreadyExistsException("cnh");
        }
        for (RelServiceUserDto service : serviceProviderDto.getListServicesID()) {
            Optional<Service> serviceFind = serviceRepository.findById(service.getServiceId());
            if (serviceFind.isEmpty()) {
                throw new NotRegisterFieldException("service id");
            }
        }
        return false;
    }

    private Address createAddres(UserDto userDto) {
        Address savedAddress = this.addressRepository.save(new Address(
                userDto.getNeighborhood(),
                userDto.getStreet(),
                userDto.getNumber(),
                userDto.getCity(),
                userDto.getState(),
                userDto.getCep()));
        return savedAddress;
    }

    public User createUser(UserDto userDto, Address savedAddress) {
        String encryptedPassword = new BCryptPasswordEncoder().encode(userDto.getPassword());
        TypeUser userType = TypeUser.valueOf(userDto.getType().toUpperCase());
        return this.userRepository.save(new User(
                userDto.getFullName(),
                userDto.getPhoneNumber(),
                userDto.getEmail(),
                userDto.getIdentifier(),
                encryptedPassword,
                userType,
                savedAddress,
                UserRole.USER));
    }

    public ServiceProvider createServiceProvider(ServiceProviderDto serviceProviderDto, User user, String imageCnh) {
        ServiceProvider serviceProvider = new ServiceProvider(
                imageCnh,
                serviceProviderDto.getCnh(),
                user);
        return serviceProviderRepository.save(serviceProvider);
    }

    public Map<String, String> generateToken(GenerateTokenDto generateTokenDto) {
        RandomCodeGenerator randomCodeGenerator = new RandomCodeGenerator();
        var tokenPasswordChange = randomCodeGenerator.generateRandomCode();
        tokenTradePasswordExecute(generateTokenDto, tokenPasswordChange);
        emailService.sendEmail(generateTokenDto.getEmail(), "Password change",
                MessageFormat.format("use this code {0} to change password", tokenPasswordChange));
        Map<String, String> response = new HashMap<>();
        response.put("message", tokenPasswordChange);
        return response;
    }

    public void tokenTradePasswordExecute(GenerateTokenDto generateTokenDto, String token) {
        User findUser = (User) userRepository.findByEmail(generateTokenDto.getEmail());
        if (findUser == null) {
            throw new NotRegisterFieldException("email");
        }
        findUser.setTokenPasswordChange(token);
        userRepository.save(findUser);
    }

    public LoginResponseDto login(LoginDto data, AuthenticationManager authenticationManager) {

        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getPassword());
            var auth = authenticationManager.authenticate(usernamePassword);
            var token = this.tokenService.generateToken((User) auth.getPrincipal());
            return new LoginResponseDto(token);

        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException();
        } catch (AuthenticationException ex) {
            throw new UnauthorizedException();
        }
    }

    public MessageResponse changePassword(PasswordChangeDto data) {
        User findUser = (User) userRepository.findByEmail(data.getEmail());
        if (findUser == null) {
            throw new NotRegisterFieldException("email");
        }
        if (!findUser.getTokenPasswordChange().equals(data.getTokenPasswordChange())) {
            throw new NotRegisterFieldException("token");
        }
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.getPassword());
        findUser.setPassword(encryptedPassword);
        findUser.setTokenPasswordChange("");
        userRepository.save(findUser);
        return new MessageResponse("Password change success");
    }

    public void createRelServiceUser(ServiceProviderDto serviceProviderDto, User createUser) {
        for (RelServiceUserDto service : serviceProviderDto.getListServicesID()) {
            Optional<Service> serviceFind = serviceRepository.findById(service.getServiceId());
            serviceFind.ifPresent(serviceEntity -> {
                relServiceUserRepository.save(new RelServiceUser(serviceEntity, createUser,
                        service.getPriceService(), service.getPriceKmTraveled()));
            });
        }
    }

    public Vehicle creatVehicle(UserDto userDto, String pathImageDocumentVehicle) {
        Vehicle createdVehicle = vehicleRepository.save(new Vehicle(userDto.getModel(), userDto.getMark(),
                userDto.getPlate(), userDto.getColor(), pathImageDocumentVehicle));
        return createdVehicle;
    }

    public RelUserVehicle createRelUserVehicle(User userCreated, Vehicle vehicleCreated) {
        return relUserVehicleRepository.save(new RelUserVehicle(vehicleCreated, userCreated));
    }

}
