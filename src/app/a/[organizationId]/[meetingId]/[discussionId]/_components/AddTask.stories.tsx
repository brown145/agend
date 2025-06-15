import { LumonDecorator } from "@/storybook/LumonDecorator";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddTask } from "./AddTask";

const meta: Meta<typeof AddTask> = {
  title: "Components/Task/Add",
  component: AddTask,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [LumonDecorator],
};

export default meta;
type Story = StoryObj<typeof AddTask>;

export const Default: Story = {
  args: {
    topicId: "topic1",
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
