import React from 'react';

import {
	Avatar,
	Divider,
	Drawer,
	useTheme
} from '@mui/material';

import { items } from './config';
import { Box } from '@mui/system';
import { Link, useLocation } from 'react-router-dom';

import logo from './img/Petit-logo.png';
import { SideNavItem } from './SideNavItem';


interface ISideBarProps {
	children: React.ReactNode
}

export const SideBar: React.FC<ISideBarProps> = ({ children }) => {
	const theme = useTheme();
	const location = useLocation();
	const { pathname } = location;
	return (
		<>
			<Drawer open={true} variant='persistent'>
				<Box width={theme.spacing(19)} height="100%" display="flex" flexDirection="column">
					<Link to="/">
						<Box width="100%" height={theme.spacing(9)} display="flex" alignItems="center" justifyContent="center">
							<Avatar src={logo} sx={{ width: theme.spacing(8), height: theme.spacing(8) }} />
						</Box>
					</Link>

					<Divider sx={{backgroundColor: "rgb(255,255,255,0.2)", }}/>



					<Box
						component="nav"
						sx={{
							flexGrow: 1,
							px: 1,
							py: 2
						}}
					>

						{items.map((item) => {
							const active = item.path ? (pathname === item.path) : false;

							return (
								<SideNavItem
									key={item.title}
									active={active}
									icon={item.icon}
									path={item.path}
									title={item.title}
								/>
							);
						})}

					</Box>



				</Box>
			</Drawer>
			<Box height="100vh" marginLeft={theme.spacing(16)}>
				{children}
			</Box>
		</>
	);
};