# <img src="https://github.com/user-attachments/assets/432e504b-e49e-44c8-a1ff-17c3beccc2ee" alt="Huddle" width="35" /> Huddle - One Space. All Voices. 🔗 
**Live Demo**: [https://huddle-mb7x.onrender.com/](https://huddle-mb7x.onrender.com/)

Huddle is a scalable, real-time communication platform built with modern technologies like **Next.js**, **Clerk**, **LiveKit**, **Prisma**, **Socket.IO**, and **Tailwind CSS**. Inspired by platforms like **Discord**, **Slack**, and **Microsoft Teams**, Huddle provides robust support for:

- 🏠 Servers and Channels
- 🢑 Direct Messaging
- 📹 Video/Audio Calls
- 🔒 Role-Based Access Control (RBAC)
- 📂 File Sharing
- 🧠 Real-time Messaging with Socket.IO
- 🧵 Chat Threads & Message Editing/Deletion
- 📡 Scalable architecture ready for production deployment

---

## 📚 Table of Contents

- [🚀 Tech Stack](#-tech-stack)
- [✨ Features](#-features)
- [🔐 Authentication & Authorization](#-authentication--authorization)
- [💬 Chat System](#-chat-system)
- [📹 Video Calls (LiveKit)](#-video-calls-livekit)
- [🧪 API Routes](#-api-routes)
- [📆 Database Schema](#-database-schema-simplified)
- [📸 Screenshots](#-screenshots)
- [📌 Setup Instructions](#-setup-instructions)
---

## 🚀 Tech Stack

| Technology          | Usage                               |
| ------------------- | ----------------------------------- |
| Next.js             | Frontend + Backend (Fullstack)      |
| TypeScript          | Type safety                         |
| Clerk               | Authentication & session management |
| Prisma + PostgreSQL | Database ORM                        |
| Socket.IO           | Real-time messaging                 |
| LiveKit             | WebRTC video/audio communication    |
| Tailwind CSS        | Styling                             |
| Zustand             | State management (client-side)      |
| React Query         | Data fetching and caching           |
| Render     | Hosting                                      |

---

## ✨ Features

### 🔗 Server & Channel Structure

- Users can create or join **Servers** (like Discord guilds).
- Each server contains **Channels** (text or video).
- Granular permission control with **roles** (`ADMIN`, `MODERATOR`, `GUEST`).

### 💬 Real-Time Messaging

- Server-based and direct messaging using **Socket.IO**.
- Messages are persisted to the database.
- Real-time updates pushed to connected clients.

### 🢑 Direct Messaging

- 1:1 private conversations.
- Existing conversation is reused or a new one is created dynamically.
- Messages are scoped per conversation.

### ✏️ Message Editing & Deletion

- Role-based permissions for editing or deleting messages.
- Soft deletion supported.

### 📂 File & Media Sharing

- Upload and send files as part of messages (e.g., images, PDFs, etc.).

### 📹 LiveKit Integration

- Initiate **video calls** per channel or DM.
- Token-based authentication using `AccessToken` and `LiveKit Server SDK`.
- Multiple participation using `rooms`.

### 🔒 Role-Based Permissions

- Define roles with access to specific actions (e.g., delete, moderate, etc.).
- Granular control over channels and messaging abilities.

---

## 🔐 Authentication & Authorization

- Uses **Clerk** to authenticate users.
- Middleware on protected routes (`currentProfile()`) ensures users are signed in.
- **Role-based authorization** is handled via the `MemberRole` enum in the DB and checked in APIs.

---

## 💬 Chat System

### Channel Messages

- Channel page gets `channelId` → fetches messages where `channelId` = current.
- `socket.on('chat:channel:messages')` updates React Query cache in real-time.

### Direct Messages

- On visiting a member's page, `getOrCreateConversation` is called.
- Conversation ID is used to fetch or send messages scoped to that conversation.

---

## 📹 Video Calls (LiveKit)

- Access tokens are generated server-side (`/api/livekit`) using `LiveKitServerSDK`.
- Participants join the room with the same `chatID`.
- Frontend renders `<LiveKitRoom>` and `<VideoConference>` from `@livekit/components-react`.

---

## 🧪 API Routes

| Route                              | Method | Purpose                |
| ---------------------------------- | ------ | ---------------------- |
| `/api/socket/messages`             | POST   | Save a channel message |
| `/api/socket/direct-messages`      | POST   | Save a direct message  |
| `/api/socket/direct-messages/[id]` | DELETE | Soft delete a message  |
| `/api/socket/direct-messages/[id]` | PATCH  | Edit a message         |
| `/api/livekit`                     | GET    | Generate LiveKit token |

---

## 📆 Database Schema (Simplified)

### Profile

```ts
id | userId | name | imageUrl
```

### Server

```ts
id | name | createdBy
```

### Member

```ts
id | profileId | serverId | role
```

### Channel

```ts
id | serverId | name | type (TEXT / VIDEO)
```

### Conversation

```ts
id | memberOneId | memberTwoId
```

### DirectMessage

```ts
id | conversationId | memberId | content | fileUrl | deleted
```

---

## 📸 Screenshots

*Add UI screenshots here of:*
![Screenshot from 2025-06-17 16-10-36](https://github.com/user-attachments/assets/3415733a-d2f5-4d18-b546-5d5fa7ceeae9)
![Screenshot from 2025-06-17 16-10-53](https://github.com/user-attachments/assets/ce197a54-50a3-4122-87db-716349fd4dc2)
![Screenshot from 2025-06-17 16-11-29](https://github.com/user-attachments/assets/4036a2f3-279c-4ed5-a75c-5c24bc8e373c)
![Screenshot from 2025-06-17 16-12-14](https://github.com/user-attachments/assets/737bdd66-118c-4bb1-86a0-76d1144e0034)
![Screenshot from 2025-06-17 16-13-08](https://github.com/user-attachments/assets/50c9595f-e434-4de6-8102-5858ff73a485)
![Screenshot from 2025-06-17 16-13-40](https://github.com/user-attachments/assets/cd7997ce-9034-454f-ac6a-3d51f76a2439)

---

## 📌 Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/huddle.git
cd huddle

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Fill in all the Clerk, LiveKit, and DB credentials

# 4. Generate and migrate DB
npx prisma generate
npx prisma migrate dev --name init

# 5. Run the app
npm run dev
```
---

