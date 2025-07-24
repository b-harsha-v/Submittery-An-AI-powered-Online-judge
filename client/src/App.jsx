// client/src/App.jsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useTheme } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddProblemPage from './pages/AddProblemPage';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import ProblemsListPage from './pages/ProblemsListPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import AdminProblemsListPage from './pages/AdminProblemsListPage';
import EditProblemPage from './pages/EditProblemPage';
import { useNavigate } from 'react-router-dom';

// Asteroid component
const Asteroid = ({ size = 1, speed = 1, delay = 0, left = 0, rotate = 0 }) => {
  const { theme } = useTheme();
  const color = theme === 'dark' ? 'rgba(200,200,255,0.8)' : 'rgba(100,80,150,0.8)';

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: `${size * 20}px`,
        height: `${size * 20}px`,
        left: `${left}%`,
        top: '-50px',
        rotate: `${rotate}deg`,
        zIndex: -1,
      }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{
        x: [`${Math.random() * 50 - 25}px`, `${Math.random() * 100 - 50}px`],
        y: '100vh',
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 10 / speed,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 10,
        ease: 'linear',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M50 0 L75 25 L100 50 L75 75 L50 100 L25 75 L0 50 L25 25 Z"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <path
          d="M30 30 L70 30 L70 70 L30 70 Z"
          fill="none"
          stroke={color}
          strokeWidth="1"
        />
      </svg>
    </motion.div>
  );
};

// Meteor component
const Meteor = ({ size = 1, speed = -1, delay = 0, left = 0 }) => {
  const { theme } = useTheme();
  const color = theme === 'dark' ? 'rgba(150,200,255,0.8)' : 'rgba(150,100,255,0.8)';

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: `${size * 100}px`,
        height: '2px',
        left: `${left}%`,
        top: '-10px',
        background: `linear-gradient(90deg, transparent, ${color})`,
        transformOrigin: 'left center',
        rotate: `${Math.random() * 30 + 15}deg`,
        zIndex: -1,
      }}
      initial={{ x: 0, y: 0, opacity: 0, scaleX: 0 }}
      animate={{
        x: [`${Math.random() * 20 - 10}px`, `${Math.random() * 40 - 20}px`],
        y: '100vh',
        opacity: [0, 1, 0],
        scaleX: [0, 1, 0],
      }}
      transition={{
        duration: 3 / speed,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 15,
        ease: 'linear',
      }}
    />
  );
};

// SpaceBackground component
const SpaceBackground = () => {
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 0.5 + 0.5,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }));

  const asteroids = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    size: Math.random() * 0.8 + 0.5,
    speed: Math.random() * 0.7 + 0.5,
    delay: Math.random() * 5,
    left: Math.random() * 100,
    rotate: Math.random() * 360
  }));

  const meteors = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 100,
    size: Math.random() * 0.5 + 0.5,
    speed: Math.random() * 0.5 + 1,
    delay: Math.random() * 8,
    left: Math.random() * 100
  }));

  return (
    <div className="fixed inset-0 overflow-hidden -z-10" style={{ zIndex: -1 }}>
      {/* Stars */}
      {stars.map(star => (
        <motion.div
          key={`star-${star.id}`}
          className={`absolute rounded-full bg-white`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            zIndex: -1,
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            delay: star.delay,
            duration: star.duration,
            ease: 'easeInOut'
          }}
        />
      ))}
      
      {/* Asteroids */}
      {asteroids.map(asteroid => (
        <Asteroid
          key={`asteroid-${asteroid.id}`}
          size={asteroid.size}
          speed={asteroid.speed}
          delay={asteroid.delay}
          left={asteroid.left}
          rotate={asteroid.rotate}
        />
      ))}
      
      {/* Meteors */}
      {meteors.map(meteor => (
        <Meteor
          key={`meteor-${meteor.id}`}
          size={meteor.size}
          speed={meteor.speed}
          delay={meteor.delay}
          left={meteor.left}
        />
      ))}
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();

  const handleExploreProblems = () => {
    navigate('/problems');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-start pt-32 min-h-[calc(100vh-4rem)] px-4 relative"
    >
      <SpaceBackground />
      
      <div className="text-center relative z-10 max-w-6xl mx-auto">
        <motion.h1 
          className="text-3xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to
        </motion.h1>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
        >
          <span
            style={{
              fontFamily: 'Consolas, Monaco, monospace',
              letterSpacing: '-0.5px',
              fontSize: '70px',
              display: 'inline-block',
              background: 'linear-gradient(90deg, #7e22ce, #3b82f6)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 0 10px rgba(123, 104, 238, 0.5)'
            }}
          >
            Submittery
          </span>
        </motion.div>
        
        <motion.p 
          className="mt-8 text-lg max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Practice. Submit. Improve. 🚀
        </motion.p>
        
       {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* AI Code Review Card */}
          <motion.div
            className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 cursor-pointer group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.4)',
              backgroundColor: 'rgba(147, 51, 234, 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="text-2xl mb-2">💡</div>
            <h3 className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors">
              AI Code Review using Gemini
            </h3>
          </motion.div>

          {/* Multi-Language Support Card */}
          <motion.div
            className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 cursor-pointer group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="text-2xl mb-2">🖥</div>
            <h3 className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors">
              Code in C++, Java & Python
            </h3>
          </motion.div>

          {/* Test Evaluation Card */}
          <motion.div
            className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-3 cursor-pointer group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="text-2xl mb-2">🧪</div>
            <h3 className="text-sm font-semibold text-white group-hover:text-green-200 transition-colors">
              Sample & Hidden Test Evaluation
            </h3>
          </motion.div>

          {/* Submission History Card */}
          <motion.div
            className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-sm border border-orange-500/30 rounded-lg p-3 cursor-pointer group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)',
              backgroundColor: 'rgba(249, 115, 22, 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-sm font-semibold text-white group-hover:text-orange-200 transition-colors">
              View Submission History
            </h3>
          </motion.div>
        </motion.div>

        {/* Explore Problems Button - NOW WITH NAVIGATION */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <motion.button
            onClick={handleExploreProblems}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium text-lg shadow-lg cursor-pointer"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px rgba(123, 104, 238, 0.6)'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            Explore Problems
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 relative">
      <SpaceBackground />
      
      {/* Navbar with ensured clickability */}
      <div className="relative z-50">
        <Navbar />
      </div>
      
      <motion.div 
        className="flex-1 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </motion.div>
      
      <Toaster 
        position="top-right" 
        richColors 
        toastOptions={{
          style: {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(30, 30, 30, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 20px rgba(123, 104, 238, 0.3)'
          }
        }} 
      />
    </div>
  );
};

const MotionWrapper = ({ children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="relative"
      {...props}
    >
      {children}
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* ... your particle effects ... */}
      </div>
    </motion.div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/problems" element={<MotionWrapper><ProblemsListPage /></MotionWrapper>} />
          <Route path="/problems/:id" element={<MotionWrapper><ProblemDetailPage /></MotionWrapper>} />
          <Route path="/login" element={<MotionWrapper><LoginPage /></MotionWrapper>} />
          <Route path="/register" element={<MotionWrapper><RegisterPage /></MotionWrapper>} />

          <Route element={<AdminRoute />}>
            <Route path="/admin/problems" element={<MotionWrapper><AdminProblemsListPage /></MotionWrapper>} />
            <Route path="/admin/add-problem" element={<MotionWrapper><AddProblemPage /></MotionWrapper>} />
            <Route path="/admin/problems/edit/:id" element={<MotionWrapper><EditProblemPage /></MotionWrapper>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;