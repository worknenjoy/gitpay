import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import TermsOfService from "../../content/terms/terms-of-service/terms-of-service";
import { FormattedMessage } from "react-intl";

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