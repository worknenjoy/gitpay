import React from 'react';
import { Link } from 'react-router-dom'
import { Typography, Button, CardContent, Avatar, CardHeader } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { 
  CardActionsCentered,
  Card
} from './dashboard-card-base.styles'
import taskIcon from 'images/icons/noun_project management_3063547.svg'

type DashboardCardBaseProps = {
  children?: React.ReactNode;
  image?: string;
  title?: string | React.ReactNode;
  subheader?: string | React.ReactNode;
  buttonText?: string | React.ReactNode;
  buttonLink?: string;
};

const DashboardCardBase = ({
  children,
  image,
  title,
  subheader,
  buttonText,
  buttonLink
}: DashboardCardBaseProps) => {
  return (
    <Card>
      <CardHeader 
        avatar={
          <Avatar sx={{ bgcolor: 'text.contrast', width: 48, height: 48 }}>
            {image && <img src={image} alt="Tasks Icon" width={21} height={32} style={{ marginTop: 6 }} />}
          </Avatar>
        }
        title={title}
        subheader={subheader}
      />
      <CardContent>
        {children}
      </CardContent>
      <CardActionsCentered>
        <Button size="small" color="primary">
          <Link to={buttonLink}>
            {buttonText}
          </Link>
        </Button>
      </CardActionsCentered>
    </Card>
  );
};

export default DashboardCardBase;