package com.pgmanagement.dto;

import com.pgmanagement.model.PricingConfig;

import java.math.BigDecimal;

public class PricingConfigResponse {

    private Long id;
    private String planType;
    private BigDecimal costPerUnit;

    public PricingConfigResponse() {}

    public PricingConfigResponse(PricingConfig config) {
        this.id = config.getId();
        this.planType = config.getPlanType().name();
        this.costPerUnit = config.getCostPerUnit();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }

    public BigDecimal getCostPerUnit() { return costPerUnit; }
    public void setCostPerUnit(BigDecimal costPerUnit) { this.costPerUnit = costPerUnit; }
}
