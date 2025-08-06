'use client';

import { AppShell, Box, Button, Container, Group, Text, Title } from '@mantine/core';
import { ChatWindow } from '../components/ChatWindow/ChatWindow';

export default function HomePage() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header p="md">
        <Group justify="space-between" align="center" h="100%">
          <Title order={1} size="h3">
            Portfolio Example
          </Title>
          <Group gap="md" visibleFrom="sm">
            <Button variant="subtle" size="sm" aria-label="About page">
              About
            </Button>
            <Button variant="subtle" size="sm" aria-label="Contact page">
              Contact
            </Button>
          </Group>
          <Button variant="subtle" size="sm" hiddenFrom="sm" aria-label="Menu">
            ☰
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          {/* Hero Section */}
          <Box py={{ base: 40, sm: 60 }} ta="center" px="md">
            <Title order={1} size="h1" mb="md">
              This is an example portfolio.
            </Title>
            <Text size="xl" c="dimmed" mb="xl">
              This is an example portfolio website to demonstrate the chat assistant functionality.
            </Text>
          </Box>

          {/* Chat Assistant Notice */}
          <Box
            py={{ base: 30, sm: 40 }}
            ta="center"
            px="md"
            style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px dashed #007bff',
              marginTop: '40px',
            }}
            role="region"
            aria-label="Chat assistant information"
          >
            <Title order={3} size="h3" mb="md" c="blue">
              💬 Try the Chat Assistant!
            </Title>
            <Text size="lg" mb="md">
              Look for the blue chat icon in the bottom right corner of your screen.
            </Text>
            <Text c="dimmed">
              Click it to start a conversation and ask questions about this website or anything
              else!
            </Text>
          </Box>

          {/* About Section */}
          <Box py={40}>
            <Title order={2} size="h2" mb="lg" ta="center">
              About Me
            </Title>
            <Text size="lg" ta="center" maw={800} mx="auto">
              This is a sample about section. In a real portfolio, you would include information
              about your background, skills, and experience. The chat assistant in the bottom right
              corner can help you learn more about this website or answer any questions you might
              have.
            </Text>
          </Box>

          {/* Projects Section */}
          <Box py={40}>
            <Title order={2} size="h2" mb="lg" ta="center">
              Sample Projects
            </Title>
            <Group gap="lg" justify="center">
              <Box w={300} p="md" style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <Title order={3} size="h4" mb="sm">
                  Project 1
                </Title>
                <Text c="dimmed">
                  This is a sample project description. Click the chat icon to learn more!
                </Text>
              </Box>
              <Box w={300} p="md" style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <Title order={3} size="h4" mb="sm">
                  Project 2
                </Title>
                <Text c="dimmed">
                  Another sample project. The chat assistant can provide more details.
                </Text>
              </Box>
              <Box w={300} p="md" style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <Title order={3} size="h4" mb="sm">
                  Project 3
                </Title>
                <Text c="dimmed">
                  A third example project. Try asking the assistant about this one!
                </Text>
              </Box>
            </Group>
          </Box>
        </Container>
      </AppShell.Main>

      <ChatWindow />
    </AppShell>
  );
}
