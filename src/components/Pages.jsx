import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function Pages({ setCurrentPageId, pageId }) {
  const getButtonStyles = (page) => ({
    background: page === pageId ? "#c9c9c9" : "transparent",
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
          m: 1,
        },
        "& .MuiButton-outlined": {
          borderColor: "#bcbcbc",
          color: "#4b4b4b",
        },
        "& .MuiButton-outlined:hover": {
          background: "#c9c9c9",
        },
      }}
    >
      <ButtonGroup>
        <Button sx={getButtonStyles(1)} onClick={() => setCurrentPageId(1)}>
          Page 1
        </Button>
        <Button sx={getButtonStyles(2)} onClick={() => setCurrentPageId(2)}>
          Page 2
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default Pages;
