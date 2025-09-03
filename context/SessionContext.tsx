import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// 🧑‍💻 User type
export type User = {
  id: string;
  fname: string;
  mname?: string;
  lname: string;
  username: string;
  email: string;
  bdate: Date;
  gender: string;
  contactNumber: string;
  profileImage: string;
  isProUser: boolean;
  bio?: string;
  status: string;
  type: string;
  createdOn: Date;
  groups: string[];
  isFirstLogin: boolean;
  likes: string[];
  safetyState: {
    isInAnEmergency: boolean;
    emergencyType: string;
  };
  publicSettings: {
    isProfilePublic: boolean;
    isTravelInfoPublic: boolean;
    isPersonalInfoPublic: boolean;
  };
};

// 🛣️ ORS Data
export type ORSData = {
  geometry: { coordinates: [number, number][]; type: string };
  distance: number;   // meters
  duration: number;   // seconds
  bbox?: number[];
};

// 📍 ActiveRoute type
export type ActiveRoute = {
  routeID: string;
  userID: string;
  location: { latitude: number; longitude: number; locationName: string }[];
  mode: string;
  status: string;
  createdOn: Date;
  orsData?: ORSData; // ✅ ORS data
};

// 🧠 SessionData
export type SessionData = {
  user?: User;
  activeRoute?: ActiveRoute;
  accessToken?: string;
  refreshToken?: string;
};

// 💡 Context shape
type SessionContextType = {
  session: SessionData | null;
  updateSession: (newData: Partial<SessionData>) => Promise<void>;
  clearSession: () => Promise<void>;
  loading: boolean;
};

// 🔗 Context init
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// 🔐 Provider
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('session');
        console.log('🔍 SessionContext: Stored session data:', stored);
        
        if (stored) {
          const parsed = JSON.parse(stored);

          if (parsed.user) {
            parsed.user.bdate = new Date(parsed.user.bdate);
            parsed.user.createdOn = new Date(parsed.user.createdOn);
          }

          if (parsed.activeRoute) {
            parsed.activeRoute.createdOn = new Date(parsed.activeRoute.createdOn);
            // orsData is left as-is (geometry/distance/duration)
          }

          setSession(parsed);
          console.log('✅ SessionContext: Session loaded successfully');
        } else {
          console.log('❌ SessionContext: No stored session found');
        }
      } catch (err) {
        console.error('❌ SessionContext: Failed to load session:', err);
      } finally {
        setLoading(false);
        console.log('🏁 SessionContext: Loading complete');
      }
    })();
  }, []);

  const updateSession = async (newData: Partial<SessionData>) => {
    try {
      const updated = { ...session, ...newData };
      setSession(updated);
      await AsyncStorage.setItem('session', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update session:', err);
    }
  };

  const clearSession = async () => {
    try {
      setSession(null);
      await AsyncStorage.removeItem('session');
    } catch (err) {
      console.error('Failed to clear session:', err);
    }
  };

  return (
    <SessionContext.Provider value={{ session, updateSession, clearSession, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

// 🎯 Hook
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
