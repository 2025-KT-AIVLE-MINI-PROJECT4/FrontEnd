import apiClient from '../utils/apiClient';

// 백엔드의 BookResponseDto와 매핑 (필드명 동일하게 유지)
const mapBookResponseToFrontend = (apiBook) => {
  if (!apiBook) return null;
  return {
    id: apiBook.id,
    title: apiBook.title,
    author: apiBook.author,
    publisher: apiBook.publisher,
    publishedDate: apiBook.publishedDate,
    content: apiBook.content,
    price: apiBook.price,
    category: apiBook.category,
    imageUrl: apiBook.imageUrl,
    authorId: apiBook.authorId,
    authorName: apiBook.authorName,
    createdAt: apiBook.createdAt,
    updatedAt: apiBook.updatedAt,
    deletedAt: apiBook.deletedAt || null,
  };
};

// 프론트엔드 데이터를 백엔드의 BookRequestDto와 매핑
const mapBookRequestToBackend = (frontendBook) => ({
  title: frontendBook.title,
  author: frontendBook.author,
  publisher: frontendBook.publisher,
  publishedDate: frontendBook.publishedDate,
  content: frontendBook.content,
  price: frontendBook.price,
  category: frontendBook.category,
  imageUrl: frontendBook.imageUrl,
});

export const getBooks = async () => {
  try {
    const response = await apiClient.get('/api/v1/books');
    return response.data.data.books.map(mapBookResponseToFrontend);
  } catch (error) {
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await apiClient.get(`/api/v1/books/${id}`);
    return mapBookResponseToFrontend(response.data.data);
  } catch (error) {
    throw error;
  }
};

export const getMyBooks = async () => {
  try {
    const response = await apiClient.get('/api/v1/books/my');
    return response.data.data.books.map(mapBookResponseToFrontend);
  } catch (error) {
    throw error;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await apiClient.post('/api/v1/books', mapBookRequestToBackend(bookData));
    return mapBookResponseToFrontend(response.data.data);
  } catch (error) {
    throw error;
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await apiClient.put(`/api/v1/books/${id}`, mapBookRequestToBackend(bookData));
    return mapBookResponseToFrontend(response.data.data);
  } catch (error) {
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await apiClient.delete(`/api/v1/books/${id}`);
    return { success: true, message: response.data.message || "도서가 성공적으로 삭제되었습니다." }; // 204에 본문이 없을 수 있지만, 혹시나 백엔드에서 메시지를 담아 보낸다면 처리
  } catch (error) {
    throw error;
  }
};