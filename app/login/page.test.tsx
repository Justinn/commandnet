import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./page";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from 'styled-components';
import { theme } from '@/app/theme';

jest.mock("next-auth/react");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockReplace = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
});

// Helper render to wrap in ThemeProvider
function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe("LoginPage", () => {
  it("renders the login form", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });
    renderWithTheme(<LoginPage />);
    expect(screen.getByText(/Sign in to CommandNet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Magic Link/i })).toBeInTheDocument();
  });

  it("updates the email input value", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });
    renderWithTheme(<LoginPage />);
    const input = screen.getByLabelText(/Email/i);
    fireEvent.change(input, { target: { value: "test@example.com" } });
    expect((input as HTMLInputElement).value).toBe("test@example.com");
  });

  it("shows loading state when submitting", async () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });
    (signIn as jest.Mock).mockImplementation(() => new Promise(() => {}));
    renderWithTheme(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Send Magic Link/i }));
    expect(screen.getByRole("button")).toHaveTextContent(/Sending.../i);
  });

  it("shows success message if signIn is successful", async () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });
    (signIn as jest.Mock).mockResolvedValue({ ok: true });
    renderWithTheme(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Send Magic Link/i }));
    await waitFor(() => {
      expect(screen.getByText(/Check your email for a magic link/i)).toBeInTheDocument();
    });
  });

  it("shows error message if signIn fails", async () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });
    (signIn as jest.Mock).mockResolvedValue({ ok: false, error: "Failed to send magic link." });
    renderWithTheme(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Send Magic Link/i }));
    await waitFor(() => {
      expect(screen.getByText(/Failed to send magic link/i)).toBeInTheDocument();
    });
  });

  it("shows generic error if signIn throws", async () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });
    (signIn as jest.Mock).mockRejectedValue(new Error("Network error"));
    renderWithTheme(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Send Magic Link/i }));
    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
    });
  });

  it("redirects if already authenticated", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });
    renderWithTheme(<LoginPage />);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
}); 