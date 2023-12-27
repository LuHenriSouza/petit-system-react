import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';


interface SideNavItemProps {
  active?: boolean;
  icon: React.ReactNode;
  path: string;
  title: string;
  clicked: (() => void) | undefined;
}

export const SideNavItem: React.FC<SideNavItemProps> = (props) => {

  const { active = false, icon, path, title, clicked } = props;

  const handleClick = () => {
    clicked?.();
  }


  return (
    <Link to={path} style={{ textDecoration: 'none' }} onClick={handleClick}>
      <Button
        color='info'
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          my: '5px',
          py: '0px',
          textAlign: 'left',
          width: '100%',
          ...(active && {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
        }}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'rgba(255, 255, 255, 0.5)',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 1,
              ...(active && {
                color: 'rgba(99, 102, 241)'
              })
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            flexGrow: 1,
            fontSize: 9,
            fontWeight: 600,
            lineHeight: '21px',
            whiteSpace: 'nowrap',
            textTransform: 'none',
            ...(active && {
              color: 'rgb(255, 255, 255, 1)'
            })
          }}
        >
          {title}
        </Box>
      </Button>
    </Link>
  );
};
