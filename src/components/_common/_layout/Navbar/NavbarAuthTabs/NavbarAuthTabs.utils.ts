import { pageUrls } from "@/utils/pageUrls";

interface INavbarTabOption {
  href: string;
  tabIndex: number;
  id: string;
  label: string;
}

export const navbarTabOptions: INavbarTabOption[] = [
  {
    href: pageUrls.index,
    tabIndex: 0,
    id: "home-tab",
    label: "Home",
  },
  {
    href: pageUrls.draft,
    tabIndex: 1,
    id: "draft-tab",
    label: "Draft",
  },
  {
    href: pageUrls.playground,
    tabIndex: 2,
    id: "playground-tab",
    label: "Playground",
  },
];