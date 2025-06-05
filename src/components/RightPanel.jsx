import React, { useContext } from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { ThemeContext } from './ThemeContext';
import { BulbOutlined, MoonOutlined } from '@ant-design/icons';
import packageInfo from '../../package.json';
import UpdateChecker from './UpdateChecker';

export default function RightPanel() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Card
        style={{
          maxWidth: 300,
          margin: 'auto',
          borderRadius: 16,
          boxShadow: isDark ? '0 2px 16px #10131a' : '0 2px 16px #e6f7ff',
          background: isDark ? 'rgba(35,40,58,0.95)' : '#fff',
          color: isDark ? '#fff' : '#222',
          minHeight: 200,
          position: 'relative',
          paddingBottom: 40
        }}
        bordered={false}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <img src="./df.png" alt="logo" style={{ width: 28, height: 28, borderRadius: 6, boxShadow: isDark ? '0 1px 4px #10131a' : '0 1px 4px #e0e0e0', objectFit: 'cover' }} />
          <Typography.Title level={4} style={{ color: isDark ? '#fff' : '#222', fontSize: 22, margin: 0 }}>
            {packageInfo.productName || packageInfo.name}
          </Typography.Title>
        </div>
        <Typography.Text style={{ color: isDark ? '#fff' : '#222', fontSize: 14 }}>
          作者：{packageInfo.author}
        </Typography.Text>
        <br />
        <Typography.Text style={{ color: isDark ? '#fff' : '#222', fontSize: 14 }}>
          版本：v{packageInfo.version}
        </Typography.Text>
        <br />
        <Typography.Text type="secondary" style={{ color: isDark ? '#b0b8c9' : '#888', fontSize: 13 }}>
          {packageInfo.description}
        </Typography.Text>
        
        {/* 底部按钮容器 */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 24,
          paddingRight: 24
        }}>
          {/* 左侧更新按钮 */}
          <UpdateChecker />
          
          {/* 右侧主题切换按钮 */}
          <Button
            shape="round"
            size="small"
            icon={isDark ? <BulbOutlined /> : <MoonOutlined />}
            style={{
              background: isDark ? 'rgba(35,40,58,0.5)' : 'rgba(245,247,250,0.5)',
              color: isDark ? '#b0b8c9' : '#666',
              border: isDark ? '1px solid #2c3346' : '1px solid #e6e6e6',
              borderRadius: 20,
              fontSize: 13,
              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
              padding: '0 12px',
              height: '28px',
              minWidth: 0,
              transition: 'all 0.3s'
            }}
            onClick={toggleTheme}
          >
            {isDark ? '明亮' : '暗黑'}
          </Button>
        </div>
      </Card>
    </div>
  );
} 