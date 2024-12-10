export default function getDemoUser(displayName: string) {
  if (!(process.env.NODE_ENV === "development")) {
    return undefined;
  }

  return {
    displayName: displayName,
    name: {
      givenName: "Marius Sørenes",
    },
  };
}
