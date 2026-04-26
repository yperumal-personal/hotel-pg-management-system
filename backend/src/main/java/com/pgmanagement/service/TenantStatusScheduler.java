package com.pgmanagement.service;

import com.pgmanagement.model.User;
import com.pgmanagement.repository.TenantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import java.time.LocalDate;

/**
 * Scheduled job that runs every midnight to recalculate tenant statuses
 * based on their checkout dates.
 *
 * Rules:
 *   - checkout == today or tomorrow  → TO_BE_EXTENDED
 *   - checkout < (today - 1 day)      → CLOSED  (2+ days in the past)
 *   - checkout > tomorrow             → ACTIVE
 */
@Service
public class TenantStatusScheduler {

    private static final Logger log = LoggerFactory.getLogger(TenantStatusScheduler.class);

    @Autowired
    private TenantRepository tenantRepository;

    /**
     * Runs every day at midnight (00:00:00).
     * Also exposed as a public method so it can be triggered immediately
     * when a tenant's checkout date is updated.
     */
    @EventListener(ApplicationReadyEvent.class)
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void recalculateTenantStatuses() {
        LocalDate today    = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        // "2 days ago" exclusive boundary: checkout < today - 1 means 2+ days in the past
        LocalDate twoDaysAgo = today.minusDays(1);

        log.info("[TenantStatusScheduler] Running status recalculation for date: {}", today);

        int active = tenantRepository.updateStatusForActiveTenants(
                User.Status.ACTIVE, tomorrow);

        int toBeExtended = tenantRepository.updateStatusForToBeExtendedTenants(
                User.Status.TO_BE_EXTENDED, today, tomorrow);

        int closed = tenantRepository.updateStatusForClosedTenants(
                User.Status.CLOSED, twoDaysAgo);

        log.info("[TenantStatusScheduler] Status update complete — ACTIVE: {}, TO_BE_EXTENDED: {}, CLOSED: {}",
                active, toBeExtended, closed);
    }
}
