package com.pgmanagement.controller;

import com.pgmanagement.dto.TenantResponse;
import com.pgmanagement.exception.UnauthorizedException;
import com.pgmanagement.model.User;
import com.pgmanagement.repository.UserRepository;
import com.pgmanagement.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tenants")
public class TenantController {
    
    @Autowired
    private TenantService tenantService;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get all tenants (Owner only)
     */
    @GetMapping
    public ResponseEntity<List<TenantResponse>> getAllTenants() {
        verifyOwnerAccess();
        
        List<User> tenants = tenantService.getAllTenants();
        List<TenantResponse> response = tenants.stream()
                .map(TenantResponse::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Verify that the current user is an OWNER
     */
    private void verifyOwnerAccess() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        
        if (currentUser.getRole() != User.Role.OWNER) {
            throw new UnauthorizedException("Only owners can access tenant information");
        }
    }
}
