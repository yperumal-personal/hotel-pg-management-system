import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, Button, Typography, Grid, Link } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';

const roles = [
  {
    label: 'Property Owner',
    description: 'Manage properties, rooms, tenants and payments.',
    icon: <BusinessIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    path: '/register/owner',
  },
  {
    label: 'Tenant',
    description: 'Register as a tenant to book a room in a PG.',
    icon: <PersonIcon sx={{ fontSize: 48, color: 'success.main' }} />,
    path: '/register/tenant',
  },
  {
    label: 'Staff',
    description: 'Manage day-to-day PG operations as staff.',
    icon: <BadgeIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
    path: '/register/staff',
  },
];

export default function Register() {
  const navigate = useNavigate();

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
      <Box sx={{ maxWidth: 700, width: '100%', px: 2 }}>
        <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
          Create an Account
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" mb={4}>
          Choose the role that describes you best.
        </Typography>

        <Grid container spacing={3}>
          {roles.map((role) => (
            <Grid item xs={12} sm={4} key={role.label}>
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'primary.main', boxShadow: 4 },
                }}
                onClick={() => navigate(role.path)}
              >
                {role.icon}
                <Typography variant="h6" fontWeight={700} mt={1} mb={1}>
                  {role.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {role.description}
                </Typography>
                <Button variant="outlined" fullWidth onClick={() => navigate(role.path)}>
                  Register
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
