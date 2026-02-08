import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Home, MeetingRoom, People, Payment } from '@mui/icons-material';

export default function Dashboard() {
  const stats = [
    { title: 'Total Properties', value: '0', icon: <Home fontSize="large" />, color: '#1976d2' },
    { title: 'Total Rooms', value: '0', icon: <MeetingRoom fontSize="large" />, color: '#2e7d32' },
    { title: 'Active Tenants', value: '0', icon: <People fontSize="large" />, color: '#ed6c02' },
    { title: 'Pending Payments', value: '₹0', icon: <Payment fontSize="large" />, color: '#d32f2f' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>{stat.title}</Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}