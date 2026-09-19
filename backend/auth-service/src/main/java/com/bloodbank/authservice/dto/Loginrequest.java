package com.bloodbank.authservice.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class Loginrequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

	public String getEmail() {
		return email;
	}

	public String getPassword() {
		return password;
	}
}
