import { ConvexClientProviderMock } from "@/app/a/_components/ConvexClientProviderMock";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ConvexProvider } from "convex/react";
import { action } from "storybook/actions";
import { TaskList } from "./TaskList";

//----
type MockData = {
  "tasks.queries.byTopicId"?:
    | Array<{
        _id: Id<"tasks">;
        _creationTime: number;
        text: string;
        completed: boolean;
        owner: Id<"users">;
        createdBy: Id<"users">;
        orgId: Id<"organizations">;
        topicId: Id<"topics">;
        freeformOwner?: string;
      }>
    | "loading";
  "users.queries.byUserId"?:
    | {
        _id: Id<"users">;
        _creationTime: number;
        name: string;
        email: string;
        subject: string;
      }
    | "loading";
  "users.queries.byOrgId"?:
    | Array<{
        _id: Id<"users">;
        _creationTime: number;
        name: string;
        email: string;
        subject: string;
        isYou: boolean;
      }>
    | "loading";
};

type MockActions = {
  "tasks.mutations.complete"?: ReturnType<typeof action>;
  "tasks.mutations.create"?: ReturnType<typeof action>;
};

const createMockClient = (
  mockData: MockData = {},
  mockActions?: MockActions,
) => {
  const mockClient = new ConvexClientProviderMock();

  // Register query mocks
  if (mockData["tasks.queries.byTopicId"]) {
    const data = mockData["tasks.queries.byTopicId"];
    if (data === "loading") {
      mockClient.registerQueryFake(
        api.tasks.queries.byTopicId,
        () => undefined,
      );
    } else {
      mockClient.registerQueryFake(api.tasks.queries.byTopicId, () => data);
    }
  }

  if (mockData["users.queries.byUserId"]) {
    const data = mockData["users.queries.byUserId"];
    if (data === "loading") {
      mockClient.registerQueryFake(api.users.queries.byUserId, () => undefined);
    } else {
      mockClient.registerQueryFake(api.users.queries.byUserId, () => data);
    }
  }

  if (mockData["users.queries.byOrgId"]) {
    const data = mockData["users.queries.byOrgId"];
    if (data === "loading") {
      mockClient.registerQueryFake(api.users.queries.byOrgId, () => undefined);
    } else {
      mockClient.registerQueryFake(api.users.queries.byOrgId, () => data);
    }
  }

  // Register mutation mocks
  if (mockActions?.["tasks.mutations.complete"]) {
    mockClient.registerMutationFake(api.tasks.mutations.complete, (args) => {
      mockActions["tasks.mutations.complete"]!(args);
      return null;
    });
  }

  if (mockActions?.["tasks.mutations.create"]) {
    mockClient.registerMutationFake(api.tasks.mutations.create, (args) => {
      mockActions["tasks.mutations.create"]!(args);
      return "task1" as Id<"tasks">;
    });
  }

  return mockClient;
};
//----

const meta: Meta<typeof TaskList> = {
  title: "Task/List",
  component: TaskList,
  parameters: {
    layout: "centered",
    mockData: {
      "tasks.queries.byTopicId": [
        {
          _id: "task1" as Id<"tasks">,
          _creationTime: Date.now(),
          text: "Complete project documentation",
          completed: false,
          owner: "user1" as Id<"users">,
          createdBy: "user1" as Id<"users">,
          orgId: "org1" as Id<"organizations">,
          topicId: "topic1" as Id<"topics">,
        },
        {
          _id: "task2" as Id<"tasks">,
          _creationTime: Date.now(),
          text: "Review pull requests",
          completed: true,
          owner: "user2" as Id<"users">,
          createdBy: "user1" as Id<"users">,
          orgId: "org1" as Id<"organizations">,
          topicId: "topic1" as Id<"topics">,
        },
        {
          _id: "task3" as Id<"tasks">,
          _creationTime: Date.now(),
          text: "Schedule team meeting",
          completed: false,
          owner: "user1" as Id<"users">,
          createdBy: "user1" as Id<"users">,
          orgId: "org1" as Id<"organizations">,
          topicId: "topic1" as Id<"topics">,
          freeformOwner: "External Team",
        },
      ],
      "users.queries.byUserId": {
        _id: "user1" as Id<"users">,
        _creationTime: Date.now(),
        name: "John Doe",
        email: "john@example.com",
        subject: "john@example.com",
      },
      "users.queries.byOrgId": [
        {
          _id: "user1" as Id<"users">,
          _creationTime: Date.now(),
          name: "John Doe",
          email: "john@example.com",
          subject: "john@example.com",
          isYou: true,
        },
        {
          _id: "user2" as Id<"users">,
          _creationTime: Date.now(),
          name: "Jane Smith",
          email: "jane@example.com",
          subject: "jane@example.com",
          isYou: false,
        },
      ],
    },
    mockActions: {
      "tasks.mutations.complete": action("completeTask"),
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
      "tasks.queries.byTopicId": [],
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
