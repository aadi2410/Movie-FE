import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { authAPI } from "../services/api";
import "../App.css";
import WaveImg from "../assets/wave.svg";

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "#093545",
  padding: theme.spacing(2),
  maxWidth: 'unset',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}));

const LoginCard = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "400px",
  textAlign: "center",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
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
  background: "linear-gradient(45deg, #00d4aa 30%, #00a085 90%)",
  borderRadius: "12px",
  padding: theme.spacing(1.5, 4),
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(45deg, #00a085 30%, #007a63 90%)",
  },
  "&:disabled": {
    background: "rgba(255, 255, 255, 0.2)",
    color: "rgba(255, 255, 255, 0.5)",
  },
}));

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
    } else if (value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(email, password);

      if (response.access_token) {
        localStorage.setItem("authToken", response.access_token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", response.user.email);
        onLogin(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth={false}>
      <Box className="p-2.5 md:p-5 flex-1 flex justify-center items-center">
        <LoginCard className="!p-2.5 md:!p-5 md:rounded-2xl rounded-xl">
        <Box sx={{ mb: 3 }}>
          <Box
            className="!text-[24px] md:!text-[32px] w-[50px] h-[50px] md:w-[80px] md:h-[80px] rounded-full"
            sx={{
              background: "linear-gradient(45deg, #00d4aa 30%, #00a085 90%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            M
          </Box>
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            Sign in
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, backgroundColor: "rgba(211, 47, 47, 0.2)" }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <StyledTextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <StyledTextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <StyledButton
              type="submit"
              fullWidth
              disabled={
                loading ||
                Object.values(errors).some((val) => val) ||
                !email ||
                !password
              }
              size="large"
            >
              {loading ? "Signing in..." : "Login"}
            </StyledButton>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            mt: 2,
          }}
        >
          Demo credentials: 
          <br />
          admin@example.com
          <br />
          password123
        </Typography>
        </LoginCard>
      </Box>
      <img alt="wave image" src={WaveImg} className="w-full min-h-[60px] object-cover" />
    </StyledContainer>
  );
};

export default Login;
