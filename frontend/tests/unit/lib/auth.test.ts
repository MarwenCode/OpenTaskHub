import { clearUser, loadUser, saveUser } from "../../../src/lib/auth";

describe("auth localStorage utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and loads user from localStorage", () => {
    const user = { id: "u-1", username: "john", token: "jwt-token" };
    saveUser(user);

    expect(loadUser()).toEqual(user);
  });

  it("clears user from localStorage", () => {
    saveUser({ id: "u-1" });
    clearUser();

    expect(loadUser()).toBeNull();
  });
});
