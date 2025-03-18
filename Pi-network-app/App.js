// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import PostPage from './components/PostPage';
import ProfilePage from './components/ProfilePage';
import { Web3Provider } from './contexts/Web3Context';

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 예시: 블록체인 연결 확인
    // Web3 인스턴스를 사용하여 네트워크 연결을 확인하는 로직 작성
    if (window.ethereum) {
      setIsConnected(true);
    }
  }, []);

  return (
    <Web3Provider>
      <Router>
        <div className="App">
          <h1>Pi Network Application</h1>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/posts">Posts</a></li>
              <li><a href="/profile">Profile</a></li>
            </ul>
          </nav>
          
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/posts" component={PostPage} />
            <Route path="/profile" component={ProfilePage} />
          </Switch>
          
          {!isConnected && (
            <div>
              <p>Please connect your wallet to continue.</p>
            </div>
          )}
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
