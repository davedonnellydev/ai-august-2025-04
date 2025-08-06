import { render, screen, userEvent, waitFor } from '@/test-utils';
import { ClientRateLimiter } from '../../app/lib/utils/api-helpers';
import { ChatWindow } from './ChatWindow';

// Mock the ClientRateLimiter
jest.mock('../../app/lib/utils/api-helpers', () => ({
  ClientRateLimiter: {
    getRemainingRequests: jest.fn(() => 10),
    checkLimit: jest.fn(() => true),
  },
}));

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ChatWindow component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initial render and accessibility', () => {
    it('renders minimized chat button by default', () => {
      render(<ChatWindow />);
      expect(screen.getByLabelText('Open chat assistant')).toBeInTheDocument();
      expect(screen.queryByText('Chat Assistant')).not.toBeInTheDocument();
    });

    it('has proper accessibility attributes for minimized state', () => {
      render(<ChatWindow />);
      const chatButton = screen.getByLabelText('Open chat assistant');
      expect(chatButton).toHaveAttribute('aria-label', 'Open chat assistant');
    });

    it('expands chat window when minimized button is clicked', async () => {
      const user = userEvent.setup();
      render(<ChatWindow />);

      const chatButton = screen.getByLabelText('Open chat assistant');
      await user.click(chatButton);

      expect(screen.getByText('Chat Assistant')).toBeInTheDocument();
      expect(screen.getByLabelText('Type your message')).toBeInTheDocument();
      expect(screen.getByLabelText('Send message')).toBeInTheDocument();
    });

    it('has proper accessibility attributes for expanded state', async () => {
      const user = userEvent.setup();
      render(<ChatWindow />);

      const chatButton = screen.getByLabelText('Open chat assistant');
      await user.click(chatButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText('Chat assistant')).toBeInTheDocument();
      expect(screen.getByLabelText('Reset conversation')).toBeInTheDocument();
      expect(screen.getByLabelText('Minimize chat')).toBeInTheDocument();
    });
  });

  describe('Chat functionality', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ChatWindow />);

      const chatButton = screen.getByLabelText('Open chat assistant');
      await user.click(chatButton);
    });

    it('allows user to type in message input', async () => {
      const user = userEvent.setup();
      const input = screen.getByLabelText('Type your message');

      await user.type(input, 'Hello world');
      expect(input).toHaveValue('Hello world');
    });

    it('shows error when trying to send empty message', async () => {
      const user = userEvent.setup();
      const sendButton = screen.getByLabelText('Send message');

      await user.click(sendButton);

      expect(screen.getByText('Error: Please enter a message')).toBeInTheDocument();
    });

    it('sends message when Enter key is pressed', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: 'Test response',
          responseId: 'test-id-123',
        }),
      } as Response);

      const user = userEvent.setup();
      const input = screen.getByLabelText('Type your message');

      await user.type(input, 'Test message');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/openai/responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: 'Test message',
            previous_response_id: null,
          }),
        });
      });
    });

    it('allows new line with Shift+Enter', async () => {
      const user = userEvent.setup();
      const input = screen.getByLabelText('Type your message');

      await user.type(input, 'Line 1');
      await user.keyboard('{Shift>}{Enter}');
      await user.type(input, 'Line 2');

      expect(input).toHaveValue('Line 1\nLine 2');
    });
  });

  describe('API integration', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ChatWindow />);

      const chatButton = screen.getByLabelText('Open chat assistant');
      await user.click(chatButton);
    });

    it('makes API call when sending message', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: 'Test response',
          responseId: 'test-id-123',
        }),
      } as Response);

      const user = userEvent.setup();
      const input = screen.getByLabelText('Type your message');
      const sendButton = screen.getByLabelText('Send message');

      await user.type(input, 'Hello');
      await user.click(sendButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/openai/responses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: 'Hello',
            previous_response_id: null,
          }),
        });
      });
    });

    it('handles API errors gracefully', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'API Error' }),
      } as Response);

      const user = userEvent.setup();
      const input = screen.getByLabelText('Type your message');
      const sendButton = screen.getByLabelText('Send message');

      await user.type(input, 'Hello');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Error: API Error')).toBeInTheDocument();
      });
    });

    it('stores response ID in localStorage on successful API call', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: 'Test response',
          responseId: 'test-id-123',
        }),
      } as Response);

      const user = userEvent.setup();
      const input = screen.getByLabelText('Type your message');
      const sendButton = screen.getByLabelText('Send message');

      await user.type(input, 'Hello');
      await user.click(sendButton);

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'previous_response_id',
          'test-id-123'
        );
      });
    });
  });

  describe('Reset functionality', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ChatWindow />);

      const chatButton = screen.getByLabelText('Open chat assistant');
      await user.click(chatButton);
    });

    it('clears input and response when reset is clicked', async () => {
      const user = userEvent.setup();
      const input = screen.getByLabelText('Type your message');
      const resetButton = screen.getByLabelText('Reset conversation');

      await user.type(input, 'Test message');
      await user.click(resetButton);

      expect(input).toHaveValue('');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('previous_response_id');
    });

    it('clears localStorage when reset is clicked', async () => {
      const user = userEvent.setup();
      const resetButton = screen.getByLabelText('Reset conversation');

      await user.click(resetButton);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('previous_response_id');
    });
  });

  describe('Minimize/Maximize functionality', () => {
    it('minimizes chat window when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<ChatWindow />);

      // Expand the chat
      const chatButton = screen.getByLabelText('Open chat assistant');
      await user.click(chatButton);

      // Verify it's expanded
      expect(screen.getByText('Chat Assistant')).toBeInTheDocument();

      // Minimize it
      const closeButton = screen.getByLabelText('Minimize chat');
      await user.click(closeButton);

      // Verify it's minimized
      expect(screen.queryByText('Chat Assistant')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Open chat assistant')).toBeInTheDocument();
    });
  });

  describe('Previous conversation loading', () => {
    it('loads previous conversation from localStorage', async () => {
      localStorageMock.getItem.mockReturnValue('previous-id-123');

      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              id: 'msg-1',
              type: 'message',
              status: 'completed',
              content: [
                {
                  type: 'input_text',
                  text: 'Previous message',
                },
              ],
              role: 'user',
            },
          ],
        }),
      } as Response);

      const user = userEvent.setup();
      render(<ChatWindow />);

      const chatButton = screen.getByLabelText('Open chat assistant');
      await user.click(chatButton);

      await waitFor(() => {
        expect(screen.getByText('user:')).toBeInTheDocument();
        expect(screen.getByText('Previous message')).toBeInTheDocument();
      });
    });
  });

  describe('Rate limiting', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ChatWindow />);

      const chatButton = screen.getByLabelText('Open chat assistant');
      await user.click(chatButton);
    });

    it('shows rate limit error when limit is exceeded', async () => {
      (ClientRateLimiter.checkLimit as jest.Mock).mockReturnValue(false);
      (ClientRateLimiter.getRemainingRequests as jest.Mock).mockReturnValue(0);

      const user = userEvent.setup();
      const input = screen.getByLabelText('Type your message');
      const sendButton = screen.getByLabelText('Send message');

      await user.type(input, 'Hello');
      await user.click(sendButton);

      expect(
        screen.getByText('Error: Rate limit exceeded. Please try again later.')
      ).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('maintains accessibility on mobile devices', async () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const user = userEvent.setup();
      render(<ChatWindow />);

      const chatButton = screen.getByLabelText('Open chat assistant');
      await user.click(chatButton);

      // Verify all interactive elements are accessible
      expect(screen.getByLabelText('Type your message')).toBeInTheDocument();
      expect(screen.getByLabelText('Send message')).toBeInTheDocument();
      expect(screen.getByLabelText('Reset conversation')).toBeInTheDocument();
      expect(screen.getByLabelText('Minimize chat')).toBeInTheDocument();
    });
  });
});
