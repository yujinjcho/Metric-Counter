import React from 'react';
import { render } from 'react-dom';
import Leaderboard from './components/Leaderboard';

if (window.location.pathname.match('leaderboard')) {
  render(<Leaderboard />, document.getElementById('leaderboard'));
}
