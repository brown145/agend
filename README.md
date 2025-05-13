# Agend - Meeting Management System

Agend is a modern meeting management system built with Next.js, Convex, and Clerk. It helps teams organize, track, and manage their meetings effectively with features like discussion management, task tracking, and meeting summaries.

## Tech Stack

- **Frontend**: Next.js, React, shadcn/ui
- **Backend**: Convex
- **Authentication**: Clerk
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) - JavaScript runtime & package manager
- [Convex](https://www.convex.dev/) - Backend as a service
- [Clerk](https://clerk.dev/) - Authentication

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up the development environment:
   ```bash
   asdf shell nodejs 23.1.0
   ```

### Running the Development Server

1. Start the frontend development server:
   ```bash
   bun dev
   ```

2. Start the Convex development server:
   ```bash
   bunx convex dev
   ```

### Data Setup

To populate the database with initial data, run the following commands:

```bash
# Import users
bunx convex import --table users src/mocks/users.jsonl --replace

# Import organizations
bunx convex import --table organizations src/mocks/organizations.jsonl --replace

# Import user-organization relationships
bunx convex import --table userOrganizations src/mocks/userOrganizations.jsonl --replace

# Import meetings
bunx convex import --table meetings src/mocks/meetings.mdr.jsonl --replace

# Import meeting attendance
bunx convex import --table meetingsAttendance src/mocks/meetingAttendance.mdr.jsonl --replace
```

## Features

### Core Features
- Organization management
- Meeting creation and management
- Discussion tracking
- Task and topic ownership
- Meeting summaries and recaps
- User authentication and authorization







## License

All rights reserved. This software and its documentation are proprietary and confidential. Unauthorized copying, distribution, or use of this software, via any medium, is strictly prohibited.