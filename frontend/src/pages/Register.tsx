import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  Link,
  Grid,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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
    role: 'TENANT',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be 10 digits');
      return;
    }
    
    if (formData.aadharNo && !/^\d{12}$/.test(formData.aadharNo)) {
      setError('Aadhar number must be 12 digits');
      return;
    }
    
    if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
      setError('PIN code must be 6 digits');
      return;
    }
    
    if (formData.workStatus === 'EMPLOYEE' && !formData.employeeName) {
      setError('Employee name is required for employees');
      return;
    }
    
    if (formData.workStatus === 'STUDENT' && !formData.collegeName) {
      setError('College name is required for students');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
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
        role: formData.role,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 4,
      }}
    >
      <Card sx={{ p: 4, maxWidth: 600, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <Typography variant="h4" gutterBottom align="center">
          PG Management
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={3}>
          Create your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
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
                required
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
              <TextField
                fullWidth
                label="Aadhar Image URL"
                name="aadharImageUrl"
                value={formData.aadharImageUrl}
                onChange={handleChange}
                placeholder="Upload Aadhar image and paste URL"
                helperText="Upload your Aadhar image to a cloud storage and paste the URL here"
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <MenuItem value="OWNER">Property Owner</MenuItem>
                <MenuItem value="TENANT">Tenant</MenuItem>
                <MenuItem value="STAFF">Staff</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Register
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
