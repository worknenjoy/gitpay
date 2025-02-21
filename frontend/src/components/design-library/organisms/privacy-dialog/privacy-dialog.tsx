import React from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import PrivacyPolicy from "../../molecules/privacy-policy/privacy-policy";

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