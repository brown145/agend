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
        isClosed: boolean;
        isResolved: boolean;
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
        isClosed: boolean;
        isResolved: boolean;
        owner: Id<"users">;
        createdBy: Id<"users">;
        orgId: Id<"organizations">;
        discussionId: Id<"discussions">;
        freeformOwner?: string;
      }>
    | Record<
        string,
        Array<{
          _id: Id<"topics">;
          _creationTime: number;
          text: string;
          isClosed: boolean;
          isResolved: boolean;
          owner: Id<"users">;
          createdBy: Id<"users">;
          orgId: Id<"organizations">;
          discussionId: Id<"discussions">;
          freeformOwner?: string;
        }>
      >
    | "loading";
  "topics.queries.byTopicId"?:
    | {
        _id: Id<"topics">;
        _creationTime: number;
        text: string;
        isClosed: boolean;
        isResolved: boolean;
        owner: Id<"users">;
        createdBy: Id<"users">;
        orgId: Id<"organizations">;
        discussionId: Id<"discussions">;
        freeformOwner?: string;
        done: boolean;
      }
    | "loading";
  "discussions.queries.byDiscussionId"?:
    | {
        _id: Id<"discussions">;
        _creationTime: number;
        date?: string;
        activeStep: number;
        isClosed: boolean;
        isResolved: boolean;
        createdBy: Id<"users">;
        meetingId: Id<"meetings">;
        orgId: Id<"organizations">;
      }
    | "loading";
  "discussions.queries.previousIncompletedDiscussions"?:
    | Array<{
        _id: Id<"discussions">;
        _creationTime: number;
        date?: string;
        activeStep: number;
        isClosed: boolean;
        isResolved: boolean;
        createdBy: Id<"users">;
        meetingId: Id<"meetings">;
        orgId: Id<"organizations">;
      }>
    | "loading";
  "meetings.queries.byMeetingId"?:
    | {
        _id: Id<"meetings">;
        _creationTime: number;
        nextDiscussionId?: Id<"discussions">;
        orgId: Id<"organizations">;
        isYours: boolean;
        owner: {
          _id: Id<"users">;
          _creationTime: number;
          name: string;
          email: string;
          subject: string;
        } | null;
        previousDiscussion: {
          _id: Id<"discussions">;
          _creationTime: number;
          date: string;
          activeStep: number;
          isClosed: boolean;
          isResolved: boolean;
          createdBy: Id<"users">;
          meetingId: Id<"meetings">;
          orgId: Id<"organizations">;
        };
        createdBy: Id<"users">;
        title: string;
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
  "tasks.mutations.close"?: ReturnType<typeof action>;
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
      isClosed: false,
      isResolved: false,
      owner: "user1" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic1" as Id<"topics">,
    },
    {
      _id: "task2" as Id<"tasks">,
      _creationTime: 2,
      text: "Review pull requests",
      isClosed: true,
      isResolved: true,
      owner: "user2" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic1" as Id<"topics">,
    },
    {
      _id: "task3" as Id<"tasks">,
      _creationTime: 3,
      text: "Schedule team meeting",
      isClosed: false,
      isResolved: false,
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
      isClosed: false,
      isResolved: false,
      owner: "user1" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic2" as Id<"topics">,
    },
  ],
  topic3: [],
  topic4: [
    {
      _id: "task5" as Id<"tasks">,
      _creationTime: 5,
      text: "Collect team feedback from last sprint",
      isClosed: true,
      isResolved: true,
      owner: "user3" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic4" as Id<"topics">,
    },
    {
      _id: "task6" as Id<"tasks">,
      _creationTime: 6,
      text: "Analyze retrospective insights and create action items",
      isClosed: true,
      isResolved: true,
      owner: "user1" as Id<"users">,
      createdBy: "user3" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic4" as Id<"topics">,
    },
  ],
  topic5: [
    {
      _id: "task7" as Id<"tasks">,
      _creationTime: 7,
      text: "Review current project timeline accuracy",
      isClosed: false,
      isResolved: false,
      owner: "user1" as Id<"users">,
      createdBy: "user2" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic5" as Id<"topics">,
    },
    {
      _id: "task8" as Id<"tasks">,
      _creationTime: 8,
      text: "Update milestone dates and dependencies",
      isClosed: false,
      isResolved: false,
      owner: "user2" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic5" as Id<"topics">,
      freeformOwner: "Technical Writing Team",
    },
    {
      _id: "task9" as Id<"tasks">,
      _creationTime: 9,
      text: "Publish updated timeline to project wiki",
      isClosed: false,
      isResolved: false,
      owner: "user1" as Id<"users">,
      createdBy: "user2" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic5" as Id<"topics">,
      freeformOwner: "Technical Writing Team",
    },
  ],
  topic6: [
    {
      _id: "task10" as Id<"tasks">,
      _creationTime: 10,
      text: "Gather Q1 performance data from analytics dashboard",
      isClosed: false,
      isResolved: false,
      owner: "user4" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic6" as Id<"topics">,
    },
    {
      _id: "task11" as Id<"tasks">,
      _creationTime: 11,
      text: "Create executive summary slides",
      isClosed: false,
      isResolved: false,
      owner: "user4" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic6" as Id<"topics">,
    },
  ],
  topic7: [
    {
      _id: "task12" as Id<"tasks">,
      _creationTime: 12,
      text: "Schedule kickoff meeting with marketing team",
      isClosed: true,
      isResolved: true,
      owner: "user2" as Id<"users">,
      createdBy: "user3" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic7" as Id<"topics">,
    },
    {
      _id: "task13" as Id<"tasks">,
      _creationTime: 13,
      text: "Share product specifications and launch timeline",
      isClosed: true,
      isResolved: true,
      owner: "user1" as Id<"users">,
      createdBy: "user2" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic7" as Id<"topics">,
      freeformOwner: "Marketing Department",
    },
    {
      _id: "task14" as Id<"tasks">,
      _creationTime: 14,
      text: "Review marketing campaign materials for accuracy",
      isClosed: true,
      isResolved: true,
      owner: "user3" as Id<"users">,
      createdBy: "user2" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic7" as Id<"topics">,
    },
  ],
  topic8: [
    {
      _id: "task15" as Id<"tasks">,
      _creationTime: 15,
      text: "Review vendor contract terms and pricing",
      isClosed: false,
      isResolved: false,
      owner: "user1" as Id<"users">,
      createdBy: "user4" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic8" as Id<"topics">,
    },
    {
      _id: "task16" as Id<"tasks">,
      _creationTime: 16,
      text: "Get legal approval for contract modifications",
      isClosed: false,
      isResolved: false,
      owner: "user4" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      topicId: "topic8" as Id<"topics">,
      freeformOwner: "Legal Department",
    },
  ],
};

