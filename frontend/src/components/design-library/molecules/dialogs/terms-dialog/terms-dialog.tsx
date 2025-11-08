import React from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import TermsOfService from "../../content/terms/terms-of-service/terms-of-service";

const TermsDialog = ({
  open,
  onClose
}) => {

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Terms and Conditions</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <TermsOfService />
        </DialogContentText>
      </DialogContent>
    </Dialog>  
  );
}

export default TermsDialog;