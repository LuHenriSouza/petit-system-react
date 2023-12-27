import { Avatar, Badge, IconButton, Stack, useMediaQuery, useTheme } from '@mui/material';

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
				height: theme.spacing(4),
				zIndex: theme.zIndex.appBar,
				overflow: 'visible'
			}}>
				<Stack
					alignItems="center"
					direction="row"
					justifyContent="space-between"
					spacing={2}
					sx={{
						minHeight: 33,
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
							<IconButton onClick={toggleDrawerOpen} size="small">
								<MenuIcon style={{ fontSize: '12px' }} />
							</IconButton>
						)}
					</Stack>
					<Stack
						alignItems="center"
						direction="row"
						spacing={3}
					>

						<IconButton size="small">
							<Badge
								badgeContent={1}
								color="success"
								variant="dot"
								overlap="circular"
								invisible
								
							>

								<NotificationsIcon style={{ fontSize: '12px' }} />

							</Badge>
						</IconButton>
						<Avatar
							// onClick={accountPopover.handleOpen}
							// ref={accountPopover.anchorRef}
							sx={{
								cursor: 'pointer',
								height: 20,
								width: 20
							}}
						/>
					</Stack>
				</Stack>
			</Box>
		</>
	);
};