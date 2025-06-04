import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import { ThemeContext } from './components/ThemeContext';

const { Sider, Content } = Layout;

export default function App() {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Layout style={{ background: theme === 'dark' ? '#181c27' : '#f5f7fa' }}>
        <Sider
          width={500}
          style={{
            background: theme === 'dark' ? '#181c27' : '#f5f7fa',
            boxShadow: theme === 'dark' ? '2px 0 8px #10131a' : '2px 0 8px #e0e0e0',
            overflow: 'auto',
            height: '100vh'
          }}
        >
          <LeftPanel />
        </Sider>
        <Content style={{ padding: 32, background: theme === 'dark' ? '#181c27' : '#f5f7fa', minHeight: '100vh' }}>
          <RightPanel />
        </Content>
      </Layout>
    </ThemeContext.Provider>
  );
} 