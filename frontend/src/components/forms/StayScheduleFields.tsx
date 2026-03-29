import {
  Grid,
  TextField,
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import type { ChangeEvent } from 'react';

interface StayScheduleValues {
  checkInDate: string;
  staySchedule: string;
  stayDuration: number;
}

interface Props {
  values: StayScheduleValues;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onStayScheduleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  pricingRates: { DAY: number | null; MONTH: number | null };
}

function computeCheckOutDate(checkInDate: string, staySchedule: string, stayDuration: number): string {
  if (!checkInDate || !staySchedule) return '';
  const date = new Date(checkInDate);
  if (staySchedule === 'DAY') {
    date.setDate(date.getDate() + stayDuration);
  } else {
    date.setMonth(date.getMonth() + stayDuration);
  }
  return date.toISOString().split('T')[0];
}

export default function StayScheduleFields({
  values,
  onChange,
  onStayScheduleChange,
  onIncrement,
  onDecrement,
  pricingRates,
}: Props) {
  const rate = values.staySchedule ? pricingRates[values.staySchedule as 'DAY' | 'MONTH'] : null;
  const checkOutDate = computeCheckOutDate(values.checkInDate, values.staySchedule, values.stayDuration);

  return (
    <>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Check In Date"
          name="checkInDate"
          type="date"
          value={values.checkInDate}
          onChange={onChange}
          required
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: new Date().toISOString().split('T')[0] }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset" required>
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>
            Stay Schedule *
          </FormLabel>
          <RadioGroup row value={values.staySchedule} onChange={onStayScheduleChange}>
            <FormControlLabel value="DAY" control={<Radio />} label="Day Plan" />
            <FormControlLabel value="MONTH" control={<Radio />} label="Monthly Plan" />
          </RadioGroup>
        </FormControl>
      </Grid>

      {values.staySchedule && (
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
            {values.staySchedule === 'DAY' ? 'Number of Days (max 30)' : 'Number of Months (max 12)'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={onDecrement}
              disabled={values.stayDuration <= 1}
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
                {values.stayDuration}
              </Typography>
            </Box>
            <IconButton
              onClick={onIncrement}
              disabled={values.stayDuration >= (values.staySchedule === 'DAY' ? 30 : 12)}
              color="primary"
              size="small"
            >
              <AddCircleOutlineIcon fontSize="large" />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {values.staySchedule === 'DAY' ? 'day(s)' : 'month(s)'}
            </Typography>
          </Box>
        </Grid>
      )}

      {checkOutDate && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Check Out Date"
            value={checkOutDate}
            InputProps={{ readOnly: true }}
            InputLabelProps={{ shrink: true }}
            helperText="Auto-calculated from check-in date and duration"
          />
        </Grid>
      )}

      {values.staySchedule && rate !== null && (
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
              ₹{(rate! * values.stayDuration).toLocaleString('en-IN')}
            </Typography>
            <Typography variant="caption" color="success.dark">
              {values.stayDuration} {values.staySchedule === 'DAY' ? 'day(s)' : 'month(s)'} × ₹
              {rate!.toLocaleString('en-IN')} per {values.staySchedule === 'DAY' ? 'day' : 'month'}
            </Typography>
          </Box>
        </Grid>
      )}
    </>
  );
}
