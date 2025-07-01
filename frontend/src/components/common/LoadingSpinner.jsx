import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, Heart, Share2, Bell, Settings, Camera, Globe, Zap, Shield } from 'lucide-react';

const LoadingSpinner = ({ size = 'xl' }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 12 + 3;
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative w-24 h-24"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Outer orbital ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{
          background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #3b82f6)',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute inset-2 rounded-full border border-purple-500/40"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Inner spinning elements */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: -180 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              transform: `rotate(${i * 90}deg) translateY(-30px)`
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Center pulse */}
      <motion.div
        className="absolute inset-0 m-auto w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
        animate={{
          scale: [1, 1.4, 1],
          boxShadow: [
            '0 0 0 0 rgba(139, 92, 246, 0.7)',
            '0 0 0 10px rgba(139, 92, 246, 0)',
            '0 0 0 0 rgba(139, 92, 246, 0)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Progress indicator */}
      <motion.div
        className="absolute -bottom-12 left-0 right-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="text-center text-sm text-gray-400 mb-2">
          {Math.round(progress)}%
        </div>
        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const FloatingElement = ({ children, delay = 0, duration = 6 }) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.05, 1]
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

const SocialExperienceLoader = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [visibleFeatures, setVisibleFeatures] = useState(new Set());
  const [connectionNodes, setConnectionNodes] = useState([]);

  const loadingStages = [
    { text: "Establishing secure connection", detail: "Encrypting your data" },
    { text: "Synchronizing your social graph", detail: "Loading connections" },
    { text: "Preparing personalized content", detail: "Curating your feed" },
    { text: "Initializing real-time features", detail: "Setting up notifications" },
    { text: "Optimizing your experience", detail: "Almost ready" }
  ];

  const socialFeatures = [
    { Icon: Users, label: "Social Network", position: { top: '20%', left: '15%' } },
    { Icon: MessageCircle, label: "Live Messaging", position: { top: '15%', right: '20%' } },
    { Icon: Heart, label: "Engagement", position: { bottom: '25%', left: '20%' } },
    { Icon: Share2, label: "Content Sharing", position: { bottom: '20%', right: '15%' } },
    { Icon: Bell, label: "Real-time Updates", position: { top: '40%', left: '8%' } },
    { Icon: Camera, label: "Media Upload", position: { top: '35%', right: '8%' } },
    { Icon: Globe, label: "Global Reach", position: { bottom: '40%', left: '10%' } },
    { Icon: Zap, label: "Instant Sync", position: { bottom: '35%', right: '10%' } }
  ];

  // Generate connection nodes
  useEffect(() => {
    const nodes = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2
    }));
    setConnectionNodes(nodes);
  }, []);

  // Cycle through loading stages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage(prev => (prev + 1) % loadingStages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Show features progressively
  useEffect(() => {
    const timeouts = socialFeatures.map((_, index) => {
      return setTimeout(() => {
        setVisibleFeatures(prev => new Set([...prev, index]));
      }, index * 800 + 1000);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-black overflow-hidden">
      {/* Dynamic background gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 25% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Connection network background */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {connectionNodes.map((node, i) => 
          connectionNodes.slice(i + 1).map((otherNode, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${otherNode.x}%`}
              y2={`${otherNode.y}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0],
                pathLength: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: (i + j) * 0.2,
                ease: "easeInOut"
              }}
            />
          ))
        )}
        {connectionNodes.map((node, i) => (
          <motion.circle
            key={i}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [node.opacity, node.opacity * 2, node.opacity],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>

      {/* Floating social features */}
      <AnimatePresence>
        {socialFeatures.map((feature, index) => (
          visibleFeatures.has(index) && (
            <motion.div
              key={feature.label}
              className="absolute z-10"
              style={feature.position}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              <FloatingElement delay={index * 0.5} duration={6 + index}>
                <div className="relative group">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-slate-700/50 backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotateY: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.Icon className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
                    
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                      animate={{
                        opacity: [0, 0.5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.4
                      }}
                    />
                  </motion.div>
                  
                  {/* Feature label */}
                  <motion.div
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="text-xs text-slate-400 font-medium bg-slate-900/80 px-2 py-1 rounded-md">
                      {feature.label}
                    </span>
                  </motion.div>
                </div>
              </FloatingElement>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Central loading area */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {/* Main brand */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-4 tracking-tight"
            animate={{
              backgroundImage: [
                'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                'linear-gradient(45deg, #8b5cf6, #ec4899)',
                'linear-gradient(45deg, #ec4899, #f59e0b)',
                'linear-gradient(45deg, #f59e0b, #10b981)',
                'linear-gradient(45deg, #10b981, #3b82f6)'
              ]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Connect
          </motion.h1>
          
          <motion.p
            className="text-xl text-slate-400 font-light"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Your Social Experience Awaits
          </motion.p>
        </motion.div>

        {/* Main loading spinner */}
        <motion.div
          className="mb-16"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
        >
          <LoadingSpinner />
        </motion.div>

        {/* Loading stage information */}
        <motion.div
          className="text-center max-w-md"
          key={currentStage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            {loadingStages[currentStage].text}
          </h3>
          <p className="text-slate-400 text-sm">
            {loadingStages[currentStage].detail}
          </p>
        </motion.div>

        {/* Status indicators */}
        <motion.div
          className="flex space-x-4 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {loadingStages.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                index <= currentStage ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-700'
              }`}
              animate={{
                scale: index === currentStage ? [1, 1.3, 1] : 1,
                opacity: index <= currentStage ? 1 : 0.5
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom ambient lighting */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-64 bg-gradient-to-t from-purple-900/10 via-blue-900/5 to-transparent"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Side glow effects */}
      <motion.div
        className="absolute top-1/4 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  );
};

export default SocialExperienceLoader;