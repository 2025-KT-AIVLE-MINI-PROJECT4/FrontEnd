import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import bookApi from '../../api/bookApi';

const BookDetailPage = ({ book, similarBooks, token }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-book/${book.id}`);
  };

  const handleRegister = () => {
    navigate('/new-book');
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await bookApi.deleteBook(book.id, token);
        alert('도서가 삭제되었습니다.');
        navigate('/books'); // 삭제 후 목록으로 이동
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} sx={{ ml: { xs: 0, md: 15 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h3">{book.title}</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {book.author} / {book.publisher}, {book.publishDate}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" mt={1}>
                {book.category}
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="text.secondary" mt={1}>
                판매가: {book.price.toLocaleString()}원
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                최초 등록일: {book.createdAt}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                최근 수정일: {book.updatedAt}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h3" fontWeight="bold">
              {book.title}
            </Typography>
            <Typography variant="h6" mt={2}>
              {book.content?.split('.')[0]}.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} mt={4}>
            <Button variant="contained" color="primary" onClick={handleEdit}>
              도서 상세 수정
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleRegister}>
              신규 도서 등록
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              도서 삭제
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4} sx={{ ml: { xs: 0, md: 20 } }}>
          <Typography variant="h6" gutterBottom>
            비슷한 책
          </Typography>
          <Stack spacing={2}>
            {similarBooks.slice(0, 3).map((b, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{ p: 2, display: 'flex', alignItems: 'center' }}
              >
                <Avatar
                  variant="square"
                  src={b.coverImage}
                  alt={b.title}
                  sx={{ width: 56, height: 80, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle2">{b.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {b.author}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookDetailPage;
