'use client';
import { AppShell } from '@mantine/core';
import { ChatWindow } from '../components/ChatWindow/ChatWindow';

export default function HomePage() {
  return (
    <>
      <AppShell padding="md">
        <AppShell.Main>
          <ChatWindow />
        </AppShell.Main>
      </AppShell>
    </>
  );
}
