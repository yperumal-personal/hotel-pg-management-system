package com.pgmanagement.service;

import com.pgmanagement.dto.PricingConfigResponse;
import com.pgmanagement.exception.ResourceNotFoundException;
import com.pgmanagement.model.PricingConfig;
import com.pgmanagement.repository.PricingConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PricingConfigService {

    @Autowired
    private PricingConfigRepository pricingConfigRepository;

    public PricingConfigResponse getPricing(String planType) {
        PricingConfig.PlanType type;
        try {
            type = PricingConfig.PlanType.valueOf(planType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid plan type: " + planType);
        }

        PricingConfig config = pricingConfigRepository.findByPlanType(type)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing not found for plan: " + planType));

        return new PricingConfigResponse(config);
    }
}
