import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import SvgIcon from '@mui/material/SvgIcon'
import { alpha, styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import logoGithub from 'images/github-logo-alternative.png'
import logoBitbucket from 'images/bitbucket-logo.png'

import { Lock, LockOpen } from '@mui/icons-material'
import { useSpring, animated } from 'react-spring/web.cjs' // web.cjs is required for IE 11 support

import Organizations from './organizations'
import OrganizationUpdate from './organization-update'

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  )
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  )
}

function CloseSquare(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  )
}

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  })

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  )
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
}

const StyledTreeItem = styled((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  '& .MuiTreeItem-iconContainer .close': { opacity: 0.3 },
  '& .MuiTreeItem-group': {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}))

export default function UserOrganizationTree({
  createOrganizations,
  updateOrganization,
  organizations,
  user,
  history,
}) {
  return (
    <div>
      <Typography variant="h5" style={{ marginTop: 20, marginBottom: 20 }}>
        Organizations you own on Gitpay
      </Typography>
      <TreeView
        sx={{ flexGrow: 1, maxWidth: '95%' }}
        defaultExpanded={['1']}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
      >
        {user &&
          user.Organizations.map((o, i) => (
            <StyledTreeItem
              nodeId={i}
              label={
                <React.Fragment>
                  <span>{o.name}</span>
                  {!o.provider ? (
                    <OrganizationUpdate updateOrganization={updateOrganization} organization={o} />
                  ) : o.provider === 'github' ? (
                    <span style={{ display: 'inline-block' }}>
                      <Avatar
                        style={{ marginLeft: 10, width: 16, height: 16, backgroundColor: 'black' }}
                      >
                        <img width={12} src={logoGithub} />
                      </Avatar>
                    </span>
                  ) : (
                    <span style={{ display: 'inline-block' }}>
                      <Avatar
                        style={{ marginLeft: 10, width: 16, height: 16, backgroundColor: 'black' }}
                      >
                        <img width={12} src={logoBitbucket} />
                      </Avatar>
                    </span>
                  )}
                </React.Fragment>
              }
            >
              {o &&
                o.Projects.map((p, j) => (
                  <StyledTreeItem
                    nodeId={`${i}-${j}`}
                    label={
                      <React.Fragment>
                        <span>{p.name}</span>
                      </React.Fragment>
                    }
                  >
                    {p &&
                      p.Tasks &&
                      p.Tasks.map((t, k) => (
                        <StyledTreeItem
                          onClick={(e) => history.push(`/task/${t.id}`)}
                          endIcon={t.private ? <Lock /> : <LockOpen />}
                          nodeId={`${i}-${j}-${k}`}
                          label={
                            <React.Fragment>
                              <span>{t.title}</span>
                            </React.Fragment>
                          }
                        />
                      ))}
                  </StyledTreeItem>
                ))}
            </StyledTreeItem>
          ))}
      </TreeView>
      {organizations && organizations.length > 0 && (
        <div>
          <Typography variant="h5" component="h3" style={{ marginTop: 20, marginBottom: 10 }}>
            <FormattedMessage id="account.profile.org.headline" defaultMessage="Organizations" />
          </Typography>
          <Typography component="p">
            <FormattedMessage
              id="account.profile.org.description"
              defaultMessage="Here is your public organizations that you can import to Gitpay"
            />
          </Typography>
          <div style={{ marginTop: 20, marginBottom: 40 }}>
            <Organizations user={user} data={organizations} onImport={createOrganizations} />
          </div>
        </div>
      )}
    </div>
  )
}
