package dev.reinaldosantos.car_fix.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import dev.reinaldosantos.car_fix.dto.ServiceProviderDto;
import dev.reinaldosantos.car_fix.dto.UserDto;
import dev.reinaldosantos.car_fix.enums.TypeUser;
import dev.reinaldosantos.car_fix.enums.UserRole;
import dev.reinaldosantos.car_fix.exception.FieldAlreadyExistsException;
import dev.reinaldosantos.car_fix.model.Address;
import dev.reinaldosantos.car_fix.model.ServiceProvider;
import dev.reinaldosantos.car_fix.model.User;
import dev.reinaldosantos.car_fix.repositories.AddressRepository;
import dev.reinaldosantos.car_fix.repositories.ServiceProviderRepository;
import dev.reinaldosantos.car_fix.repositories.UserRepository;

@Service
public class AuthorizationService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email);
    }

    public UserDto createUserClient(UserDto userDto) {
        this.checkIfEmailOrIdentifierExists(userDto);
        Address savedAddress  = this.createAddres(userDto);
        this.createUser(userDto,savedAddress);
        userDto.setPassword(null);
        return userDto;
    }

    public ServiceProviderDto createUserServiceProvider(ServiceProviderDto serviceProviderDto) {
        this.checkIfEmailOrIdentifierExists(serviceProviderDto.getUserDto());
        Address savedAddress  = this.createAddres(serviceProviderDto.getUserDto());
        User userCreated = this.createUser(serviceProviderDto.getUserDto(),savedAddress);
        this.createServiceProvider(serviceProviderDto,userCreated);
        serviceProviderDto.getUserDto().setPassword(null);
        return serviceProviderDto;
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

    private Address createAddres(UserDto userDto) {
        Address addressNew = new Address(
            userDto.getNeighborhood(),
            userDto.getStreet(),
            userDto.getNumber(),
            userDto.getCity(), 
            userDto.getState(), 
            userDto.getCep()
        );
        Address savedAddress  = this.addressRepository.save(addressNew);
        return savedAddress;
    }

    public User createUser(UserDto userDto, Address savedAddress){
        String encryptedPassword = new BCryptPasswordEncoder().encode(userDto.getPassword());
        TypeUser userType = TypeUser.valueOf(userDto.getType().toUpperCase()); 
        User userNew = new User( 
            userDto.getFullName(), 
            userDto.getPhoneNumber(), 
            userDto.getEmail(), 
            userDto.getIdentifier(),
            encryptedPassword, 
            userType, 
            savedAddress,
            UserRole.USER
        );
        return this.userRepository.save(userNew);
    }

    public ServiceProvider createServiceProvider(ServiceProviderDto serviceProviderDto,User user){
        ServiceProvider serviceProvider = new ServiceProvider( 
            serviceProviderDto.getPathToImageCnh(), 
            serviceProviderDto.getCnh(), 
            user
        );
        return serviceProviderRepository.save(serviceProvider);
    }
}
