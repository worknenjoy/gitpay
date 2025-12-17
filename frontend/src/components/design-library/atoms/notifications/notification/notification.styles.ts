import { Alert, styled } from "@mui/material";

export const AlertStyled = styled(Alert)(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  border: `1px solid ${theme.palette.grey[500]}`,  
  boxShadow: 'none',
}))