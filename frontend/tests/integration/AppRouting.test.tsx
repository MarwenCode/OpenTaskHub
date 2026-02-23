import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import App from "../../src/App";

jest.mock("../../src/components/auth/Login", () => ({
  __esModule: true,
  default: () => <div>Login Page Mock</div>,
}));

jest.mock("../../src/components/auth/Register", () => ({
  __esModule: true,
  default: () => <div>Register Page Mock</div>,
}));

jest.mock("../../src/pages/landing/Landing", () => ({
  __esModule: true,
  default: () => <div>Landing Page Mock</div>,
}));

jest.mock("../../src/components/navbar/Navbar", () => ({
  __esModule: true,
  default: () => <div>Navbar Mock</div>,
}));

jest.mock("../../src/components/sidebar/SideBar", () => ({
  __esModule: true,
  default: () => <div>Sidebar Mock</div>,
}));

jest.mock("../../src/components/tasks/TaskList", () => ({
  __esModule: true,
  default: () => <div>TaskList Mock</div>,
}));

jest.mock("../../src/pages/dashboard/Dashboard", () => ({
  __esModule: true,
  default: () => <div>Dashboard Page Mock</div>,
}));

jest.mock("../../src/pages/singleworkspace/SingleWorkSpace", () => ({
  __esModule: true,
  default: () => <div>Single Workspace Page Mock</div>,
}));

jest.mock("../../src/pages/mytasks/MyTasks", () => ({
  __esModule: true,
  default: () => <div>MyTasks Page Mock</div>,
}));

const createTestStore = (user: unknown) =>
  configureStore({
    reducer: {
      auth: () => ({
        user,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: "",
      }),
      workspace: () => ({}),
      task: () => ({}),
      notification: () => ({}),
    },
  });

describe("App routing integration", () => {
  it("shows landing on / when user is unauthenticated", () => {
    const store = createTestStore(null);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Landing Page Mock")).toBeInTheDocument();
  });

  it("shows dashboard on /dashboard when user is authenticated", () => {
    const store = createTestStore({ id: "u-1", token: "token-1" });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Dashboard Page Mock")).toBeInTheDocument();
    expect(screen.getByText("Navbar Mock")).toBeInTheDocument();
  });
});
