import { Link } from 'react-router-dom'; 
import { useForm } from "react-hook-form";

export default function Signup() {
  // API URL
  const apiUrl = "http://localhost:3000/users/signup"; // Adjust endpoint to match your API.

  // react-hook-form setup
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Add new user to API
  function registerUser(data) {
    console.log("Form Data:", data);  // Debugging step: log the form data

    // Prepare the data as JSON with the correct field names for the backend
    const requestData = {
      w_number: data.wNumber,         // Assuming w number is a required field
      first_name: data.firstName,     // backend expects 'first_name'
      last_name: data.lastName,       // backend expects 'last_name'
      email: data.email,
      password: data.password,
      role: data.role || "user",      // default role is 'user'
    };

    // Post data to API as JSON
    async function postData() {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("Registration successful!");
        window.location.href = '/login'; // Redirect to login page on success.
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Registration failed.'}`);
      }
    }

    postData();
  }

  // Password validation check
  const passwordValidation = {
    required: "Password is required.",
    validate: {
      minLength: value => value.length >= 8 || "Password must be at least 8 characters long.",
      uppercase: value => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter.",
      lowercase: value => /[a-z]/.test(value) || "Password must contain at least one lowercase letter.",
      digit: value => /\d/.test(value) || "Password must contain at least one digit.",
      noSpaces: value => !/\s/.test(value) || "Password cannot contain spaces."
    }
  };

  // Role validation function
  const roleValidation = {
    required: "Role is required.",
    validate: value => {
      const validRoles = ["principal", "chair", "admin", "staff", "student"];
      const normalizedRole = value.trim().toLowerCase().replace(/\./g, ''); // Normalize input
      return validRoles.includes(normalizedRole) || "Invalid role. Please enter a valid role.";
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div className="w-100" style={{ maxWidth: '500px', marginTop: '10px' }}>
        <h1 className="text-center mb-4">Sign Up</h1>

        <form onSubmit={handleSubmit(registerUser)}>
          {/* w Number */}
          <div className="mb-3">
            <label className="form-label">W Number</label>
            <input
              {...register("wNumber", { required: "W Number is required." })}
              type="text"
              className="form-control bg-light"
              placeholder="Enter your W number"
            />
            {errors.wNumber && <span className="text-danger">{errors.wNumber.message}</span>}
          </div>

          {/* First Name */}
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              {...register("firstName", {
                required: "First Name is required.",
                pattern: { value: /^[A-Za-z]+$/, message: "Invalid name format." }
              })}
              type="text"
              className="form-control bg-light"
              placeholder="John"
            />
            {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              {...register("lastName", {
                required: "Last Name is required.",
                pattern: { value: /^[A-Za-z]+$/, message: "Invalid name format." }
              })}
              type="text"
              className="form-control bg-light"
              placeholder="Doe"
            />
            {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              {...register("email", {
                required: "Email is required.",
                validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email address."
              })}
              type="email"
              className="form-control bg-light"
              placeholder="johndoe@example.com"
            />
            {errors.email && <span className="text-danger">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              {...register("password", passwordValidation)}
              type="password"
              className="form-control bg-light"
              placeholder="Enter your password"
            />
            {errors.password && <span className="text-danger">{errors.password.message}</span>}
          </div>

          {/* Role */}
          <div className="mb-3">
            <label className="form-label">Role</label>
            <input
              {...register("role", roleValidation)}
              type="text"
              className="form-control bg-light"
              placeholder="Role (Principal, Chair, Admin, Staff or Student)"
            />
            {errors.role && <span className="text-danger">{errors.role.message}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
          <Link to="/login" className="btn btn-outline-secondary w-100 mt-2">Cancel</Link>
        </form>
      </div>
    </div>
  );
}
