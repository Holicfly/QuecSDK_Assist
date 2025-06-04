import React, { useContext } from 'react';
import { Card, Typography, Button } from 'antd';
import { ThemeContext } from './ThemeContext';
import { BulbOutlined, MoonOutlined } from '@ant-design/icons';

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
          minHeight: 200
        }}
        bordered={false}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <img src={'/df.png'} alt="logo" style={{ width: 28, height: 28, borderRadius: 6, boxShadow: isDark ? '0 1px 4px #10131a' : '0 1px 4px #e0e0e0', objectFit: 'cover' }} />
          <Typography.Title level={4} style={{ color: isDark ? '#fff' : '#222', fontSize: 22, margin: 0 }}>移远SDK辅助工具</Typography.Title>
        </div>
        <Typography.Text style={{ color: isDark ? '#fff' : '#222', fontSize: 14 }}>作者：Holicfly</Typography.Text>
        <br />
        <Typography.Text style={{ color: isDark ? '#fff' : '#222', fontSize: 14 }}>版本：v1.0.0</Typography.Text>
        <br />
        <Typography.Text type="secondary" style={{ color: isDark ? '#b0b8c9' : '#888', fontSize: 13 }}>SDK编译一键执行工具，哦哦哦哦~</Typography.Text>
      </Card>
      <Button
        shape="round"
        size="small"
        icon={isDark ? <BulbOutlined /> : <MoonOutlined />}
        style={{
          position: 'absolute',
          right: 18,
          bottom: 18,
          background: isDark ? '#23283a' : '#f5f7fa',
          color: isDark ? '#fff' : '#222',
          border: '1px solid #b0b8c9',
          borderRadius: 20,
          fontSize: 13,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: '0 12px',
          minWidth: 0
        }}
        onClick={toggleTheme}
      >
        {isDark ? '明亮' : '暗黑'}
      </Button>
    </div>
  );
} 