package com.pgmanagement.config;

import com.pgmanagement.model.PricingConfig;
import com.pgmanagement.repository.PricingConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PricingConfigRepository pricingConfigRepository;

    @Override
    public void run(String... args) {
        seedPricingConfig(PricingConfig.PlanType.DAY, new BigDecimal("1000.00"));
        seedPricingConfig(PricingConfig.PlanType.MONTH, new BigDecimal("10000.00"));
    }

    private void seedPricingConfig(PricingConfig.PlanType planType, BigDecimal costPerUnit) {
        if (pricingConfigRepository.findByPlanType(planType).isEmpty()) {
            PricingConfig config = new PricingConfig();
            config.setPlanType(planType);
            config.setCostPerUnit(costPerUnit);
            pricingConfigRepository.save(config);
        }
    }
}
