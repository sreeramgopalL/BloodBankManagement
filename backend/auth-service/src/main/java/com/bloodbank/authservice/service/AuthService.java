package com.bloodbank.authservice.service;

import com.bloodbank.authservice.dto.*;
import com.bloodbank.authservice.entity.Role;
import com.bloodbank.authservice.entity.User;
import com.bloodbank.authservice.repository.UserRepository;
import com.bloodbank.authservice.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service

public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final AuthenticationManager authenticationManager;
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
			AuthenticationManager authenticationManager) {
		super();
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtil = jwtUtil;
		this.authenticationManager = authenticationManager;
	}


    // 🔐 REGISTER
    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.valueOf(request.getRole().toUpperCase())
        );

        userRepository.save(user);

        return "User registered successfully";
    }

    // 🔐 LOGIN
    public Authresponse login(Loginrequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new Authresponse(token);
    }
}
