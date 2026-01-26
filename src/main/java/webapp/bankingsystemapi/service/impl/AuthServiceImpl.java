package webapp.bankingsystemapi.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import webapp.bankingsystemapi.DTO.auth.AuthResponse;
import webapp.bankingsystemapi.DTO.auth.LoginRequest;
import webapp.bankingsystemapi.DTO.auth.RegisterRequest;
import webapp.bankingsystemapi.config.JWTUtil;
import webapp.bankingsystemapi.enums.AuditAction;
import webapp.bankingsystemapi.enums.AuditEntityType;
import webapp.bankingsystemapi.enums.Role;
import webapp.bankingsystemapi.enums.UserStatus;
import webapp.bankingsystemapi.exception.BadRequestException;
import webapp.bankingsystemapi.model.User;
import webapp.bankingsystemapi.repo.UserRepo;
import webapp.bankingsystemapi.service.AuditService;
import webapp.bankingsystemapi.service.AuthService;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder encoder;
    private final JWTUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final AuditService auditService;


    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: "+ request.getEmail());
        }

        if(!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .status(UserStatus.ACTIVE)
                .isActive(true)
                .password(encoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepo.save(user);

        auditService.logSuccess(AuditAction.REGISTER, AuditEntityType.USER, user.getId(), String.format("Registered with email %s", user.getEmail()));
      return mapToResponse(user);
    }


    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            auditService.logFailure(AuditAction.LOGIN, AuditEntityType.USER, null, String.format("Failed login attempt from email : %s", request.getEmail()));
            throw new BadRequestException("Invalid email or password");
        }
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));
        user.setLastLoginAt(LocalDateTime.now());

        auditService.logSuccess(
                AuditAction.LOGIN,
                AuditEntityType.USER,
                user.getId(),
                String.format("Logged in with email %s", user.getEmail())
        );
        return mapToResponse(user);
    }



    private AuthResponse mapToResponse(User user){
        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .createdAt(user.getCreatedAt())
                .build();
    }



}

