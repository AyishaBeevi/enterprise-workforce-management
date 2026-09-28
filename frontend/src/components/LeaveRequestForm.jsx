import { useState } from "react";
import { leaveService } from "../services/leaveService";

import Button from "./common/Button";
import ErrorMessage from "./common/ErrorMessage";

function LeaveRequestForm({ onSaved }) {
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
        const response =
        await leaveService.requestLeave(form);

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            data.detail ||
            data.start_date?.[0] ||
            data.end_date?.[0] ||
            data.reason?.[0] ||
            "Failed to submit leave request."
        );
        }

        setForm({
        start_date: "",
        end_date: "",
        reason: "",
        });

        onSaved();
    } catch (error) {
        setError(error.message);
    }
    };

  return (
    <section className="form-card">
      <div className="page-section-header">
        <h2>Request Leave</h2>

        <p>
          Submit a new leave request for approval.
        </p>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Start Date</label>

            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>End Date</label>

            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field full-width">
            <label>Reason</label>

            <textarea
              name="reason"
              placeholder="Explain the reason for your leave..."
              value={form.reason}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit">
            Submit Leave Request
          </Button>
        </div>
      </form>
    </section>
  );
}

export default LeaveRequestForm;