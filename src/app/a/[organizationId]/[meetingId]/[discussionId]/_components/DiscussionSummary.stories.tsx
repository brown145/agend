import { LumonDecorator } from "@/storybook/LumonDecorator";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DiscussionSummary from "./DiscussionSummary";

const meta: Meta<typeof DiscussionSummary> = {
  title: "Components/Discussion/Summary",
  component: DiscussionSummary,
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
type Story = StoryObj<typeof DiscussionSummary>;

export const Default: Story = {
  args: {
    discussionId: "discussion1",
    organizationId: "org1",
    meetingId: "meeting1",
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "discussions.queries.byDiscussionId": "loading",
      "meetings.queries.byMeetingId": "loading",
      "topics.queries.byDiscussionId": "loading",
    },
  },
};

export const NoTopics: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "topics.queries.byDiscussionId": [],
    },
  },
};
