import { LumonDecorator } from "@/storybook/LumonDecorator";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DiscussionClient } from "./DiscussionClient";

const meta: Meta<typeof DiscussionClient> = {
  title: "Features/Discussion/Client",
  component: DiscussionClient,
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
type Story = StoryObj<typeof DiscussionClient>;

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
      "meetings.queries.byMeetingId": "loading",
      "discussions.queries.byDiscussionId": "loading",
      "discussions.queries.previousIncompletedDiscussions": "loading",
      "topics.queries.byDiscussionId": "loading",
      "topics.queries.byTopicId": "loading",
      "users.queries.byUserId": "loading",
      "users.queries.byOrgId": "loading",
    },
  },
};

export const NextDiscussion: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "meetings.queries.byMeetingId": {
        _id: "meeting1",
        nextDiscussionId: "discussion1",
        orgId: "org1",
      },
      "discussions.queries.byDiscussionId": {
        _id: "discussion1",
        activeStep: 1,
        orgId: "org1",
      },
    },
  },
};

export const RecapStep: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "discussions.queries.byDiscussionId": {
        _id: "discussion1",
        activeStep: 0,
        orgId: "org1",
      },
    },
  },
};

export const DiscussionStep: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "discussions.queries.byDiscussionId": {
        _id: "discussion1",
        activeStep: 1,
        orgId: "org1",
      },
    },
  },
};

export const ReviewStep: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "discussions.queries.byDiscussionId": {
        _id: "discussion1",
        activeStep: 2,
        orgId: "org1",
      },
    },
  },
};
