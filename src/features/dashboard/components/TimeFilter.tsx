import { Button } from "@chakra-ui/react";
import { DateFilterState } from "../../../shared/utils/createTimeFilter";

function TimeFilter({
  filter,
  setFilter,
}: {
  filter: DateFilterState["dateFilter"];
  setFilter: DateFilterState["setDateFilter"];
}) {
  function handleClick(filter: "week" | "month" | "year") {
    setFilter(filter);
  }

  return (
    <div className="flex w-max items-center gap-1 rounded-xl bg-gray-100 p-1">
      <Button
        variant="ghost"
        size="sm"
        isActive={filter === "week"}
        onClick={() => {
          handleClick("week");
        }}
        _active={{ bg: "green.500", color: "white" }}
      >
        Week
      </Button>
      <Button
        variant="ghost"
        size="sm"
        isActive={filter === "month"}
        onClick={() => {
          handleClick("month");
        }}
        _active={{ bg: "green.500", color: "white" }}
      >
        Month
      </Button>
      <Button
        variant="ghost"
        size="sm"
        isActive={filter === "year"}
        onClick={() => {
          handleClick("year");
        }}
        _active={{ bg: "green.500", color: "white" }}
      >
        Year
      </Button>
    </div>
  );
}

export default TimeFilter;
