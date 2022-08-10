import React from "react";
import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import App from "../App";

const { questionsResponse, invalidTokenQuestionsResponse } = require('../../cypress/mocks/questions');

const initialState = {
  player: {
  name:"Jorge Casé",
  assertions: 0,
  score: 0,
  gravatarEmail: "jorgekzbra@gmail.com",
  }  
}

function timerGame(callback) {
    setTimeout(() => {
        callback && callback();
    }, 2000);
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('Testa a página de Game', () => {
  test('Verifica se a página Game possui o estado inicial correspondente', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(questionsResponse),
    });

    const { store, history } = renderWithRouterAndRedux(<App />, initialState, '/game');
    const { location: { pathname } } = history

    expect(pathname).toBe('/game');
    expect(store.getState().player).toEqual(initialState.player);
})
  test('Verifica se o usuário é redirecionado para a página inicial caso o token seja inválido', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(invalidTokenQuestionsResponse),
    });
  
    const { history } = renderWithRouterAndRedux(<App />, initialState, '/game')
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const { location: { pathname } } = history
    expect(pathname).toBe('/')
  })
  test('Verifica se a imagem do Gravatar é renderizada no header', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(questionsResponse),
    });
    renderWithRouterAndRedux(<App />, initialState, '/game');
    await waitFor(() => expect(fetch).toHaveBeenCalled());
        
    const imgPlayer = screen.getByTestId('header-profile-picture');
    expect(imgPlayer).toBeInTheDocument();
  })
  test('Verifica se o nome do jogador é renderizado no header', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(questionsResponse),
    });
    renderWithRouterAndRedux(<App />, initialState, '/game');
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const namePlayer = screen.getByTestId('header-player-name');
    expect(namePlayer).toBeInTheDocument();
  })
  test('Verifica se o score é renderizado no header', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(questionsResponse),
    });
    renderWithRouterAndRedux(<App />, initialState, '/game');
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const namePlayer = screen.getByTestId('header-score');
    expect(namePlayer).toBeInTheDocument();
  })
  test('Verifica se a categoria da questão é renderizada', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(questionsResponse),
    });
    renderWithRouterAndRedux(<App />, initialState, '/game');
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const question = screen.getByTestId('question-text');
    expect(question).toBeInTheDocument();
    expect(question).toHaveTextContent(questionsResponse.results[0].question);
    })

    test('Verifica se o botão Next é renderizado caso a alternativa correta tenha sido selecionada', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(questionsResponse),
    });
    renderWithRouterAndRedux(<App />, initialState, '/game');
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const correctAnswer = screen.getByTestId('correct-answer');
    userEvent.click(correctAnswer);
    const nextButton = screen.getByTestId('btn-next');
    expect(nextButton).toBeInTheDocument();

    userEvent.click(nextButton);
    const question = screen.getByTestId('question-text');
    expect(question).toBeInTheDocument();
    expect(question).toHaveTextContent(questionsResponse.results[1].question);
  })
  test('Verifica se o botão Next é renderizado caso a alternativa incorreta tenha sido selecionada', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(questionsResponse),
    });
    renderWithRouterAndRedux(<App />, initialState, '/game');
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const incorrectAnswer = screen.getByTestId('wrong-answer');
    
    userEvent.click(incorrectAnswer);
    const nextButton = screen.getByTestId('btn-next');
    expect(nextButton).toBeInTheDocument();

    userEvent.click(nextButton);
    const question = screen.getByTestId('question-text');
    expect(question).toBeInTheDocument();
    expect(question).toHaveTextContent(questionsResponse.results[1].question);

  })
  test('Verifica se a página feedback é renderizada após responder 5 perguntas', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(questionsResponse),
    });
    jest.spyOn(global, 'clearInterval')
    jest.spyOn(global, 'clearTimeout')
    const { history } = renderWithRouterAndRedux(<App />, initialState, '/game');
    await new Promise((r) => setTimeout(r, 2000));

    const correctAnswer1 = screen.getByTestId('correct-answer')
    userEvent.click(correctAnswer1);
    const nextButton1 = await screen.findByRole('button', { name: /next/i });
    userEvent.click(nextButton1)

    const correctAnswer2 = await screen.findByTestId('correct-answer')
    userEvent.click(correctAnswer2);
    const nextButton2 = await screen.findByRole('button', { name: /next/i });
    userEvent.click(nextButton2)

    const correctAnswer3 = await screen.findByTestId('correct-answer')
    userEvent.click(correctAnswer3);
    const nextButton3 = await screen.findByRole('button', { name: /next/i });
    userEvent.click(nextButton3)

    const correctAnswer4 = await screen.findByTestId('correct-answer')
    userEvent.click(correctAnswer4);
    const nextButton4 = await screen.findByRole('button', { name: /next/i });
    userEvent.click(nextButton4)

    const correctAnswer5 = await screen.findByTestId('correct-answer')
    userEvent.click(correctAnswer5);
    const nextButton5 = await screen.findByRole('button', { name: /next/i });
    userEvent.click(nextButton5)

    expect(clearInterval).toHaveBeenCalled()
    expect(clearTimeout).toHaveBeenCalled()
    screen.logTestingPlaygroundURL()

    expect(history.location.pathname).toBe('/feedback')
  })
  test('Verifica se o botão Next é renderizado após 30 segundos', async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(questionsResponse),
    });
    jest.spyOn(global, 'clearInterval')
    jest.spyOn(global, 'clearTimeout')
    const { history } = renderWithRouterAndRedux(<App />, initialState, '/game');
    // await new Promise((r) => setTimeout(r, 2000));
    
    await waitForElementToBeRemoved(() => screen.getByText('loading...'))

    screen.logTestingPlaygroundURL()
    jest.advanceTimersByTime(32000);
    
    expect(screen.queryAllByText('Next')).toHaveLength(1);

    // setTimeout(() => {
    //   const nextButton = screen.getByRole('button', { name: /next/i });
    //   expect(nextButton).toBeInTheDocument()}, 31000)
    // expect(nextButton).toBeInTheDocument();

    // expect(clearInterval).toHaveBeenCalled()

  })
})