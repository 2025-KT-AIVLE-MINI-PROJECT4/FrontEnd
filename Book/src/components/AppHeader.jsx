import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { BookOutlined, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const AppHeader = ({ onNavigate }) => {
  const { user, logout } = useAuth(); // useAuth 훅에서 user 객체를 가져옴
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    onNavigate('login'); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <BookOutlined sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => onNavigate('main')}
        >
          도서 관리 시스템
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            // 로그인 상태일 때
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                환영합니다, **{user.name}**님!
              </Typography>
              <Button color="inherit" onClick={() => onNavigate('main')}>
                전체 도서
              </Button>
              <Button color="inherit" onClick={() => onNavigate('myBooks')}>
                내 도서
              </Button>
              {/* 로그인 시에만 도서 등록 버튼 활성화 */}
              <Button color="inherit" onClick={() => onNavigate('createBook')}>
                도서 등록
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                로그아웃
              </Button>
              {/* 사용자 아바타 또는 아이콘 */}
              <Avatar sx={{ ml: 2, bgcolor: 'secondary.main' }} onClick={handleMenu} >
                {user.name ? user.name[0] : <AccountCircle />}
              </Avatar>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { handleClose(); onNavigate('myBooks'); }}>내 도서</MenuItem>
                <MenuItem onClick={() => { handleClose(); onNavigate('createBook'); }}>도서 등록</MenuItem>
                <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
              </Menu>
            </>
          ) : (
            // 로그아웃 상태일 때
            <>
              <Button color="inherit" onClick={() => onNavigate('main')}>
                전체 도서
              </Button>
              <Button color="inherit" onClick={() => onNavigate('login')}>
                로그인
              </Button>
              <Button color="inherit" onClick={() => onNavigate('register')}>
                회원가입
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;