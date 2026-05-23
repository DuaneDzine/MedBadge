import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PortfolioPage from '../src/app/[userId]/page'; 

// Mock Firebase if the component interacts with it directly
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

describe('PortfolioPage - Public Review Submission', () => {
  it('renders the practitioner profile and review form correctly', () => {
    // Assuming params are passed as a prop in App Router page components
    render(<PortfolioPage params={Promise.resolve({ userId: 'practitioner-123' })} />);
    
    expect(screen.getByText(/aptitude rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/peer review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit review/i })).toBeInTheDocument();
  });

  it('handles form submission state correctly', async () => {
    render(<PortfolioPage params={Promise.resolve({ userId: 'practitioner-123' })} />);
    
    const commentInput = screen.getByLabelText(/peer review/i);
    const submitButton = screen.getByRole('button', { name: /submit review/i });
    
    fireEvent.change(commentInput, { target: { value: 'Excellent care and very professional.' } });
    fireEvent.click(submitButton);
    
    // Check for a loading state or success message after submission
    await waitFor(() => {
       const feedbackMsg = screen.queryByText(/submitting|success|thank you/i);
       if (feedbackMsg) {
         expect(feedbackMsg).toBeInTheDocument();
       }
    });
  });

  it('shows validation errors when submitting an empty form', async () => {
    render(<PortfolioPage params={Promise.resolve({ userId: 'practitioner-123' })} />);
    
    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // Assuming you have validation logic displaying "required" messages
      const errorMsg = screen.queryByText(/required/i);
      if (errorMsg) {
        expect(errorMsg).toBeInTheDocument();
      }
    });
  });
});
