"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [deviceOS, setDeviceOS] = useState<string>("");
  const [status, setStatus] = useState<string>("환경 감지 중...");

  // 앱 설정
  const appConfig = {
    android: {
        appUrl: 'coinshotjp://deeplink', // 안드로이드 앱 스킴
        storeUrl: 'https://play.google.com/store/apps/details?id=com.finshotjp.coinshot',
        webUrl: 'https://jp.coinshot.org/'
    },
    ios: {
        appUrl: 'coinshotjp://deeplink', // iOS 앱 스킴 (대체용)
        storeUrl: 'https://apps.apple.com/app/1603552176',
        webUrl: 'https://jp.coinshot.org/'
    },
    web: {
        webUrl: 'https://jp.coinshot.org/'
    }
};

  // 디바이스 OS 감지
  function getDeviceOS() {
    // window에 추가 속성을 위한 인터페이스 확장
    interface ExtendedWindow extends Window {
      opera?: unknown;
      MSStream?: unknown;
    }
    
    const extWindow = window as ExtendedWindow;
    const userAgent = navigator.userAgent || navigator.vendor || extWindow.opera;
    
    if (/android/i.test(userAgent as string)) {
      return 'android';
    }
    
    if (/iPad|iPhone|iPod/.test(userAgent as string) && !extWindow.MSStream) {
      return 'ios';
    }
    
    return 'web';
  }
  
  // 앱으로 리다이렉션 시도
  function tryOpenApp(os: string) {
    if (os === 'web') {
      window.location.href = appConfig.web.webUrl;
      return;
    }
    
    const config = appConfig[os as 'android' | 'ios'];  // 타입을 명시적으로 지정
    
    if (os === 'ios') {
      window.location.href = config.storeUrl;
    } else {
      window.location.href = config.appUrl;
      
      setTimeout(function() {
        if (document.hidden) return;
        setStatus('앱을 찾을 수 없습니다. 스토어로 이동합니다...');
        window.location.href = config.storeUrl;
      }, 1500);
    }
  }

  useEffect(() => {
    const os = getDeviceOS();
    setDeviceOS(os);
    setStatus('감지된 환경: ' + 
      (os === 'android' ? '안드로이드' : 
      os === 'ios' ? 'iOS' : '웹 브라우저'));
    
    // 자동 리다이렉션 즉시 실행
    tryOpenApp(os);
  }, []);

  const handleAppButtonClick = () => {
    if (deviceOS === 'web') return;
    const config = appConfig[deviceOS as 'android' | 'ios'];
    window.location.href = config.appUrl;
  };
  
  const handleStoreButtonClick = () => {
    if (deviceOS === 'web') return;
    const config = appConfig[deviceOS as 'android' | 'ios'];
    window.location.href = config.storeUrl;
  };
  
  const handleWebButtonClick = () => {
    const config = appConfig[deviceOS === 'web' ? 'web' : deviceOS as keyof typeof appConfig];
    window.location.href = config.webUrl;
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.h1}>앱 리다이렉션</h1>
        <div style={styles.status} id="status">{status}</div>
        <div style={{...styles.manualButtons, display: 'block'}}>
          <button style={styles.button} onClick={handleAppButtonClick}>앱 열기</button>
          <button style={styles.button} onClick={handleStoreButtonClick}>스토어로 이동</button>
          <button style={styles.button} onClick={handleWebButtonClick}>웹사이트로 이동</button>
        </div>
      </div>
    </div>
  );
}
const styles = {
  body: {
    fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
    textAlign: 'center' as const,
    margin: 0,
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  h1: {
    color: '#333'
  },
  status: {
    margin: '20px 0',
    padding: '10px',
    borderRadius: '5px',
    background: '#f0f0f0'
  },
  button: {
    background: '#4285f4',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  manualButtons: {
    marginTop: '20px'
  }
};