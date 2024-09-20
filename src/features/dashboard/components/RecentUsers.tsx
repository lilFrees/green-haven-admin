import { Link } from "react-router-dom";
import { formatDateString } from "../../../shared/utils/formatDateString";
import { useDashboard } from "../hooks/useDashboard";
import { Button, Tooltip } from "@chakra-ui/react";
import { FaChevronRight } from "react-icons/fa";
function RecentUsers() {
  const { users, usersLoading } = useDashboard();

  if (usersLoading) {
    return <div className="grow">Loading...</div>;
  }

  if (!users || users.length === 0) {
    return <div className="grow text-2xl font-bold">There are no users😔</div>;
  }

  return (
    <div className="grow py-10">
      <h2 className="text-xl font-bold">Latest users</h2>
      <div className="flex flex-col divide-y">
        <div className="flex items-center gap-2 py-2">
          <div className="basis-36 font-semibold text-gray-600">Name</div>
          <div className="grow font-semibold text-gray-600">Email</div>
          <div className="basis-24 font-semibold text-gray-600">
            Total spent
          </div>
          <div className="basis-24 font-semibold text-gray-600">Joined at</div>
        </div>
        {users.map((user, i) => (
          <Link
            key={i}
            to={`/users/${user.user_id}`}
            className="transition-all duration-200 hover:bg-gray-100"
          >
            <div className="flex items-center gap-2 py-2" key={user.user_id}>
              <div className="basis-36 truncate font-semibold">
                <Tooltip label={user.user_name} aria-label="user name">
                  {user.user_name}
                </Tooltip>
              </div>
              <div className="grow truncate font-semibold">
                <Tooltip label={user.user_email} aria-label="user email">
                  {user.user_email}
                </Tooltip>
              </div>
              <div className="basis-24 font-semibold">
                <Tooltip
                  label={`$ ${user.total_spent.toFixed(2)}`}
                  aria-label="total spent"
                >
                  {`$ ${user.total_spent.toFixed(2)}`}
                </Tooltip>
              </div>
              <div className="basis-24 font-semibold">
                <Tooltip
                  label={formatDateString(user.created_at, {
                    month: "long",
                  })}
                  aria-label="joined at"
                >
                  {formatDateString(user.created_at, {
                    month: "short",
                  })}
                </Tooltip>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/users" className="mx-auto mt-5 inline-block text-center">
        <Button
          colorScheme="green"
          size="sm"
          rightIcon={<FaChevronRight size={12} />}
        >
          View all users
        </Button>
      </Link>
    </div>
  );
}

export default RecentUsers;
