export default function getDemoUser() {
  if (!(process.env.NODE_ENV === "development")) {
    return null;
  }

  return {
    displayName: "BlueIO22",
    name: {
      givenName: "Marius Sørenes",
    },
  };
}
