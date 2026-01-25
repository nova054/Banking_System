package webapp.bankingsystemapi.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import webapp.bankingsystemapi.DTO.admin.user.AdminUserFilterRequest;
import webapp.bankingsystemapi.DTO.admin.user.AdminUserResponse;
import webapp.bankingsystemapi.DTO.admin.user.ResetPasswordRequest;
import webapp.bankingsystemapi.DTO.auth.RegisterRequest;
import webapp.bankingsystemapi.DTO.user.UserResponse;

public interface UserService {

    AdminUserResponse getUserById(Long userId);
    AdminUserResponse getUserByEmail(String email);
    AdminUserResponse registerUser(RegisterRequest request);
    Page<AdminUserResponse> getAllUsers(Pageable pageable);
    Page<AdminUserResponse> filterUsers(AdminUserFilterRequest request , Pageable pageable);
    void enableUser( Long id);
    void disableUser( Long id);
    void resetPassword(ResetPasswordRequest request);


    UserResponse getUser(String email);

    //Internal Methods

}
