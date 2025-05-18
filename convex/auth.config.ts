// This file is used for local development only
// For production, use the deployment configuration in convex.json
export default {
  providers: [
    {
      domain: "https://clerk.agendry.com/.well-known/jwks.json",
      // domain: "https://bold-rodent-16.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
