// SecurityPredictionPage.jsx
import React, { useState } from "react";

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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Server Security Prediction</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block font-semibold mb-1">
              {key.replace("_", " ").toUpperCase()}
            </label>
            <input
              type={key === "ml_risk_score" ? "number" : "text"}
              step={key === "ml_risk_score" ? "0.01" : undefined}
              min={key === "ml_risk_score" ? 0 : undefined}
              max={key === "ml_risk_score" ? 1 : undefined}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required={key !== "blockchain_tx" && key !== "notes"}
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict Security"}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {prediction && (
        <div className="p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-bold mb-2">Prediction Result</h2>
          <p>
            <strong>Risk Level:</strong> {prediction.risk_level}
          </p>
          <p>
            <strong>Message:</strong> {prediction.message}
          </p>
          <p>
            <strong>Scores:</strong> ML={prediction.ml_anomaly_score}, Rule={prediction.rule_score}, Combined={prediction.combined_score}
          </p>
          {prediction.active_alerts.length > 0 && (
            <p>
              <strong>Alerts:</strong> {prediction.active_alerts.join(", ")}
            </p>
          )}
          <p>
            <strong>Recommendations:</strong>{" "}
            {prediction.recommendations.join(" | ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default SecurityPredictionPage;
