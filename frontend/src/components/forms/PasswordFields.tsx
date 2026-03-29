import { Grid, TextField } from '@mui/material';
import type { ChangeEvent } from 'react';

interface PasswordValues {
  password: string;
  confirmPassword: string;
}

interface Props {
  values: PasswordValues;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  helperText?: string;
}

export default function PasswordFields({ values, onChange, required = true, helperText }: Props) {
  return (
    <>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          required={required}
          helperText={helperText}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={onChange}
          required={required}
        />
      </Grid>
    </>
  );
}
