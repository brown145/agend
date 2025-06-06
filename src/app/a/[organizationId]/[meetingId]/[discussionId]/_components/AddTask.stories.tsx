import { ConvexClientProviderMock } from "@/app/a/_components/ConvexClientProviderMock";
import { createUserMocks } from "@/mocks/createUserMock";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ConvexProvider } from "convex/react";
import { action } from "storybook/actions";
import { AddTask } from "./AddTask";

//----
type MockData = {
  "users.queries.byOrgId"?:
    | Array<{
        name: string;
        email: string;
        isYou?: boolean;
      }>
    | "loading";
};

type MockActions = {
  "tasks.mutations.create"?: ReturnType<typeof action>;
};

const createMockClient = (
  mockData: MockData = {},
  mockActions?: MockActions,
) => {
  const mockClient = new ConvexClientProviderMock();

  // Register query mocks
  if (mockData["users.queries.byOrgId"]) {
    const data = mockData["users.queries.byOrgId"];
    if (data === "loading") {
      mockClient.registerQueryFake(api.users.queries.byOrgId, () => undefined);
    } else {
      mockClient.registerQueryFake(api.users.queries.byOrgId, () =>
        createUserMocks(data),
      );
    }
  }

  // Register mutation mocks
  if (mockActions?.["tasks.mutations.create"]) {
    mockClient.registerMutationFake(api.tasks.mutations.create, (args) => {
      mockActions["tasks.mutations.create"]!(args);
      return "task1" as Id<"tasks">;
    });
  }

  return mockClient;
};
//----

const meta: Meta<typeof AddTask> = {
  title: "Task/Add",
  component: AddTask,
  parameters: {
    layout: "centered",
    mockData: {
      "users.queries.byOrgId": [
        { name: "Mark Scout", email: "mark.s@lumon.com", isYou: true },
        { name: "Helly Realname", email: "helly.r@lumon.com" },
        { name: "Dylan George", email: "dylan.g@lumon.com" },
        { name: "Irving Bailiff", email: "irving.b@lumon.com" },
      ],
    },
    mockActions: {
      "tasks.mutations.create": action("createTask"),
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const mockClient = createMockClient(
        context.parameters.mockData as MockData,
        context.parameters.mockActions as MockActions,
      );
      return (
        <ConvexProvider client={mockClient}>
          <Story />
        </ConvexProvider>
      );
    },
  ],
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
      "users.queries.byOrgId": "loading", // Simulate loading state
    },
  },
};

export const NoUsers: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: {
      "users.queries.byOrgId": [], // Override with empty users array
    },
  },
};
