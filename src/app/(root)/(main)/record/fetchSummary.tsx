"use client"

import React, { useEffect, useState } from 'react'


export type CategoryType = {
  userId: string,
  workoutSessionId: string
  date: string | Date,
  totalSessionSets: number,
  totalSessionWeight: number,
  categorySummaries: {
    exerciseCategory: string,
    totalCategorySets: number,
    totalCategoryWeight: number
  }[];
}

interface Props {
  userWeekSummary: CategoryType[]
}

// TODO! 測試用
const FetchSummary = ({ userWeekSummary }: Props) => {
  const [weekSummary, setWeekSummary] = useState<CategoryType[]>([]);

  useEffect(() => {
    setWeekSummary(userWeekSummary)
  }, [userWeekSummary])

  return (
    <div>
      {weekSummary.map((summary, index) => (
        <div key={index}>
          <p>Date: {new Date(summary.date).toLocaleDateString()}</p>

          {summary.categorySummaries.map((category, idx) => (
            <div key={idx}>
              <p>Category: {category.exerciseCategory}</p>
              <p>Sets: {category.totalCategorySets}</p>
              <p>Weight: {category.totalCategoryWeight}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default FetchSummary