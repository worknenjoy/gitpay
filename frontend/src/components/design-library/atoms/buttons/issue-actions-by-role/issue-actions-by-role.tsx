import React from 'react'
import { CreditCard as BountyIcon, HowToReg as HowToRegIcon } from '@mui/icons-material'
import IssueActions from 'design-library/atoms/buttons/issue-actions/issue-actions'
import IssuePaymentDrawer from 'design-library/molecules/drawers/issue-payment-drawer/issue-payment-drawer'
import SendSolutionDrawer from 'design-library/molecules/drawers/send-solution-drawer/send-solution-drawer'

interface IssueActionsProps {
  issue: any
  currentRole: string
  children?: React.ReactNode
  cleanPullRequestDataState: () => void
  account: any
  fetchAccount: () => void
  pullRequestData: any
  user: any
  taskSolution: any
  getTaskSolution: (taskId: number) => void
  createTaskSolution: (taskId: number, data: any) => void
  updateTaskSolution: (taskId: number, solutionId: number, data: any) => void
  fetchPullRequestData: (owner: string, repo: string, pullNumber: string, taskId: number) => void
  // Props for IssuePaymentDrawer
  fetchCustomer: () => void
  customer: any
  addNotification: (message: string, options?: any) => void
  updateTask: (taskId: number, data: any) => void
  task: any
  createOrder: (data: any) => void
  order: any
  fetchWallet: () => void
  wallet: any
  listWallets: () => void
  wallets: any
  fetchTask: (taskId: number) => void
  syncTask: (taskId: number) => void
  taskSolutionCompleted: boolean
  validateCoupon?: (code: string, originalOrderPrice: number) => void
  couponStoreState?: any
}

const IssueActionsByRole = ({
  issue,
  currentRole,
  cleanPullRequestDataState,
  pullRequestData,
  account,
  fetchAccount,
  user,
  taskSolution,
  taskSolutionCompleted,
  getTaskSolution,
  createTaskSolution,
  updateTaskSolution,
  fetchPullRequestData,
  fetchCustomer,
  customer,
        addNotification,
        updateTask,
        task,
        createOrder,
        order,
        fetchWallet,
        wallet,
        listWallets,
        wallets,
        fetchTask,
        syncTask,
        validateCoupon,
        couponStoreState
}: IssueActionsProps) => {
  const { data } = issue

  const [open, setOpen] = React.useState(false)
  const [openPaymentDrawer, setOpenPaymentDrawer] = React.useState(false)

  const shouldDisable = data?.paid || data?.transfer_id || data?.Transfer?.id

  const commonActions = [
    {
      key: 'add-bounty',
      onClick: () => {
        setOpenPaymentDrawer(true)
      },
      label: 'Add bounty',
      disabled: shouldDisable,
      icon: <BountyIcon fontSize="small" />,
      component: (
        <IssuePaymentDrawer
          open={openPaymentDrawer}
          onClose={() => setOpenPaymentDrawer(false)}
          fetchCustomer={fetchCustomer}
          customer={customer}
          addNotification={addNotification}
          updateTask={updateTask}
          user={user}
          task={task}
          createOrder={createOrder}
          order={order}
          fetchWallet={fetchWallet}
          wallet={wallet}
          listWallets={listWallets}
          wallets={wallets}
          fetchTask={fetchTask}
          syncTask={syncTask}
          price={data?.price || 0}
          validateCoupon={validateCoupon}
          couponStoreState={couponStoreState}
        />
      )
    },
    {
      key: 'send-solution',
      onClick: () => {},
      label: 'Send solution',
      disabled: shouldDisable,
      icon: <HowToRegIcon fontSize="small" />,
      component: (
        <SendSolutionDrawer
          cleanPullRequestDataState={cleanPullRequestDataState}
          account={account}
          fetchAccount={fetchAccount}
          pullRequestData={pullRequestData}
          open={open}
          onClose={() => setOpen(false)}
          task={issue}
          createTaskSolution={createTaskSolution}
          updateTaskSolution={updateTaskSolution}
          getTaskSolution={getTaskSolution}
          user={user}
          taskSolution={taskSolution}
          fetchPullRequestData={fetchPullRequestData}
          taskSolutionCompleted={taskSolutionCompleted}
        />
      )
    }
  ]
  const roles = {
    admin: {
      primary: [commonActions[0]],
      secondary: [commonActions[1]]
    },
    user: {
      primary: [commonActions[0]],
      secondary: [commonActions[1]]
    }
  }
  return <IssueActions role={currentRole} roles={roles} />
}

export default IssueActionsByRole
