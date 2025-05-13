export default {
  providers: [
    {
      // domain: process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN,
      domain: "https://clerk.agendry.com/.well-known/jwks.json",
      applicationID: "convex",
    },
  ],
};
