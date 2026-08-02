import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/theme";
import messages from "../../messages/en.json";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeProvider theme={theme} defaultMode="light">
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

export function renderWithProviders(ui: ReactElement) {
  return render(ui, { wrapper: Providers });
}
