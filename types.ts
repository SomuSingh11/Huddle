import { Server, Member, Profile } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & {
    profile: Profile;
  })[];
};

// This represents the Server entity from the Prisma schema. It contains fields related to a server, such as id, name, etc.,
// depending on how the Server model is defined in the Prisma schema.

// & (Intersection Type): The & symbol in TypeScript is used to create an intersection type. It combines multiple types into a single type.
// In this case, it combines the Server type with an object that represents its associated members.

//members: (Member & { profile: Profile; })[]:
// members:: This defines a property called members on the Server entity. It's an array ([]) because a server can have multiple members.
// Member & { profile: Profile; }: Each element in the members array is a Member object (likely representing the relationship between a user and a server) combined with an additional `

// This type describes:
// A Server object.
// A members array, where each Member includes a nested profile (from the Profile model).
