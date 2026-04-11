package com.pgmanagement.repository;

import com.pgmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TenantRepository extends JpaRepository<User, Long> {

    /**
     * Find all users with TENANT role
     */
    List<User> findByRole(User.Role role);

    /**
     * Set status = ACTIVE for tenants whose checkout date is after tomorrow
     */
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.role = 'TENANT' AND u.checkOutDate > :tomorrow")
    int updateStatusForActiveTenants(@Param("status") User.Status status,
                                     @Param("tomorrow") LocalDate tomorrow);

    /**
     * Set status = TO_BE_EXTENDED for tenants whose checkout date is today or tomorrow
     */
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.role = 'TENANT' AND u.checkOutDate >= :today AND u.checkOutDate <= :tomorrow")
    int updateStatusForToBeExtendedTenants(@Param("status") User.Status status,
                                           @Param("today") LocalDate today,
                                           @Param("tomorrow") LocalDate tomorrow);

    /**
     * Set status = CLOSED for tenants whose checkout date was 2 or more days ago
     */
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.role = 'TENANT' AND u.checkOutDate < :twoDaysAgo")
    int updateStatusForClosedTenants(@Param("status") User.Status status,
                                     @Param("twoDaysAgo") LocalDate twoDaysAgo);
}
