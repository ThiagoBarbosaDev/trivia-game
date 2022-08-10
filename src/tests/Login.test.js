import React from "react";
import { screen, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import Login from "../pages/Login";
import App from "../App";

describe('Testa a página de Login.', () => {
  test('Verifica se existe um input de nome na tela', () => {
    renderWithRouterAndRedux(<Login />);
    const nameInput = screen.getByTestId('input-player-name');
    expect(nameInput).toBeInTheDocument();
  })
  test('Verifica se existe um input de e-mail na tela', () => {
    renderWithRouterAndRedux(<Login />);
    const emailInput = screen.getByTestId('input-gravatar-email');
    expect(emailInput).toBeInTheDocument();
  })
  test('Verifica se existe o botão Play na tela e o seu funcionamento', () => {
    renderWithRouterAndRedux(<Login />);
    const nameInput = screen.getByTestId('input-player-name');
    const emailInput = screen.getByTestId('input-gravatar-email');
    const playButton = screen.getAllByRole("button", { name: 'Play' })[0];

    userEvent.type(nameInput, 'Jose');
    userEvent.type(emailInput, 'jose@email.com')

    expect(playButton).toBeInTheDocument();
  })
  test('Verifica se o usuário é redirecionado para a página /game', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const nameInput = screen.getByTestId('input-player-name');
    const emailInput = screen.getByTestId('input-gravatar-email');
    const playButton = screen.getByTestId('btn-play');

    userEvent.type(nameInput, 'Jose');
    userEvent.type(emailInput, 'jose@email.com')
    expect(playButton).toBeEnabled();

    userEvent.click(playButton);
    await new Promise((r) => setTimeout(r, 2000));
    const { pathname } = history.location;
    expect(pathname).toBe('/game');
  })
  test('Verifica se existe o botão Settings na tela', () => {
    renderWithRouterAndRedux(<Login />);
    const settingsButton = screen.getAllByRole("button", { name: 'Settings' })[0];
    expect(settingsButton).toBeInTheDocument();
  })

  test('Verifica se o usuário é redirecionado para a página /settings', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const settingsButton = screen.getAllByRole("button", { name: 'Settings' })[0];

    userEvent.click(settingsButton);
   
    const { pathname } = history.location;
    expect(pathname).toBe('/settings');

  })
})