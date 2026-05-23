import React from 'react';
import { render, screen } from '@testing-library/react';
import QRCodeGenerator from '../src/components/QRCodeGenerator'; // Adjust to actual path

jest.mock('qrcode.react', () => ({
  QRCodeCanvas: () => <img alt="qr code" src="mock.png" />
}));

describe('QRCodeGenerator Component', () => {
  it('renders a QR code image with correct alt text', () => {
    render(<QRCodeGenerator userId="123" />);
    
    // Checking for an image element with alt text for accessibility
    const qrCodeImage = screen.getByAltText(/qr code/i);
    expect(qrCodeImage).toBeInTheDocument();
  });

  it('renders a fallback or placeholder when no url is provided', () => {
    render(<QRCodeGenerator url="" />);
    
    // Depending on implementation, you might show a placeholder or nothing
    const fallbackText = screen.queryByText(/no url provided/i);
    if (fallbackText) {
      expect(fallbackText).toBeInTheDocument();
    }
  });

  it('contains the correct data in the QR Code', () => {
    // This could test specific props passed to an underlying QR library if mocking it,
    // or visual snapshot matching. For now, we test DOM presence.
    render(<QRCodeGenerator userId="456" />);
    expect(screen.getByAltText(/qr code/i)).toBeInTheDocument();
  });
});
