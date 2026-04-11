import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { tenantService } from '../services/tenantService';
import { Tenant } from '../types';
import { useAuth } from '../contexts/AuthContext';

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tenantService.getAllTenants();
      setTenants(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status: Tenant['status']) => {
    switch (status) {
      case 'TO_BE_EXTENDED': return { label: 'To Be Extended', color: 'warning' as const };
      case 'CLOSED':         return { label: 'Closed',          color: 'default' as const };
      default:               return { label: 'Active',          color: 'success' as const };
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Check if user is owner
  if (user?.role !== 'OWNER') {
    return (
      <Box>
        <Alert severity="error">
          Access Denied: Only owners can view tenant information.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Tenants
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Phone No</strong></TableCell>
              <TableCell><strong>Check In Date</strong></TableCell>
              <TableCell><strong>Check Out Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Stay Schedule</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No tenants found.
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((tenant) => {
                const stayStatus = getStatusChip(tenant.status);
                return (
                  <TableRow
                    key={tenant.id}
                    hover
                    onClick={() => navigate(`/tenants/view/${tenant.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      {tenant.firstName} {tenant.lastName}
                    </TableCell>
                    <TableCell>{tenant.phone || 'N/A'}</TableCell>
                    <TableCell>{formatDate(tenant.checkInDate)}</TableCell>
                    <TableCell>{formatDate(tenant.checkOutDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={stayStatus.label}
                        color={stayStatus.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {tenant.staySchedule
                        ? `${tenant.staySchedule.charAt(0) + tenant.staySchedule.slice(1).toLowerCase()}${tenant.stayDuration ? ` (${tenant.stayDuration})` : ''}`
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Total Tenants: {tenants.length}
      </Typography>
    </Box>
  );
}
