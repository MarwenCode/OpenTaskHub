// Test framework: Jest + React Testing Library
// Scope: Integration test frontend (App + Router + Store)
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import App from "../../src/App";

// On mock les gros composants/pages pour tester seulement la logique de routing
jest.mock("../../src/components/auth/Login", () => ({
  __esModule: true,
  default: () => <div>Login Page Mock</div>,
}));

jest.mock("../../src/components/auth/Register", () => ({
  __esModule: true,
  default: () => <div>Register Page Mock</div>,
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
  it("redirects unauthenticated user from / to /login", () => {
    const store = createTestStore(null);

    // On démarre la navigation sur "/" sans utilisateur authentifié
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Login Page Mock")).toBeInTheDocument();
  });

  it("shows dashboard on / when user is authenticated", () => {
    const store = createTestStore({ id: "u-1", token: "token-1" });

    // Même route "/", mais avec user connecté dans le store
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Dashboard Page Mock")).toBeInTheDocument();
    expect(screen.getByText("Navbar Mock")).toBeInTheDocument();
  });
});
