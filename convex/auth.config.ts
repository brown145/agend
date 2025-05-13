export default {
  providers: [
    {
      // TODO: figurie out env issues later
      domain: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
      // domain: "https://relaxing-bunny-64.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
