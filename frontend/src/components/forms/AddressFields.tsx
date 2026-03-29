import { Grid, TextField, Typography } from '@mui/material';
import type { ChangeEvent } from 'react';

interface AddressValues {
  streetName: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
}

interface Props {
  values: AddressValues;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function AddressFields({ values, onChange }: Props) {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="text.secondary">
          Permanent Address
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Street Name"
          name="streetName"
          value={values.streetName}
          onChange={onChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="City"
          name="city"
          value={values.city}
          onChange={onChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="District"
          name="district"
          value={values.district}
          onChange={onChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="State"
          name="state"
          value={values.state}
          onChange={onChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="PIN Code"
          name="pinCode"
          value={values.pinCode}
          onChange={onChange}
          placeholder="6 digit PIN code"
          required
        />
      </Grid>
    </>
  );
}
