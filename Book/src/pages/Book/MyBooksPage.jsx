import React, { useState, useEffect } from 'react';
import { Add, Book as BookIcon } from '@mui/icons-material';
import { getMyBooks, deleteBook as apiDeleteBook } from '../../api/bookApi';
import { useAuth } from '../../contexts/AuthContext';
import BookCard from '../../components/BookCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const MyBooksPage = ({ onNavigate, onEditBook, onSelectBook }) => {
  const { user, loading: authLoading, showToast } = useAuth();
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const loadMyBooks = async () => {
    if (!user) return; // user가 없으면 (로그아웃 상태) 함수 종료
    setLoading(true);
    try {
      const booksData = await getMyBooks();
      setMyBooks(booksData);
    } catch (error) {
      showToast('내 도서 목록을 불러오는데 실패했습니다: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // user와 showToast가 변경될 때마다 loadMyBooks를 다시 로드
  // user는 로그인/로그아웃 시 변경
  useEffect(() => {
    loadMyBooks();
  }, [user]);

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;
    setLoading(true);
    try {
      const result = await apiDeleteBook(bookToDelete.id);
      showToast(result.message, 'success');
      setDeleteModalOpen(false);
      setBookToDelete(null);
      loadMyBooks(); // 삭제 후 목록 새로고침
    } catch (error) {
      showToast('도서 삭제에 실패했습니다: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          내가 등록한 도서
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          총 {myBooks.length}권의 도서를 등록했습니다.
        </Typography>
      </Box>

      {loading || authLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {myBooks.length > 0 ? (
            <Grid container spacing={4}>
              {myBooks.map(book => (
                <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                  <BookCard
                    book={book}
                    isOwner={user && book.authorId === user.id}
                    onEdit={onEditBook}
                    onDelete={handleDeleteClick}
                    onView={() => onSelectBook('bookDetail', book.id)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <BookIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" component="h3" sx={{ color: 'grey.600', mb: 1 }}>등록된 도서가 없습니다</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>첫 번째 도서를 등록해보세요!</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => onNavigate('createBook')}
              >
                도서 등록
              </Button>
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
            {loading ? '삭제 중...' : '삭제'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBooksPage;