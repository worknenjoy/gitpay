import React from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import TermsOfService from "../../molecules/terms-of-service/terms-of-service";

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