export const mockTopicsByDiscussionId = {
  discussion1: [
    {
      _id: "topic1" as Id<"topics">,
      _creationTime: 1,
      text: "Discuss Q2 goals",
      isClosed: false,
      isResolved: false,
      owner: "user1" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      discussionId: "discussion1" as Id<"discussions">,
    },
    {
      _id: "topic2" as Id<"topics">,
      _creationTime: 2,
      text: "Budget review",
      isClosed: true,
      isResolved: true,
      owner: "user2" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      discussionId: "discussion1" as Id<"discussions">,
      freeformOwner: "Finance Team",
    },
    {
      _id: "topic3" as Id<"topics">,
      _creationTime: 3,
      text: "No Tasks",
      isClosed: false,
      isResolved: false,
      owner: "user2" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      discussionId: "discussion1" as Id<"discussions">,
    },
  ],
  discussion2: [
    {
      _id: "topic4" as Id<"topics">,
      _creationTime: 4,
      text: "Review sprint retrospective feedback",
      isClosed: true,
      isResolved: true,
      owner: "user3" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      discussionId: "discussion2" as Id<"discussions">,
    },
    {
      _id: "topic5" as Id<"topics">,
      _creationTime: 5,
      text: "Update project timeline documentation",
      isClosed: false,
      isResolved: false,
      owner: "user1" as Id<"users">,
      createdBy: "user2" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      discussionId: "discussion2" as Id<"discussions">,
      freeformOwner: "Technical Writing Team",
    },
    {
      _id: "topic6" as Id<"topics">,
      _creationTime: 6,
      text: "Prepare Q1 performance metrics presentation",
      isClosed: false,
      isResolved: false,
      owner: "user4" as Id<"users">,
      createdBy: "user1" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      discussionId: "discussion2" as Id<"discussions">,
    },
  ],
  discussion3: [
    {
      _id: "topic7" as Id<"topics">,
      _creationTime: 7,
      text: "Coordinate with marketing team on product launch",
      isClosed: true,
      isResolved: true,
      owner: "user2" as Id<"users">,
      createdBy: "user3" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      discussionId: "discussion3" as Id<"discussions">,
      freeformOwner: "Marketing Department",
    },
    {
      _id: "topic8" as Id<"topics">,
      _creationTime: 8,
      text: "Finalize vendor contract negotiations",
      isClosed: false,
      isResolved: false,
      owner: "user1" as Id<"users">,
      createdBy: "user4" as Id<"users">,
      orgId: "org1" as Id<"organizations">,
      discussionId: "discussion3" as Id<"discussions">,
    },
  ],
};

