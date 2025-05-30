import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Material-UI 기본 테마 생성 (원하는 경우 커스터마이징 가능)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // 예시 색상
    },
    secondary: {
      main: '#dc004e', // 예시 색상
    },
  },
  typography: {
    fontFamily: 'Noto Sans KR, sans-serif', // 한글 폰트 적용
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* MUI의 기본 CSS 초기화 */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);