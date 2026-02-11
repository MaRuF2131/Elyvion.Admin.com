import { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/adminService.mjs';
import localforage from 'localforage';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getUser = async () => {
  const data = await localforage.getItem("user");
  if (!data) return null;
  if (Date.now() > data.expiryTime) {
    // Expired হলে মুছে ফেলবে
    await localforage.removeItem("user");
    return null;
  }

  return data;
};

const addUser = async (user) => {
    console.log("user",user);
    
   if(!user || !user.id) return null;
    // expire time (7 days = 7*24*60*60*1000 ms)
   user.expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
  const res= await localforage.setItem('user', user);
  return res;
};

const removeUser = async () => {
  await localforage.removeItem('user');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      (async () => {
        setLoading(true); // start loading
        const user = await getUser();
        if (user) {
          setUser(user);   // এখানে object wrap না করে সরাসরি দিচ্ছি
        } else {
          setUser(false);
        }
        setLoading(false); // cookie check complete
      })();
  }, []);

  const logout = async() => {
    setLoading(true); // start loading
    try{
      console.log("callllll");
      
      const res= await axios.post("https://elyvion-beckend-com.vercel.app/logout",{})
      console.log("resssss",res);    
      toast.success(res?.response?.data?.message || '')
      await removeUser();
      setUser(null);
      return true;
    }catch(err){
      console.log("errrr",err);
      toast.error(err?.response?.data.message || "request failed")
      return false;
    }finally{
      setLoading(false); // cookie check complete
    }
  };


  const login = async (userName, password) => {
    try {
      setLoading(true); // start loading
      // For now, we'll use a simple check against users
      // In production, this should be a proper login endpoint
      const response = await adminService.login(userName, password);
      console.log("resss",response);
      
      if (response.success && response.data) {
            const userData = response.data;
            const res = await addUser(userData);
            if(!res){ setUser(null);setLoading(false); return { success: false, error: 'Failed to save user data' }};
            setUser(res);
            setLoading(false); // cookie check complete
        return { success: true };
      } else {
        setLoading(false); // cookie check complete
        return { success: false, error: response?.error || 'Invalid credentials' };
      }
    } catch (error) {
      setLoading(false); // cookie check complete
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    }
  };


  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

