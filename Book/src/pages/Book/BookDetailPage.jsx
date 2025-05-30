import React, { useState, useEffect } from 'react';
import { ArrowBack, Person, Business, CalendarToday, AttachMoney, Category, Description, Edit, Delete } from '@mui/icons-material';
import { getBookById, deleteBook as apiDeleteBook } from '../../api/bookApi';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Box, Typography, Button, Paper, CircularProgress, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const BookDetailPage = ({ bookId, onNavigate, onEditBook }) => {
  const { user, showToast } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      try {
        const bookData = await getBookById(bookId);
        setBook(bookData);
      } catch (error) {
        showToast('도서 정보를 불러오는데 실패했습니다: ' + error.message, 'error');
        onNavigate('main');
      } finally {
        setLoading(false);
      }
    };
    if (bookId) {
      loadBook();
    }
  }, [bookId, onNavigate, showToast]);

  const isOwner = book && user && book.authorId === user.id;

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const confirmDeleteBook = async () => {
    if (!book) return;
    setLoading(true);
    try {
      const result = await apiDeleteBook(book.id);
      showToast(result.message, 'success');
      setDeleteModalOpen(false);
      onNavigate('myBooks');
    } catch (error) {
      showToast('도서 삭제에 실패했습니다: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!book) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="text.secondary">도서 정보를 찾을 수 없습니다.</Typography>
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => onNavigate('main')}
          sx={{ mt: 2 }}
        >
          목록으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', p: 3 }}>
      <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
        <Paper elevation={4} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Grid container>
            <Grid item xs={12} md={4}>
              {book.imageURL ? (
                <Box
                  component="img"
                  src={book.imageURL}
                  alt={book.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 2, bgcolor: '#f0f0f0' }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: { xs: 200, md: 400 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.200',
                    color: 'grey.500',
                    p: 2,
                  }}
                >
                  <Typography variant="body2">이미지 없음</Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ p: 4 }}>
                <Button
                  variant="text"
                  startIcon={<ArrowBack />}
                  onClick={() => onNavigate('main')}
                  sx={{ mb: 2, color: 'text.secondary' }}
                >
                  목록으로 돌아가기
                </Button>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                  {book.title}
                </Typography>

                <Box sx={{ '& > div': { display: 'flex', alignItems: 'center', mb: 1.5 }, '& svg': { mr: 2, color: 'text.secondary' } }}>
                  <div>
                    <Person />
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="medium">저자:</Typography> {book.author}
                    </Typography>
                  </div>
                  <div>
                    <Business />
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="medium">출판사:</Typography> {book.publisher}
                    </Typography>
                  </div>
                  <div>
                    <CalendarToday />
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="medium">출판일:</Typography> {book.publishedDate} {/* publishedDate 사용 */}
                    </Typography>
                  </div>
                  {book.price !== null && book.price !== undefined && (
                    <div>
                      <AttachMoney sx={{ color: 'success.main' }} />
                      <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                        <Typography component="span" fontWeight="medium" sx={{ color: 'text.primary' }}>가격:</Typography> {book.price.toLocaleString()}원
                      </Typography>
                    </div>
                  )}
                  <div>
                    <Category sx={{ color: 'primary.main' }} />
                    <Typography variant="body1">
                      <Typography component="span" fontWeight="medium">카테고리:</Typography> {book.category || '기타'}
                    </Typography>
                  </div>
                  {book.authorName && (
                    <div>
                      <Person />
                      <Typography variant="body1">
                        <Typography component="span" fontWeight="medium">등록자:</Typography> {book.authorName}
                      </Typography>
                    </div>
                  )}
                </Box>

                {book.content && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', color: 'text.primary', mb: 1, display: 'flex', alignItems: 'center' }}>
                      <Description sx={{ mr: 1, color: 'text.secondary' }} />
                      내용
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{book.content}</Typography>
                  </Box>
                )}

                {isOwner && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={() => onEditBook(book)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={handleDeleteClick}
                    >
                      삭제
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DialogTitle>도서 삭제 확인</DialogTitle>
        <DialogContent>
          <Typography>정말로 "{book.title}"을(를) 삭제하시겠습니까?</Typography>
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

export default BookDetailPage;