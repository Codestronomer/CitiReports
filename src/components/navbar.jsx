import React, { useState } from 'react';
import {
  AppBar,
  Button,
  Toolbar,
  Menu,
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search,
  DarkModeOutlined,
  LightModeOutlined,
  NotificationsOutlined,
  NotificationImportant,
  Menu as MenuIcon,
  Close,
  SettingsOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout } from '../state';
import { useNavigate } from 'react-router-dom';
import FlexBetween from './flexBetween';
import profileImage from './profile2.png';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const red = theme.palette.primary.main;
  // const primaryLight = theme.palette.primary.light;
  // const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <AppBar
      sx={{
        position: 'static',
        background: 'none',
        boxShadow: 'none'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* LEFT SIDE of the NavBar  */}
        <FlexBetween>
          <FlexBetween sx={{marginRight: '100px'}}>
              <IconButton onClick={() => navigate('/')}>
                  <Typography variant='h1' sx={{fontWeight: 700,  color: red}}>
                    CitiReports
                  </Typography>
              </IconButton>
          </FlexBetween>
          {isNonMobileScreens && (
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius='9px'
              gap='6rem'
              padding='0.1rem 1.5rem'
            >
              <InputBase placeholder='What are you looking for?' />
              <IconButton>
                <Search />
              </IconButton>
            </FlexBetween>
          )}
        </FlexBetween>

        {/* DESKTOP NAV */}
        <FlexBetween>
          {isNonMobileScreens
            ? (
              <FlexBetween gap='2rem'>
                <IconButton onClick={() => dispatch(setMode())}>
                  {theme.palette.mode === 'dark'
                    ? (
                      <DarkModeOutlined sx={{ fontSize: '25px' }} />
                      )
                    : (
                      <LightModeOutlined sx={{ color: dark, fontSize: '25px' }} />
                      )}
                </IconButton>
                <IconButton>
                  <SettingsOutlined sx={{ fontSize: '25px' }} />
                </IconButton>
                <NotificationImportant sx={{ color: dark, fontSize: '25px' }} />
                <FlexBetween>
                  <Button
                    onClick={handleClick}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textTransform: 'none',
                      gap: '1rem'
                    }}
                  >
                    <Box
                      component='img'
                      alt='profile'
                      src={profileImage}
                      height='32px'
                      width='32px'
                      borderRadius='50%'
                      sx={{ objectFit: 'cover' }}
                    />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={isOpen}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  >
                    <MenuItem onClick={() => {
                      dispatch(setLogout);
                      navigate('/');
                    }}
                    >Log Out
                    </MenuItem>
                  </Menu>
                </FlexBetween>
              </FlexBetween>
              )
            : (
              <IconButton
                onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
              >
                <MenuIcon />
              </IconButton>
              )}
        </FlexBetween>
        {/* MOBILE NAV */}
        {!isNonMobileScreens &&
          isMobileMenuToggled && (
            <Box
              position='fixed'
              right='0'
              bottom='0'
              height='100%'
              zIndex='10'
              maxWidth='500px'
              minWidth='300px'
              backgroundColor={background}
            >
              {/* CLOSE ICON */}
              <Box display='flex' justifyContent='flex-end' p='1rem'>
                <IconButton
                  onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                  <Close />
                </IconButton>
              </Box>
              {/* MENU ITEMS */}
              <FlexBetween
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                gap='3rem'
              >
                <IconButton
                  onClick={() => dispatch(setMode())}
                  sx={{ fontSize: '25px' }}
                >
                  {theme.palette.mode === 'dark'
                    ? (
                      <DarkModeOutlined sx={{ fontSize: '25px' }} />
                      )
                    : (
                      <LightModeOutlined sx={{ color: dark, fontSize: '25px' }} />
                      )}
                </IconButton>
                <IconButton>
                  <NotificationsOutlined sx={{ fontSize: '25px' }} />
                </IconButton>
                <IconButton>
                  <SettingsOutlined sx={{ fontSize: '25px' }} />
                </IconButton>
                <FormControl variant='standard' value={fullName}>
                  <Select
                    value={fullName}
                    sx={{
                      backgroundColor: neutralLight,
                      width: '150px',
                      borderRadius: '0.25rem',
                      p: '0.25rem 1rem',
                      '& .MuiSvgIcon-root': {
                        pr: '0.25rem',
                        width: '3rem'
                      },
                      '& .MuiSelect-select:focus': {
                        backgroundColor: neutralLight
                      }
                    }}
                    input={<InputBase />}
                  >
                    <MenuItem value={fullName}>
                      <Typography>{fullName}</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => {
                      dispatch(setLogout());
                      navigate('/');
                    }}
                    >
                      Log Out
                    </MenuItem>
                  </Select>
                </FormControl>
              </FlexBetween>
            </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
