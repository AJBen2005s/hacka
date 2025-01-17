import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const inspectionForms = {
  Classroom: [
    { id: 1, question: "Housekeeping: Cleanliness, waste disposal, surface dust levels", field: "housekeeping" },
    { id: 2, question: "Floors, Aisles & Exits: Clear and unobstructed", field: "floorsAislesExits" },
    { id: 3, question: "Classroom Furniture: Good condition, no safety hazards", field: "classroomFurniture" },
    { id: 4, question: "Lighting: Functioning lights, need for bulb replacement", field: "lighting" },
    { id: 5, question: "Electrical Safety: Condition of cords, plugs, outlets", field: "electricalSafety" },
    { id: 6, question: "Fire Safety: Unobstructed sprinkler heads, ceiling tiles installed", field: "fireSafety" },
    { id: 7, question: "Security/Personal Safety: Functional locks, proper window coverings", field: "securitySafety" },
    { id: 8, question: "First Aid Cabinet: Accessible and well-stocked", field: "firstAidCabinet" }
  ],
  Office: [
    { id: 1, question: "Housekeeping: Cleanliness, garbage disposal, low dust", field: "housekeeping" },
    { id: 2, question: "Office Furniture and Equipment: Good condition, no safety hazards", field: "furnitureEquipment" },
    { id: 3, question: "Floors, Aisles & Exits: Clean and clear", field: "floorsAislesExits" },
    { id: 4, question: "Lighting: Functional lights, no need for replacement", field: "lighting" },
    { id: 5, question: "Electrical Safety: Condition of cords, plugs, outlets", field: "electricalSafety" },
    { id: 6, question: "Security/Personal Safety: Valuables handling, evacuation plans", field: "securityPersonalSafety" },
    { id: 7, question: "Fire Safety: Sprinkler heads unobstructed, extinguisher inspections", field: "fireSafety" },
    { id: 8, question: "First Aid Cabinet: Accessible and well-stocked", field: "firstAidCabinet" }
  ],
  Shop: [
    { id: 1, question: "Aisles and Passages: Clear and well-marked", field: "aislesPassages" },
    { id: 2, question: "Floor Surface: Clean, no slipping risks", field: "floorSurface" },
    { id: 3, question: "Walls/Partitions: Clean and used for visual controls", field: "wallsPartitions" },
    { id: 4, question: "Windows: Clean and unobstructed", field: "windows" },
    { id: 5, question: "Columns and Ceiling: Clean and properly identified", field: "columnsCeiling" },
    { id: 6, question: "Lighting: Properly located, adequate for tasks", field: "lighting" },
    { id: 7, question: "Electrical Apparatus: Clean, accessible panels", field: "electricalApparatus" }
  ],
  Maintenance: [
    { id: 1, question: "General Safety: Cleanliness, waste disposal, PPE, chemical safety", field: "generalSafety" },
    { id: 2, question: "Floors, Aisles & Exits: Clear and unobstructed", field: "floorsAislesExits" },
    { id: 3, question: "Lighting: Proper lighting and bulb replacement", field: "lighting" },
    { id: 4, question: "Shelving: Secure, proper storage, safety hazards", field: "shelving" },
    { id: 5, question: "Electrical Safety: Safe cords, plugs, sockets, extension cords", field: "electricalSafety" }
  ],
  Laboratory: [
    { id: 1, question: "Signage: Visible emergency contact, safety, operating hazard signs", field: "signage" },
    { id: 2, question: "General Lab Safety: Tidy work areas, well-stocked first aid kit", field: "labSafety" },
    { id: 3, question: "Emergency Evacuation: Unobstructed exits, evacuation procedures", field: "emergencyEvacuation" },
    { id: 4, question: "Fire Extinguishers: Proper type, inspection status", field: "fireExtinguishers" },
    { id: 5, question: "Employee Training: Adequate safety training and manuals", field: "employeeTraining" },
    { id: 6, question: "Personal Protective Equipment: Proper use of PPE", field: "ppe" },
    { id: 7, question: "Chemical Storage and Handling: Correct labeling and storage", field: "chemicalStorage" },
    { id: 8, question: "Safety Showers and Eye Wash Stations: Operational and inspected", field: "safetyShowers" },
    { id: 9, question: "Fume Hoods: Properly functioning and uncluttered", field: "fumeHoods" },
    { id: 10, question: "Flammable Storage Cabinets: Proper condition and storage", field: "flammableStorage" },
    { id: 11, question: "Chemical Waste: Proper labeling and disposal procedures", field: "chemicalWaste" },
    { id: 12, question: "Sharps and Biological Waste: Proper disposal containers", field: "sharpsBiologicalWaste" }
  ],
  Culinary: [
    { id: 1, question: "General Safety: Cleanliness, waste disposal, appropriate PPE", field: "generalSafety" },
    { id: 2, question: "Work Environment: No infestations, clean dumpster areas", field: "workEnvironment" },
    { id: 3, question: "Floors, Aisles & Exits: Clear, clean aisles, proper storage", field: "floorsAislesExits" },
    { id: 4, question: "Lighting: Proper lighting for tasks", field: "lighting" },
    { id: 5, question: "Shelving: Secure shelves, proper storage", field: "shelving" },
    { id: 6, question: "Stacked Material: Stable and orderly storage", field: "stackedMaterial" },
    { id: 7, question: "Electrical Safety: Proper maintenance of electrical equipment", field: "electricalSafety" },
    { id: 8, question: "Machinery: Safety guards, secure mounting, maintenance", field: "machinery" },
    { id: 9, question: "Gas/Fire Safety: Training, fire extinguisher inspections", field: "gasFireSafety" }
  ]
};



