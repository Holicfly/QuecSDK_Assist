import React, { useEffect, useState, useContext } from 'react';
import { Button, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { ThemeContext } from './ThemeContext';

export default function UpdateChecker() {
  const [checking, setChecking] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [rotating, setRotating] = useState(false);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  useEffect(() => {
    // 注册更新事件监听
    const handleUpdateAvailable = () => {
      console.log('收到更新可用事件');
    };
    
    const handleUpdateDownloaded = () => {
      console.log('收到更新已下载事件');
    };
    
    const handleUpdateError = (errorMessage) => {
      console.error('更新错误:', errorMessage);
      message.error(`检查更新失败: ${errorMessage}`);
      setChecking(false);
    };
    
    // 先移除所有监听，确保只注册一次
    window.electronAPI.removeUpdateListeners();
    
    window.electronAPI.onUpdateAvailable(handleUpdateAvailable);
    window.electronAPI.onUpdateDownloaded(handleUpdateDownloaded);
    window.electronAPI.onUpdateError(handleUpdateError);
    
    return () => {
      window.electronAPI.removeUpdateListeners();
    };
  }, []);
  
  const handleMouseEnter = () => {
    setHovered(true);
    setRotating(true);
    setTimeout(() => setRotating(false), 600); // 旋转600ms
  };
  
  const handleMouseLeave = () => {
    setHovered(false);
    setRotating(true);
    setTimeout(() => setRotating(false), 600); // 旋转600ms
  };
  
  const checkForUpdates = async () => {
    if (checking) return;
    
    setChecking(true);
    message.info('正在检查更新...');
    
    try {
      await window.electronAPI.checkForUpdates();
      // 不立即重置checking状态，等待更新事件或错误事件
      setTimeout(() => {
        // 如果5秒内没有收到任何更新事件，则重置状态
        setChecking(false);
      }, 5000);
    } catch (error) {
      console.error('检查更新出错:', error);
      message.error('检查更新失败');
      setChecking(false);
    }
  };
  
  // 自定义按钮样式，解决图标抽动问题
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        height: '28px',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={checkForUpdates}
    >
      {/* 外层容器，控制宽度变化 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: isDark ? 'rgba(35,40,58,0.5)' : 'rgba(245,247,250,0.5)',
          border: isDark ? '1px solid #2c3346' : '1px solid #e6e6e6',
          borderRadius: hovered ? '14px' : '50%',
          width: hovered ? '90px' : '28px',
          height: '28px',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          overflow: 'hidden',
          opacity: checking ? 0.7 : 1
        }}
      >
        {/* 图标容器，保持位置固定 */}
        <div
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <SyncOutlined
            style={{
              fontSize: '14px',
              color: isDark ? '#b0b8c9' : '#666',
              animation: checking ? 'spin 1.2s infinite linear' : 
                      rotating ? 'rotate 0.6s ease' : 'none'
            }}
          />
        </div>
        
        {/* 文字容器 */}
        <div
          style={{
            fontSize: '12px',
            color: isDark ? '#b0b8c9' : '#666',
            marginLeft: '2px',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          检查更新
        </div>
      </div>
      
      {/* 添加CSS动画 */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
} 