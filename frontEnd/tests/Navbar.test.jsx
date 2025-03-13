import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UserContext, UserProvider } from "../src/Contexts/UserProvider"; // Import UserProvider
import Navbar from "../src/Pages/components/Navbar"; // Import the Navbar component
import "@testing-library/jest-dom/vitest";

describe("Navbar", () => {
  it("should display correct user information", () => {
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
        <Navbar PageName={"Testing"} />
      </CustomUserProvider>
    );
    expect(screen.getByTestId("user_info").textContent).equals(
      "Kian OConnorkian.oconnor003@gmail.com"
    );
  });
});
