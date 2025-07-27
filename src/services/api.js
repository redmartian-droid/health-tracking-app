// Simulated API service
export const API = {
  getHeartRate: () => Promise.resolve(Math.floor(Math.random() * 40) + 60),
  getSteps: () => Promise.resolve(Math.floor(Math.random() * 8000) + 2000),
  getMedicines: () => Promise.resolve([]),
  updateMedicine: (id, time, taken) => Promise.resolve(true),
  addMedicine: (medicine) => Promise.resolve({ id: Date.now(), ...medicine }),
};
