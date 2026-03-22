package com.pgmanagement.service;

import com.pgmanagement.model.User;
import com.pgmanagement.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TenantService {
    
    @Autowired
    private TenantRepository tenantRepository;
    
    /**
     * Get all tenants
     */
    public List<User> getAllTenants() {
        return tenantRepository.findByRole(User.Role.TENANT);
    }
}
