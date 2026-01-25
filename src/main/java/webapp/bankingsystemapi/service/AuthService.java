package webapp.bankingsystemapi.service;

import webapp.bankingsystemapi.DTO.auth.AuthResponse;
import webapp.bankingsystemapi.DTO.auth.LoginRequest;
import webapp.bankingsystemapi.DTO.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest req);
    AuthResponse login(LoginRequest req);
}
