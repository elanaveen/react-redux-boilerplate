import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from '../store';
import App from './App';
import boardReducer from '../reducers/boardReducer';
import { feedFor, canView, levelFor, userStats, visibleAnswers, visibleQueries, XP } from '../utils/selectors';
import { login } from '../actions/auth';

beforeEach(() => {
  window.history.pushState({}, '', '/');
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

test('deactivated posts, forums and accounts disappear for students', () => {
  let board = boardReducer(undefined, { type: '@@INIT' });
  const ids = (b) => visibleQueries(b, 'u_new').map((q) => q.id);
  expect(ids(board)).toContain('q9');

  board = boardReducer(board, { type: 'SET_STATUS', payload: { kind: 'query', id: 'q9', status: 'inactive', at: 1 } });
  expect(ids(board)).not.toContain('q9');

  board = boardReducer(board, { type: 'SET_STATUS', payload: { kind: 'forum', id: 'f_bus', status: 'inactive', at: 1 } });
  expect(ids(board)).not.toContain('q3');
  expect(canView(board.forums.f_bus, 'u_karthik')).toBe(false);

  // Suspending an account hides its answers everywhere.
  expect(visibleAnswers(board, board.queries.q2).map((a) => a.id)).toContain('a6');
  board = boardReducer(board, { type: 'SET_STATUS', payload: { kind: 'user', id: 'u_quickcash', status: 'inactive', at: 1 } });
  expect(visibleAnswers(board, board.queries.q2).map((a) => a.id)).not.toContain('a6');

  // Reactivating restores it.
  board = boardReducer(board, { type: 'SET_STATUS', payload: { kind: 'forum', id: 'f_bus', status: 'active', at: 2 } });
  expect(ids(board)).toContain('q3');
});

test('resolving closes every open report on the same target', () => {
  let board = boardReducer(undefined, { type: '@@INIT' });
  const open = (b) => b.reports.filter((r) => r.status === 'open' && r.targetId === 'q9').length;
  expect(open(board)).toBe(2);
  board = boardReducer(board, { type: 'RESOLVE_REPORTS', payload: { targetType: 'query', targetId: 'q9', status: 'actioned', adminId: 'admin', at: 1 } });
  expect(open(board)).toBe(0);
  expect(board.reports.filter((r) => r.targetId === 'a6')[0].status).toBe('open');
});

test('a suspended student cannot sign in', async () => {
  const store = configureStore();
  const creds = { name: 'Rahul', email: 'rahul@college.edu', college: 'VSB', major: '' };
  jest.useFakeTimers();
  let attempt = store.dispatch(login(creds));
  jest.advanceTimersByTime(1000);
  const user = await attempt;
  store.dispatch({ type: 'GET_USER', payload: null });
  store.dispatch({ type: 'SET_STATUS', payload: { kind: 'user', id: user.id, status: 'inactive', at: 1 } });

  attempt = store.dispatch(login(creds));
  jest.advanceTimersByTime(1000);
  jest.useRealTimers();
  await expect(attempt).rejects.toMatch(/suspended/);
  expect(store.getState().user).toBeNull();
});

test('a moderator signs in, sees open reports and deactivates a reported query', async () => {
  const store = configureStore();
  render(<Provider store={store}><App /></Provider>);
  fireEvent.click(screen.getByRole('button', { name: /admin sign in/i }));
  fireEvent.change(screen.getByLabelText(/moderator email/i), { target: { value: 'admin@vsb.student' } });
  fireEvent.change(screen.getByLabelText(/passcode/i), { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in to admin console/i }));
  expect(await screen.findByText(/don't match a moderator account/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/passcode/i), { target: { value: 'vsb-admin' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in to admin console/i }));
  expect(await screen.findByRole('heading', { name: /admin console/i })).toBeInTheDocument();

  const card = screen.getByText(/Earn ₹5000\/day/).closest('article');
  fireEvent.click(within(card).getByRole('button', { name: /deactivate query/i }));
  fireEvent.click(await screen.findByRole('button', { name: /^deactivate$/i }));
  expect(store.getState().board.queries.q9.status).toBe('inactive');
  expect(store.getState().board.reports.filter((r) => r.targetId === 'q9').every((r) => r.status === 'actioned')).toBe(true);
  expect(store.getState().board.modlog[1].text).toMatch(/deactivated query/);
});
