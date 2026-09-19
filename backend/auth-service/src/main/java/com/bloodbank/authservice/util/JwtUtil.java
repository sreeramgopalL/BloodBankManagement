package com.bloodbank.authservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET =
            "bloodbank-secret-key-bloodbank-secret-key";

    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // 🔐 Generate JWT
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 📧 Extract email
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // 👤 Extract role
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // 📜 Extract all claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Validate token
    public boolean isTokenValid(String token, String email) {
        final String extractedEmail = extractEmail(token);
        return extractedEmail.equals(email) && !isTokenExpired(token);
    }

    // ⏳ Check expiration
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }
}
