import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UserContext, UserProvider } from "../src/Contexts/UserProvider";
import Login from "../src/Pages/auth/Login";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

describe("Navbar", () => {
  it("should display correct user information", async () => {
    const CustomUserProvider = ({ children }) => (
      <UserProvider>
        <UserContext.Provider
          value={[
            {
              first_name: "Kian",
              last_name: "OConnor",
              email_address: "kian.oconnor003@gmail.com",
            },
            () => {},
          ]}
        >
          {children}
        </UserContext.Provider>
      </UserProvider>
    );
    render(
      <CustomUserProvider>
        <Login />
      </CustomUserProvider>
    );

    const button = screen.getByRole("button", { name: /Sign In/i });

    await userEvent.click(button);

    expect(
      screen.getByText("Email Address is a required field")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Password is a required field")
    ).toBeInTheDocument();
  });
});
