import { MOCK_USERS, mockApiResponse, mockApiError } from './mockData';

const authApi = {
  login: async (credentials) => {
    // Simulate login validation
    const user = MOCK_USERS.find(u =>
      u.email === credentials.email &&
      credentials.password === '123456' // Mock password
    );

    if (!user) {
      return mockApiError('Email hoặc mật khẩu không đúng', 1000);
    }

    const token = `mock-token-${user.id}-${Date.now()}`;
    return mockApiResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
      }
    });
  },

  register: async (data) => {
    // Simulate registration
    const existingUser = MOCK_USERS.find(u => u.email === data.email);
    if (existingUser) {
      return mockApiError('Email đã tồn tại', 1000);
    }

    const newUser = {
      id: MOCK_USERS.length + 1,
      ...data,
      role: 'adopter', // Default role for registration
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    return mockApiResponse({
      token: `mock-token-${newUser.id}-${Date.now()}`,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        phone: newUser.phone,
      }
    });
  },

  logout: async () => {
    return mockApiResponse({ success: true });
  },

  getProfile: async () => {
    // Get user from localStorage token
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('No token found');
    }

    const userId = token.split('-')[2]; // Extract user ID from mock token
    const user = MOCK_USERS.find(u => u.id === parseInt(userId));

    if (!user) {
      return mockApiError('User not found');
    }

    return mockApiResponse({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
    });
  },

  refreshToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('No token found');
    }

    return mockApiResponse({
      token: `mock-token-refreshed-${Date.now()}`
    });
  },
};

export default authApi;
