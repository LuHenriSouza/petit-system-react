import { Avatar, Badge, IconButton, Stack, Tooltip, useMediaQuery, useTheme } from '@mui/material';

// ICONS
// import SearchIcon from '@mui/icons-material/Search';
// import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';


import { Box } from '@mui/system';
import { useDrawerContext } from '../../contexts';

export const TopBar: React.FC = () => {
	const { toggleDrawerOpen } = useDrawerContext();
	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));
	return (
		<>
			<Box sx={{
				backgroundColor: '#faf9f9',
				position: 'sticky',
				top: 0,
				width: '100%',
				height: theme.spacing(5),
				zIndex: theme.zIndex.appBar
			}}>
				<Stack
					alignItems="center"
					direction="row"
					justifyContent="space-between"
					spacing={2}
					sx={{
						minHeight: 39,
						pr: 3,
						pl: 1,
					}}
				>
					<Stack
						alignItems="center"
						direction="row"
						spacing={2}
					>
						{smDown && (
							<IconButton onClick={toggleDrawerOpen}>
								<MenuIcon style={{ fontSize: '15px' }} />
							</IconButton>
						)}
						{/* <Tooltip title="Search">
							<IconButton>

								<SearchIcon style={{ fontSize: '15px' }} />

							</IconButton>
						</Tooltip> */}
					</Stack>
					<Stack
						alignItems="center"
						direction="row"
						spacing={3}
					>
						{/* <Tooltip title="Contacts">
							<IconButton>

								<PersonIcon style={{ fontSize: '15px' }} />

							</IconButton>
						</Tooltip> */}
						<Tooltip title="Notifications">
							<IconButton>
								<Badge
									badgeContent={4}
									color="success"
									variant="dot"
								>

									<NotificationsIcon style={{ fontSize: '15px' }} />

								</Badge>
							</IconButton>
						</Tooltip>
						<Avatar
							// onClick={accountPopover.handleOpen}
							// ref={accountPopover.anchorRef}
							sx={{
								cursor: 'pointer',
								height: 30,
								width: 30
							}}
						/>
					</Stack>
				</Stack>
			</Box>
		</>
	);
};