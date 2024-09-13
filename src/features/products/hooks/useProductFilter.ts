import createFilterStore from "../../../shared/utils/createFilterStore";

export const useProductFilter = createFilterStore({
  properties: ["id", "title", "stock", "category", "price"],
});
