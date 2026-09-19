package com.bloodbank.authservice.dto;

public class Authresponse {

    private String token;

    public Authresponse() {
    }

    public Authresponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

