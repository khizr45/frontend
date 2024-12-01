import { Box } from "@mui/material";
import React from "react";

export default function Cards({ cards }) {
 
  return (
    <>
      {cards.map((element, index) => {
        // Destructure the element for cleaner access
        const { cardNumber, cardName, iconName: Icon } = element;
        return (
          <Box
            sx={{
              display: "flex",
              width: "24%",
              bgcolor: "white",
              color: "#1976d2",
              padding: "2%",
              borderRadius: 3,
              justifyContent: "space-between",
              transition: "background-color 0.3s ease, color 0.3s ease",
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "white",
              },
            }}
          >
            <Box>
              <Box>
                {cardNumber.toLocaleString()}
                {index === 3 || index === 2 ? " Rs" : ""}
              </Box>
              {cardName}
            </Box>
            <Icon />
          </Box>
        );
      })}
    </>
  );
}
