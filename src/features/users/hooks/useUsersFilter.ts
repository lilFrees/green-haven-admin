import createFilterStore from "../../../shared/utils/createFilterStore";

export const useUsersFilter = createFilterStore({ properties: ["user_name"] });
