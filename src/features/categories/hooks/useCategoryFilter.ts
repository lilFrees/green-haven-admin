import createFilterStore from "../../../shared/utils/createFilterStore";

export const useCategoryFilter = createFilterStore({
  properties: ["id", "name", "category"],
});
