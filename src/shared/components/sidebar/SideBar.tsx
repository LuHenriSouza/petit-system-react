import React from 'react';

import {
	Avatar,
	Divider,
	Drawer,
	useMediaQuery,
	useTheme
} from '@mui/material';

import { items } from './config';
import { Box } from '@mui/system';
import { Link, useLocation } from 'react-router-dom';

import logo from './img/Petit-logo.png';
import { SideNavItem } from './SideNavItem';
import { useDrawerContext } from '../../contexts';


import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';


interface ISideBarProps {
	children: React.ReactNode
}

export const SideBar: React.FC<ISideBarProps> = ({ children }) => {
	const theme = useTheme();
	const location = useLocation();

	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	const { isDrawerOpen, toggleDrawerOpen } = useDrawerContext();

	const handleClick = () => {
		smDown ? toggleDrawerOpen() : undefined;
	}

	return (
		<>
			<Drawer open={isDrawerOpen} variant={smDown ? 'temporary' : 'permanent'} onClose={toggleDrawerOpen}>
				<Box width={theme.spacing(30)} height="100%" display="flex" flexDirection="column">
					<Link to="/" onClick={handleClick}>
						<Box width="100%" height={theme.spacing(16)} display="flex" alignItems="center" justifyContent="center">
							<Avatar src={logo} sx={{ width: theme.spacing(17), height: theme.spacing(17), paddingBottom: 1 }} />
						</Box>
					</Link>

					<Divider sx={{ backgroundColor: "rgb(255,255,255,0.2)", }} />
					<SideNavItem
						key='Dashboard'
						title='Dashboard'
						path='/dashboard'
						icon={(<DashboardRoundedIcon fontSize='small' />)}
						clicked={smDown ? toggleDrawerOpen : undefined}
						active={(location.pathname === '/dashboard')}

					/>


					<Divider sx={{ backgroundColor: "rgb(255,255,255,0.2)", }} />

					<Box
						component="nav"
						sx={{
							flexGrow: 1,
							px: 1,
							py: 2
						}}
					>

						{items.map((item) => {
							const active = item.path ? (location.pathname === item.path) : false;

							return (
								<SideNavItem
									key={item.title}
									active={active}
									icon={item.icon}
									path={item.path}
									title={item.title}
									clicked={smDown ? toggleDrawerOpen : undefined}
								/>
							);
						})}

					</Box>



				</Box>
			</Drawer >
			<Box height="100vh" marginLeft={smDown ? 0 : theme.spacing(30)}>
				{children}
			</Box>
		</>
	);
};