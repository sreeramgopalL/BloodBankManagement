package com.bloodbank.authservice.config;

import com.bloodbank.authservice.entity.Role;
import com.bloodbank.authservice.entity.User;
import com.bloodbank.authservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default Admin if not present
        if (userRepository.findByEmail("admin@bloodbank.org").isEmpty()) {
            userRepository.save(new User(
                    "System Admin",
                    "admin@bloodbank.org",
                    passwordEncoder.encode("admin@123"),
                    Role.ADMIN
            ));
        }

        // Seed default Hospital if not present
        if (userRepository.findByEmail("hospital@citygeneral.org").isEmpty()) {
            userRepository.save(new User(
                    "City General Hospital",
                    "hospital@citygeneral.org",
                    passwordEncoder.encode("hospital@123"),
                    Role.HOSPITAL
            ));
        }

        // Seed default Donor if not present
        if (userRepository.findByEmail("donor@example.com").isEmpty()) {
            userRepository.save(new User(
                    "John Doe",
                    "donor@example.com",
                    passwordEncoder.encode("donor@123"),
                    Role.DONOR
            ));
        }
    }
}
