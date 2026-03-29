package com.pgmanagement.controller;

import com.pgmanagement.dto.PricingConfigResponse;
import com.pgmanagement.service.PricingConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pricing")
public class PricingConfigController {

    @Autowired
    private PricingConfigService pricingConfigService;

    @GetMapping("/{planType}")
    public ResponseEntity<PricingConfigResponse> getPricing(@PathVariable String planType) {
        return ResponseEntity.ok(pricingConfigService.getPricing(planType));
    }
}
