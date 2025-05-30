import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookApi from '../../api/bookApi';
import {
  Box, Button, TextField, Typography, Grid, Paper,
} from '@mui/material';

const EditBookPage = ({ book, token }) => {
  const navigate = useNavigate();

  // 초기값을 book에서 받아서 세팅
  const [coverImage, setCoverImage] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (book) {
      setCoverImage(book.imageURL || '');
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setPublisher(book.publisher || '');
      setPublishedDate(book.publishedDate ? book.publishedDate.slice(0,10) : ''); // YYYY-MM-DD
      setCategory(book.category || '');
      setPrice(book.price !== null && book.price !== undefined ? book.price.toString() : '');
      setContent(book.content || '');
    }
  }, [book]);

  const handleGenerateCover = () => {
    console.log('AI 커버 이미지 재생성 버튼 클릭됨');
    // DALLE 이미지 생성 기능 추후 구현 예정
  };

  const handleUpdate = async () => {
    const updatedData = {
      title,
      author,
      publisher: publisher || null,
      publishedDate: publishedDate || null,
      category: category || null,
      price: price ? Number(price) : null,
      content: content || null,
      imageURL: coverImage || null,
    };

    try {
      await bookApi.updateBook(book.id, updatedData, token);
      alert('도서 정보가 성공적으로 수정되었습니다.');
      navigate(`/detail/${book.id}`);
    } catch (error) {
      console.error('도서 수정 실패:', error.response?.data || error.message);
      alert('도서 정보 수정에 실패했습니다.');
    }
  };

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        {/* 좌측: 도서 표지 및 AI 커버 재생성 버튼 */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>도서표지</Typography>
          <Paper
            variant="outlined"
            sx={{
              width: '100%',
              height: 300,
              mb: 2,
              backgroundColor: '#f0f0f0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 2,
            }}
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt="도서 표지"
                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                도서 표지가 없습니다
              </Typography>
            )}
          </Paper>
          <Button variant="contained" fullWidth onClick={handleGenerateCover}>
            AI 커버 이미지 재생성
          </Button>
        </Grid>

        {/* 우측: 수정 폼 */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>도서 정보 수정</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="제목" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
            <TextField label="작가명" value={author} onChange={(e) => setAuthor(e.target.value)} fullWidth />
            <TextField label="출판사" value={publisher} onChange={(e) => setPublisher(e.target.value)} fullWidth />
            <TextField
              label="출판일"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              fullWidth
            />
            <TextField label="카테고리" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth />
            <TextField label="가격" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />
            <TextField
              label="내용"
              multiline
              minRows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={handleUpdate}>수정</Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditBookPage;
