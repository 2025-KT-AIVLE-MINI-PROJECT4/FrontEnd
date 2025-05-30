import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookDetailPage from '../pages/Book/BookDetailPage';
import NewBookPage from '../pages/Book/NewBookPage';
import EditBookPage from '../pages/Book/EditBookPage';

const AppRoutes = ({ book, similarBooks, onEdit, onRegister, onDelete, token }) => {
  return (
    <Routes>
      {/* 상세페이지 라우팅*/}
      <Route
        path="/books/:id"
        element={
          <BookDetailPage
            book={book}
            similarBooks={similarBooks}
            token={token}
          />
        }
      />

      {/* 신규 도서 등록 라우팅 */}
      <Route path="/new-book" element={<NewBookPage token={token} />} />
      { /* 도서 수정 라우팅 */}
      <Route 
        path="/edit-book/:id" 
        element={<EditBookPage token={token} />}
      />
    </Routes>
  );
};

export default AppRoutes;
