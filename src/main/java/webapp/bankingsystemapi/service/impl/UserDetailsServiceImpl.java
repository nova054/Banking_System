package webapp.bankingsystemapi.service.impl;

import lombok.AllArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import webapp.bankingsystemapi.model.User;
import webapp.bankingsystemapi.repo.UserRepo;
import webapp.bankingsystemapi.service.MyUserDetailsService;

import java.util.List;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements MyUserDetailsService {

    private final UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user= userRepo.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toString()))
        );
    }
}
