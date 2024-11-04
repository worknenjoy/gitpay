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
    button: {
      marginRight: theme.spacing(1),
    },
    completed: {
      display: 'inline-block',
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
  bankAccount,
  createBankAccount,
  updateBankAccount,
  deleteUser
}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>({});


  function getSteps() {
    return ['Account holder details', 'Bank Account information'];
  }
  
  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AccountDetails user={user} account={account} fetchAccount={fetchAccount} updateUser={updateUser} changePassword={changePassword} addNotification={addNotification} deleteUser={deleteUser}  />;
      case 1:
        return <BankAccount user={user} account={account} bankAccount={bankAccount} createAccount={createAccount} createBankAccount={createBankAccount} updateBankAccount={updateBankAccount} />;
      default:
        return 'Unknown step';
    }
  }

  const steps = getSteps();

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={handleStep(index)} completed={completed[index]}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div className={classes.instructions}>{getStepContent(activeStep)}</div>
    </div>  
  );
}