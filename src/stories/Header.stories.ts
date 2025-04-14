import type { Meta, StoryObj } from '@storybook/react';

import { Header } from './Header';

const meta = {
  title: 'Example/Header',
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: 'Jane Doe',
    },
    onLogin: () => console.log('Logged in'),
    onLogout: () => console.log('Logged out'),
    onCreateAccount: () => console.log('Account created'),
  },
};

export const LoggedOut: Story = {
  args: {
    onLogin: () => console.log('Logged in'),
    onLogout: () => console.log('Logged out'),
    onCreateAccount: () => console.log('Account created'),
  },
};
