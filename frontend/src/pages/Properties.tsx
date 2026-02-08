import { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function Properties() {
  const [properties] = useState([]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Properties</Typography>
        <Button variant="contained" startIcon={<Add />}>Add Property</Button>
      </Box>

      {properties.length === 0 ? (
        <Card>
          <CardContent>
            <Typography align="center" color="text.secondary">
              No properties found. Click "Add Property" to create your first property.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {properties.map((property: any) => (
            <Grid item xs={12} md={6} key={property.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{property.name}</Typography>
                  <Typography color="text.secondary">{property.address}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}