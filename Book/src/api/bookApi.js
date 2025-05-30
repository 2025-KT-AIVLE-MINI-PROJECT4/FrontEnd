import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1/books';

const bookApi = {
  // 도서 등록
  createBook: async (bookData, token) => {
    return axios.post(API_BASE_URL, bookData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // 도서 목록 조회
  getBookList: async () => {
    return axios.get(API_BASE_URL);
  },

  // 도서 상세 조회
  getBookDetail: async (id) => {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  // 도서 수정
  updateBook: async (id, updatedData, token) => {
    return axios.patch(`${API_BASE_URL}/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // 도서 삭제
  deleteBook: async (id, token) => {
    return axios.delete(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default bookApi;
