import { createEffect, onCleanup } from "solid-js";
import { createMediaQuery } from "~/helpers/hooks/create-media-query"; // use alias from tsconfig

/* ========================= */
/* ===== Debounce Utils ===== */
/* ========================= */

export const debounce =
  <T extends unknown[]>(callback: (...args: T) => void, wait: number) =>
  (...args: T) => {
    let timeout: number | undefined;
    clearTimeout(timeout);
    timeout = window.setTimeout(() => callback(...args), wait);
  };

/* ========================= */
/* ===== Time Formatter ===== */
/* ========================= */

const padZero = (n: number) => `${n < 10 ? "0" : ""}${n}`;

export const formatTime = (ms?: number): string => {
  if (typeof ms !== "number" || !Number.isFinite(ms) || ms < 0) {
    return "--:--";
  }
  const hours = Math.floor(ms / 3600);
  const minutes = Math.floor((ms % 3600) / 60);
  const seconds = Math.floor(ms % 60);
  const parts = [padZero(minutes), padZero(seconds)];

  return hours > 0 ? `${hours}:${parts.join(":")}` : parts.join(":");
};

/* ========================= */
/* ===== Array Helpers ===== */
/* ========================= */

export const swapArrayItems = <T>(
  array: T[],
  i: number,
  j: number,
): T[] => {
  if (i < 0 || j < 0 || i >= array.length || j >= array.length) return array;
  const tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
  return array;
};

export const shuffleArray = <T>(array: readonly T[]): T[] => {
  const out = [...array];
  let current = out.length;
  while (current > 1) {
    const random = Math.floor(Math.random() * current--);
    swapArrayItems(out, current, random);
  }
  return out;
};

export const sortByKey = <T>(list: T[], key: keyof T): T[] =>
  list.sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (typeof va === "number" && typeof vb === "number") return va - vb;
    const sa = `${va ?? ""}`.toLowerCase();
    const sb = `${vb ?? ""}`.toLowerCase();
    return sa < sb ? -1 : sa > sb ? 1 : 0;
  });

/* ========================= */
/* ===== Async Helpers ===== */
/* ========================= */

export const rafPromise = () => new Promise<number>(requestAnimationFrame);
export const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/* ========================= */
/* ===== Style Helpers ===== */
/* ========================= */

interface CSSVars {
  [key: string]: string | number;
  [key: `--${string}`]: string | number;
}

export type MaybeArray<T> = T | T[];

const toArray = <T>(x: MaybeArray<T>): T[] =>
  Array.isArray(x) ? x : [x];

export const setStyles = (
  target: MaybeArray<HTMLElement>,
  styles: Partial<CSSVars>,
) => {
  const entries = Object.entries(styles);
  toArray(target).forEach((el) =>
    entries.forEach(([k, v]) => el.style.setProperty(k, `${v}`)),
  );
};

export const removeStyles = (
  target: MaybeArray<HTMLElement>,
  props: (keyof CSSVars)[],
) => {
  toArray(target).forEach((el) =>
    props.forEach((name) => el.style.removeProperty(String(name))),
  );
};

/* ========================= */
/* ===== User Interaction === */
/* ========================= */

export const isElementTextInput = (el: unknown): el is HTMLInputElement =>
  el instanceof HTMLInputElement && el.type === "text";

export const isEventForTextInput = (e: Event) =>
  e.composedPath().some(isElementTextInput);

const animTimeouts = new WeakMap<Element, boolean>();

export const animateIcon = (
  e: MouseEvent,
  duration: number,
  className: string,
) => {
  const el = e.composedPath()[0] as HTMLElement;
  if (!animTimeouts.has(el)) {
    el.classList.add(className);
    animTimeouts.set(el, true);
    wait(duration).then(() => {
      el.classList.remove(className);
      animTimeouts.delete(el);
    });
  }
};

/* ========================= */
/* ===== UI Helpers ======== */
/* ========================= */

type ClxArg = string | number | false | null | undefined;
export const clx = (...args: ClxArg[]) =>
  args.filter(Boolean).join(" ");

const pluralRules = new Intl.PluralRules("en-US");
export const pluralize = (count: number, singular: string) =>
  count === 1 ? singular : `${singular}s`;
export const pluralizeCount = (c: number, s: string) => `${c} ${pluralize(c, s)}`;

/* ========================= */
/* ===== Media & Resize ===== */
/* ========================= */

export const usePrefersReducedMotion = () =>
  createMediaQuery("(prefers-reduced-motion: reduce)");

export const useDarkThemeEnabled = () =>
  createMediaQuery("(prefers-color-scheme: dark)");

export const useResizeObserver = (
  element: () => HTMLElement,
  callback: (entry: ResizeObserverEntry) => void,
) => {
  const ro = new ResizeObserver(([entry]) => callback(entry));
  createEffect(() => {
    const el = element();
    ro.observe(el);
    onCleanup(() => ro.unobserve(el));
  });
};

/* ========================= */
/* ===== Device Info ======= */
/* ========================= */

const detectMobile = () =>
  navigator.userAgentData?.mobile ??
  /Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent);

export const IS_DEVICE_A_MOBILE = detectMobile();
