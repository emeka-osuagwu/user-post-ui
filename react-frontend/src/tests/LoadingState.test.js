import { render, screen } from '@testing-library/react';
import LoadingState from '../components/LoadingState';

test('displays loading message', () => {
  render(<LoadingState />);
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});
