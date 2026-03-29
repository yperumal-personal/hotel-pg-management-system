import { Box, Card, Button, Typography, Alert, Link, Grid, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SuccessModal from './SuccessModal';

interface Props {
  title: string;
  subtitle: string;
  error: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  submitLabel: string;
  successOpen: boolean;
  onSuccessLogin: () => void;
  children: React.ReactNode;
}

export default function RegisterFormWrapper({
  title,
  subtitle,
  error,
  loading,
  onSubmit,
  onBack,
  submitLabel,
  successOpen,
  onSuccessLogin,
  children,
}: Props) {
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
        <Button variant="text" size="small" onClick={onBack} sx={{ mb: 1, pl: 0 }}>
          ← Back to Role Selection
        </Button>

        <Typography variant="h5" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {subtitle}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            {children}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : submitLabel}
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

      <SuccessModal open={successOpen} onLogin={onSuccessLogin} />
    </Box>
  );
}
