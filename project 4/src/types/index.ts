export type ExperienceLevel = {
  id: string;
  label: string;
  rate: number;
};

export type CalculatorState = {
  selectedExperience: string;
  hoursPerDay: number;
};