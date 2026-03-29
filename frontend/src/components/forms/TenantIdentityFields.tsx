import { Grid, TextField, MenuItem } from '@mui/material';
import type { ChangeEvent } from 'react';
import FileUpload from '../FileUpload';

interface TenantIdentityValues {
  aadharNo: string;
  aadharImageUrl: string;
  gender: string;
  maritalStatus: string;
  workStatus: string;
  employeeName: string;
  collegeName: string;
}

interface Props {
  values: TenantIdentityValues;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAadharImageChange: (base64: string) => void;
  onError: (msg: string) => void;
}

export default function TenantIdentityFields({ values, onChange, onAadharImageChange, onError }: Props) {
  return (
    <>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Aadhar Number"
          name="aadharNo"
          value={values.aadharNo}
          onChange={onChange}
          placeholder="12 digit Aadhar number"
          required
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          label="Aadhar Image Upload"
          value={values.aadharImageUrl}
          onChange={onAadharImageChange}
          onError={onError}
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
          value={values.gender}
          onChange={onChange}
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
          value={values.maritalStatus}
          onChange={onChange}
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
          value={values.workStatus}
          onChange={onChange}
          required
        >
          <MenuItem value="">Select Work Status</MenuItem>
          <MenuItem value="EMPLOYEE">Employee</MenuItem>
          <MenuItem value="STUDENT">Student</MenuItem>
        </TextField>
      </Grid>
      {values.workStatus === 'EMPLOYEE' && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Employee Name (Company)"
            name="employeeName"
            value={values.employeeName}
            onChange={onChange}
            placeholder="Enter your company name"
            required
          />
        </Grid>
      )}
      {values.workStatus === 'STUDENT' && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="College Name"
            name="collegeName"
            value={values.collegeName}
            onChange={onChange}
            placeholder="Enter your college name"
            required
          />
        </Grid>
      )}
    </>
  );
}
