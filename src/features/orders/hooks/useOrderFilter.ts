import createFilterStore from "../../../shared/utils/createFilterStore";

export const useOrderFilter = createFilterStore({ properties: ["user_name"] });
