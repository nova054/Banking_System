package webapp.bankingsystemapi.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import webapp.bankingsystemapi.DTO.admin.user.AdminUserFilterRequest;
import webapp.bankingsystemapi.DTO.admin.user.AdminUserResponse;
import webapp.bankingsystemapi.DTO.admin.user.ResetPasswordRequest;
import webapp.bankingsystemapi.DTO.auth.RegisterRequest;
import webapp.bankingsystemapi.DTO.user.UserResponse;
import webapp.bankingsystemapi.enums.AuditAction;
import webapp.bankingsystemapi.enums.AuditEntityType;
import webapp.bankingsystemapi.enums.Role;
import webapp.bankingsystemapi.enums.UserStatus;
import webapp.bankingsystemapi.exception.BadRequestException;
import webapp.bankingsystemapi.exception.ResourceNotFoundException;
import webapp.bankingsystemapi.model.User;
import webapp.bankingsystemapi.repo.AccountRepo;
import webapp.bankingsystemapi.repo.UserRepo;
import webapp.bankingsystemapi.service.AuditService;
import webapp.bankingsystemapi.service.UserService;
import webapp.bankingsystemapi.validation.UserValidator;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder encoder;
    private final AuditService auditService;
    private final UserValidator userValidator;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserResponse registerUser(RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new BadRequestException(
                    "Email already registered: " + request.getEmail()
            );
        }
        if(!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .isActive(true)
                .status(UserStatus.ACTIVE)
                .build();
        userRepo.save(user);
        return mapToAdminResponse(user);
    }



    //Make one method with admin validation
    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public UserResponse getUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(()-> new ResourceNotFoundException("User not found with email " + email));
        userValidator.validateActive(user);

        return mapToResponse(user);
    }


    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserResponse getUserByEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User is not found with Email: " + email));
        return mapToAdminResponse(user);
    }





    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Page<AdminUserResponse> getAllUsers(Pageable pageable) {
        return userRepo.findAll(pageable).map(this::mapToAdminResponse);
//        List<UserResponse> userResponses = new ArrayList<>();
//        users.forEach(user -> userResponses.add(mapToResponse(user)));
//        return userResponses;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public Page<AdminUserResponse> filterUsers(AdminUserFilterRequest request, Pageable pageable) {
        return userRepo.filterUsers(
                request.getFullName(),
                request.getEmail(),
                request.getRole(),
                request.getStatus(),
                request.getIsActive(),
                request.getFromDate(),
                request.getToDate(),
                pageable).map(this::mapToAdminResponse);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserResponse getUserById(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User is not found with id: " + userId)
                );
        return mapToAdminResponse(user);
    }




    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void disableUser( Long id){
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User is not found with id: " + id));
        user.setActive(false);
        user.setStatus(UserStatus.SUSPENDED);
    }
    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void enableUser( Long id){
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User is not found with id: " + id));
        user.setActive(true);
        user.setStatus(UserStatus.ACTIVE);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void resetPassword(ResetPasswordRequest request){
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User is not found with Email: " + request.getEmail()));
        if(!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }
        user.setPassword(encoder.encode(request.getPassword()));
        auditService.logSuccess(AuditAction.PASSWORD_RESET, AuditEntityType.USER, user.getId(), String.format("Password reset of email : %s successfully", user.getEmail()));
    }


    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
    private AdminUserResponse mapToAdminResponse(User user){
        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status(user.getStatus())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
//                .accountCount(accountRepo.countAccountsByUserId(user.getId()))
                .build();
    }

}
