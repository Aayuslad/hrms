package com.aayush.lad.hrms.core.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expirationMs}")
    private long jwtExpirationMs;

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public void issueAccessTokenCookie(String username, HttpServletResponse response) {
        String token = generateToken(username);
        response.addCookie(buildAccessTokenCookie(token));
    }

    public void removeAccessTokenCookie(HttpServletResponse response) {
        response.addCookie(buildRemovalAccessTokenCookie());
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            logger.error("Invalid JWT token: {}", ex.getMessage());
            return false;
        }
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Cookie buildAccessTokenCookie(String token) {
        Cookie cookie = new Cookie("ACCESS_TOKEN", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // true in prod
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtExpirationMs / 1000));
        return cookie;
    }

    private Cookie buildRemovalAccessTokenCookie() {
        Cookie cookie = new Cookie("ACCESS_TOKEN", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // true in prod
        cookie.setPath("/");
        cookie.setMaxAge(0);
        return cookie;
    }
}
