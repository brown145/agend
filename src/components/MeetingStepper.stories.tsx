import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { MeetingStepper } from "./MeetingStepper";

const meta: Meta<typeof MeetingStepper> = {
  title: "Components/MeetingStepper",
  component: MeetingStepper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    stepContents: {
      table: {
        disable: true,
      },
    },
    setActiveStep: {
      action: "setActiveStep",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MeetingStepper>;

// Mock step contents for all stories
const mockStepContents = {
  recap: (disabled: boolean) => (
    <div className={`p-4 ${disabled ? "bg-gray-50" : "bg-white"}`}>
      <p className="text-sm text-gray-600">
        Aliquam quis enim non nunc blandit rutrum.
      </p>
      <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Maecenas posuere nisi quis faucibus interdum.</li>
        <li>Nunc tincidunt ex at urna fringilla imperdiet.</li>
      </ul>
    </div>
  ),
  discussion: (disabled: boolean) => (
    <div className={`p-4 ${disabled ? "bg-gray-50" : "bg-white"}`}>
      <p className="text-sm text-gray-600">
        Aliquam quis enim non nunc blandit rutrum.
      </p>
      <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Maecenas posuere nisi quis faucibus interdum.</li>
        <li>Nunc tincidunt ex at urna fringilla imperdiet.</li>
      </ul>
    </div>
  ),
  review: (disabled: boolean) => (
    <div className={`p-4 ${disabled ? "bg-gray-50" : "bg-white"}`}>
      <p className="text-sm text-gray-600">
        Aliquam quis enim non nunc blandit rutrum.
      </p>
      <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Maecenas posuere nisi quis faucibus interdum.</li>
        <li>Nunc tincidunt ex at urna fringilla imperdiet.</li>
      </ul>
    </div>
  ),
};

export const Default: Story = {
  args: {
    activeStep: 0,
    stepContents: mockStepContents,
  },
};

export const Step1: Story = {
  args: {
    activeStep: 1,
    stepContents: mockStepContents,
  },
};

export const Step2: Story = {
  args: {
    activeStep: 2,
    stepContents: mockStepContents,
  },
};

export const Done: Story = {
  args: {
    activeStep: 3,
    stepContents: mockStepContents,
  },
};

export const Interactive: Story = {
  name: "Interactive Demo",
  render: (args) => {
    const [activeStep, setActiveStep] = useState(0);
    return (
      <MeetingStepper
        {...args}
        stepContents={mockStepContents}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />
    );
  },
  args: {
    activeStep: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Fully interactive stepper where you can click through all the steps and see the state changes.",
      },
    },
  },
};
