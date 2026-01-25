package webapp.bankingsystemapi.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import webapp.bankingsystemapi.DTO.auth.RegisterRequest;
import webapp.bankingsystemapi.DTO.user.UserResponse;
import webapp.bankingsystemapi.model.User;
import webapp.bankingsystemapi.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;



    @GetMapping("/getUserData")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<UserResponse> getUser( Authentication authentication) {
        String email = authentication.getName();
        UserResponse response = service.getUser(email);
        return ResponseEntity.ok(response);
    }

//    @GetMapping
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<List<UserResponse>> getAllUsers() {
//
//        List<UserResponse> users = service.getAllUsers();
//        return ResponseEntity.ok(users);
//    }




}


//1. UserService + UserController
//2. GlobalExceptionHandler
//3. Test all APIs (without JWT)
//4. AuthService + JWT
//5. Secure APIs
