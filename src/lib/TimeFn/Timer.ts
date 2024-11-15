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

// TODO* 創立的時間 UTC, 傳入ISO格式字串
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

// 傳入當地格式
export const multiFormatDateStringLocal = (timestamp: string = ""): string => {
  const date: Date = new Date(timestamp);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 7:
      return formatDateString(timestamp); // 超過 7 天，顯示完整日期
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