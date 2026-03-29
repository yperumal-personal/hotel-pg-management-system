package com.pgmanagement.dto;

import com.pgmanagement.model.User;
import java.time.LocalDate;

public class UserResponse {
    
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String aadharNo;
    private String aadharImageUrl;
    private String workStatus;
    private String employeeName;
    private String collegeName;
    private String streetName;
    private String city;
    private String district;
    private String state;
    private String pinCode;
    private String gender;
    private String maritalStatus;
    private String role;
    private String status;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String staySchedule;
    private Integer stayDuration;
    
    // Constructors
    public UserResponse() {}
    
    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.phone = user.getPhone();
        this.aadharNo = user.getAadharNo();
        this.aadharImageUrl = user.getAadharImageUrl();
        this.workStatus = user.getWorkStatus() != null ? user.getWorkStatus().name() : null;
        this.employeeName = user.getEmployeeName();
        this.collegeName = user.getCollegeName();
        this.streetName = user.getStreetName();
        this.city = user.getCity();
        this.district = user.getDistrict();
        this.state = user.getState();
        this.pinCode = user.getPinCode();
        this.gender = user.getGender() != null ? user.getGender().name() : null;
        this.maritalStatus = user.getMaritalStatus() != null ? user.getMaritalStatus().name() : null;
        this.role = user.getRole().name();
        this.status = user.getStatus().name();
        this.checkInDate = user.getCheckInDate();
        this.checkOutDate = user.getCheckOutDate();
        this.staySchedule = user.getStaySchedule() != null ? user.getStaySchedule().name() : null;
        this.stayDuration = user.getStayDuration();
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
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
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getAadharNo() {
        return aadharNo;
    }
    
    public void setAadharNo(String aadharNo) {
        this.aadharNo = aadharNo;
    }
    
    public String getAadharImageUrl() {
        return aadharImageUrl;
    }
    
    public void setAadharImageUrl(String aadharImageUrl) {
        this.aadharImageUrl = aadharImageUrl;
    }
    
    public String getWorkStatus() {
        return workStatus;
    }
    
    public void setWorkStatus(String workStatus) {
        this.workStatus = workStatus;
    }
    
    public String getEmployeeName() {
        return employeeName;
    }
    
    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
    
    public String getCollegeName() {
        return collegeName;
    }
    
    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }
    
    public String getStreetName() {
        return streetName;
    }
    
    public void setStreetName(String streetName) {
        this.streetName = streetName;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getDistrict() {
        return district;
    }
    
    public void setDistrict(String district) {
        this.district = district;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getPinCode() {
        return pinCode;
    }
    
    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
    }
    
    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    
    public String getMaritalStatus() {
        return maritalStatus;
    }
    
    public void setMaritalStatus(String maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public String getStaySchedule() {
        return staySchedule;
    }

    public void setStaySchedule(String staySchedule) {
        this.staySchedule = staySchedule;
    }

    public Integer getStayDuration() {
        return stayDuration;
    }

    public void setStayDuration(Integer stayDuration) {
        this.stayDuration = stayDuration;
    }
}
