import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Loader from "./Loader";

const meta: Meta<typeof Loader> = {
  title: "Components/UI/Loader",
  component: Loader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  args: {},
};

export const WithText: Story = {
  args: {
    text: "Loading...",
  },
};

export const CustomText: Story = {
  args: {
    text: "Please wait while we process your request",
  },
};