const Form = () => {
  const [formType, setFormType] = useState("Classroom");
  const [room, setRoom] = useState(""); // State for room field
  const [roomNumbers, setRoomNumbers] = useState([]); // State for room numbers
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch room numbers from the API
    axios
      .get("http://localhost:3000/form/rooms/")
      .then((response) => {
        setRoomNumbers(response.data); // Assuming the response is an array of room numbers
      })
      .catch((error) => {
        console.error("Error fetching room numbers:", error);
      });
  }, []);

  const handleTypeChange = (e) => {
    setFormType(e.target.value);
    setFormData({});
    setErrors({});
    setIsFormValid(false);
  };

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    setErrors({ ...errors, [field]: false });
  };

  const validateForm = () => {
    let isValid = true;
    let validationErrors = {};

    // Validate room field
    if (!room) {
      isValid = false;
      validationErrors.room = "*Room field is required";
    }

    // Validate inspection fields
    inspectionForms[formType].forEach((field) => {
      if (!formData[field.field]) {
        isValid = false;
        validationErrors[field.field] = "*This field is required";
      }

      if (formData[field.field] === "No") {
        if (
          !formData[`${field.field}Deficiency`] ||
          !formData[`${field.field}Action`] ||
          !formData[`${field.field}Person`] ||
          !formData[`${field.field}Date`]
        ) {
          isValid = false;
          validationErrors[field.field] = "Please fill out all fields";
        }
      }
    });

    setErrors(validationErrors);
    setIsFormValid(isValid);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Post data to backend
    axios
      .post("http://localhost:3000/form/upload", {
        type: formType,
        room: room,
        data: formData
      })
      .then((response) => {
        alert("Inspection submitted successfully!");
        navigate("/success"); // Navigate to a success page if needed
      })
      .catch((error) => {
        console.error("Error submitting the inspection:", error);
        alert("Failed to submit inspection. Please try again.");
      });
  };

  useEffect(() => {
    validateForm();
  }, [formData, room]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-lg">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-700">Create Inspection</h1>
        </header>
        <form onSubmit={handleSubmit} className="text-center">
          {/* Room Input Field */}
          <div className="mb-6">
            <label htmlFor="room" className="block text-lg font-bold text-gray-700 mb-2">
              Room Number
            </label>
            <select
              id="room"
              value={room}
              onChange={handleRoomChange}
              className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Room Number</option>
              {roomNumbers.map((roomNumber, index) => (
                <option key={index} value={roomNumber}>
                  {roomNumber}
                </option>
              ))}
            </select>
            {errors.room && (
              <div className="text-red-600 text-sm font-bold mt-2">{errors.room}</div>
            )}
          </div>

          {/* Inspection Type Dropdown */}
          <div className="mb-6">
            <label htmlFor="formType" className="block text-lg font-bold text-gray-700 mb-2">
              Inspection Type
            </label>
            <select
              id="formType"
              value={formType}
              onChange={handleTypeChange}
              className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Classroom">Classroom</option>
              <option value="Office">Office</option>
              <option value="Shop">Shop</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Culinary">Culinary</option>
            </select>
          </div>

          {/* Inspection Fields */}
          {inspectionForms[formType].map((field) => (
            <div key={field.id} className="mb-6">
              <label className="block text-lg font-bold text-gray-700 mb-2 text-center">
                {field.question}
              </label>
              <div className="flex justify-center">
                {["Yes", "No", "N/A"].map((answer) => (
                  <label
                    key={answer}
                    className={`btn ${formData[field.field] === answer ? `btn-${answer === "Yes" ? "success" : answer === "No" ? "danger" : "secondary"} active` : "btn-outline-secondary"}`}
                    role="button"
                  >
                    <input
                      type="radio"
                      name={field.field}
                      value={answer}
                      checked={formData[field.field] === answer}
                      onChange={(e) => handleChange(e, field.field)}
                      className="d-none"
                      required
                    />
                    {answer}
                  </label>
                ))}
              </div>

              {errors[field.field] && (
                <div className="text-red-600 text-sm font-bold mt-2">{errors[field.field]}</div>
              )}

              {formData[field.field] === "No" && (
                <div className="space-y-4 mt-4">
                  <div className="flex items-center">
                    <label htmlFor={`${field.field}Deficiency`} className="text-sm font-semibold text-gray-600">Deficiency:</label>
                    <input
                      type="text"
                      id={`${field.field}Deficiency`}
                      value={formData[`${field.field}Deficiency`] || ""}
                      onChange={(e) => handleChange(e, `${field.field}Deficiency`)}
                      className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <label htmlFor={`${field.field}Action`} className="text-sm font-semibold text-gray-600">Action:</label>
                    <input
                      type="text"
                      id={`${field.field}Action`}
                      value={formData[`${field.field}Action`] || ""}
                      onChange={(e) => handleChange(e, `${field.field}Action`)}
                      className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <label htmlFor={`${field.field}Person`} className="text-sm font-semibold text-gray-600">Person Responsible:</label>
                    <input
                      type="text"
                      id={`${field.field}Person`}
                      value={formData[`${field.field}Person`] || ""}
                      onChange={(e) => handleChange(e, `${field.field}Person`)}
                      className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <label htmlFor={`${field.field}Date`} className="text-sm font-semibold text-gray-600">Date:</label>
                    <input
                      type="date"
                      id={`${field.field}Date`}
                      value={formData[`${field.field}Date`] || ""}
                      onChange={(e) => handleChange(e, `${field.field}Date`)}
                      className="w-full p-3 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 text-lg font-bold rounded-lg mt-6 focus:outline-none ${
              isFormValid ? "bg-blue-500" : "bg-gray-500 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;