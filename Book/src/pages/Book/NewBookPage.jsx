import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import bookApi from '../../api/bookApi'; 
import {
  Box, Button, TextField, Typography, Grid, Paper,
} from '@mui/material';

const NewBookPage = ({ token, userId }) => {
  const navigate = useNavigate();

  const [coverImage, setCoverImage] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [price, setPrice] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [content, setContent] = useState('');

  const handleRegister = async () => {
    console.log('등록 버튼 클릭됨');

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // "YYYY-MM-DD"

    const bookData = {
        userId,
        title,
        author,
        publisher: publisher || null,
        publishedDate: publishedDate || null,
        content: content || null,
        price: price ? Number(price) : null,
        category: null,
        imageURL: coverImage || null,
        createdAt: formattedDate,
        updatedAt: formattedDate,
        deletedAt: null,
    };

    try {
        const result = await bookApi.registerBook(bookData, token);
        console.log('도서 등록 성공:', result);

        // 등록된 도서 상세 페이지로 이동
        navigate(`/detail/${result.bookId}`); // 서버가 bookId 반환한다고 가정
    } catch (error) {
        console.error('도서 등록 실패:', error.response?.data || error.message);
        alert('도서 등록에 실패했습니다.');
    }
    };

  const handleGenerateCover = () => {
    console.log('AI 커버 이미지 생성 버튼 클릭됨');
    // AI 이미지 생성 기능 추가 예정 
  };

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        {/* 좌측: 도서 표지 및 버튼 */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            도서표지
          </Typography>
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
            AI 커버 이미지 생성
          </Button>
        </Grid>

        {/* 우측: 신규 도서 정보 입력 폼 */}
        <Grid item xs={12} md={8}>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField label="제목" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
            <TextField label="작가명" value={author} onChange={(e) => setAuthor(e.target.value)} fullWidth />
            <TextField label="출판사" value={publisher} onChange={(e) => setPublisher(e.target.value)} fullWidth />
            <TextField label="가격" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />
            <TextField
              label="출판일"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              fullWidth
            />
            <TextField
              label="내용"
              multiline
              minRows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleRegister}>
              등록
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewBookPage;
