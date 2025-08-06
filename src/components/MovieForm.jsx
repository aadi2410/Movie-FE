import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardMedia,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowBack, CloudUpload, Delete } from "@mui/icons-material";
import { moviesAPI } from "../services/api";
import "../App.css";
import WaveImg from "../assets/wave.svg";

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "#093545",
  maxWidth: 'unset',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(4),
  color: "white",
}));

const FormCard = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  maxWidth: "600px",
  margin: "0 auto",
  border: "1px solid rgba(255, 255, 255, 0.2)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: 0,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00d4aa",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#00d4aa",
  color: "white",
  borderRadius: "10px",
  padding: theme.spacing(1.5, 4),
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#00b894",
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: "white",
  borderColor: "rgba(255, 255, 255, 0.5)",
  borderRadius: "10px",
  padding: theme.spacing(1.5, 4),
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "none",
  "&:hover": {
    borderColor: "white",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}));

const UploadArea = styled(Box)(({ theme }) => ({
  border: "2px dashed rgba(255, 255, 255, 0.3)",
  minHeight: 400,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  "&:hover": {
    borderColor: "rgba(255, 255, 255, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}));

const MovieForm = ({ movie, onSave, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: movie?.title || "",
    publishingYear: movie?.publishing_year || "",
    poster: movie?.poster || "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    movie?.poster ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}${movie.poster}` :null
  );
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };

      reader.readAsDataURL(selectedFile);

      setFormData((prev) => ({ ...prev, poster: selectedFile.name }));
      setFile(selectedFile);
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setFormData((prev) => ({
      ...prev,
      poster: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

const validateForm = () => {
  if (!formData.title.trim()) {
    setError("Movie title is required");
    return false;
  }

  if (!formData.publishingYear) {
    setError("Publishing year is required");
    return false;
  }

  const year = parseInt(formData.publishingYear);
  const currentYear = new Date().getFullYear();
  if (isNaN(year) || year < 1800 || year > currentYear + 5) {
    setError(`Publishing year must be between 1800 and ${currentYear + 5}`);
    return false;
  }

  if (!previewImage) {
    setError("Movie poster is required");
    return false;
  }

  return true;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const form = new FormData();
      form.append("title", formData.title.trim());
      form.append("publishingYear", parseInt(formData.publishingYear));
      if (file) {
        form.append("poster", file);
      }

      let response;
      if (isEdit && movie?.id) {
        response = await moviesAPI.updateMovie(movie.id, form, true);
      } else {
        response = await moviesAPI.createMovie(form, true);
      }
      onSave(response);
    } catch (err) {
      console.error("Error saving movie:", err);
      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          setError(err.response.data.message.join(", "));
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError("Failed to save movie. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  console.log({ movie, formData, previewImage });
  return (
    <StyledContainer maxWidth={false}>
      <Box className="p-2.5 md:p-5 flex flex-col flex-1 w-full max-w-[1440px] mx-auto">
        <Header>
        <IconButton
          onClick={onCancel}
          sx={{
            color: "white",
            mr: 2,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography className="!text-[24px] md:!text-[32px]" sx={{ fontWeight: "bold" }}>
          {isEdit ? "Edit" : "Create a new movie"}
        </Typography>
        </Header>

        <Box className="flex-1 flex items-center justify-center">
          <FormCard className="md:rounded-2xl rounded-xl w-full p-2.5 md:p-5">
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                color: "white",
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "start", md: "center" },
                gap: 3,
                mb: 3,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Box sx={{ flex: 1, width: '100%' }}>
                {previewImage ? (
                  <Box sx={{ position: "relative" }}>
                    <Card sx={{ backgroundColor: "transparent" }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={previewImage}
                        alt="Movie poster preview"
                        sx={{
                          objectFit: "cover",
                          borderRadius: "15px",
                          minHeight: 400
                        }}
                      />
                    </Card>
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(244, 67, 54, 0.8)",
                        color: "white",
                        "&:hover": { backgroundColor: "rgba(244, 67, 54, 1)" },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ) : (
                  <UploadArea onClick={handleUploadClick} className="md:!rounded-2xl !rounded-xl">
                    <CloudUpload
                      sx={{
                        fontSize: 48,
                        color: "rgba(255, 255, 255, 0.5)",
                        mb: 2,
                      }}
                    />
                    <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
                      Drop an image here
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      or click to browse
                    </Typography>
                  </UploadArea>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
              </Box>

              <Box sx={{ flex: 1, width: '100%' }} className="flex md:gap-5 gap-3 flex-col">
                <StyledTextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                />

                <StyledTextField
                  fullWidth
                  label="Publishing year"
                  name="publishingYear"
                  type="number"
                  value={formData.publishingYear}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                  inputProps={{
                    min: 1800,
                    max: new Date().getFullYear() + 5,
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "space-between", mt: 4 }}
            >
              <CancelButton
                variant="outlined"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </CancelButton>
              <StyledButton
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isLoading ? "Saving..." : "Submit"}
              </StyledButton>
            </Box>
          </Box>
          </FormCard>
        </Box>
      </Box>

      <img alt="wave image" src={WaveImg} className="w-full min-h-[60px] object-cover" />

    </StyledContainer>
  );
};

export default MovieForm;
