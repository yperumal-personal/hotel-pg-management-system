import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';

interface FileUploadProps {
  label?: string;
  value?: string;
  onChange: (base64: string) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  previewWidth?: number;
  previewHeight?: number;
}

export default function FileUpload({
  label = 'Upload File',
  value = '',
  onChange,
  onError,
  accept = 'image/*,application/pdf',
  maxSizeMB = 5,
  previewWidth = 120,
  previewHeight = 80,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);

  // Detect file type from base64 string when value changes
  const detectFileType = (base64: string): 'image' | 'pdf' | null => {
    if (!base64) return null;
    if (base64.includes('data:application/pdf')) return 'pdf';
    if (base64.includes('data:image/')) return 'image';
    return 'image'; // Default to image for backward compatibility
  };

  const currentFileType = fileType || detectFileType(value);

  const handleFileChange = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    
    if (!isImage && !isPdf) {
      onError?.('Please upload an image or PDF file');
      return;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onError?.(`File size should be less than ${maxSizeMB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
      setFileType(isImage ? 'image' : 'pdf');
      onError?.(''); // Clear any previous errors
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileType(null);
  };

  const inputId = `file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      {!value ? (
        <Paper
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: '2px dashed',
            borderColor: isDragging ? 'primary.main' : 'grey.400',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: isDragging ? 'action.hover' : 'background.paper',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
          onClick={() => document.getElementById(inputId)?.click()}
        >
          <input
            id={inputId}
            type="file"
            accept={accept}
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            Drag and drop file here
          </Typography>
          <Typography variant="body2" color="text.secondary">
            or click to browse (Images or PDF, Max {maxSizeMB}MB)
          </Typography>
        </Paper>
      ) : (
        <Paper
          sx={{
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 2,
            p: 2,
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {currentFileType === 'pdf' ? (
              <Box
                sx={{
                  width: previewWidth,
                  height: previewHeight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'error.light',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                }}
              >
                <PdfIcon sx={{ fontSize: 48, color: 'error.dark' }} />
              </Box>
            ) : (
              <Box
                component="img"
                src={value}
                alt="Preview"
                sx={{
                  width: previewWidth,
                  height: previewHeight,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                }}
              />
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="success.main" gutterBottom>
                ✓ File uploaded successfully
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentFileType === 'pdf' ? 'PDF document ready' : 'Image ready for submission'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleRemove}
            >
              Remove
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}