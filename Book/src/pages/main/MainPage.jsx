// src/pages/main/MainPage.jsx
import React, { useState, useEffect, useCallback } from 'react'; // useCallback import
import { getBooks, deleteBook as apiDeleteBook } from '../../api/bookApi'; // deleteBook import
import BookCard from '../../components/BookCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material'; // Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress import
import RefreshIcon from '@mui/icons-material/Refresh'; // RefreshIcon import

const MainPage = ({ onNavigate, onSelectBook }) => {
  const { user, showToast } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 에러 상태 추가

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // loadBooks 함수를 useCallback으로 감싸서 불필요한 재생성 방지
  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null); // 새로운 로딩 시작 시 에러 초기화
    try {
      const booksData = await getBooks();
      setBooks(booksData);
    } catch (err) {
      setError('도서 목록을 불러오는데 실패했습니다.'); // 사용자에게 보여줄 에러 메시지
      showToast('도서 목록을 불러오는데 실패했습니다: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 호출
    loadBooks();
  }, [loadBooks]);

  const handleRefreshClick = () => {
    loadBooks(); // 버튼 클릭 시 수동으로 데이터 다시 불러오기
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;
    setLoading(true); // 삭제 작업 중 로딩 표시 (버튼 비활성화)
    try {
      const result = await apiDeleteBook(bookToDelete.id);
      showToast(result.message, 'success');
      setDeleteModalOpen(false);
      setBookToDelete(null);
      loadBooks(); // 삭제 후 목록 새로고침
    } catch (error) {
      showToast('도서 삭제에 실패했습니다: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          모든 도서
        </Typography>
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
      ) : error ? ( // 에러가 있을 경우 에러 메시지와 재시도 버튼 표시
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={handleRefreshClick}
            startIcon={<RefreshIcon />}
          >
            다시 불러오기
          </Button>
        </Box>
      ) : (
        <>
          {books.length > 0 ? (
            <Grid container spacing={4}>
              {books.map(book => (
                <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                  <BookCard
                    book={book}
                    isOwner={user && parseInt(book.authorId, 10) === parseInt(user.id, 10)} // isOwner 판단 로직 (타입 일치 확인)
                    onEdit={() => onNavigate('editBook', book)} // 수정 버튼 동작
                    onDelete={handleDeleteClick}
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

      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DialogTitle>도서 삭제 확인</DialogTitle>
        <DialogContent>
          <Typography>정말로 "{bookToDelete?.title}"을(를) 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} disabled={loading}>
            취소
          </Button>
          <Button onClick={confirmDeleteBook} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : '삭제'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainPage;