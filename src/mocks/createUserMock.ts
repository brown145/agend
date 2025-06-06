import { Id } from "@convex/_generated/dataModel";

export const createUserMock = (
  overrides: {
    id?: string;
    name?: string;
    email?: string;
    isYou?: boolean;
  } = {},
) => {
  const num = 1; // Default number for single user
  return {
    _creationTime: Date.now(),
    _id: (overrides.id || `user${num}`) as Id<"users">,
    email: overrides.email || `user${num}@example.com`,
    isYou: overrides.isYou ?? false,
    name: overrides.name || `User ${num}`,
    subject: overrides.name || `User ${num}`,
  };
};

export const createUserMocks = (
  overrides: Array<Partial<Parameters<typeof createUserMock>[0]>> = [],
) => {
  return overrides.map((override, index) => {
    const num = index + 1;
    return createUserMock({
      id: `user${num}`,
      name: `User ${num}`,
      email: `user${num}@example.com`,
      ...override,
    });
  });
};
