// src/pages/main/MainPage.jsx
import React, { useState, useEffect } from 'react';
import { getBooks } from '../../api/bookApi';
import BookCard from '../../components/BookCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, Grid, Button } from '@mui/material'; // Button import 추가
import RefreshIcon from '@mui/icons-material/Refresh'; // RefreshIcon import 추가

const MainPage = ({ onNavigate, onSelectBook }) => {
  const { user, showToast } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // loadBooks 함수를 useEffect 밖으로 빼고, 필요시 수동 호출 가능하게 함
  const loadBooks = async () => {
    setLoading(true);
    try {
      const booksData = await getBooks();
      setBooks(booksData);
    } catch (error) {
      showToast('도서 목록을 불러오는데 실패했습니다: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 한 번만 loadBooks 호출
    loadBooks();
  }, []); // 의존성 배열이 비어 있으므로 컴포넌트 마운트 시 한 번만 실행

  // 새로고침 버튼 클릭 핸들러
  const handleRefreshClick = () => {
    loadBooks(); // loadBooks 함수 실행
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> {/* 버튼 배치를 위해 display: 'flex' 추가 */}
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          모든 도서
        </Typography>
        {/* 새로고침 버튼 추가 */}
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefreshClick}
          disabled={loading} // 로딩 중에는 버튼 비활성화
        >
          새로고침
        </Button>
      </Box>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {books.length > 0 ? (
            <Grid container spacing={4}>
              {books.map(book => (
                <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                  <BookCard
                    book={book}
                    isOwner={user && book.authorId === user.id} // 소유자 여부 판단
                    onEdit={() => onNavigate('editBook', book)} // 수정 버튼 동작
                    onDelete={() => { /* onDelete는 MyBooksPage에서만 사용 */ }}
                    onView={() => onSelectBook('bookDetail', book.id)} // 상세 페이지 이동
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" component="h3" sx={{ color: 'grey.600', mb: 1 }}>아직 등록된 도서가 없습니다.</Typography>
              <Typography variant="body1" color="text.secondary">새로운 도서를 등록하여 시작해보세요!</Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default MainPage;