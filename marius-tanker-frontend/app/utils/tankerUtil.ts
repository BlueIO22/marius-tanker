export default function getDemoUser() {
  console.log(process.env.NODE_ENV);
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
