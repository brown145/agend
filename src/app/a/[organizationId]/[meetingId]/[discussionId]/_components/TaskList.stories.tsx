import { LumonDecorator } from "@/storybook/LumonDecorator";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TaskList } from "./TaskList";

const meta: Meta<typeof TaskList> = {
  title: "Components/Task/List",
  component: TaskList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    LumonDecorator,
    (Story) => (
      <div className="min-w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskList>;

export const Default: Story = {
  args: {
    topicId: "topic1",
    orgId: "org1",
    addable: true,
    completeable: true,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "tasks.queries.byTopicId": "loading",
      "users.queries.byUserId": "loading",
      "users.queries.byOrgId": "loading",
    },
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "tasks.queries.byTopicId": {
        topic1: [],
      },
    },
  },
};

export const NotAddable: Story = {
  args: {
    ...Default.args,
    addable: false,
  },
};

export const NotCompleteable: Story = {
  args: {
    ...Default.args,
    completeable: false,
  },
};
