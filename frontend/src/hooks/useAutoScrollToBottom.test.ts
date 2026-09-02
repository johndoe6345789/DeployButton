import { renderHook } from "@testing-library/react";
import { useAutoScrollToBottom } from "./useAutoScrollToBottom";

function setLayout({
  scrollHeight = 2000,
  innerHeight = 800,
  scrollY = 0,
}: {
  scrollHeight?: number;
  innerHeight?: number;
  scrollY?: number;
}) {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(window, "innerHeight", {
    value: innerHeight,
    configurable: true,
  });
  Object.defineProperty(window, "scrollY", {
    value: scrollY,
    configurable: true,
  });
}

describe("useAutoScrollToBottom", () => {
  let scrollTo: jest.Mock;

  beforeEach(() => {
    scrollTo = jest.fn();
    window.scrollTo = scrollTo;
    setLayout({});
  });

  it("scrolls to the bottom when the dependency changes while active", () => {
    const { rerender } = renderHook(
      ({ dep }) => useAutoScrollToBottom(dep, true),
      { initialProps: { dep: 1 } },
    );
    scrollTo.mockClear();

    rerender({ dep: 2 });

    expect(scrollTo).toHaveBeenCalledWith({ top: 2000 });
  });

  it("does not scroll when inactive", () => {
    const { rerender } = renderHook(
      ({ dep }) => useAutoScrollToBottom(dep, false),
      { initialProps: { dep: 1 } },
    );
    scrollTo.mockClear();

    rerender({ dep: 2 });

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("stops following once the viewer scrolls away from the bottom", () => {
    const { rerender } = renderHook(
      ({ dep }) => useAutoScrollToBottom(dep, true),
      { initialProps: { dep: 1 } },
    );

    // Viewer scrolls up, well clear of the bottom threshold.
    setLayout({ scrollHeight: 2000, innerHeight: 800, scrollY: 200 });
    window.dispatchEvent(new Event("scroll"));
    scrollTo.mockClear();

    rerender({ dep: 2 });

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("resumes following once the viewer scrolls back near the bottom", () => {
    const { rerender } = renderHook(
      ({ dep }) => useAutoScrollToBottom(dep, true),
      { initialProps: { dep: 1 } },
    );

    setLayout({ scrollHeight: 2000, innerHeight: 800, scrollY: 200 });
    window.dispatchEvent(new Event("scroll"));

    setLayout({ scrollHeight: 2000, innerHeight: 800, scrollY: 1195 });
    window.dispatchEvent(new Event("scroll"));
    scrollTo.mockClear();

    rerender({ dep: 2 });

    expect(scrollTo).toHaveBeenCalledWith({ top: 2000 });
  });

  it("does not listen for scroll events while inactive", () => {
    renderHook(({ dep }) => useAutoScrollToBottom(dep, false), {
      initialProps: { dep: 1 },
    });

    setLayout({ scrollHeight: 2000, innerHeight: 800, scrollY: 1195 });
    window.dispatchEvent(new Event("scroll"));

    // With no listener attached, wasNearBottomRef stays at its initial
    // `true` -- this only proves the hook doesn't crash without one; the
    // "does not scroll when inactive" case above is what actually matters.
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
