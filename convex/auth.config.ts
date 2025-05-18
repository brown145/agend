// This file is used for local development only
// For production, use the deployment configuration in convex.json
export default {
  providers: [
    {
      domain:
        process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN ??
        "https://bold-rodent-16.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
