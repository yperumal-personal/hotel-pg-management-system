import { Grid, TextField } from '@mui/material';
import type { ChangeEvent } from 'react';

interface PersonalInfoValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Props {
  values: PersonalInfoValues;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  phoneHelperText?: string;
}

export default function PersonalInfoFields({ values, onChange, phoneHelperText }: Props) {
  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={values.firstName}
          onChange={onChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={values.lastName}
          onChange={onChange}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={values.phone}
          onChange={onChange}
          placeholder="10 digit number"
          required
          helperText={phoneHelperText}
        />
      </Grid>
    </>
  );
}
