import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // 204 No Content (예: DELETE 성공)는 data가 없을 수 있으므로 특별 처리
    if (response.status === 204) {
      return response; // 204는 data가 없으므로 그대로 반환
    }

    // 백엔드의 ApiResponse<T> 형식 처리
    // { "status": "success", "message": "...", "data": T }
    // { "status": "error", "message": "..." }
    if (response.data && response.data.status === 'success') {
      return response; // 성공 응답의 경우 원본 응답 반환
    } else if (response.data && response.data.status === 'error') {
      // 백엔드에서 200 OK이면서 status: "error"를 반환하는 경우 (특정 로직 상)
      return Promise.reject(new Error(response.data.message || '알 수 없는 오류가 발생했습니다.'));
    }
    // 예상치 못한 성공 응답 형식
    return Promise.reject(new Error('예상치 못한 응답 형식입니다.'));
  },
  (error) => {
    if (error.response) {
      // 서버가 응답했지만 상태 코드가 2xx 범위를 벗어나는 경우
      // 백엔드의 ApiResponse 오류 형식에서 message를 추출
      const message = error.response.data?.message || `서버 오류 (${error.response.status}): 알 수 없는 오류`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // 요청이 이루어졌으나 응답을 받지 못한 경우 (네트워크 문제 등)
      return Promise.reject(new Error('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.'));
    } else {
      // 요청을 설정하는 중에 오류가 발생한 경우
      return Promise.reject(new Error('요청 설정 중 오류가 발생했습니다: ' + error.message));
    }
  }
);

export default apiClient;