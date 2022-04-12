import create from "zustand";

const useStore = create((set) => ({
  open: true,
  setOpen: () => set((state) => ({ open: !state.open })),
  user: {},
  setUser: (newUser) => set((state) => ({ ...state, user: newUser })),
}));

export default useStore;
