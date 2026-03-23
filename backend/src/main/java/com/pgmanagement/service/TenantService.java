package com.pgmanagement.service;

import com.pgmanagement.dto.UpdateTenantRequest;
import com.pgmanagement.exception.ResourceNotFoundException;
import com.pgmanagement.model.User;
import com.pgmanagement.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    
    /**
     * Get tenant by ID
     */
    public User getTenantById(Long id) {
        User user = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));
        
        if (user.getRole() != User.Role.TENANT) {
            throw new ResourceNotFoundException("User is not a tenant");
        }
        
        return user;
    }
    
    /**
     * Update tenant information
     */
    @Transactional
    public User updateTenant(Long id, UpdateTenantRequest request) {
        User tenant = getTenantById(id);
        
        // Update basic info
        if (request.getEmail() != null) {
            tenant.setEmail(request.getEmail());
        }
        if (request.getFirstName() != null) {
            tenant.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            tenant.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            tenant.setPhone(request.getPhone());
        }
        
        // Update Aadhar info
        if (request.getAadharNo() != null) {
            tenant.setAadharNo(request.getAadharNo());
        }
        if (request.getAadharImageUrl() != null) {
            tenant.setAadharImageUrl(request.getAadharImageUrl());
        }
        
        // Update work status
        if (request.getWorkStatus() != null && !request.getWorkStatus().isEmpty()) {
            tenant.setWorkStatus(User.WorkStatus.valueOf(request.getWorkStatus()));
        }
        
        tenant.setEmployeeName(request.getEmployeeName());
        tenant.setCollegeName(request.getCollegeName());
        
        // Update address
        tenant.setStreetName(request.getStreetName());
        tenant.setCity(request.getCity());
        tenant.setDistrict(request.getDistrict());
        tenant.setState(request.getState());
        tenant.setPinCode(request.getPinCode());
        
        // Update gender and marital status
        if (request.getGender() != null && !request.getGender().isEmpty()) {
            tenant.setGender(User.Gender.valueOf(request.getGender()));
        }
        if (request.getMaritalStatus() != null && !request.getMaritalStatus().isEmpty()) {
            tenant.setMaritalStatus(User.MaritalStatus.valueOf(request.getMaritalStatus()));
        }
        
        // Update status
        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            tenant.setStatus(User.Status.valueOf(request.getStatus()));
        }
        
        return tenantRepository.save(tenant);
    }
    
    /**
     * Delete tenant by ID
     */
    @Transactional
    public void deleteTenant(Long id) {
        User tenant = getTenantById(id);
        tenantRepository.delete(tenant);
    }
}

