package com.pgmanagement.repository;

import com.pgmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantRepository extends JpaRepository<User, Long> {
    
    /**
     * Find all users with TENANT role
     */
    List<User> findByRole(User.Role role);
}
