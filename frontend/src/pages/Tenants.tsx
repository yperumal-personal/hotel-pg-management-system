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
  IconButton,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'default';
      case 'SUSPENDED':
        return 'error';
      default:
        return 'default';
    }
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Aadhar No</TableCell>
              <TableCell>Aadhar Image</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No tenants found.
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((tenant) => (
                <TableRow key={tenant.id} hover>
                  <TableCell>
                    {tenant.firstName} {tenant.lastName}
                  </TableCell>
                  <TableCell>{tenant.email}</TableCell>
                  <TableCell>{tenant.phone || 'N/A'}</TableCell>
                  <TableCell>{tenant.aadharNo || 'N/A'}</TableCell>
                  <TableCell>
                    {tenant.aadharImageUrl ? (
                      <a
                        href={tenant.aadharImageUrl}
                        download={`aadhar_${tenant.firstName}_${tenant.lastName}.jpg`}
                        style={{
                          color: '#1976d2',
                          textDecoration: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Download
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tenant.status}
                      color={getStatusColor(tenant.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/tenants/edit/${tenant.id}`)}
                      title="Edit tenant"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
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
