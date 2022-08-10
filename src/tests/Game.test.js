import React from "react";
import { screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from "../App";
import Game from "../pages/Game";

describe('Testa a página de Game', () => {
    test('Verifica se a categoria da pergunta é exibida', async () => {
        // renderWithRouterAndRedux(<App />, undefined, '/game');
        // history.push('/game');
        const { history } = renderWithRouterAndRedux(<App />);
        const nameInput = screen.getByTestId('input-player-name');
        const emailInput = screen.getByTestId('input-gravatar-email');
        const playButton = screen.getByTestId('btn-play');
    
        userEvent.type(nameInput, 'Jose');
        userEvent.type(emailInput, 'jose@email.com')
        expect(playButton).toBeEnabled();
    
        userEvent.click(playButton);
        await new Promise((r) => setTimeout(r, 2000));
        const questionCategory = screen.getByTestId('question-category');
        expect(questionCategory).toBeInTheDocument();
    })
     test('Verifica se o texto da pergunta é exibido', () => {
         renderWithRouterAndRedux(<Game />)
         const questionText = screen.getByTestId('question-text');
         expect(questionText).toBeInTheDocument();
    })
     test('Verifica se há um botão "Next" na tela', () => {
         renderWithRouterAndRedux(<Game />);
         const btnNext = screen.getByTestId('btn-next');
         expect(btnNext).toBeInTheDocument();
     });
     test('Verifica se o botão "Next" redireciona para a página de feedback', () => {
         const { history } = renderWithRouterAndRedux(<App />);
         const btnNext = screen.getAllByRole("button", { name: 'Next' });

         userEvent.click(btnNext);

         const { pathname } = history.location;
         expect(pathname).toBe('/feedback');
     });
})