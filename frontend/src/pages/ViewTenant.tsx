import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { tenantService } from '../services/tenantService';
import { Tenant } from '../types';

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1">{value || 'N/A'}</Typography>
    </Box>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );
}

export default function ViewTenant() {
  const { id } = useParams<{ id: string }>();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    tenantService
      .getTenantById(Number(id))
      .then((res) => setTenant(res.data))
      .catch((err: any) =>
        setError(err.response?.data?.message || 'Failed to load tenant details')
      )
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return undefined;
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStayStatus = (checkOutDate?: string) => {
    if (!checkOutDate) return { label: 'N/A', color: 'default' as const };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkout = new Date(checkOutDate);
    if (checkout >= today) {
      return { label: 'ACTIVE', color: 'success' as const };
    }
    return { label: 'To be Extended', color: 'error' as const };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !tenant) {
    return (
      <Box>
        <Alert severity="error">{error || 'Tenant not found.'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/tenants')} sx={{ mt: 2 }}>
          Back to Tenants
        </Button>
      </Box>
    );
  }

  const stayStatus = getStayStatus(tenant.checkOutDate);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tenants')}
          variant="outlined"
          size="small"
        >
          Back
        </Button>
        <Typography variant="h4">
          {tenant.firstName} {tenant.lastName}
        </Typography>
        <Chip label={stayStatus.label} color={stayStatus.color} />
      </Box>

      {/* Personal Information */}
      <SectionCard title="Personal Information">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="First Name" value={tenant.firstName} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Last Name" value={tenant.lastName} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Email" value={tenant.email} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Phone" value={tenant.phone} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Gender" value={tenant.gender} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Marital Status" value={tenant.maritalStatus} />
          </Grid>
        </Grid>
      </SectionCard>

      {/* Identity */}
      <SectionCard title="Identity">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Aadhar No" value={tenant.aadharNo} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Aadhar Image
              </Typography>
              {tenant.aadharImageUrl ? (
                <a
                  href={tenant.aadharImageUrl}
                  download={`aadhar_${tenant.firstName}_${tenant.lastName}`}
                  style={{ color: '#1976d2', textDecoration: 'none' }}
                >
                  Download
                </a>
              ) : (
                <Typography variant="body1">N/A</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </SectionCard>

      {/* Work / Study */}
      <SectionCard title="Work / Study">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Work Status" value={tenant.workStatus} />
          </Grid>
          {tenant.workStatus === 'EMPLOYEE' && (
            <Grid item xs={12} sm={6} md={4}>
              <InfoRow label="Employee / Company Name" value={tenant.employeeName} />
            </Grid>
          )}
          {tenant.workStatus === 'STUDENT' && (
            <Grid item xs={12} sm={6} md={4}>
              <InfoRow label="College Name" value={tenant.collegeName} />
            </Grid>
          )}
        </Grid>
      </SectionCard>

      {/* Address */}
      <SectionCard title="Address">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Street Name" value={tenant.streetName} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="City" value={tenant.city} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="District" value={tenant.district} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="State" value={tenant.state} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Pin Code" value={tenant.pinCode} />
          </Grid>
        </Grid>
      </SectionCard>

      {/* Stay Details */}
      <SectionCard title="Stay Details">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Check In Date" value={formatDate(tenant.checkInDate)} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Check Out Date" value={formatDate(tenant.checkOutDate)} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Stay Schedule" value={tenant.staySchedule} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow
              label="Stay Duration"
              value={
                tenant.stayDuration
                  ? `${tenant.stayDuration} ${tenant.staySchedule === 'DAY' ? 'Day(s)' : 'Month(s)'}`
                  : undefined
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoRow label="Joined Date" value={formatDate(tenant.createdAt)} />
          </Grid>
        </Grid>
      </SectionCard>

      {/* Edit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/tenants/edit/${tenant.id}`)}
          size="large"
        >
          Edit Tenant Details
        </Button>
      </Box>
    </Box>
  );
}
