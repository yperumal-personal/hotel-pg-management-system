import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { tenantService } from '../services/tenantService';
import { Tenant } from '../types';
import FileUpload from '../components/FileUpload';

export default function UpdateTenant() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    aadharNo: '',
    aadharImageUrl: '',
    workStatus: '',
    employeeName: '',
    collegeName: '',
    streetName: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
    gender: '',
    maritalStatus: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenant();
  }, [id]);

  const fetchTenant = async () => {
    try {
      setLoading(true);
      const response = await tenantService.getTenantById(Number(id));
      const tenant: Tenant = response.data;
      setFormData({
        email: tenant.email || '',
        firstName: tenant.firstName || '',
        lastName: tenant.lastName || '',
        phone: tenant.phone || '',
        aadharNo: tenant.aadharNo || '',
        aadharImageUrl: tenant.aadharImageUrl || '',
        workStatus: tenant.workStatus || '',
        employeeName: tenant.employeeName || '',
        collegeName: tenant.collegeName || '',
        streetName: tenant.streetName || '',
        city: tenant.city || '',
        district: tenant.district || '',
        state: tenant.state || '',
        pinCode: tenant.pinCode || '',
        gender: tenant.gender || '',
        maritalStatus: tenant.maritalStatus || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tenant');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAadharImageChange = (base64: string) => {
    setFormData({
      ...formData,
      aadharImageUrl: base64,
    });
  };

  const handleDelete = async () => {
    setOpenDeleteDialog(false);
    setDeleting(true);
    setError('');
    
    try {
      await tenantService.deleteTenant(Number(id));
      setSuccess('Tenant deleted successfully!');
      setTimeout(() => navigate('/tenants'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    // Validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be 10 digits');
      setSubmitting(false);
      return;
    }

    if (formData.aadharNo && !/^\d{12}$/.test(formData.aadharNo)) {
      setError('Aadhar number must be 12 digits');
      setSubmitting(false);
      return;
    }

    if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
      setError('PIN code must be 6 digits');
      setSubmitting(false);
      return;
    }

    if (formData.workStatus === 'EMPLOYEE' && !formData.employeeName) {
      setError('Employee name is required for employees');
      setSubmitting(false);
      return;
    }

    if (formData.workStatus === 'STUDENT' && !formData.collegeName) {
      setError('College name is required for students');
      setSubmitting(false);
      return;
    }

    try {
      await tenantService.updateTenant(Number(id), {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        aadharNo: formData.aadharNo || undefined,
        aadharImageUrl: formData.aadharImageUrl || undefined,
        workStatus: formData.workStatus || undefined,
        employeeName: formData.employeeName || undefined,
        collegeName: formData.collegeName || undefined,
        streetName: formData.streetName || undefined,
        city: formData.city || undefined,
        district: formData.district || undefined,
        state: formData.state || undefined,
        pinCode: formData.pinCode || undefined,
        gender: formData.gender || undefined,
        maritalStatus: formData.maritalStatus || undefined,
      });
      setSuccess('Tenant updated successfully!');
      setTimeout(() => navigate('/tenants'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
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

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Update Tenant
      </Typography>

      <Card sx={{ p: 4, maxWidth: 800, maxHeight: '80vh', overflow: 'auto' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10 digit number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Aadhar Number"
                name="aadharNo"
                value={formData.aadharNo}
                onChange={handleChange}
                placeholder="12 digit Aadhar number"
              />
            </Grid>
            <Grid item xs={12}>
              <FileUpload
                label="Aadhar Image Upload"
                value={formData.aadharImageUrl}
                onChange={handleAadharImageChange}
                onError={setError}
                accept="image/*"
                maxSizeMB={5}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Marital Status"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="MARRIED">Married</MenuItem>
                <MenuItem value="UNMARRIED">Unmarried</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Work Status"
                name="workStatus"
                value={formData.workStatus}
                onChange={handleChange}
              >
                <MenuItem value="">Select Work Status</MenuItem>
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                <MenuItem value="STUDENT">Student</MenuItem>
              </TextField>
            </Grid>
            {formData.workStatus === 'EMPLOYEE' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Employee Name (Company)"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                />
              </Grid>
            )}
            {formData.workStatus === 'STUDENT' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="College Name"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  placeholder="Enter your college name"
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Permanent Address
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Name"
                name="streetName"
                value={formData.streetName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PIN Code"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="6 digit PIN code"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              disabled={submitting || deleting}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {submitting ? 'Updating...' : 'Update Tenant'}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/tenants')}
              disabled={submitting || deleting}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => setOpenDeleteDialog(true)}
              disabled={submitting || deleting}
              startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Box>
        </form>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Tenant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tenant? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
