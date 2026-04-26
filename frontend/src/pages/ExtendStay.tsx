import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import StayScheduleFields from '../components/forms/StayScheduleFields';
import { tenantService } from '../services/tenantService';
import { pricingService } from '../services/pricingService';
import { Tenant } from '../types';

export default function ExtendStay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [values, setValues] = useState({
    checkInDate: '', // Not used for extension, but required by component
    staySchedule: 'DAY' as 'DAY' | 'MONTH',
    stayDuration: 1,
  });
  
  const [pricingRates, setPricingRates] = useState<{ DAY: number | null; MONTH: number | null }>({
    DAY: null,
    MONTH: null,
  });

  useEffect(() => {
    if (!id) return;
    
    // Fetch tenant details
    tenantService
      .getTenantById(Number(id))
      .then((res) => {
        setTenant(res.data);
        // Set initial stay schedule based on tenant's current schedule
        if (res.data.staySchedule) {
          setValues((prev) => ({ ...prev, staySchedule: res.data.staySchedule as 'DAY' | 'MONTH' }));
        }
      })
      .catch((err: any) =>
        setError(err.response?.data?.message || 'Failed to load tenant details')
      )
      .finally(() => setLoading(false));

    // Fetch pricing rates
    Promise.all([
      pricingService.getPricing('DAY'),
      pricingService.getPricing('MONTH'),
    ])
      .then(([dayRes, monthRes]) => {
        setPricingRates({
          DAY: dayRes.data.costPerUnit,
          MONTH: monthRes.data.costPerUnit,
        });
      })
      .catch((err: any) => {
        setError((prev) => prev || err.response?.data?.message || 'Failed to load pricing rates');
      });
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleStayScheduleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, staySchedule: e.target.value as 'DAY' | 'MONTH', stayDuration: 1 });
  };

  const handleIncrement = () => {
    const maxDuration = values.staySchedule === 'DAY' ? 30 : 12;
    if (values.stayDuration < maxDuration) {
      setValues({ ...values, stayDuration: values.stayDuration + 1 });
    }
  };

  const handleDecrement = () => {
    if (values.stayDuration > 1) {
      setValues({ ...values, stayDuration: values.stayDuration - 1 });
    }
  };

  const newCheckOutDate = (() => {
    if (!tenant?.checkOutDate) return '';
    const date = new Date(tenant.checkOutDate);
    if (values.staySchedule === 'DAY') {
      date.setDate(date.getDate() + values.stayDuration);
    } else {
      date.setMonth(date.getMonth() + values.stayDuration);
    }
    return date.toISOString().split('T')[0];
  })();

  const handleSubmit = async () => {
    if (!tenant) return;

    setSubmitting(true);
    setError(null);

    try {
      const newStayDuration = (tenant.stayDuration || 0) + values.stayDuration;

      await tenantService.extendStay(Number(id), {
        checkOutDate: newCheckOutDate,
        staySchedule: values.staySchedule,
        stayDuration: newStayDuration,
        status: 'ACTIVE',
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/tenants/view/${id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to extend stay');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !tenant) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/tenants')} sx={{ mt: 2 }}>
          Back to Tenants
        </Button>
      </Box>
    );
  }

  const rate = pricingRates[values.staySchedule];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/tenants/view/${id}`)}
          variant="outlined"
          size="small"
        >
          Back
        </Button>
        <Typography variant="h4">Extend Stay</Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Stay extended successfully! Redirecting...
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {/* Tenant Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {tenant?.firstName} {tenant?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Check-Out Date:{' '}
              {tenant?.checkOutDate
                ? new Date(tenant.checkOutDate).toLocaleDateString('en-IN')
                : 'N/A'}
            </Typography>
          </Box>

          {!tenant?.checkOutDate && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              This tenant has no current check-out date. A check-out date must be set before extending the stay.
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Extension Duration Label */}
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight={500} color="text.primary">
                Extension Duration
              </Typography>
            </Grid>

            {/* Reuse StayScheduleFields Component */}
            <StayScheduleFields
              values={values}
              onChange={handleChange}
              onStayScheduleChange={handleStayScheduleChange}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              pricingRates={pricingRates}
              showCheckInDate={false}
              disableScheduleChange={true}
            />

            {/* New Check-Out Date */}
            {newCheckOutDate && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'info.light',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'info.main',
                  }}
                >
                  <Typography variant="body2" color="info.dark" fontWeight={500}>
                    New Check-Out Date
                  </Typography>
                  <Typography variant="h6" color="info.dark" fontWeight={600}>
                    {new Date(newCheckOutDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/tenants/view/${id}`)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !rate || !newCheckOutDate}
              size="large"
            >
              {submitting ? <CircularProgress size={24} /> : 'Confirm Extension'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
