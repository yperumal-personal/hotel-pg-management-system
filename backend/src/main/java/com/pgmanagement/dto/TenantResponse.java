package com.pgmanagement.dto;

import com.pgmanagement.model.User;

import java.time.LocalDateTime;

public class TenantResponse {
    
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String aadharNo;
    private String status;
    private LocalDateTime createdAt;
    
    // Constructors
    public TenantResponse() {}
    
    public TenantResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.phone = user.getPhone();
        this.aadharNo = user.getAadharNo();
        this.status = user.getStatus().name();
        this.createdAt = user.getCreatedAt();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getAadharNo() {
        return aadharNo;
    }
    
    public void setAadharNo(String aadharNo) {
        this.aadharNo = aadharNo;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
