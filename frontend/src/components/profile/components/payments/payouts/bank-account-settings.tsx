import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AccountDetails from '../../../account-details';
import BankAccount from '../../../bank-account';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

export default function BankAccountSettings({
  user,
  account,
  fetchAccount,
  updateUser,
  changePassword,
  addNotification,
  createAccount,
  updateAccount,
  bankAccount,
  createBankAccount,
  updateBankAccount,
  getBankAccount,
  deleteUser
}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  function getSteps() {
    return [
      {
        label: 'Account holder details',
        disabled: false
      }, 
      {
        label: 'Bank Account information',
        disabled: !account.data.id
      }
    ];
  }
  
  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AccountDetails user={user} account={account} createAccount={createAccount} updateAccount={updateAccount} fetchAccount={fetchAccount} updateUser={updateUser} changePassword={changePassword} addNotification={addNotification} deleteUser={deleteUser}  />;
      case 1:
        return <BankAccount user={user} account={account} bankAccount={bankAccount} createAccount={createAccount} createBankAccount={createBankAccount} updateBankAccount={updateBankAccount} getBankAccount={getBankAccount} />;
      default:
        return 'Unknown step';
    }
  }

  const steps = getSteps();


  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton onClick={handleStep(index)} disabled={step.disabled}>
              {step.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div className={classes.instructions}>{getStepContent(activeStep)}</div>
    </div>  
  );
}