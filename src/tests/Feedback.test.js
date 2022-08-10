import { screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import React from "react";
import App from "../App";
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';

describe('Testa a página de Feedback.', () => {
  test('Verifica se é renderizada uma imagem do usuário', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const imgUser = screen.getByTestId('header-profile-picture');
    expect(imgUser).toBeInTheDocument();
  })
  test('Verifica se o nome do usuário é renderizado', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const nameUser = screen.getByTestId('header-player-name');
    expect(nameUser).toBeInTheDocument();
  })
  test('Verifica se o score é renderizado', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const scoreUser = screen.getByTestId('header-score');
    expect(scoreUser).toBeInTheDocument();
  })
  test('Verifica se um texto de Feedback é renderizado', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const feedbackText = screen.getByTestId('feedback-text');
    expect(feedbackText).toBeInTheDocument();
  })
  test('Verifica se o total de questões acertadas é renderizado', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const totalQuestions = screen.getByTestId('feedback-total-question');
    expect(totalQuestions).toBeInTheDocument();
  })
  test('Verifica se o total score é renderizado', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const totalScore = screen.getByTestId('feedback-total-score');
    expect(totalScore).toBeInTheDocument();
  })
  test('Verifica se o botão play again é renderizado', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const playAgainButton = screen.getByTestId('btn-play-again');
    expect(playAgainButton).toBeInTheDocument();
  })
  test('Verifica se ao clicar no botão play again o ususário é redirecionado para a página de login', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const rankingButton = screen.getByTestId('btn-play-again');
    userEvent.click(rankingButton);
    expect(history.location.pathname).toBe('/');
  })
  test('Verifica se o botão ranking é renderizado', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const rankingButton = screen.getByTestId('btn-ranking');
    expect(rankingButton).toBeInTheDocument();
  })
  test('Verifica se ao clicar no botão ranking o ususário é redirecionado para a página de ranking', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const rankingButton = screen.getByTestId('btn-ranking');
    userEvent.click(rankingButton);
    expect(history.location.pathname).toBe('/ranking');
  })
  test('aqui', () => {
    const initialState = {
      player: {
      name:"Jorge Casé",
      assertions: 5,
      score: 0,
      gravatarEmail: "jorgekzbra@gmail.com",
      }  
    }
    renderWithRouterAndRedux(<App />, initialState, '/feedback');
    const wellDone = screen.getByRole('heading', { name: /well done!/i});
    expect(wellDone).toBeInTheDocument();
  })
})