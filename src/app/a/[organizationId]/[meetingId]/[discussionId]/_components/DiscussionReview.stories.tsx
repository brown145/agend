import {
  LumonDecorator,
  mockPreviousDiscussions,
} from "@/storybook/LumonDecorator";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DiscussionReview from "./DiscussionReview";

const meta: Meta<typeof DiscussionReview> = {
  title: "Components/Discussion/Review",
  component: DiscussionReview,
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
type Story = StoryObj<typeof DiscussionReview>;

export const Default: Story = {
  args: {
    discussionId: "discussion1",
    organizationId: "org1",
    editable: true,
  },
};

export const NotEditable: Story = {
  args: {
    ...Default.args,
    editable: false,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "discussions.queries.byDiscussionId": "loading",
      "discussions.queries.previousIncompletedDiscussions": "loading",
    },
  },
};

export const OnePreviousDiscussions: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "discussions.queries.previousIncompletedDiscussions": [
        mockPreviousDiscussions[0],
      ],
    },
  },
};

export const NoPreviousDiscussions: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "discussions.queries.previousIncompletedDiscussions": [],
    },
  },
};
