import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const navigate = useNavigate();
  
  // Create icon components
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const HomeIcon = getIcon('Home');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 7000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-accent/10 text-accent"
      >
        <AlertTriangleIcon className="w-12 h-12" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 text-gradient"
      >
        404
      </motion.h1>
      
      <motion.h2
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4"
      >
        Page Not Found
      </motion.h2>
      
      <motion.p 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-surface-600 dark:text-surface-300 mb-8 max-w-lg"
      >
        The page you're looking for doesn't exist or has been moved.
        You'll be redirected to the home page in a few seconds.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link 
          to="/" 
          className="btn btn-primary inline-flex items-center"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Return Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;