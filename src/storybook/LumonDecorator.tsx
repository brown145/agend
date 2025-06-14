import { ConvexClientProviderMock } from "@/app/a/_components/ConvexClientProviderMock";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { Decorator } from "@storybook/nextjs-vite";
import { ConvexProvider } from "convex/react";
import { action } from "storybook/actions";

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
  "topics.queries.byDiscussionId"?:
    | Array<{
        _id: Id<"topics">;
        _creationTime: number;
        text: string;
        completed: boolean;
        owner: Id<"users">;
        createdBy: Id<"users">;
        orgId: Id<"organizations">;
        discussionId: Id<"discussions">;
        freeformOwner?: string;
      }>
    | "loading";
  "topics.queries.byTopicId"?:
    | {
        _id: Id<"topics">;
        _creationTime: number;
        text: string;
        completed: boolean;
        owner: Id<"users">;
        createdBy: Id<"users">;
        orgId: Id<"organizations">;
        discussionId: Id<"discussions">;
        freeformOwner?: string;
        done: boolean;
      }
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

const mockUsersByOrgId = [
  {
    _id: "user1" as Id<"users">,
    _creationTime: 1,
    name: "Mark Scout",
    email: "mark.s@lumon.com",
    isYou: true,
    subject: "Mark Scout",
  },
  {
    _id: "user2" as Id<"users">,
    _creationTime: 2,
    name: "Helly Realname",
    email: "helly.r@lumon.com",
    isYou: false,
    subject: "Helly Realname",
  },
  {
    _id: "user3" as Id<"users">,
    _creationTime: 3,
    name: "Dylan George",
    email: "dylan.g@lumon.com",
    isYou: false,
    subject: "Dylan George",
  },
  {
    _id: "user4" as Id<"users">,
    _creationTime: 4,
    name: "Irving Bailiff",
    email: "irving.b@lumon.com",
    isYou: false,
    subject: "Irving Bailiff",
  },
];

export const mockTasksByTopicId = {
  topic1: [
    {
      _id: "task1" as Id<"tasks">,
      _creationTime: 1,
      text: "Complete project documentation",
      completed: false,
      owner: "user1" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic1" as Id<"topics">,
    },
    {
      _id: "task2" as Id<"tasks">,
      _creationTime: 2,
      text: "Review pull requests",
      completed: true,
      owner: "user2" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic1" as Id<"topics">,
    },
    {
      _id: "task3" as Id<"tasks">,
      _creationTime: 3,
      text: "Schedule team meeting",
      completed: false,
      owner: "user1" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic1" as Id<"topics">,
      freeformOwner: "External Team",
    },
  ],
  topic2: [
    {
      _id: "task4" as Id<"tasks">,
      _creationTime: 4,
      text: "Add some Lumon specific tasks",
      completed: false,
      owner: "user1" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic2" as Id<"topics">,
    },
  ],
  topic3: [],
};

export const mockTopicsByDiscussionId = [
  {
    _id: "topic1" as Id<"topics">,
    _creationTime: 1,
    text: "Discuss Q2 goals",
    completed: false,
    owner: "user1" as Id<"users">,
    createdBy: "user1" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion1" as Id<"discussions">,
  },
  {
    _id: "topic2" as Id<"topics">,
    _creationTime: 2,
    text: "Budget review",
    completed: true,
    owner: "user2" as Id<"users">,
    createdBy: "user1" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion1" as Id<"discussions">,
    freeformOwner: "Finance Team",
  },
  {
    _id: "topic3" as Id<"topics">,
    _creationTime: 2,
    text: "No Tasks",
    completed: false,
    owner: "user2" as Id<"users">,
    createdBy: "user1" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion1" as Id<"discussions">,
  },
];

export const mockTopicsByTopicId = {
  topic1: {
    _id: "topic1" as Id<"topics">,
    _creationTime: 1,
    text: "Discuss Q2 goals",
    completed: false,
    owner: "user1" as Id<"users">,
    createdBy: "user1" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion1" as Id<"discussions">,
    done: false,
  },
  topic2: {
    _id: "topic2" as Id<"topics">,
    _creationTime: 2,
    text: "Budget review",
    completed: true,
    owner: "user2" as Id<"users">,
    createdBy: "user1" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion1" as Id<"discussions">,
    freeformOwner: "Finance Team",
    done: false,
  },
  topic3: {
    _id: "topic3" as Id<"topics">,
    _creationTime: 2,
    text: "No Tasks",
    completed: false,
    owner: "user2" as Id<"users">,
    createdBy: "user1" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion1" as Id<"discussions">,
    done: false,
  },
};

export function createMockClient(
  mockData: MockData = {},
  mockActions: MockActions = {},
) {
  const mockClient = new ConvexClientProviderMock();

  // Register query mocks
  const tasksByTopicId =
    mockData["tasks.queries.byTopicId"] || mockTasksByTopicId;
  if (tasksByTopicId === "loading") {
    mockClient.registerQueryFake(api.tasks.queries.byTopicId, () => undefined);
  } else {
    mockClient.registerQueryFake(
      api.tasks.queries.byTopicId,
      (args: { topicId: Id<"topics"> }) =>
        tasksByTopicId[args.topicId as keyof typeof tasksByTopicId],
    );
  }

  const topicsByDiscussionId =
    mockData["topics.queries.byDiscussionId"] || mockTopicsByDiscussionId;
  if (topicsByDiscussionId === "loading") {
    mockClient.registerQueryFake(
      api.topics.queries.byDiscussionId,
      () => undefined,
    );
  } else {
    mockClient.registerQueryFake(
      api.topics.queries.byDiscussionId,
      () => topicsByDiscussionId,
    );
  }

  const topicsByTopicId =
    mockData["topics.queries.byTopicId"] || mockTopicsByTopicId;
  if (topicsByTopicId === "loading") {
    mockClient.registerQueryFake(api.topics.queries.byTopicId, () => undefined);
  } else {
    mockClient.registerQueryFake(
      api.topics.queries.byTopicId,
      (args: { topicId: Id<"topics"> }) =>
        topicsByTopicId[args.topicId as keyof typeof topicsByTopicId],
    );
  }

  const usersByOrgId = mockData["users.queries.byOrgId"] || mockUsersByOrgId;
  if (usersByOrgId === "loading") {
    mockClient.registerQueryFake(api.users.queries.byOrgId, () => undefined);
    mockClient.registerQueryFake(api.users.queries.byUserId, () => undefined);
  } else {
    mockClient.registerQueryFake(api.users.queries.byOrgId, () => usersByOrgId);
    mockClient.registerQueryFake(
      api.users.queries.byUserId,
      (args: { userId: Id<"users">; orgId: Id<"organizations"> }) =>
        usersByOrgId.find((user) => user._id === args.userId),
    );
  }

  // Register mutation mocks
  mockClient.registerMutationFake(api.tasks.mutations.complete, (args) => {
    const func =
      mockActions["tasks.mutations.complete"] || action("completeTask");
    func(args);
    return null;
  });

  mockClient.registerMutationFake(api.tasks.mutations.create, (args) => {
    const func = mockActions["tasks.mutations.create"] || action("createTask");
    func(args);
    return "task1" as Id<"tasks">;
  });

  return mockClient;
}

export const LumonDecorator: Decorator = (Story, context) => {
  const mockClient = createMockClient(
    context.parameters.mockData as MockData,
    context.parameters.mockActions as MockActions,
  );

  return (
    <ConvexProvider client={mockClient}>
      <Story />
    </ConvexProvider>
  );
};
