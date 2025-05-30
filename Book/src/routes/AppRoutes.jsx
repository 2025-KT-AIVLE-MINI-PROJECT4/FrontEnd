import { createBrowserRouter } from 'react-router-dom';
import BookDetailPage from '../pages/Book/BookDetailPage';
import NewBookPage from '../pages/Book/NewBookPage';
import EditBookPage from '../pages/Book/EditBookPage';
import HomePage from '../pages/Home/HomePage';
import bookApi from '../api/bookApi'


const router = createBrowserRouter([
  {
    path: '/home',
    element: <HomePage />
  },
  
  {
    path: '/books/:id',
    element: <BookDetailPage />,
    loader: async ({ params }) => {
      
      const token = localStorage.getItem('token');

      
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

      return { book, similarBooks, token };
    },
  },
  {
    path: "/new-book",
    element: <NewBookPage />,
    loader: async () => {
      // 토큰이나 유저ID를 localStorage 등에서 꺼내서 넘기는 경우
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      return { token, userId };
    },
  },
  {
    path: "/edit-book/:id",
    element: <EditBookPage />,
    loader: async ({ params }) => {
      const token = localStorage.getItem('token');
      const book = await bookApi.getBookDetail(params.id, token);
      return { book, token };
    },
  },
]);

export default router;
