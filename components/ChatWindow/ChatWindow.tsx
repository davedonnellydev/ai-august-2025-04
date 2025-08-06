'use client';

import { useEffect, useState } from 'react';
import { IconMessageCircle, IconX } from '@tabler/icons-react';
import { Box, Button, Group, ScrollArea, Text, Textarea, Tooltip } from '@mantine/core';
import { PreviousResponse } from '@/app/lib/api/types';
import { ClientRateLimiter } from '@/app/lib/utils/api-helpers';
import classes from './ChatWindow.module.css';

export function ChatWindow() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingRequests, setRemainingRequests] = useState(0);
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);
  const [inputItems, setInputItems] = useState<PreviousResponse[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);

  // Update remaining requests on component mount and after translations
  useEffect(() => {
    setRemainingRequests(ClientRateLimiter.getRemainingRequests());
  }, []);

  // set previousResponseId if it exists in localStorage
  useEffect(() => {
    if (localStorage.getItem('previous_response_id')) {
      setPreviousResponseId(localStorage.getItem('previous_response_id'));
    }
  }, []);

  // set inputItemsList if it exists
  useEffect(() => {
    if (previousResponseId) {
      getInputItemList(previousResponseId).then((itemList) => {
        if (itemList) {
          setInputItems(itemList);
          console.log(itemList);
        }
      });
    }
  }, [previousResponseId]);

  const getInputItemList = async (previous_response_id: string) => {
    if (!previous_response_id) {
      setError('No previous_response_id set');
      return;
    }

    try {
      const response = await fetch(`/api/openai/responses/${previous_response_id}/input_items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.error || 'API call failed');
      }

      const result = await response.json();
      return result.data;

      // Update remaining requests after successful translation
    } catch (err) {
      console.error('API error:', err);
      setError(err instanceof Error ? err.message : 'API failed');
    }
  };

  const handleRequest = async () => {
    if (!input.trim()) {
      setError('Please enter a message');
      return;
    }

    // Check rate limit before proceeding
    if (!ClientRateLimiter.checkLimit()) {
      setError('Rate limit exceeded. Please try again later.');
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/openai/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          previous_response_id: previousResponseId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.error || 'API call failed');
      }

      const result = await response.json();

      // Store response_id in localStorage if it exists
      if (result.responseId) {
        localStorage.setItem('previous_response_id', result.responseId);
        setPreviousResponseId(result.responseId);
      }
      console.log(result.responseObject);
      setResponse(result.response);

      // Update remaining requests after successful translation
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
    } catch (err) {
      console.error('API error:', err);
      setError(err instanceof Error ? err.message : 'API failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Clear localStorage
    localStorage.removeItem('previous_response_id');
    // Clear all state
    setInput('');
    setResponse('');
    setError('');
    setPreviousResponseId(null);
    setInputItems([]);
  };

  const handleClose = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  return (
    <>
      {isMinimized ? (
        <Tooltip label="Click to chat" position="left">
          <Button
            className={classes.minimizedChat}
            onClick={handleMaximize}
            variant="filled"
            color="blue"
            size="lg"
            radius="xl"
            aria-label="Open chat assistant"
          >
            <IconMessageCircle size={24} />
          </Button>
        </Tooltip>
      ) : (
        <Box className={classes.chatWindow} role="dialog" aria-label="Chat assistant">
          {/* Header */}
          <Box className={classes.header}>
            <Text size="lg" fw={600}>
              Chat Assistant
            </Text>
            <Group gap="xs">
              <Button
                variant="subtle"
                size="sm"
                onClick={handleReset}
                color="gray"
                aria-label="Reset conversation"
              >
                Reset
              </Button>
              <Button
                variant="subtle"
                size="sm"
                onClick={handleClose}
                color="gray"
                aria-label="Minimize chat"
              >
                <IconX size={16} />
              </Button>
            </Group>
          </Box>

          {/* Messages Area */}
          <ScrollArea className={classes.messagesArea} aria-label="Chat messages">
            {inputItems.length > 0 && (
              <Box className={classes.messagesContainer} role="log" aria-live="polite">
                {inputItems.map((item, index) => {
                  if (item.type === 'message') {
                    return item.content.map((content, contentIndex) => (
                      <Box
                        key={`${index}-${contentIndex}`}
                        className={`${classes.message} ${classes[item.role]}`}
                        role="article"
                        aria-label={`${item.role} message`}
                      >
                        <Text size="sm" fw={500} className={classes.roleLabel}>
                          {item.role}:
                        </Text>
                        <Text size="sm" className={classes.messageText}>
                          {content.text}
                        </Text>
                      </Box>
                    ));
                  }
                  return null;
                })}
              </Box>
            )}

            {error && (
              <Text c="red" size="sm" className={classes.errorMessage} role="alert">
                Error: {error}
              </Text>
            )}

            {response && (
              <Box
                className={`${classes.message} ${classes.assistant}`}
                role="article"
                aria-label="Assistant message"
              >
                <Text size="sm" fw={500} className={classes.roleLabel}>
                  assistant:
                </Text>
                <Text size="sm" className={classes.messageText}>
                  {response}
                </Text>
              </Box>
            )}
          </ScrollArea>

          {/* Input Area */}
          <Box className={classes.inputArea}>
            <Group gap="xs" align="flex-end">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                size="sm"
                radius="md"
                placeholder="Type your message..."
                className={classes.messageInput}
                minRows={1}
                maxRows={4}
                autosize
                aria-label="Type your message"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleRequest();
                  }
                }}
              />
              <Button
                variant="filled"
                color="blue"
                onClick={handleRequest}
                loading={isLoading}
                size="sm"
                aria-label="Send message"
              >
                Send
              </Button>
            </Group>

            <Text c="dimmed" size="xs" mt="xs" aria-live="polite">
              {remainingRequests} messages remaining
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
}
