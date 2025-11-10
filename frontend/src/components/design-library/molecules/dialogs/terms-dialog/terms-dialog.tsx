import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import TermsOfService from "../../content/terms/terms-of-service/terms-of-service";

const TermsDialog = ({
  open,
  onClose
}) => {

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <TermsOfService extraStyles={ false } />
      </DialogContent>
    </Dialog>  
  );
}

export default TermsDialog;