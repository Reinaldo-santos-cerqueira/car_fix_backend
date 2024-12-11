package dev.reinaldosantos.car_fix.model;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import dev.reinaldosantos.car_fix.enums.TypeUser;
import dev.reinaldosantos.car_fix.enums.UserRole;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity(name = "users")
@Table(name = "users")
@NoArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String fullName;

    private String phoneNumber;

    private String email;

    private String identifier;

    private String password;

    private String tokenPhone;

    @Enumerated(EnumType.STRING)
    private TypeUser type;

    @OneToOne
    @JoinColumn(name = "address_id")
    private Address address;

    private UserRole role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == UserRole.ADMIN)
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        else
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    public User(String fullName, String phoneNumber, String email, String identifier,
            String password, TypeUser type, Address address, UserRole role) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.identifier = identifier;
        this.password = password;
        this.type = type;
        this.address = address;
        this.role = role;
    }
}
