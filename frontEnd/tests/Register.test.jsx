import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UserContext, UserProvider } from "../src/Contexts/UserProvider";
import Register from "../src/Pages/auth/Register";
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
        <Register />
      </CustomUserProvider>
    );

    const button = screen.getByRole("button", { name: /Sign Up/i });
    const firstName = screen.getByTestId("first_name");
    const email_address = screen.getByTestId("email_address");
    const password = screen.getByTestId("password");
    const confirm_password = screen.getByTestId("confirm_password");

    await userEvent.type(firstName, "123");
    await userEvent.type(email_address, "kian");
    await userEvent.type(password, "kian");
    await userEvent.type(confirm_password, "123");
    await userEvent.click(button);

    expect(
      screen.getByText("Only letters, hyphens and apostrophes")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Last Name is a required field")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please enter valid email address")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Must be longer than 8 characters")
    ).toBeInTheDocument();

    expect(screen.getByText("Must match password field")).toBeInTheDocument();
  });
});
