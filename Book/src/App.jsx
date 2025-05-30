import React, { useState } from 'react';
import AppHeader from './components/AppHeader';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MainPage from './pages/main/MainPage';
import MyBooksPage from './pages/book/MyBooksPage';
import BookDetailPage from './pages/book/BookDetailPage';
import BookFormPage from './pages/book/BookFormPage';
import { useAuth } from './contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('main');
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [bookToEdit, setBookToEdit] = useState(null); // 수정할 도서 객체

  const navigateTo = (page, data = null) => {
    setCurrentPage(page);
    setSelectedBookId(null);
    setBookToEdit(null); // 페이지 이동 시 초기화
    if (page === 'bookDetail' && data) {
      setSelectedBookId(data);
    } else if (page === 'createBook') {
      setBookToEdit(null); // 새 도서 등록 시 초기화
    } else if (page === 'editBook' && data) {
      setBookToEdit(data); // 도서 수정 시 도서 데이터 전달
    }
  };

  const handleEditBook = (book) => {
    navigateTo('editBook', book);
  };

  const handleBookFormComplete = () => {
    // 도서 등록/수정 완료 후 '내 도서' 페이지로 이동
    navigateTo('myBooks');
  };

  const renderPage = () => {
    if (authLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      );
    }

    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      case 'main':
        return <MainPage onNavigate={navigateTo} onSelectBook={navigateTo} />;
      case 'myBooks':
        return <MyBooksPage onNavigate={navigateTo} onEditBook={handleEditBook} onSelectBook={navigateTo} />;
      case 'bookDetail':
        return <BookDetailPage bookId={selectedBookId} onNavigate={navigateTo} onEditBook={handleEditBook} />;
      case 'createBook':
        return <BookFormPage onComplete={handleBookFormComplete} onCancel={() => navigateTo('main')} />;
      case 'editBook':
        return <BookFormPage initialBook={bookToEdit} onComplete={handleBookFormComplete} onCancel={() => navigateTo('myBooks')} />;
      default:
        return <MainPage onNavigate={navigateTo} onSelectBook={navigateTo} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader onNavigate={navigateTo} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {renderPage()}
      </Box>
    </Box>
  );
}

export default App;