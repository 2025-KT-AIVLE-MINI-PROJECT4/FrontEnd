import React, { useState, useEffect } from 'react';
import { createBook as apiCreateBook, updateBook as apiUpdateBook } from '../../api/bookApi';
import { useAuth } from '../../contexts/AuthContext';
import { Box, TextField, Button, Typography, Paper, CircularProgress, TextareaAutosize } from '@mui/material';
import { styled } from '@mui/system';

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.pxToRem(16),
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
  },
}));

const BookFormPage = ({ initialBook = null, onComplete, onCancel }) => {
  const { user, showToast, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    title: '', author: '', publisher: '', publishedDate: '',
    content: '', price: '', category: '', imageURL: ''
  });
  const [loading, setLoading] = useState(false);

  const isEditing = initialBook !== null;

  useEffect(() => {
    if (isEditing && initialBook) {
      setForm({
        title: initialBook.title || '',
        author: initialBook.author || '',
        publisher: initialBook.publisher || '',
        publishedDate: initialBook.publishedDate || '', // publishedDate 사용
        content: initialBook.content || '',
        price: initialBook.price === null ? '' : initialBook.price,
        category: initialBook.category || '',
        imageURL: initialBook.imageURL || '' // imageURL 사용
      });
    } else {
      setForm({
        title: '', author: '', publisher: '', publishedDate: '',
        content: '', price: '', category: '', imageURL: ''
      });
    }
  }, [initialBook, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }
    setLoading(true);
    try {
      const submittedForm = {
        ...form,
        price: form.price === '' ? null : Number(form.price)
      };

      let resultBook;
      if (isEditing) {
        resultBook = await apiUpdateBook(initialBook.id, submittedForm);
        showToast('도서 정보가 성공적으로 수정되었습니다!', 'success');
      } else {
        resultBook = await apiCreateBook(submittedForm);
        showToast('도서가 성공적으로 등록되었습니다!', 'success');
      }
      onComplete(resultBook);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
      <Paper elevation={4} sx={{ borderRadius: 2, p: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 4 }}>
          {isEditing ? '도서 정보 수정' : '새 도서 등록'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { mb: 3 }, '& .MuiButton-root': { py: 1.5 } }}>
          <TextField
            fullWidth
            label="제목"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="저자"
            id="author"
            name="author"
            value={form.author}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="출판사"
            id="publisher"
            name="publisher"
            value={form.publisher}
            onChange={handleChange}
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="출판일"
            id="publishedDate" // publishedDate 사용
            name="publishedDate" // publishedDate 사용
            type="date"
            value={form.publishedDate}
            onChange={handleChange}
            required
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>내용(줄거리)</Typography>
            <StyledTextarea
              minRows={4}
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="도서 내용을 입력하세요..."
            />
          </Box>
          <TextField
            fullWidth
            label="가격"
            id="price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="숫자만 입력"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="카테고리"
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="이미지 URL"
            id="imageURL" // imageURL 사용
            name="imageURL" // imageURL 사용
            type="url"
            value={form.imageURL}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            variant="outlined"
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || authLoading}
              sx={{ position: 'relative' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : (isEditing ? '수정 완료' : '등록하기')}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outlined"
              fullWidth
              disabled={loading || authLoading}
            >
              취소
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BookFormPage;