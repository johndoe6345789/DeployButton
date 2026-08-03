import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSwitcher from "./LanguageSwitcher";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { setLocale } from "@/i18n/actions";

const refresh = jest.fn();
jest.mock("@/i18n/actions", () => ({ setLocale: jest.fn() }));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    (setLocale as jest.Mock).mockReset().mockResolvedValue(undefined);
    refresh.mockReset();
  });

  it("renders with the container testid", () => {
    renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });

  it("shows the current locale as selected", () => {
    renderWithProviders(<LanguageSwitcher />);
    expect(screen.getByRole("combobox")).toHaveValue("en");
  });

  it("calls setLocale and refreshes when a new language is picked", async () => {
    renderWithProviders(<LanguageSwitcher />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "es");
    expect(setLocale).toHaveBeenCalledWith("es");
    expect(refresh).toHaveBeenCalled();
  });
});
