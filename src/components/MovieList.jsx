import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Pagination,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Edit, Delete, Add, Logout } from "@mui/icons-material";
import { moviesAPI } from "../services/api";
import "../App.css";
import WaveImg from "../assets/wave.svg";

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "#093545",
  maxWidth: 'unset',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column'
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(4),
  flexWrap: "wrap",
  gap: theme.spacing(2),
}));

const MovieCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  overflow: "hidden",
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
  },
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  textAlign: "center",
  maxWidth: "500px",
  margin: "0 auto",
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  background: "linear-gradient(45deg, #00d4aa 30%, #00a085 90%)",
  "&:hover": {
    background: "linear-gradient(45deg, #00a085 30%, #007a63 90%)",
  },
}));

const MovieList = ({ onCreateMovie, onEditMovie, onLogout }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  const fetchMovies = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await moviesAPI.getMovies(currentPage, 8);
      setMovies(response.movies || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteConfirm = async () => {
    try {
      await moviesAPI.deleteMovie(movieToDelete.id);
      setDeleteDialogOpen(false);
      setMovieToDelete(null);

      const updatedResponse = await moviesAPI.getMovies(currentPage, 8);
      const updatedMovies = updatedResponse.movies || [];

      if (updatedMovies.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchMovies();
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      setError("Failed to delete movie. Please try again.");
    }
  };

  const handleDeleteClick = (movie) => {
    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    onLogout();
  };

  if (loading) {
    return (
      <StyledContainer maxWidth={false}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress size={60} sx={{ color: "#00d4aa" }} />
        </Box>
      </StyledContainer>
    );
  }

  return (
      <StyledContainer maxWidth={false}>
        <Box className="md:p-5 p-2.5 flex-1 flex flex-col w-full max-w-[1440px] mx-auto">
          <HeaderBox>
            <Box display="flex" alignItems="center" className="gap-1 md:gap-5">
              <Typography
                className="!text-[24px] md:!text-[32px]"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                My Movies
              </Typography>
              <IconButton
                onClick={onCreateMovie}
                className="!p-0 md:!p-2"
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <Add className="scale-75 md:scale-100" />
              </IconButton>
            </Box>

            <Button
              variant="outlined"
              className="!text-[12px] md:!text-[16px]"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  borderColor: "white",
                  cursor: 'pointer',
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Logout
            </Button>
          </HeaderBox>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, backgroundColor: "rgba(211, 47, 47, 0.2)" }}
          >
            {error}
          </Alert>
        )}

        {movies.length === 0 ? (
          <Box className="flex justify-center items-center flex-1 h-full">
            <EmptyStateBox className="px-2.5 md:px-5 xl:px-10 py-10 md:rounded-2xl rounded-xl">
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Your movie list is empty
            </Typography>
            <Button
              variant="contained"
              onClick={onCreateMovie}
              sx={{
                background: "linear-gradient(45deg, #00d4aa 30%, #00a085 90%)",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(45deg, #00a085 30%, #007a63 90%)",
                },
              }}
            >
              Add a new movie
            </Button>
            </EmptyStateBox>
          </Box>
        ) : (
          <>
            <Box className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
              {movies.map((movie) => {
                return (
                  <Box item key={movie.id} className="w-full">
                    <MovieCard className="md:!rounded-2xl !rounded-xl">
                      <Box sx={{ position: "relative" }}>
                        {movie.poster && (
                          <CardMedia
                            component="img"
                            className="min-h-[400px]"
                            height="300"
                            image={
                              movie.poster
                                ? `${
                                    import.meta.env.VITE_API_URL?.replace(
                                      "/api",
                                      ""
                                    ) || "http://localhost:3001"
                                  }${movie.poster}`
                                : "/placeholder-movie.jpg"
                            }
                            alt={movie.title}
                            sx={{
                              objectFit: "cover",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                            }}
                            onError={(e) => {
                              e.target.src = "/placeholder-movie.jpg";
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            display: "flex",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => onEditMovie(movie)}
                            sx={{
                              backgroundColor: "rgba(0, 0, 0, 0.6)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(movie)}
                            sx={{
                              backgroundColor: "rgba(211, 47, 47, 0.8)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "rgba(211, 47, 47, 1)",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {movie.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {movie.publishing_year || movie.publishingYear}
                        </Typography>
                      </CardContent>
                    </MovieCard>
                  </Box>
                );
              })}
            </Box>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "white",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#00d4aa",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#00a085",
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}

        <StyledFab onClick={onCreateMovie}>
          <Add />
        </StyledFab>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <DialogTitle sx={{ color: "white" }}>Delete Movie</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
              Are you sure you want to delete "{movieToDelete?.title}"? This
              action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              sx={{
                backgroundColor: "#d32f2f",
                color: "white",
                "&:hover": {
                  backgroundColor: "#b71c1c",
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        </Box>
        <img alt="wave image" src={WaveImg} className="w-full min-h-[60px] object-cover" />
      </StyledContainer>
  );
};

export default MovieList;
