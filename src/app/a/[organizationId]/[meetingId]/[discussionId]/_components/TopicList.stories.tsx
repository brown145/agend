import { LumonDecorator } from "@/storybook/LumonDecorator";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TopicList } from "./TopicList";

const meta: Meta<typeof TopicList> = {
  title: "Components/Topic/List",
  component: TopicList,
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
type Story = StoryObj<typeof TopicList>;

export const Default: Story = {
  args: {
    discussionId: "discussion1",
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
      "topics.queries.byDiscussionId": "loading",
      "topics.queries.byTopicId": "loading",
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
      "topics.queries.byDiscussionId": [],
    },
  },
};

export const EmptyWithoutFallback: Story = {
  args: {
    ...Default.args,
    showEmptyState: false,
  },
  parameters: {
    mockData: {
      "topics.queries.byDiscussionId": [],
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

export const CompletedWithDone: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "topics.queries.byTopicId": {
        topic2: {
          _id: "topic2",
          _creationTime: 2,
          text: "Budget review - All tasks complete",
          completed: true,
          owner: "user2",
          createdBy: "user1",
          orgId: "org1",
          discussionId: "discussion1",
          freeformOwner: "Finance Team",
          done: true, // This will show the strikethrough
        },
      },
    },
  },
};
