import { useState, useEffect } from 'react';
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
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from '../components/FileUpload';
import { pricingService } from '../services/pricingService';

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
    checkInDate: '',
    staySchedule: '',
    stayDuration: 1,
  });
  const [pricingRates, setPricingRates] = useState<{ DAY: number | null; MONTH: number | null }>({ DAY: null, MONTH: null });
  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      pricingService.getPricing('DAY'),
      pricingService.getPricing('MONTH'),
    ]).then(([dayRes, monthRes]) => {
      setPricingRates({ DAY: dayRes.data.costPerUnit, MONTH: monthRes.data.costPerUnit });
    }).catch(() => {
      setError('Failed to load pricing. Please refresh.');
    });
  }, []);

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

  const handleStayScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, staySchedule: e.target.value, stayDuration: 1 });
  };

  const handleIncrementDuration = () => {
    const max = formData.staySchedule === 'DAY' ? 30 : 12;
    if (formData.stayDuration < max) {
      setFormData({ ...formData, stayDuration: formData.stayDuration + 1 });
    }
  };

  const handleDecrementDuration = () => {
    if (formData.stayDuration > 1) {
      setFormData({ ...formData, stayDuration: formData.stayDuration - 1 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Password validation
    if (formData.role === 'OWNER') {
      if (!formData.password) {
        setError('Password is required for owners');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    } else if (formData.password) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
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

    if (formData.role === 'TENANT') {
      if (!formData.aadharNo) {
        setError('Aadhar number is required');
        return;
      }

      if (!formData.gender) {
        setError('Gender is required');
        return;
      }

      if (!formData.maritalStatus) {
        setError('Marital status is required');
        return;
      }

      if (!formData.workStatus) {
        setError('Work status is required');
        return;
      }

      if (!formData.streetName || !formData.city || !formData.district || !formData.state || !formData.pinCode) {
        setError('All address fields are required');
        return;
      }

      if (!formData.checkInDate) {
        setError('Check-in date is required');
        return;
      }

      if (!formData.staySchedule) {
        setError('Stay schedule is required');
        return;
      }

      if (!formData.stayDuration || formData.stayDuration < 1) {
        setError('Stay duration must be at least 1');
        return;
      }
    }

    try {
      const effectivePassword = formData.password || formData.phone;
      await register({
        email: formData.email,
        password: effectivePassword,
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
        checkInDate: formData.checkInDate || undefined,
        staySchedule: formData.staySchedule || undefined,
        stayDuration: formData.stayDuration,
      });
      setSuccessOpen(true);
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

            {/* Role — always first */}
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

            {/* Password — always second */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={formData.role === 'OWNER'}
                helperText={formData.role === 'TENANT' ? 'Optional — phone number will be used as password if left blank' : ''}
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
                required={formData.role === 'OWNER'}
              />
            </Grid>

            {/* Common fields for all roles */}
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

            {/* Tenant-only fields */}
            {formData.role === 'TENANT' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Aadhar Number"
                    name="aadharNo"
                    value={formData.aadharNo}
                    onChange={handleChange}
                    placeholder="12 digit Aadhar number"
                    required
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
                    required
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
                    required
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
                    required
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
                      required
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
                      required
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
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
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
                    required
                  />
                </Grid>

                {/* Check In Date */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Check In Date"
                    name="checkInDate"
                    type="date"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  />
                </Grid>

                {/* Stay Schedule */}
                <Grid item xs={12}>
                  <FormControl component="fieldset" required>
                    <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>
                      Stay Schedule *
                    </FormLabel>
                    <RadioGroup
                      row
                      value={formData.staySchedule}
                      onChange={handleStayScheduleChange}
                    >
                      <FormControlLabel value="DAY" control={<Radio />} label="Day Plan" />
                      <FormControlLabel value="MONTH" control={<Radio />} label="Monthly Plan" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Duration Counter */}
                {formData.staySchedule && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
                      {formData.staySchedule === 'DAY' ? 'Number of Days (max 30)' : 'Number of Months (max 12)'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        onClick={handleDecrementDuration}
                        disabled={formData.stayDuration <= 1}
                        color="primary"
                        size="small"
                      >
                        <RemoveCircleOutlineIcon fontSize="large" />
                      </IconButton>
                      <Box
                        sx={{
                          minWidth: 64,
                          textAlign: 'center',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          py: 0.75,
                          px: 2,
                        }}
                      >
                        <Typography variant="h6" fontWeight={600}>
                          {formData.stayDuration}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={handleIncrementDuration}
                        disabled={formData.stayDuration >= (formData.staySchedule === 'DAY' ? 30 : 12)}
                        color="primary"
                        size="small"
                      >
                        <AddCircleOutlineIcon fontSize="large" />
                      </IconButton>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {formData.staySchedule === 'DAY' ? 'day(s)' : 'month(s)'}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Estimated Cost Display */}
                {formData.staySchedule && pricingRates[formData.staySchedule as 'DAY' | 'MONTH'] !== null && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'success.light',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'success.main',
                      }}
                    >
                      <Typography variant="body2" color="success.dark" fontWeight={500}>
                        Estimated Stay Cost
                      </Typography>
                      <Typography variant="h5" color="success.dark" fontWeight={700}>
                        ₹{(pricingRates[formData.staySchedule as 'DAY' | 'MONTH']! * formData.stayDuration).toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" color="success.dark">
                        {formData.stayDuration}{' '}
                        {formData.staySchedule === 'DAY' ? 'day(s)' : 'month(s)'}
                        {' '}×{' '}
                        ₹{pricingRates[formData.staySchedule as 'DAY' | 'MONTH']!.toLocaleString('en-IN')}
                        {' '}per {formData.staySchedule === 'DAY' ? 'day' : 'month'}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </>
            )}
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

      {/* Registration Success Modal */}
      <Dialog open={successOpen} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={700}>
            Registration Successful!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="body1" color="text.secondary">
            Your account has been created successfully.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please log in to access the portal.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ px: 5 }}
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
