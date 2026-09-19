package com.bloodbank.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    private String password;   // 🔴 THIS WAS MISSING

    @NotBlank
    private String role;

	public String getName() {
		return name;
	}

	public String getEmail() {
		return email;
	}

	public String getPassword() {
		return password;
	}

	public String getRole() {
		return role;
	}
}

