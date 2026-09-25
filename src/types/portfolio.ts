export type PortfolioLink = {
  label: string;
  href: string;
};

export type PortfolioSection = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  links?: PortfolioLink[];
  color: string;
};
