import { seedServices, seedPackages, seedReviews } from "../data/seedData";

export const useServices = () => ({
  data: seedServices,
  loading: false,
  error: null,
  source: "seed",
});

export const usePackages = () => ({
  data: seedPackages,
  loading: false,
  error: null,
  source: "seed",
});

export const useReviews = () => ({
  data: seedReviews,
  loading: false,
  error: null,
  source: "seed",
});