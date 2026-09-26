import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from '../store';
import App from './App';
import boardReducer from '../reducers/boardReducer';
import { feedFor, canView, levelFor, userStats, XP } from '../utils/selectors';

beforeEach(() => {
  localStorage.clear();
  document.cookie.split(';').forEach((c) => { document.cookie = c.split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'; });
});

test('shows the VSB Forums sign-in page', () => {
  render(<Provider store={configureStore()}><App /></Provider>);
  expect(screen.getByText(/Ask VSB/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
});

test('private forums hide queries until a join request is approved', () => {
  let board = boardReducer(undefined, { type: '@@INIT' });
  const aids = board.forums.f_aids;
  expect(canView(aids, 'u_karthik')).toBe(false);
  expect(feedFor(board, 'u_karthik', 'latest').some((q) => q.forumId === 'f_aids')).toBe(false);

  board = boardReducer(board, { type: 'RESOLVE_REQUEST', payload: { forumId: 'f_aids', userId: 'u_karthik', approve: true } });
  expect(board.forums.f_aids.requests).not.toContain('u_karthik');
  expect(canView(board.forums.f_aids, 'u_karthik')).toBe(true);
  expect(feedFor(board, 'u_karthik', 'latest').some((q) => q.forumId === 'f_aids')).toBe(true);
});

test('following a public forum adds it to the For you feed; only one accepted answer', () => {
  let board = boardReducer(undefined, { type: '@@INIT' });
  expect(feedFor(board, 'u_new', 'foryou')).toEqual(feedFor(board, 'u_new', 'latest'));
  board = boardReducer(board, { type: 'FOLLOW_FORUM', payload: { forumId: 'f_hostel', userId: 'u_new' } });
  const forYou = feedFor(board, 'u_new', 'foryou');
  expect(forYou.some((q) => q.forumId === 'f_hostel')).toBe(true);
  expect(forYou.some((q) => q.forumId === 'f_dsa')).toBe(false);

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

  expect(await screen.findByText(/Vanakkam, Naveen/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/your question/i), { target: { value: 'How do I prepare for the DBMS mid-sem?\nAny must-do topics?' } });
  fireEvent.click(screen.getByRole('button', { name: /^ask$/i }));
  expect(await screen.findByRole('heading', { name: /How do I prepare for the DBMS mid-sem\?/ })).toBeInTheDocument();
  expect(screen.getByText(/Any must-do topics\?/)).toBeInTheDocument();
  expect(screen.getByText(/Query posted/)).toBeInTheDocument();
});

test('XP adds up from answers, accepted answers and reactions, and levels follow', () => {
  let board = boardReducer(undefined, { type: '@@INIT' });
  const before = userStats(board, 'u_arjun').points;
  board = boardReducer(board, { type: 'ACCEPT_ANSWER', payload: { queryId: 'q2', answerId: 'a2' } });
  board = boardReducer(board, { type: 'REACT_ANSWER', payload: { queryId: 'q2', answerId: 'a2', emoji: '🔥', userId: 'u_priya' } });
  expect(userStats(board, 'u_arjun').points).toBe(before + XP.accepted + XP.reaction);
  expect(levelFor(0).name).toBe('Fresher');
  expect(levelFor(65)).toMatchObject({ name: 'Helper', index: 3 });
  expect(levelFor(999).next).toBeNull();
});
