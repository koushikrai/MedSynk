import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  role: 'user' | 'hospital_staff';
}

interface AuthContextType {
  user: User | null;
  isHospitalStaff: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = [
  { id: '1', email: 'user@example.com', password: 'password', role: 'user' , name : "Akhil" , type : "user",age : 21 },
  { id: '2', email: 'hospital@example.com', password: 'password', role: 'hospital_staff', type : "management" }
] as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function signIn(email: string, password: string) {
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!mockUser) throw new Error('Invalid credentials');
    
    const { password: _, ...userWithoutPassword } = mockUser;
    setUser(userWithoutPassword as User);
    return userWithoutPassword
  }

  function signOut() {
    setUser(null);
  }

  const isHospitalStaff = user?.role === 'hospital_staff';

  return (
    <AuthContext.Provider value={{ user, isHospitalStaff, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}