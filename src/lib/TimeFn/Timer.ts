export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} ${time}`;
}

// 資料庫傳入UTC的ISO格式
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 7:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) >= 1 && diffInDays < 7:
      return `${Math.floor(diffInDays)} 天前`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} 小時前`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} 分鐘前`;
    default:
      return "剛剛";
  }
};

// 計算天數
export const calculateDaysSinceStart = (startDate: string | Date ): number => {
  // 將開始日期格式化
  const start = new Date(typeof startDate === 'string' ? startDate.replace(/\//g, '-') : startDate);
  // 設定結束日期為今天
  const end = new Date();

  // 計算時間差，轉換為天數
  const diffInTime = end.getTime() - start.getTime();
  const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
  
  return diffInDays;
};

// 篩人日期區間, isPrevious為true時, 是上個區間
export function getDateRange(
  timeFrame: string,
  startDate: Date,
  isPrevious: boolean = false
): { start: Date; end: Date } {
  const start = new Date(startDate);
  const end = new Date(startDate);

  if (timeFrame === '週') {
    const offset = isPrevious ? -7 : 0;
    start.setDate(start.getDate() - (start.getDay() || 7) + 1 + offset);
    end.setDate(start.getDate() + 6);
  } else if (timeFrame === '月') {
    if (isPrevious) {
      start.setMonth(start.getMonth() - 1);
    }
    start.setDate(1);
    end.setMonth(start.getMonth() + 1);
    end.setDate(0);
  } else if (timeFrame === '年') {
    if (isPrevious) {
      start.setFullYear(start.getFullYear() - 1);
    }
    start.setMonth(0, 1);
    end.setFullYear(start.getFullYear());
    end.setMonth(11, 31);
  }

  return { start, end };
}