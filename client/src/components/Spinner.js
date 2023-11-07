import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => prevValue - 1);
    }, 1000);

    if (count === 0) {
      // Check if the path is not empty or undefined
      if (path) {
        navigate(`/${path}`);
      } else {
        // Provide a fallback path if 'path' prop is not provided
        navigate("/");
      }
    }

    return () => clearInterval(interval);
  }, [count, navigate, path]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
      <h1 className="Text-center">redirecting to you in {count} second </h1>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
