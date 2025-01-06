import React from "react";

const Loader = () => {
  return (
    <div style={styles.container}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>

      <style jsx>{`
        @keyframes grow-shrink {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
        }

        .dot {
          width: 10px;
          height: 10px;
          background-color: #4CAF50;
          border-radius: 50%;
          animation: grow-shrink 1.2s infinite;
        }

        .dot:nth-child(1) {
          animation-delay: 0s;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },
};

export default Loader;
