import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from '../store';
import App from './App';
import boardReducer from '../reducers/boardReducer';
import { feedFor, canView } from '../utils/selectors';

beforeEach(() => {
  localStorage.clear();
  document.cookie.split(';').forEach((c) => { document.cookie = c.split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'; });
});

test('shows the Can Forums sign-in page', () => {
  render(<Provider store={configureStore()}><App /></Provider>);
  expect(screen.getByText(/Your campus can/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
});

test('private forums hide queries until a join request is approved', () => {
  let board = boardReducer(undefined, { type: '@@INIT' });
  const calc = board.forums.f_calc;
  expect(canView(calc, 'u_leo')).toBe(false);
  expect(feedFor(board, 'u_leo', 'latest').some((q) => q.forumId === 'f_calc')).toBe(false);

  board = boardReducer(board, { type: 'RESOLVE_REQUEST', payload: { forumId: 'f_calc', userId: 'u_leo', approve: true } });
  expect(board.forums.f_calc.requests).not.toContain('u_leo');
  expect(canView(board.forums.f_calc, 'u_leo')).toBe(true);
  expect(feedFor(board, 'u_leo', 'latest').some((q) => q.forumId === 'f_calc')).toBe(true);
});

test('following a public forum adds it to the For you feed; only one accepted answer', () => {
  let board = boardReducer(undefined, { type: '@@INIT' });
  expect(feedFor(board, 'u_new', 'foryou').some((q) => q.forumId === 'f_orgo')).toBe(false);
  board = boardReducer(board, { type: 'FOLLOW_FORUM', payload: { forumId: 'f_orgo', userId: 'u_new' } });
  expect(feedFor(board, 'u_new', 'foryou').some((q) => q.forumId === 'f_orgo')).toBe(true);

  board = boardReducer(board, { type: 'ACCEPT_ANSWER', payload: { queryId: 'q2', answerId: 'a2' } });
  board = boardReducer(board, { type: 'ACCEPT_ANSWER', payload: { queryId: 'q2', answerId: 'a3' } });
  expect(board.queries.q2.answers.filter((a) => a.accepted).map((a) => a.id)).toEqual(['a3']);
});

test('a student can sign in and ask a query', async () => {
  jest.useFakeTimers();
  render(<Provider store={configureStore()}><App /></Provider>);
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Naveen Ela' } });
  fireEvent.change(screen.getByLabelText(/college email/i), { target: { value: 'naveen@college.edu' } });
  fireEvent.change(screen.getByLabelText(/^college$/i), { target: { value: 'State Institute of Technology' } });
  fireEvent.click(screen.getByRole('button', { name: /continue/i }));
  await act(async () => { jest.advanceTimersByTime(1000); });
  jest.useRealTimers();

  expect(await screen.findByText(/Naveen$/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/your question/i), { target: { value: 'How do I prepare for the DBMS mid-sem?\nAny must-do topics?' } });
  fireEvent.click(screen.getByRole('button', { name: /^ask$/i }));
  expect(await screen.findByRole('heading', { name: /How do I prepare for the DBMS mid-sem\?/ })).toBeInTheDocument();
  expect(screen.getByText(/Any must-do topics\?/)).toBeInTheDocument();
});
