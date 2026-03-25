import * as React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

export type Step = {
  number: string;
  title: string;
  description: string;
  numberColor: string;
};

function DashedPath() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: { xs: "none", md: "block" },
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1400 420"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d="M35,190
             C120,80 280,70 405,95
             C520,118 560,155 610,215
             C650,265 705,355 840,350
             C980,345 1015,245 1080,175
             C1140,110 1240,95 1335,130"
          fill="none"
          stroke="#d28a4a"
          strokeWidth="4"
          strokeDasharray="10 14"
          strokeLinecap="round"
        />
      </svg>

      <Box
        sx={{
          position: "absolute",
          top: 92,
          left: "14%",
          color: "#d28a4a",
          transform: "rotate(-8deg)",
        }}
      >
        <AutoGraphOutlinedIcon sx={{ fontSize: 34 }} />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 110,
          right: "27%",
          color: "#d28a4a",
          transform: "rotate(8deg)",
        }}
      >
        <PaidOutlinedIcon sx={{ fontSize: 30 }} />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 64,
          right: "10%",
          color: "#d28a4a",
          transform: "rotate(-12deg)",
        }}
      >
        <SendOutlinedIcon sx={{ fontSize: 42 }} />
      </Box>
    </Box>
  );
}

function StepBlock({
  number,
  title,
  description,
  numberColor,
}: Step) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 2, md: 3 },
        position: "relative",
        zIndex: 1,
      }}
    >
      <Typography
        component="div"
        sx={{
          fontSize: { xs: "6rem", sm: "7rem", md: "8rem" },
          lineHeight: 0.9,
          fontWeight: 700,
          color: numberColor,
          minWidth: { xs: 72, md: 110 },
        }}
      >
        {number}
      </Typography>

      <Box sx={{ maxWidth: 270 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#1f1f23",
            fontSize: { xs: "1.8rem", md: "2.1rem" },
            lineHeight: 1.15,
            mb: 2,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#38383d",
            fontSize: { xs: "1.1rem", md: "1.2rem" },
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

type Props = {
  title: string;
  steps: Step[];
};

export default function StepsHero({ title, steps }: Props) {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        bgcolor: "#f3f3f1",
        py: { xs: 6, md: 9 },
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ position: "relative" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: "#1f1f23",
              fontSize: { xs: "2.4rem", md: "4rem" },
              lineHeight: 1.05,
              mb: { xs: 5, md: 8 },
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </Typography>

          <DashedPath />

          <Grid container spacing={{ xs: 5, md: 4 }} alignItems="center">
            {steps.map((step) => (
              <Grid key={step.number} size={{ xs: 12, md: 4 }}>
                <StepBlock {...step} />
              </Grid>
            ))}
          </Grid>

          {!mdUp && (
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "center",
                color: "#d28a4a",
              }}
            >
              <PaidOutlinedIcon sx={{ fontSize: 34 }} />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
