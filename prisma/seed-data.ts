import bcrypt from "bcryptjs";

export const editorUsers = [
  {
    username: "cernst",
    name: "Colee Ernst",
    email: "cernst@test.com",
  },
  {
    username: "kmartinez",
    name: "Kaitlyn Martinez",
    email: "kmartinez@test.com",
  },
  {
    username: "jgarcia",
    name: "Jorge Garcia",
    email: "jgarcia@test.com",
  },
];

export function createPassword(username: string) {
  return {
    hash: bcrypt.hashSync(username, 10),
  };
}
