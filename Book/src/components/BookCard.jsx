import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Button, CardActions } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const BookCard = ({ book, isOwner, onEdit, onDelete, onView }) => {
  const defaultImage = 'https://via.placeholder.com/150?text=No+Image'; // 기본 이미지 URL

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="200"
        image={book.imageUrl || defaultImage} // imageUrl 사용
        alt={book.title}
        sx={{ objectFit: 'contain', p: 2, bgcolor: '#f0f0f0' }}
        onClick={() => onView(book.id)} // 클릭 시 상세 페이지로 이동
        style={{ cursor: 'pointer' }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main',
            }
          }}
          onClick={() => onView(book.id)}
        >
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {book.author} | {book.publisher}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          출판일: {book.publishedDate} {/* publishedDate 사용 */}
        </Typography>
        <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold' }}>
          {book.price ? `${book.price.toLocaleString()}원` : '가격 정보 없음'}
        </Typography>
      </CardContent>
      {isOwner && (
        <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
          <Button size="small" startIcon={<Edit />} onClick={() => onEdit(book)}>
            수정
          </Button>
          <Button size="small" color="error" startIcon={<Delete />} onClick={() => onDelete(book)}>
            삭제
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default BookCard;