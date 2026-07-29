import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Itinerary, PlannerInput, ResourceCategory } from "@/types";
import { generateItinerary } from "@/engine/itineraryEngine";

interface TravelState {
  // 攻略
  savedItineraries: Itinerary[];
  currentItinerary: Itinerary | null;
  isGenerating: boolean;

  // 资源筛选
  resourceTab: ResourceCategory;
  resourceSearch: string;
  resourceDistrict: string;

  // Actions
  setResourceTab: (t: ResourceCategory) => void;
  setResourceSearch: (s: string) => void;
  setResourceDistrict: (d: string) => void;
  generateAndSetItinerary: (input: PlannerInput) => Promise<Itinerary>;
  saveItinerary: (it: Itinerary) => void;
  deleteItinerary: (id: string) => void;
  setCurrentItinerary: (it: Itinerary | null) => void;
  clearCurrent: () => void;
}

export const useTravelStore = create<TravelState>()(
  persist(
    (set, get) => ({
      savedItineraries: [],
      currentItinerary: null,
      isGenerating: false,
      resourceTab: "attraction",
      resourceSearch: "",
      resourceDistrict: "全部",

      setResourceTab: (t) => set({ resourceTab: t }),
      setResourceSearch: (s) => set({ resourceSearch: s }),
      setResourceDistrict: (d) => set({ resourceDistrict: d }),

      generateAndSetItinerary: async (input) => {
        set({ isGenerating: true });
        // 模拟生成耗时动画效果
        await new Promise((r) => setTimeout(r, 1500));
        const itinerary = generateItinerary(input);
        set({
          currentItinerary: itinerary,
          isGenerating: false,
          savedItineraries: [itinerary, ...get().savedItineraries].slice(0, 20),
        });
        return itinerary;
      },

      saveItinerary: (it) =>
        set({
          savedItineraries: [it, ...get().savedItineraries].slice(0, 20),
        }),
      deleteItinerary: (id) =>
        set({
          savedItineraries: get().savedItineraries.filter((x) => x.id !== id),
        }),
      setCurrentItinerary: (it) => set({ currentItinerary: it }),
      clearCurrent: () => set({ currentItinerary: null }),
    }),
    {
      name: "nanjing-travel-store-v1",
      partialize: (s) => ({
        savedItineraries: s.savedItineraries,
        currentItinerary: s.currentItinerary,
      }),
    }
  )
);
