import React from "react";
import { screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from "../App";
import Ranking from "../pages/Ranking";

describe('Testa a página de Raking.', () => {
  test('Verifica se a página possui um título com o texto "Raking"', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/ranking');
    const title = screen.getByTestId('ranking-title');
    expect(title).toBeInTheDocument();
  })
  test('Verifica se o botão Home é renderizado', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/ranking');
    const homeButton = screen.getByTestId('btn-go-home');
    expect(homeButton).toBeInTheDocument();
  })
  test('Verifica se ao clicar no botão Home o ususário é redirecionado para a página de login', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/ranking');
    const homeButton = screen.getByTestId('btn-go-home');
    userEvent.click(homeButton);
    expect(history.location.pathname).toBe('/');
  })
})
