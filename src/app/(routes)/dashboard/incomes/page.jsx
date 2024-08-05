import { Suspense } from "react";
import IncomeList from "./_components/IncomeList";

function Income() {
  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Income Streams</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <IncomeList />
      </Suspense>
    </div>
  );
}

export default Income;
