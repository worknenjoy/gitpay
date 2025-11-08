import React from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import PrivacyPolicy from "../../content/terms/privacy-policy/privacy-policy";

const PrivacyDialog = ({
  open,
  onClose
}) => {

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Privacy Policy</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <PrivacyPolicy />
        </DialogContentText>
      </DialogContent>
    </Dialog>  
  );
}

export default PrivacyDialog;