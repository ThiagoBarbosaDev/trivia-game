import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Feedback from './pages/Feedback';
import Game from './pages/Game/Game';
import Login from './pages/Login/Login';
import Ranking from './pages/Ranking';
import Settings from './pages/Settings/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.scss';
import './styles/variables.scss';

export default function App() {
  return (
    <Switch>
      <Route path="/ranking" component={ Ranking } />
      <Route path="/feedback" component={ Feedback } />
      <Route path="/settings" component={ Settings } />
      <Route path="/game" component={ Game } />
      <Route exact path="/" component={ Login } />
    </Switch>
  );
}
