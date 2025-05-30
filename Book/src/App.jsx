// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function AppWrapper() {
  const book = {
    id: 1, 
    title: 'Clean Code',
    author: 'Robert C. Martin',
    publisher: 'Pearson',
    publishDate: '2008-08-01',
    category: '프로그래밍',
    price: 30000,
    createdAt: '2022-01-10',
    updatedAt: '2023-12-01',
    coverImage:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=80',
    content:
      '클린 코드는 좋은 소프트웨어를 만드는 방법을 설명한다. 이 책은 프로그래머가 읽기 쉽고 유지보수하기 좋은 코드를 작성하는 방법에 대해 설명한다.',
  };

  const similarBooks = [
    {
      title: '리팩터링',
      author: 'Martin Fowler',
      coverImage:
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: '프로그래밍 심리학',
      author: 'Gerald M. Weinberg',
      coverImage:
        'https://images.unsplash.com/photo-1581092160615-b0c0c8b2a99a?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: '소프트웨어 장인',
      author: 'Sandro Mancuso',
      coverImage:
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=500&q=80',
    },
  ];

  const token = localStorage.getItem('token'); 

  return (
    <AppRoutes
      book={book}
      similarBooks={similarBooks}
      token={token}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
