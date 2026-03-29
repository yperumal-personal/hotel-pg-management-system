import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface Props {
  open: boolean;
  onLogin: () => void;
}

export default function SuccessModal({ open, onLogin }: Props) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
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
        <Button variant="contained" size="large" onClick={onLogin} sx={{ px: 5 }}>
          Go to Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
