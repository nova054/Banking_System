package webapp.bankingsystemapi.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import webapp.bankingsystemapi.DTO.admin.user.AdminUserFilterRequest;
import webapp.bankingsystemapi.DTO.admin.user.AdminUserResponse;
import webapp.bankingsystemapi.DTO.admin.user.ResetPasswordRequest;
import webapp.bankingsystemapi.DTO.auth.RegisterRequest;
import webapp.bankingsystemapi.service.UserService;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/user")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    private final UserService service;

    @GetMapping
    public ResponseEntity<Page<AdminUserResponse>> getAllUsers(@PageableDefault(
            size = 10,
            sort = "createdAt",
            direction = Sort.Direction.DESC
    ) Pageable pageable){
        return ResponseEntity.ok(service.getAllUsers(pageable));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<AdminUserResponse>> filterUsers(@Valid @RequestBody AdminUserFilterRequest request,@PageableDefault(
            size = 10,
            sort = "createdAt",
            direction = Sort.Direction.DESC
    ) Pageable pageable){
        return ResponseEntity.ok(service.filterUsers(request,pageable));
    }

    @PostMapping("/register")
    public ResponseEntity<AdminUserResponse> registerUser(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(service.registerUser(request), HttpStatus.CREATED);
    }

    @GetMapping("/enable/{id}")
    public ResponseEntity<Void> enableUser(@PathVariable Long id){
        service.enableUser(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/disable/{id}")
    public ResponseEntity<Void> disableUser(@PathVariable Long id){
        service.disableUser(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/resetPassword")
    public ResponseEntity<Void> resetPassword(
            @RequestBody @Valid ResetPasswordRequest request){
        service.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/email")
    public ResponseEntity<AdminUserResponse> getByEmail(@RequestParam String email) {
        return ResponseEntity.ok(service.getUserByEmail(email));
    }
    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserResponse> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getUserById(userId));
    }


}
