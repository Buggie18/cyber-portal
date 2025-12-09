// SecurityPredictionPage.jsx
import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  useTheme
} from "@mui/material";
import { Security, Psychology, Assessment, Warning, CheckCircle } from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const SecurityPredictionPage = () => {
  const [formData, setFormData] = useState({
    server_id: "",
    firewall_id: "",
    user: "",
    action_type: "",
    policy_name: "",
    policy_rule: "",
    status: "",
    ml_risk_score: 0,
    log_source: "",
    blockchain_tx: "",
    notes: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);

    // Transform ML score to float
    const payload = {
      data: [
        formData.server_id,
        formData.firewall_id,
        formData.user,
        formData.action_type,
        formData.policy_name,
        formData.policy_rule,
        formData.status,
        parseFloat(formData.ml_risk_score),
        formData.log_source,
        formData.blockchain_tx,
        formData.notes
      ]
    };

    try {
      const res = await fetch(
        "https://nsut-ac.us-east-2.aws.modelbit.com/v1/predict_server_security/latest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const result = await res.json();
      setPrediction(result.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const formatFieldName = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Chart data preparation functions
  const getRadarChartData = (prediction) => {
    const mlScore = parseFloat(prediction.ml_anomaly_score);
    const ruleScore = parseFloat(prediction.rule_score);
    const combinedScore = parseFloat(prediction.combined_score);
    
    return {
      labels: ['ML Anomaly Detection', 'Rule-based Analysis', 'Combined Score', 'Risk Assessment', 'Alert Status'],
      datasets: [
        {
          label: 'Security Metrics',
          data: [
            mlScore * 100,
            ruleScore * 100,
            combinedScore * 100,
            prediction.risk_level === 'High' ? 80 : prediction.risk_level === 'Medium' ? 50 : 20,
            prediction.active_alerts.length * 20
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
        }
      ]
    };
  };

  const getLineChartData = (prediction) => {
    return {
      labels: ['ML Anomaly', 'Rule-based', 'Combined', 'Risk Level', 'Alert Count'],
      datasets: [
        {
          label: 'Security Scores',
          data: [
            parseFloat(prediction.ml_anomaly_score) * 100,
            parseFloat(prediction.rule_score) * 100,
            parseFloat(prediction.combined_score) * 100,
            prediction.risk_level === 'High' ? 80 : prediction.risk_level === 'Medium' ? 50 : 20,
            Math.min(prediction.active_alerts.length * 20, 100)
          ],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Security Metrics Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Security Metrics Radar'
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #1a1f3a 0%, #0f1629 50%, #0a0e27 100%)"
          : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
        backgroundAttachment: "fixed",
        py: 6,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.mode === "dark"
            ? "radial-gradient(circle at 20% 50%, rgba(74, 144, 226, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)"
            : "radial-gradient(circle at 20% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(66, 165, 245, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            background: theme.palette.mode === "dark"
              ? "rgba(26, 31, 58, 0.85)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(15px)",
            border: theme.palette.mode === "dark"
              ? "1px solid rgba(74, 144, 226, 0.2)"
              : "1px solid rgba(25, 118, 210, 0.2)",
            borderRadius: 4,
          }}
        >
        {/* Header */}
        <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            <Security />
          </Avatar>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{
              background: theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #4a90e2 0%, #00d4ff 100%)"
                : "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Server Security Prediction
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Analyze security risks using machine learning and rule-based systems
          </Typography>
        </Stack>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {Object.keys(formData).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={formatFieldName(key)}
                  type={key === "ml_risk_score" ? "number" : "text"}
                  inputProps={{
                    step: key === "ml_risk_score" ? "0.01" : undefined,
                    min: key === "ml_risk_score" ? 0 : undefined,
                    max: key === "ml_risk_score" ? 1 : undefined,
                  }}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  fullWidth
                  required={key !== "blockchain_tx" && key !== "notes"}
                  helperText={
                    key === "ml_risk_score" 
                      ? "Enter a value between 0 and 1" 
                      : key === "blockchain_tx" || key === "notes" 
                        ? "Optional field" 
                        : ""
                  }
                />
              </Grid>
            ))}
          </Grid>

          <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Psychology />}
              sx={{ minWidth: 200 }}
            >
              {loading ? "Analyzing..." : " Predict Security"}
            </Button>
          </Stack>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {/* Prediction Results */}
        {prediction && (
          <Card elevation={3} sx={{ mt: 4 }}>
            <CardContent>
              <Stack alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: getRiskLevelColor(prediction.risk_level) === 'error' ? 'error.main' : 
                            getRiskLevelColor(prediction.risk_level) === 'warning' ? 'warning.main' : 
                            'success.main',
                    width: 48,
                    height: 48
                  }}
                >
                  {getRiskLevelColor(prediction.risk_level) === 'error' ? <Warning /> : <CheckCircle />}
                </Avatar>
                <Typography variant="h5" fontWeight={600}>
                  📊 Prediction Results
                </Typography>
              </Stack>

              {/* Charts Section - Moved to top */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                   Security Analysis Visualization
                </Typography>
                
                <Grid container spacing={3} alignItems="stretch">
                  {/* Radar Chart */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '400px' }}>
                      <CardContent sx={{ height: '100%', p: 2 }}>
                        <Box sx={{ height: '100%' }}>
                          <Radar 
                            data={getRadarChartData(prediction)} 
                            options={radarOptions}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Line Chart */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: '400px' }}>
                      <CardContent sx={{ height: '100%', p: 2 }}>
                        <Box sx={{ height: '100%' }}>
                          <Line 
                            data={getLineChartData(prediction)} 
                            options={lineChartOptions}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={3} justifyContent="center">
                {/* Risk Level */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        🚨 Risk Level
                      </Typography>
                      <Chip 
                        label={prediction.risk_level} 
                        color={getRiskLevelColor(prediction.risk_level)}
                        size="large"
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Scores */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        📈 Security Scores
                      </Typography>
                      <Stack spacing={1} alignItems="center">
                        <Typography variant="body2">
                          <strong>ML Anomaly:</strong> {prediction.ml_anomaly_score}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Rule-based:</strong> {prediction.rule_score}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Combined:</strong> {prediction.combined_score}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Message */}
                <Grid item xs={12} md={8}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        💬 Analysis Message
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {prediction.message}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Active Alerts */}
                {prediction.active_alerts.length > 0 && (
                  <Grid item xs={12} md={8}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                          ⚠️ Active Alerts
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                          {prediction.active_alerts.map((alert, index) => (
                            <Chip 
                              key={index} 
                              label={alert} 
                              color="error" 
                              variant="outlined"
                              icon={<Warning />}
                            />
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Recommendations */}
                <Grid item xs={12} md={8}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        💡 Recommendations
                      </Typography>
                      <Stack spacing={1} alignItems="center">
                        {prediction.recommendations.map((rec, index) => (
                          <Typography key={index} variant="body2" sx={{ pl: 2, borderLeft: 2, borderColor: 'primary.main', textAlign: 'left', width: '100%', maxWidth: '400px' }}>
                            {rec}
                          </Typography>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        </Paper>
      </Container>
    </Box>
  );
};

export default SecurityPredictionPage;
