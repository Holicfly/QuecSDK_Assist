import React, { useState, useRef, useEffect, useContext } from 'react';
import { Button, Input, Typography, message } from 'antd';
import { FolderOpenOutlined, PlayCircleOutlined, StopOutlined, CloseCircleFilled } from '@ant-design/icons';
import { ThemeContext } from './ThemeContext';

export default function LeftPanel() {
  const [folder, setFolder] = useState('');
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const outputRef = useRef();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const handleSelectFolder = async () => {
    const path = await window.electronAPI.selectFolder();
    if (path) setFolder(path);
  };

  const handleStart = () => {
    if (!folder || !command) {
      message.warning('请选择文件夹并输入指令');
      return;
    }
    setOutput('');
    setRunning(true);
    window.electronAPI.startCompile({ folder, command });
  };

  const handleCancel = () => {
    window.electronAPI.cancelCompile();
    setRunning(false);
  };

  useEffect(() => {
    // 先移除所有监听，保证只注册一个
    window.electronAPI.removeCompileOutputListeners();
    const listener = (data) => {
      setOutput(prev => prev + data.replace('[__END__]', ''));
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
      if (data.includes('[__END__]')) {
        setRunning(false);
      }
    };
    window.electronAPI.onCompileOutput(listener);
    // 不需要return清理
  }, []);

  // 通过 style 标签注入 placeholder 和清除按钮颜色
  useEffect(() => {
    const styleId = 'custom-input-dark-style';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = isDark ? `
      .ant-input, .ant-input-affix-wrapper {
        background: #181c27 !important;
        color: #fff !important;
      }
      .ant-input::placeholder {
        color: #b0b8c9 !important;
        opacity: 1 !important;
      }
      .ant-input-affix-wrapper .ant-input-clear-icon {
        color: #b0b8c9 !important;
        opacity: 1 !important;
      }
      .ant-btn.folder-btn-dark {
        background: #181c27 !important;
        color: #fff !important;
        border: 1px solid #444 !important;
      }
      .ant-btn.folder-btn-dark:hover {
        background: #23283a !important;
        color: #fff !important;
      }
    ` : `
      .ant-input, .ant-input-affix-wrapper {
        background: #f5f7fa !important;
        color: #222 !important;
      }
      .ant-input::placeholder {
        color: #888 !important;
        opacity: 1 !important;
      }
      .ant-input-affix-wrapper .ant-input-clear-icon {
        color: #888 !important;
        opacity: 1 !important;
      }
      .ant-btn.folder-btn-dark {
        background: #fff !important;
        color: #222 !important;
        border: 1px solid #d9d9d9 !important;
      }
      .ant-btn.folder-btn-dark:hover {
        background: #f5f7fa !important;
        color: #222 !important;
      }
    `;
    return () => {
      // 不移除style，便于切换
    };
  }, [isDark]);

  return (
    <div style={{ padding: 32, minHeight: '100vh', background: isDark ? '#23283a' : '#fff', borderRadius: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Button
          className="folder-btn-dark"
          icon={<FolderOpenOutlined style={{ color: isDark ? '#fff' : undefined }} />}
          onClick={handleSelectFolder}
          style={{
            marginRight: 12,
            fontSize: 14
          }}
        >
          选择文件夹
        </Button>
        <Input
          value={folder}
          readOnly
          style={{ width: 260, marginRight: 0, fontSize: 14 }}
          placeholder="未选择"
          size="middle"
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Input.TextArea
          value={command}
          onChange={e => setCommand(e.target.value)}
          placeholder="请输入指令……"
          style={{ width: 260, marginRight: 12, fontSize: 14, resize: 'none', lineHeight: 1.5, padding: 4 }}
          disabled={running}
          autoSize={{ minRows: 1, maxRows: 4 }}
          allowClear
        />
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleStart}
          disabled={running}
          style={{ marginRight: 8, fontSize: 14 }}
        >开始</Button>
        <Button
          danger
          icon={<StopOutlined />}
          onClick={handleCancel}
          disabled={!running}
          style={{ color: !running && isDark ? '#b0b8c9' : undefined, borderColor: !running && isDark ? '#444' : undefined, background: !running && isDark ? '#23283a' : undefined, fontSize: 14 }}
        >取消</Button>
      </div>
      <Typography.Text style={{ color: isDark ? '#fff' : '#222', fontSize: 14 }}>编译输出：</Typography.Text>
      <div
        ref={outputRef}
        className="output-scrollbar"
        style={{
          height: 220,
          background: isDark ? '#181c27' : '#f5f7fa',
          borderRadius: 8,
          padding: 12,
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: 14,
          color: isDark ? '#fff' : '#222',
          boxShadow: isDark ? '0 1px 8px #10131a' : '0 1px 8px #e0e0e0'
        }}
      >{output || '等待输出……'}</div>
    </div>
  );
} 