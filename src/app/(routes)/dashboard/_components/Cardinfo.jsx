"use client";

import formatNumber from "@/utils/index";
import getFinancialAdvice from "@/utils/getFinancialAdvice";
import React, { useEffect, useState } from "react";
import Chat from "./ChatInterface";

function CardInfo({ budgetList, incomeList }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState("");

  useEffect(() => {
    if (budgetList.length > 0 || incomeList.length > 0) {
      CalculateCardInfo();
    }
  }, [budgetList, incomeList]);

  useEffect(() => {
    if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
      const fetchFinancialAdvice = async () => {
        const advice = await getFinancialAdvice(
          totalBudget,
          totalIncome,
          totalSpend
        );
        setFinancialAdvice(advice);
      };

      fetchFinancialAdvice();
    }
  }, [totalBudget, totalIncome, totalSpend]);

  const CalculateCardInfo = () => {
    console.log(budgetList);
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    let totalIncome_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ = totalBudget_ + Number(element.amount);
      totalSpend_ = totalSpend_ + element.totalSpend;
    });

    incomeList.forEach((element) => {
      totalIncome_ = totalIncome_ + element.totalAmount;
    });

    setTotalIncome(totalIncome_);
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  };

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div>
          <div className="p-0 border mt-0 mb-0 rounded-2xl flex items-center justify-between">
            <Chat
              totalBudget={totalBudget}
              totalIncome={totalIncome}
              totalSpend={totalSpend}
            />
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Cash</h2>
                <h2 className="font-bold text-2xl">
                  ${formatNumber(totalBudget)}
                </h2>
              </div>
              <span className="bg-purple-800 p-3 h-12 w-12 rounded-full text-white flex items-center justify-center">
                🏦
              </span>
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Expenses</h2>
                <h2 className="font-bold text-2xl">
                  ${formatNumber(totalSpend)}
                </h2>
              </div>
              <span className="bg-purple-800 p-3 h-12 w-12 rounded-full text-white flex items-center justify-center">
                🧾
              </span>
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">No. Of Budget</h2>
                <h2 className="font-bold text-2xl">{budgetList?.length}</h2>
              </div>
              <span className="bg-purple-800 p-3 h-12 w-12 rounded-full text-white flex items-center justify-center">
                💼
              </span>
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm"> Income Flow</h2>
                <h2 className="font-bold text-2xl">
                  ${formatNumber(totalIncome)}
                </h2>
              </div>
              <span className="bg-purple-800 p-3 h-12 w-12 rounded-full text-white flex items-center justify-center">
                💵
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item, index) => (
            <div
              className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
              key={index}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;
