import React, { useState, useEffect } from "react";
import '/offer.css';
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function GenerateOfferLetter() {
  const [offerLetterId, setOfferLetterId] = useState("");
  const [wordDocumentUrl, setWordDocumentUrl] = useState(null);
  const [existingLetters, setExistingLetters] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    start_date: "",
    end_date: "",
    generated_on: "", // New field
  });

  useEffect(() => {
    // Set current date in YYYY-MM-DD format on component mount
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;

    setFormData((prevData) => ({ ...prevData, generated_on: formattedToday }));

    // Fetch existing offer letters
    fetch("http://localhost:8000/offer_letters/")
      .then(res => res.json())
      .then(data => setExistingLetters(data))
      .catch(err => console.error("Error fetching names:", err));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitOfferLetter = async () => {
    try {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      const formattedStartDate = `${startDate.getMonth() + 1}-${startDate.getDate()}-${startDate.getFullYear()}`;
      const formattedEndDate = `${endDate.getMonth() + 1}-${endDate.getDate()}-${endDate.getFullYear()}`;

      const response = await fetch("http://localhost:8000/create_offer_letter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          duration: formData.duration,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          generated_on: formData.generated_on,
        }),
      });

      if (!response.ok) throw new Error("Failed to save offer letter");

      const result = await response.json();
      alert(`Offer Letter created successfully with ID: ${result.id}`);
      setOfferLetterId(result.id.toString());
    } catch (err) {
      console.error("Error submitting offer letter:", err);
      alert("Error saving offer letter.");
    }
  };

  const generateOfferLetter = async () => {
    try {
      const response = await fetch("http://localhost:8000/generate_offer_letter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offer_letter_id: offerLetterId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate offer letter");
      }

      const wordBlob = await response.blob();
      const wordUrl = URL.createObjectURL(wordBlob);
      setWordDocumentUrl(wordUrl);

    } catch (error) {
      console.error("Error generating offer letter:", error);
      alert("An error occurred while generating the offer letter.");
    }
  };

  return (
    <div className="container">
      <h1 className="header">Internship Offer Letter System</h1>
      <div className="form-wrapper">
        <div className="content">
          <h2 className="form-heading">Recruiter Input Form</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Candidate Name"
            className="input-field"
          />
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="Duration (in months)"
            className="input-field"
            min="1"
          />
          <ReactDatePicker
            selected={formData.start_date ? new Date(formData.start_date) : null}
            onChange={(date) =>
              setFormData({ ...formData, start_date: date ? date.toISOString().split("T")[0] : "" })
            }
            className="input-field"
            placeholderText="Select Start Date"
            isClearable
          />
          <ReactDatePicker
            selected={formData.end_date ? new Date(formData.end_date) : null}
            onChange={(date) =>
              setFormData({ ...formData, end_date: date ? date.toISOString().split("T")[0] : "" })
            }
            className="input-field"
            placeholderText="Select End Date"
            isClearable
          />
          <ReactDatePicker
            selected={formData.generated_on ? new Date(formData.generated_on) : null}
            onChange={(date) =>
              setFormData({ ...formData, generated_on: date ? date.toISOString().split("T")[0] : "" })
            }
            className="input-field"
            placeholderText="Generated On"
            isClearable
          />
          <button type="submit" onClick={submitOfferLetter} className="generate-button">
            Save Offer Letter Data
          </button>
        </div>

        <div className="content">
          <h2 className="form-heading">Generate Offer Letter</h2>
          <select
            onChange={(e) => {
              const selectedId = e.target.value;
              const selected = existingLetters.find(item => item.id.toString() === selectedId);
              setOfferLetterId(selectedId);
            }}
            className="input-field"
          >
            <option value="">Select a Candidate</option>
            {existingLetters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={offerLetterId}
            onChange={(e) => setOfferLetterId(e.target.value)}
            placeholder="Enter Offer Letter ID"
            className="input-field"
          />
          <button onClick={generateOfferLetter} className="generate-button">
            Generate Offer Letter
          </button>

          {wordDocumentUrl && (
            <div className="links-container">
              <a href={wordDocumentUrl} target="_blank" rel="noopener noreferrer" className="view-link">
                Open Offer Letter (Word)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerateOfferLetter;
