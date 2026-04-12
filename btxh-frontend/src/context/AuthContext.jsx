import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

// ─── Mock accounts (dev only) ────────────────────────────
const MOCK_ACCOUNTS = [
  { email: 'sender@test.com',       password: '123456', role: 'sender',           fullName: 'Nguyễn Thị Lan' },
  { email: 'adopter@test.com',      password: '123456', role: 'adopter',          fullName: 'Trần Văn Hùng' },
  { email: 'reception@test.com',    password: '123456', role: 'staff_reception',  fullName: 'Lê Thị Hoa' },
  { email: 'adoption@test.com',     password: '123456', role: 'staff_adoption',   fullName: 'Phạm Văn Dũng' },
  { email: 'manager@test.com',      password: '123456', role: 'manager',          fullName: 'Hoàng Minh Tuấn' },
  { email: 'admin@test.com',        password: '123456', role: 'admin',            fullName: 'Admin Hệ Thống' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('mock_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { localStorage.removeItem('mock_user'); }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    await new Promise(r => setTimeout(r, 400)); // simulate network
    const account = MOCK_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (!account) throw new Error('Sai email hoặc mật khẩu');
    const { password: _, ...userData } = account;
    localStorage.setItem('mock_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mock_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
