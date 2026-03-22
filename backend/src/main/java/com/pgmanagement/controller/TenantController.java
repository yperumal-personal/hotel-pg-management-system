package com.pgmanagement.controller;

import com.pgmanagement.dto.TenantResponse;
import com.pgmanagement.dto.UpdateTenantRequest;
import com.pgmanagement.exception.UnauthorizedException;
import com.pgmanagement.model.User;
import com.pgmanagement.repository.UserRepository;
import com.pgmanagement.service.TenantService;
import jakarta.validation.Valid;
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
     * Get tenant by ID (Owner only)
     */
    @GetMapping("/{id}")
    public ResponseEntity<TenantResponse> getTenantById(@PathVariable Long id) {
        verifyOwnerAccess();
        
        User tenant = tenantService.getTenantById(id);
        return ResponseEntity.ok(new TenantResponse(tenant));
    }
    
    /**
     * Update tenant information (Owner only)
     */
    @PutMapping("/{id}")
    public ResponseEntity<TenantResponse> updateTenant(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTenantRequest request) {
        verifyOwnerAccess();
        
        User updatedTenant = tenantService.updateTenant(id, request);
        return ResponseEntity.ok(new TenantResponse(updatedTenant));
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