export const mockTopicsByTopicId = {
  topic1: {
    _id: "topic1" as Id<"topics">,
    _creationTime: 1,
    text: "Discuss Q2 goals",
    isClosed: false,
    isResolved: false,
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
    isClosed: true,
    isResolved: true,
    owner: "user2" as Id<"users">,
    createdBy: "user1" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion1" as Id<"discussions">,
    freeformOwner: "Finance Team",
    done: false,
  },
  topic3: {
    _id: "topic3" as Id<"topics">,
    _creationTime: 3,
    text: "No Tasks",
    isClosed: false,
    isResolved: false,
    owner: "user2" as Id<"users">,
    createdBy: "user1" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion1" as Id<"discussions">,
    done: false,
  },
  topic4: {
    _id: "topic4" as Id<"topics">,
    _creationTime: 4,
    text: "Review sprint retrospective feedback",
    isClosed: true,
    isResolved: true,
    owner: "user3" as Id<"users">,
    createdBy: "user1" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion2" as Id<"discussions">,
    done: false,
  },
  topic5: {
    _id: "topic5" as Id<"topics">,
    _creationTime: 5,
    text: "Update project timeline documentation",
    isClosed: false,
    isResolved: false,
    owner: "user1" as Id<"users">,
    createdBy: "user2" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion2" as Id<"discussions">,
    freeformOwner: "Technical Writing Team",
    done: false,
  },
  topic6: {
    _id: "topic6" as Id<"topics">,
    _creationTime: 6,
    text: "Prepare Q1 performance metrics presentation",
    isClosed: false,
    isResolved: false,
    owner: "user4" as Id<"users">,
    createdBy: "user1" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion2" as Id<"discussions">,
    done: false,
  },
  topic7: {
    _id: "topic7" as Id<"topics">,
    _creationTime: 7,
    text: "Coordinate with marketing team on product launch",
    isClosed: true,
    isResolved: true,
    owner: "user2" as Id<"users">,
    createdBy: "user3" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion3" as Id<"discussions">,
    freeformOwner: "Marketing Department",
    done: false,
  },
  topic8: {
    _id: "topic8" as Id<"topics">,
    _creationTime: 8,
    text: "Finalize vendor contract negotiations",
    isClosed: false,
    isResolved: false,
    owner: "user1" as Id<"users">,
    createdBy: "user4" as Id<"users">,
    orgId: "org1" as Id<"organizations">,
    discussionId: "discussion3" as Id<"discussions">,
    done: false,
  },
};

export const mockDiscussionById = {
  _id: "discussion1" as Id<"discussions">,
  _creationTime: 1673825000000,
  date: "2024-01-15",
  activeStep: 0,
  isClosed: false,
  isResolved: false,
  createdBy: "user1" as Id<"users">,
  meetingId: "meeting1" as Id<"meetings">,
  orgId: "org1" as Id<"organizations">,
};

export const mockPreviousDiscussions = [
  {
    _id: "discussion2" as Id<"discussions">,
    _creationTime: 1673220000000,
    date: "2024-01-10",
    activeStep: 1,
    isClosed: false,
    isResolved: false,
    createdBy: "user1" as Id<"users">,
    meetingId: "meeting1" as Id<"meetings">,
    orgId: "org1" as Id<"organizations">,
  },
  {
    _id: "discussion3" as Id<"discussions">,
    _creationTime: 1672620000000,
    date: "2024-01-05",
    activeStep: 0,
    isClosed: false,
    isResolved: false,
    createdBy: "user2" as Id<"users">,
    meetingId: "meeting1" as Id<"meetings">,
    orgId: "org1" as Id<"organizations">,
  },
];

export const mockMeetingById = {
  _id: "meeting1" as Id<"meetings">,
  _creationTime: 1673825000000,
  orgId: "org1" as Id<"organizations">,
  isYours: true,
  owner: mockUsersByOrgId[0],
  previousDiscussion: mockPreviousDiscussions[0],
  createdBy: "user1" as Id<"users">,
  title: "Weekly Team Sync",
  nextDiscussionId: undefined,
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
      (args: { discussionId: Id<"discussions"> }) =>
        Array.isArray(topicsByDiscussionId)
          ? topicsByDiscussionId
          : topicsByDiscussionId[
              args.discussionId as keyof typeof topicsByDiscussionId
            ] || [],
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

  // Register discussion query mocks
  const discussionById =
    mockData["discussions.queries.byDiscussionId"] || mockDiscussionById;
  if (discussionById === "loading") {
    mockClient.registerQueryFake(
      api.discussions.queries.byDiscussionId,
      () => undefined,
    );
  } else {
    mockClient.registerQueryFake(
      api.discussions.queries.byDiscussionId,
      () => discussionById,
    );
  }

  const previousDiscussions =
    mockData["discussions.queries.previousIncompletedDiscussions"] ||
    mockPreviousDiscussions;
  if (previousDiscussions === "loading") {
    mockClient.registerQueryFake(
      api.discussions.queries.previousIncompletedDiscussions,
      () => undefined,
    );
  } else {
    mockClient.registerQueryFake(
      api.discussions.queries.previousIncompletedDiscussions,
      () => previousDiscussions,
    );
  }

  // Register meeting query mocks
  const meetingById =
    mockData["meetings.queries.byMeetingId"] || mockMeetingById;
  if (meetingById === "loading") {
    mockClient.registerQueryFake(
      api.meetings.queries.byMeetingId,
      () => undefined,
    );
  } else {
    mockClient.registerQueryFake(
      api.meetings.queries.byMeetingId,
      () => meetingById,
    );
  }

  // Register mutation mocks
  mockClient.registerMutationFake(api.tasks.mutations.close, (args) => {
    const func = mockActions["tasks.mutations.close"] || action("closeTask");
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
