import React from "react";
import styled, { keyframes } from "styled-components";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../../public/style.css");
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Image = styled.img`
  animation: ${spin} 4s infinite linear;
`;

const Spinner = () => (
  <div className="loading">
    <Image src="/public/img/loading.png" alt="loading indicator" />
  </div>
);

export default Spinner;
