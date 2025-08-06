'use client';

import { useEffect, useState } from 'react';
import { Button, Text, TextInput, Title } from '@mantine/core';
import { PreviousResponse } from '@/app/lib/api/types';
import { ClientRateLimiter } from '@/app/lib/utils/api-helpers';
import classes from './Welcome.module.css';

export function Welcome() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingRequests, setRemainingRequests] = useState(0);
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);
  const [inputItems, setInputItems] = useState<PreviousResponse[]>([]);

  // Update remaining requests on component mount and after translations
  useEffect(() => {
    if (localStorage.getItem('previous_response_id')) {
      setPreviousResponseId(localStorage.getItem('previous_response_id'));
    }
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
      setError('Please enter some text to translate');
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
    setInput('');
    setResponse('');
    setError('');
  };

  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to your{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Starter
        </Text>
      </Title>

      {inputItems.length > 0 && (
        <div style={{ maxWidth: 600, margin: '20px auto', padding: '20px' }}>
          <Text size="lg" fw={500} mb="md">
            Previous Conversation:
          </Text>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {inputItems.map((item, index) => {
              if (item.type === 'message') {
                return item.content.map((content, contentIndex) => (
                  <li key={`${index}-${contentIndex}`} style={{ marginBottom: '8px' }}>
                    <Text size="sm" c="dimmed">
                      {item.role} ({content.type}): {content.text}
                    </Text>
                  </li>
                ));
              }
              return null;
            })}
          </ul>
        </div>
      )}

      <div style={{ maxWidth: 600, margin: '20px auto', padding: '20px' }}>
        <TextInput
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          size="md"
          radius="md"
          label="Ask a Question"
          placeholder="How big is the earth?"
        />

        <Button variant="filled" color="cyan" onClick={() => handleRequest()} loading={isLoading}>
          Ask Question
        </Button>
        <Button variant="light" color="cyan" onClick={() => handleReset()}>
          Reset
        </Button>

        {error && (
          <Text c="red" ta="center" size="lg" maw={580} mx="auto" mt="xl">
            Error: {error}
          </Text>
        )}

        {response && (
          <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
            Answer: {response}
          </Text>
        )}
      </div>

      <Text c="dimmed" ta="center" size="sm" maw={580} mx="auto" mt="xl">
        You have {remainingRequests} questions remaining.
      </Text>
    </>
  );
}
