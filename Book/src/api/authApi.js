import apiClient from '../utils/apiClient';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/api/v1/users/login', { email, password });
    // Postman Collection 명세에 따라 data.id, data.name, data.email, data.accessToken 반환
    return {
      success: true,
      message: response.data.message, // 로그인 성공 메시지
      user: {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
      },
      token: response.data.data.accessToken,
    };
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post('/api/v1/users/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    // Postman Collection 명세에 따라 data.id, data.name, data.email 반환
    return {
      success: true,
      message: response.data.message, // 회원가입 성공 메시지
      user: {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
      },
      token: null, // 회원가입 후 accessToken은 반환하지 않음
    };
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    // UserController의 logout API 호출 (토큰은 apiClient 인터셉터가 자동으로 추가)
    const response = await apiClient.post('/api/v1/users/logout');
    // 백엔드 응답에서 메시지 추출
    return { success: true, message: response.data.message };
  } catch (error) {
    throw error; // apiClient 인터셉터에서 이미 Error 객체로 변환됨
  }
};