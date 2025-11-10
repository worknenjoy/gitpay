import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import PrivacyPolicy from "../../content/terms/privacy-policy/privacy-policy";

const PrivacyDialog = ({
  open,
  onClose
}) => {

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <PrivacyPolicy extraStyles={ false } />
      </DialogContent>
    </Dialog>  
  );
}

export default PrivacyDialog;