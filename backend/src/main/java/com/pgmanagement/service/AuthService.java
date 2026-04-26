package com.pgmanagement.service;

import com.pgmanagement.dto.*;
import com.pgmanagement.exception.ResourceAlreadyExistsException;
import com.pgmanagement.exception.UnauthorizedException;
import com.pgmanagement.model.User;
import com.pgmanagement.repository.UserRepository;
import com.pgmanagement.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already registered");
        }
        
        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setAadharNo(request.getAadharNo());
        user.setAadharImageUrl(request.getAadharImageUrl());
        
        if (request.getWorkStatus() != null && !request.getWorkStatus().isEmpty()) {
            user.setWorkStatus(User.WorkStatus.valueOf(request.getWorkStatus()));
        }
        
        user.setEmployeeName(request.getEmployeeName());
        user.setCollegeName(request.getCollegeName());
        user.setStreetName(request.getStreetName());
        user.setCity(request.getCity());
        user.setDistrict(request.getDistrict());
        user.setState(request.getState());
        user.setPinCode(request.getPinCode());
        
        if (request.getGender() != null && !request.getGender().isEmpty()) {
            user.setGender(User.Gender.valueOf(request.getGender()));
        }
        
        if (request.getMaritalStatus() != null && !request.getMaritalStatus().isEmpty()) {
            user.setMaritalStatus(User.MaritalStatus.valueOf(request.getMaritalStatus()));
        }
        
        if (request.getCheckInDate() != null && !request.getCheckInDate().isEmpty()) {
            user.setCheckInDate(LocalDate.parse(request.getCheckInDate()));
        }

        if (request.getCheckOutDate() != null && !request.getCheckOutDate().isEmpty()) {
            user.setCheckOutDate(LocalDate.parse(request.getCheckOutDate()));
        }

        if (request.getStaySchedule() != null && !request.getStaySchedule().isEmpty()) {
            user.setStaySchedule(User.StaySchedule.valueOf(request.getStaySchedule()));
        }

        user.setStayDuration(request.getStayDuration());
        
        user.setRole(User.Role.valueOf(request.getRole()));
        user.setStatus(computeInitialStatus(user.getCheckOutDate(), user.getRole()));
        
        User savedUser = userRepository.save(user);
        
        // Generate token
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(savedUser.getEmail())
                .password(savedUser.getPassword())
                .roles(savedUser.getRole().name())
                .build();
        
        String token = jwtTokenProvider.generateToken(userDetails);
        
        return new AuthResponse(token, new UserResponse(savedUser));
    }
    
    public AuthResponse login(LoginRequest request) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Get user details
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            // Check if account is active (only enforced for non-tenant roles)
            if (user.getRole() != User.Role.TENANT && user.getStatus() != User.Status.ACTIVE) {
                throw new UnauthorizedException("Account is not active");
            }
            
            // Generate token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(userDetails);
            
            return new AuthResponse(token, new UserResponse(user));
            
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }
    
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return new UserResponse(user);
    }

    /**
     * Compute the initial status for a tenant based on their checkout date.
     * Only applies to TENANTs; other roles default to ACTIVE.
     *
     * - checkout IS NULL or checkout > tomorrow → ACTIVE
     * - checkout == today or tomorrow           → TO_BE_EXTENDED
     * - checkout < today (yesterday or earlier) → CLOSED
     */
    private User.Status computeInitialStatus(LocalDate checkOutDate, User.Role role) {
        if (role != User.Role.TENANT || checkOutDate == null) {
            return User.Status.ACTIVE;
        }
        LocalDate today    = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        if (checkOutDate.isBefore(today)) {
            return User.Status.CLOSED;
        } else if (!checkOutDate.isAfter(tomorrow)) {
            return User.Status.TO_BE_EXTENDED;
        }
        return User.Status.ACTIVE;
    }
}
