import React from "react";
import { Card } from "../components/Card";
import { CardContent } from "../components/CardContent";
import { BookStatusChart } from "../components/BookStatusChart";
import { BookOpen, BookOpenCheck, BookUp, Clock2, Users } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";

const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading } = useDashboard();

  const renderCardSkeleton = () => (
    <Card className="p-6 h-[200px] pt-15 animate-pulse ">
      <div className="h-5 bg-gray-300 rounded  w-1/2 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-300 rounded w-12"></div>
        <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
      </div>
    </Card>
  );

  return (
    <div className="flex h-screen bg-background w-full">
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Library Dashboard
              </h1>
              <p className="text-xl mt-2 text-gray-500">
                Welcome to the library management system
              </p>
            </div>
          </div>

          {/* Cards */}
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <React.Fragment key={idx}>
                  {renderCardSkeleton()}
                </React.Fragment>
              ))
            ) : (
              <>
                <Card className="p-6 h-[200px] pt-15">
                  <p className="text-lg font-medium text-gray-500">
                    Total Books
                  </p>
                  <div className="flex text-2xl font-bold place-content-between mt-2">
                    <p>{dashboardData?.books?.length || 0}</p>
                    <BookOpen className="w-7 h-7 text-gray-500" />
                  </div>
                </Card>
                <Card className="p-6 h-[200px] pt-15">
                  <p className="text-lg font-medium text-gray-500">Available</p>
                  <div className="flex text-2xl font-bold place-content-between mt-2">
                    <p>{dashboardData?.availableBooks?.length || 0}</p>
                    <BookOpenCheck className="w-7 h-7 text-gray-500" />
                  </div>
                </Card>
                <Card className="p-6 h-[200px] pt-15">
                  <p className="text-lg font-medium text-gray-500">Checkout</p>
                  <div className="flex text-2xl font-bold place-content-between mt-2">
                    <p>{dashboardData?.checkoutBooks?.length || 0}</p>
                    <BookUp className="w-7 h-7 text-gray-500" />
                  </div>
                </Card>
                <Card className="p-6 h-[200px] pt-15">
                  <p className="text-lg font-medium text-gray-500">
                    Total Borrowers
                  </p>
                  <div className="flex text-2xl font-bold place-content-between mt-2">
                    <p>{dashboardData?.borrowers?.length || 0}</p>
                    <Users className="w-7 h-7 text-gray-500" />
                  </div>
                </Card>
                <Card className="p-6 h-[200px] pt-15">
                  <p className="text-lg font-medium text-gray-500">Overdue</p>
                  <div className="flex text-2xl font-bold place-content-between mt-2">
                    <p>{dashboardData?.overdue?.length || 0}</p>
                    <Clock2 className="w-7 h-7 text-gray-500" />
                  </div>
                </Card>
              </>
            )}
          </CardContent>

          {/* Chart */}
          {isLoading ? (
            <div className="w-full h-[300px] bg-gray-300 rounded animate-pulse" />
          ) : (
            <BookStatusChart
              available={dashboardData?.availableBooks?.length || 0}
              checkedOut={dashboardData?.checkoutBooks?.length || 0}
              overdue={dashboardData?.overdue?.length || 0}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
