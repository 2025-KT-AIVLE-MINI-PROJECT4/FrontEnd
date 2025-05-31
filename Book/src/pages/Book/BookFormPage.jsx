import React, { useState, useEffect } from 'react';
import { createBook as apiCreateBook, updateBook as apiUpdateBook } from '../../api/bookApi';
import { useAuth } from '../../contexts/AuthContext';
import { Box, TextField, Button, Typography, Paper, CircularProgress, TextareaAutosize, Grid } from '@mui/material';
import { styled } from '@mui/system';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // AI 아이콘 추가

// .env 파일에서 환경 변수 불러오기 (Vite 환경)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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
    content: '', price: '', category: '', imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); // AI 이미지 생성 로딩 상태

  const isEditing = initialBook !== null;

  useEffect(() => {
    if (isEditing && initialBook) {
      setForm({
        title: initialBook.title || '',
        author: initialBook.author || '',
        publisher: initialBook.publisher || '',
        publishedDate: initialBook.publishedDate || '',
        content: initialBook.content || '',
        price: initialBook.price === null ? '' : initialBook.price,
        category: initialBook.category || '',
        imageUrl: initialBook.imageUrl || '' 
      });
    } else {
      setForm({
        title: '', author: '', publisher: '', publishedDate: '',
        content: '', price: '', category: '', imageUrl: ''
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
        price: form.price === '' ? null : Number(form.price),
        // imageUrl 필드는 이미 form 상태에 있으며, DALL-E URL이 저장됩니다.
        // 이 URL이 mapBookRequestToBackend를 통해 백엔드로 전달됩니다.
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
      console.error("도서 저장 실패:", error);
      showToast('도서 저장에 실패했습니다: ' + (error.response?.data?.error || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  // DALL-E API 호출 및 이미지 URL 반환 함수
  const generateImageWithAI = async (prompt) => {
    if (!OPENAI_API_KEY) {
      showToast('OpenAI API 키가 설정되지 않았습니다.', 'error');
      console.error("VITE_OPENAI_API_KEY is not set in .env file.");
      return null;
    }
    setAiLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "dall-e-3", // DALL-E 3 모델 사용
          prompt: prompt,
          n: 1,
          size: '1024x1024' // 더 높은 해상도 (DALL-E 3는 1024x1024, 1792x1024, 1024x1792 지원)
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log("DALL-E API 응답:", data);
        return data.data[0].url; // 생성된 이미지의 임시 URL 반환
      } else {
        // API 에러 상세 정보 로깅
        console.error("DALL-E API Error Response:", data);
        throw new Error(data.error?.message || '이미지 생성 실패');
      }
    } catch (error) {
      console.error("DALL-E 이미지 생성 오류:", error);
      showToast('AI 이미지 생성 중 오류가 발생했습니다: ' + error.message, 'error');
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateAndUploadImage = async () => {
    if (!user) {
        showToast('로그인이 필요합니다.', 'error');
        return;
    }

    // AI 이미지 생성을 위한 프롬프트 생성
    const promptParts = [];
    if (form.title.trim()) promptParts.push(`"${form.title}"이라는 제목의`);
    if (form.content.trim()) promptParts.push(`줄거리는 "${form.content}"입니다.`);
    if (form.category.trim()) promptParts.push(`카테고리는 "${form.category}"인`);

    let generatedPrompt = promptParts.join(' ');
    if (generatedPrompt.trim()) {
        generatedPrompt = `책 표지 이미지: ${generatedPrompt}.`;
    } else {
        generatedPrompt = "책 표지 이미지"; // 최소한의 프롬프트
    }

    if (!generatedPrompt.trim()) {
      showToast('AI 이미지 생성을 위해 최소한 제목, 줄거리 또는 카테고리를 입력해주세요.', 'warning');
      return;
    }
    
    showToast('AI 이미지 생성 중... 잠시 기다려주세요.', 'info');

    try {
        // DALL-E로 새 이미지 생성
        const dalleimageUrl = await generateImageWithAI(generatedPrompt);

        if (dalleimageUrl) {
            // 생성된 DALL-E URL을 바로 imageUrl 상태에 저장
            setForm(prev => ({ ...prev, imageUrl: dalleimageUrl }));
            showToast('AI 이미지 생성이 완료되었습니다!', 'success');
        }
    } catch (error) {
        console.error("AI 이미지 생성 중 오류:", error);
        showToast('AI 이미지 생성 중 예상치 못한 오류가 발생했습니다: ' + error.message, 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={4} sx={{ borderRadius: 2, p: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 4 }}>
          {isEditing ? '도서 정보 수정' : '새 도서 등록'}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}> {/* 폼 필드 */}
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
                id="publishedDate"
                name="publishedDate"
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
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                variant="outlined"
                sx={{ mb: 0 }}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || authLoading || aiLoading}
                  sx={{ position: 'relative' }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : (isEditing ? '수정 완료' : '등록하기')}
                </Button>
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="outlined"
                  fullWidth
                  disabled={loading || authLoading || aiLoading}
                >
                  취소
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}> {/* 이미지 미리보기 및 AI 생성 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: { xs: 0, md: 3 }, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>이미지 미리보기</Typography>
              <Box
                component="img"
                src={form.imageUrl || 'https://via.placeholder.com/250x350?text=No+Image'}
                alt="도서 이미지"
                sx={{
                  width: '100%',
                  height: 350,
                  objectFit: 'contain',
                  bgcolor: '#f0f0f0',
                  borderRadius: 1,
                  border: '1px solid #ddd',
                  mb: 2,
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AutoAwesomeIcon />}
                onClick={handleGenerateAndUploadImage}
                fullWidth
                disabled={aiLoading || loading || !user} // 로그인 상태 확인 추가
                sx={{ position: 'relative', py: 1.5 }}
              >
                {aiLoading ? <CircularProgress size={24} color="inherit" /> : 'AI 이미지 생성'}
              </Button>
               <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                (제목, 줄거리, 카테고리를 기반으로 AI 이미지를 생성합니다.)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BookFormPage;