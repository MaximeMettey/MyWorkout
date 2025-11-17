import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserProfile } from '../models';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Implémenter la vérification de l'utilisateur connecté
    // Pour l'instant, simuler un utilisateur de test
    setTimeout(() => {
      const testUser: UserProfile = {
        id: 'test-user-1',
        email: 'test@myworkout.com',
        displayName: 'Utilisateur Test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(testUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implémenter l'authentification Firebase
      console.log('Sign in:', email);
      const user: UserProfile = {
        id: 'user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(user);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implémenter l'inscription Firebase
      console.log('Sign up:', email);
      const user: UserProfile = {
        id: 'user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(user);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      // TODO: Implémenter l'authentification Google
      console.log('Sign in with Google');
      const user: UserProfile = {
        id: 'user-google-' + Date.now(),
        email: 'google@myworkout.com',
        displayName: 'Google User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(user);
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // TODO: Implémenter la déconnexion Firebase
      console.log('Sign out');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileUpdate: Partial<UserProfile>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedUser = {
        ...user,
        ...profileUpdate,
        updatedAt: new Date().toISOString(),
      };
      setUser(updatedUser);
      // TODO: Sauvegarder dans la base de données
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
