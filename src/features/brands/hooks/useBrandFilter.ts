import createFilterStore from "../../../shared/utils/createFilterStore";

export const useBrandFilter = createFilterStore({
  properties: ["id", "name"],
});
