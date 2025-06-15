import { LumonDecorator } from "@/storybook/LumonDecorator";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddTopic } from "./AddTopic";

const meta: Meta<typeof AddTopic> = {
  title: "Components/Topic/Add",
  component: AddTopic,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [LumonDecorator],
};

export default meta;
type Story = StoryObj<typeof AddTopic>;

export const Default: Story = {
  args: {
    discussionId: "discussion1",
    orgId: "org1",
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "users.queries.byOrgId": "loading",
    },
  },
};

export const NoUsers: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "users.queries.byOrgId": [],
    },
  },
};
