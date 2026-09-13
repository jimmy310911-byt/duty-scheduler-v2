import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Users, Settings, AlertCircle, BarChart3, CheckCircle2, ChevronRight, ChevronLeft, Table as TableIcon, Download, Loader2 } from 'lucide-react';

// 根據使用者提供的明確日期，定義農曆過年期間 (不排班)
const CNY_DATES = [
  // 2026年
  '2026-02-14', '2026-02-15', '2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20', '2026-02-21', '2026-02-22',
  // 2027年
  '2027-02-04', '2027-02-05', '2027-02-06', '2027-02-07', '2027-02-08', '2027-02-09', '2027-02-10'
];

// 根據使用者提供的明確日期，定義週日排班日
const SUNDAY_DUTY_DATES = [
  // 2026年
  '2026-01-04', '2026-01-11', '2026-01-18', '2026-01-25', '2026-02-01', '2026-02-08', '2026-03-01', '2026-03-08', '2026-03-15', '2026-03-22', '2026-03-29', '2026-04-05', '2026-04-12', '2026-04-19', '2026-04-26', '2026-05-03', '2026-05-10', '2026-05-17', '2026-05-24', '2026-05-31', '2026-06-07', '2026-06-14', '2026-06-21', '2026-06-28', '2026-07-05', '2026-07-12', '2026-07-19', '2026-07-26', '2026-08-02', '2026-08-09', '2026-08-16', '2026-08-23', '2026-08-30', '2026-09-06', '2026-09-13', '2026-09-20', '2026-09-27', '2026-10-04', '2026-10-11', '2026-10-18', '2026-10-25', '2026-11-01', '2026-11-08', '2026-11-15', '2026-11-22', '2026-11-29', '2026-12-06', '2026-12-13', '2026-12-20', '2026-12-27',
  // 2027年
  '2027-01-03', '2027-01-10', '2027-01-17', '2027-01-24', '2027-01-31', '2027-02-14', '2027-02-21', '2027-02-28', '2027-03-07', '2027-03-14', '2027-03-21', '2027-03-28', '2027-04-04', '2027-04-11', '2027-04-18', '2027-04-25', '2027-05-02', '2027-05-09', '2027-05-16', '2027-05-23', '2027-05-30', '2027-06-06', '2027-06-13', '2027-06-20', '2027-06-27', '2027-07-04', '2027-07-11', '2027-07-18', '2027-07-25', '2027-08-01', '2027-08-08', '2027-08-15', '2027-08-22', '2027-08-29', '2027-09-05', '2027-09-12', '2027-09-19', '2027-09-26', '2027-10-03', '2027-10-10', '2027-10-17', '2027-10-24', '2027-10-31', '2027-11-07', '2027-11-14', '2027-11-21', '2027-11-28', '2027-12-05', '2027-12-12', '2027-12-19', '2027-12-26'
];

// 根據使用者提供的明確日期，定義常規排班日 (週六或彈性假日、國定假日)
const REGULAR_DUTY_DATES = [
  // 2026年
  '2026-01-01', '2026-01-03', '2026-01-10', '2026-01-17', '2026-01-24', '2026-01-31', '2026-02-07', '2026-02-27', '2026-02-28', '2026-03-07', '2026-03-14', '2026-03-21', '2026-03-28', '2026-04-03', '2026-04-04', '2026-04-06', '2026-04-11', '2026-04-18', '2026-04-25', '2026-05-01', '2026-05-02', '2026-05-09', '2026-05-16', '2026-05-23', '2026-05-30', '2026-06-06', '2026-06-13', '2026-06-19', '2026-06-20', '2026-06-27', '2026-07-04', '2026-07-11', '2026-07-18', '2026-07-25', '2026-08-01', '2026-08-08', '2026-08-15', '2026-08-22', '2026-08-29', '2026-09-05', '2026-09-12', '2026-09-19', '2026-09-25', '2026-09-26', '2026-09-28', '2026-10-03', '2026-10-09', '2026-10-10', '2026-10-17', '2026-10-24', '2026-10-26', '2026-10-31', '2026-11-07', '2026-11-14', '2026-11-21', '2026-11-28', '2026-12-05', '2026-12-12', '2026-12-19', '2026-12-25', '2026-12-26',
  // 2027年
  '2027-01-01', '2027-01-02', '2027-01-09', '2027-01-16', '2027-01-23', '2027-01-30', '2027-02-13', '2027-02-20', '2027-02-27', '2027-03-01', '2027-03-06', '2027-03-13', '2027-03-20', '2027-03-27', '2027-04-03', '2027-04-05', '2027-04-06', '2027-04-10', '2027-04-17', '2027-04-24', '2027-04-30', '2027-05-01', '2027-05-08', '2027-05-15', '2027-05-22', '2027-05-29', '2027-06-05', '2027-06-09', '2027-06-12', '2027-06-19', '2027-06-26', '2027-07-03', '2027-07-10', '2027-07-17', '2027-07-24', '2027-07-31', '2027-08-07', '2027-08-14', '2027-08-21', '2027-08-28', '2027-09-04', '2027-09-11', '2027-09-15', '2027-09-18', '2027-09-25', '2027-09-28', '2027-10-02', '2027-10-09', '2027-10-11', '2027-10-16', '2027-10-23', '2027-10-25', '2027-10-30', '2027-11-06', '2027-11-13', '2027-11-20', '2027-11-27', '2027-12-04', '2027-12-11', '2027-12-18', '2027-12-24', '2027-12-25', '2027-12-31'
];

// 星期對應表
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

// 格式化日期為 YYYY-MM-DD
const formatDate = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

const formatDateObj = (date) => {
  return formatDate(date.getFullYear(), date.getMonth(), date.getDate());
};

// 判斷是否為需要排班的日子 (保留作為基礎檢驗用)
const isValidDutyDay = (dateStr) => {
  if (CNY_DATES.includes(dateStr)) return false;
  if (SUNDAY_DUTY_DATES.includes(dateStr)) return true;
  if (REGULAR_DUTY_DATES.includes(dateStr)) return true;
  return false;
};

// 計算連續假期的特殊積分 (連假中間日給予 2 分補償)
const ALL_DUTY_DATES = [...new Set([...SUNDAY_DUTY_DATES, ...REGULAR_DUTY_DATES])].sort((a, b) => new Date(a) - new Date(b));
const DUTY_POINTS_MAP = {};
let currentBlock = [];

for (let i = 0; i < ALL_DUTY_DATES.length; i++) {
  const current = ALL_DUTY_DATES[i];
  currentBlock.push(current);

  const next = ALL_DUTY_DATES[i + 1];
  let isConsecutive = false;
  if (next) {
     const currDate = new Date(current);
     const nextDate = new Date(next);
     const diffDays = Math.round((nextDate - currDate) / (1000 * 60 * 60 * 24));
     if (diffDays === 1) isConsecutive = true;
  }

  if (!isConsecutive) {
     // 如果連續放假 3 天(含)以上，扣除首尾，中間的日子皆為 2 分
     if (currentBlock.length >= 3) {
        DUTY_POINTS_MAP[currentBlock[0]] = 1;
        DUTY_POINTS_MAP[currentBlock[currentBlock.length - 1]] = 1;
        for (let j = 1; j < currentBlock.length - 1; j++) {
           DUTY_POINTS_MAP[currentBlock[j]] = 2;
        }
     } else {
        // 一般週末 2 天或單一假日皆為 1 分
        for (let j = 0; j < currentBlock.length; j++) {
           DUTY_POINTS_MAP[currentBlock[j]] = 1;
        }
     }
     currentBlock = [];
  }
}

export default function DutyScheduler() {
  const [config, setConfig] = useState({
    numPeople: 5,
    startDate: '2026-10-01', 
    duration: 3, 
    viewMode: 'calendar',
    startRegular: 1, 
    startSunday: 4   
  });
  const [peopleNames, setPeopleNames] = useState(Array(5).fill('')); 

  const [scheduleMap, setScheduleMap] = useState({});
  const [stats, setStats] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (['numPeople', 'duration', 'startRegular', 'startSunday'].includes(name)) {
      parsedValue = parseInt(value, 10) || 1;
    }

    setConfig(prev => {
      let nextConfig = { ...prev, [name]: parsedValue };
      // 防呆：如果總人數減少，確保起始人員 ID 不會超過總人數
      if (name === 'numPeople') {
        if (nextConfig.startRegular > parsedValue) nextConfig.startRegular = 1;
        if (nextConfig.startSunday > parsedValue) nextConfig.startSunday = 1;
      }
      return nextConfig;
    });

    if (name === 'numPeople') {
      setPeopleNames(prev => {
        const newNames = [...prev];
        if (parsedValue > prev.length) {
          return [...newNames, ...Array(parsedValue - prev.length).fill('')];
        }
        return newNames.slice(0, parsedValue);
      });
    }
  };

  const handleNameChange = (index, value) => {
    const newNames = [...peopleNames];
    newNames[index] = value;
    setPeopleNames(newNames);
  };

  const generateSchedule = () => {
    const { numPeople, startDate, duration, startRegular, startSunday } = config;
    
    let peopleStats = Array.from({ length: numPeople }, (_, i) => ({
      id: i + 1,
      name: peopleNames[i]?.trim() || `人員 ${i + 1}`,
      regularPoints: 0,
      sundayPoints: 0,
      lastRegularDuty: null,
      lastSundayDuty: null,
      regularDates: [],
      sundayDates: []
    }));

    let regularQueue = [];
    let sundayQueue = [];
    for (let i = 0; i < numPeople; i++) {
      regularQueue.push(((startRegular - 1 + i) % numPeople) + 1);
      sundayQueue.push(((startSunday - 1 + i) % numPeople) + 1);
    }

    const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
    const startDateObj = new Date(sYear, sMonth - 1, sDay);
    const endDate = new Date(sYear, sMonth - 1 + duration, 0); 

    let generatedScheduleMap = {};
    let currentBlockWorkers = new Map(); 
    let lastDutyDateObj = null; 
    let lastDayWorkers = new Set(); // 新增：紀錄上一個排班日的工作人員，防止跨週連續上班

    // 更新選人演算法：加入跨排班日防呆機制
    const pickPerson = (queue, pointKey, blockWorkers, stats, previousDayWorkers) => {
      // 1. 嚴格篩選：不在本次連假出勤過，且「不是上一個排班日」出勤的人 (防止跨週連上)
      let eligibleIds = queue.filter(id => !blockWorkers.has(id) && !previousDayWorkers.has(id));

      if (eligibleIds.length === 0) {
        // 放寬條件 1：如果人數太少導致卡死，允許上一個排班日出勤的人 (但仍不可在同一連假出勤)
        eligibleIds = queue.filter(id => !blockWorkers.has(id));
      }

      if (eligibleIds.length === 0) {
        // 放寬條件 2：防呆，如果所有人都排過了，強制全部開放重選
        eligibleIds = queue; 
      }

      const minPts = Math.min(...eligibleIds.map(id => stats.find(p => p.id === id)[pointKey]));
      const chosenIdx = queue.findIndex(id => eligibleIds.includes(id) && stats.find(p => p.id === id)[pointKey] === minPts);
      
      const chosenId = queue.splice(chosenIdx, 1)[0];
      queue.push(chosenId);
      
      return stats.find(p => p.id === chosenId);
    };

    for (let d = new Date(startDateObj); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDateObj(d);
      const dayOfWeek = d.getDay();
      const isCNY = CNY_DATES.includes(dateStr);

      if (isCNY) continue;

      const isSunday = SUNDAY_DUTY_DATES.includes(dateStr);
      const isRegular = REGULAR_DUTY_DATES.includes(dateStr);
      
      if (isSunday || isRegular) {
        if (lastDutyDateObj) {
          const diffTime = Math.abs(d - lastDutyDateObj);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 1) {
            currentBlockWorkers.clear(); 
          }
        }
        lastDutyDateObj = new Date(d);

        if (isSunday) {
          const earnedPoints = DUTY_POINTS_MAP[dateStr] || 1;
          
          // 傳入 lastDayWorkers 進行防呆過濾
          const chosenPerson = pickPerson(sundayQueue, 'sundayPoints', currentBlockWorkers, peopleStats, lastDayWorkers);

          chosenPerson.sundayPoints += earnedPoints;
          chosenPerson.lastSundayDuty = new Date(d);
          chosenPerson.sundayDates.push(dateStr);
          currentBlockWorkers.set(chosenPerson.id, (currentBlockWorkers.get(chosenPerson.id) || 0) + 1);
          
          generatedScheduleMap[dateStr] = {
            assignments: [{ id: chosenPerson.id, name: chosenPerson.name }],
            type: 'sunday',
            earnedPoints: earnedPoints
          };
          
          // 更新上一排班日的人員名單
          lastDayWorkers = new Set([chosenPerson.id]);
          
        } else if (isRegular) {
          const earnedPoints = DUTY_POINTS_MAP[dateStr] || 1;
          
          // 傳入 lastDayWorkers 進行防呆過濾
          const chosen1 = pickPerson(regularQueue, 'regularPoints', currentBlockWorkers, peopleStats, lastDayWorkers);
          
          chosen1.regularPoints += earnedPoints;
          chosen1.lastRegularDuty = new Date(d);
          chosen1.regularDates.push(dateStr);
          currentBlockWorkers.set(chosen1.id, (currentBlockWorkers.get(chosen1.id) || 0) + 1);
          
          let assignments = [{ id: chosen1.id, name: chosen1.name }];

          if (peopleStats.length > 1) {
            // 傳入 lastDayWorkers 進行防呆過濾
            const chosen2 = pickPerson(regularQueue, 'regularPoints', currentBlockWorkers, peopleStats, lastDayWorkers);

            chosen2.regularPoints += earnedPoints;
            chosen2.lastRegularDuty = new Date(d);
            chosen2.regularDates.push(dateStr);
            currentBlockWorkers.set(chosen2.id, (currentBlockWorkers.get(chosen2.id) || 0) + 1);
            assignments.push({ id: chosen2.id, name: chosen2.name });
          }
          
          generatedScheduleMap[dateStr] = {
            assignments: assignments,
            type: isRegular && dayOfWeek !== 6 ? 'holiday' : 'regular',
            earnedPoints: earnedPoints
          };
          
          // 更新上一排班日的人員名單
          lastDayWorkers = new Set(assignments.map(a => a.id));
        }
      }
    }

    setScheduleMap(generatedScheduleMap);
    setStats(peopleStats);
    setHasGenerated(true);
  };

  const downloadAsImage = async () => {
    setIsDownloading(true);
    try {
      // 動態載入 html2canvas 套件 (確保在沒有預裝的環境也能運作)
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // 取得要截圖的區塊元素
      const element = document.getElementById('schedule-capture-area');
      if (!element) return;

      // 執行截圖
      const canvas = await window.html2canvas(element, {
        scale: 2, // 提高圖片解析度
        backgroundColor: '#f8fafc', // 對應 Tailwind 的 bg-slate-50
        useCORS: true,
      });

      // 轉換為圖片連結並觸發下載
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      const dateString = config.startDate.replace(/-/g, '');
      link.download = `排班表_${dateString}.png`;
      link.click();
    } catch (error) {
      console.error("下載圖片失敗:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderCalendars = () => {
    const { startDate, duration } = config;
    const [sYear, sMonth] = startDate.split('-').map(Number);
    let calendars = [];
    let currentDate = new Date(sYear, sMonth - 1, 1);

    for (let m = 0; m < duration; m++) {
      const currentYear = currentDate.getFullYear();
      const currentMonthIndex = currentDate.getMonth();
      
      const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
      const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = Sun
      
      let days = [];
      
      // 補齊月初前方的空白天數
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null);
      }
      
      // 填入實際天數
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(currentYear, currentMonthIndex, i));
      }

      calendars.push(
        <div key={`${currentYear}-${currentMonthIndex}`} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-800 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="text-lg font-bold tracking-wider">
              {currentYear} 年 {currentMonthIndex + 1} 月
            </h3>
          </div>
          
          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200">
            {WEEKDAYS.map((day, idx) => (
              <div key={day} className={`text-center py-2 text-sm font-bold ${idx === 0 || idx === 6 ? 'text-red-500' : 'text-slate-600'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid Body */}
          <div className="grid grid-cols-7 gap-px bg-slate-200">
            {days.map((dateObj, idx) => {
              if (!dateObj) {
                return <div key={`empty-${m}-${idx}`} className="bg-slate-50 min-h-[100px]"></div>;
              }

              const dateStr = formatDateObj(dateObj);
              const dayOfWeek = dateObj.getDay();
              const dutyInfo = scheduleMap[dateStr];
              const isCNY = CNY_DATES.includes(dateStr);
              
              let cellClass = "bg-white min-h-[110px] p-2 flex flex-col transition-colors hover:bg-slate-50";
              let textClass = "text-slate-700 font-medium";
              
              if (dayOfWeek === 0) {
                cellClass = "bg-slate-50 min-h-[110px] p-2 flex flex-col"; // 週日反灰
                textClass = "text-red-500 font-bold";
              } else if (isCNY) {
                cellClass = "bg-red-50 min-h-[110px] p-2 flex flex-col border-red-100"; // 春節特殊底色
                textClass = "text-red-500 font-bold";
              }

              return (
                <div key={dateStr} className={cellClass}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={textClass}>{dateObj.getDate()}</span>
                    {isCNY && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">春節</span>}
                  </div>
                  
                  {}
                  {/* 排班資訊顯示 */}
                  <div className="flex-1 flex flex-col justify-end pb-1">
                    {dutyInfo && (
                      <div className={`mt-1 flex flex-col items-center justify-center p-1.5 rounded-lg border ${
                        dutyInfo.type === 'holiday' ? 'bg-orange-50 border-orange-200' :
                        dutyInfo.type === 'sunday' ? 'bg-emerald-50 border-emerald-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        {dutyInfo.type === 'holiday' && <span className="text-xs font-bold mb-1 leading-normal text-orange-700">國定假日</span>}
                        {dutyInfo.type === 'sunday' && <span className="text-xs font-bold mb-1 leading-normal text-emerald-700">週日班</span>}
                        {dutyInfo.type === 'regular' && <span className="text-xs font-bold mb-1 leading-normal text-blue-700">週末班</span>}
                        
                        <div className="w-full flex flex-col gap-1">
                          {dutyInfo.assignments.map(assignee => (
                            <div key={assignee.id} className="flex items-center justify-center gap-1">
                              <div className={`w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                                dutyInfo.type === 'holiday' ? 'bg-orange-500' : 
                                dutyInfo.type === 'sunday' ? 'bg-emerald-600' : 
                                'bg-blue-600'
                              }`}>
                                {assignee.id}
                              </div>
                              <span className={`text-xs font-bold leading-normal whitespace-nowrap flex items-center ${
                                dutyInfo.type === 'holiday' ? 'text-orange-700' : 
                                dutyInfo.type === 'sunday' ? 'text-emerald-700' : 
                                'text-blue-700'
                              }`}>
                                {assignee.name}
                                {dutyInfo.earnedPoints === 2 && <span className="ml-1 text-[10px] text-red-600 bg-red-100 px-1 rounded shadow-sm border border-red-200" title="連假中斷補償">+2</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return calendars;
  };

  // 新增表格檢視模式的渲染函數
  const renderTableView = () => {
    const { startDate, duration } = config;
    const [sYear, sMonth] = startDate.split('-').map(Number);
    let tables = [];
    let currentDate = new Date(sYear, sMonth - 1, 1);

    for (let m = 0; m < duration; m++) {
      const currentYear = currentDate.getFullYear();
      const currentMonthIndex = currentDate.getMonth();
      const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
      
      let days = [];
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(currentYear, currentMonthIndex, i));
      }

      tables.push(
        <div key={`table-${currentYear}-${currentMonthIndex}`} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-800 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="text-lg font-bold tracking-wider">
              {currentYear} 年 {currentMonthIndex + 1} 月
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold border-r border-slate-200 w-44">日期</th>
                  {stats.map(person => (
                    <th key={person.id} className="px-4 py-3 font-bold text-center border-r border-slate-200 min-w-[80px]">
                      {person.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((dateObj) => {
                  const dateStr = formatDateObj(dateObj);
                  const dayOfWeek = dateObj.getDay();
                  const isCNY = CNY_DATES.includes(dateStr);
                  const isNationalHoliday = REGULAR_DUTY_DATES.includes(dateStr) && dayOfWeek !== 6;
                  const isSundayDuty = SUNDAY_DUTY_DATES.includes(dateStr);
                  const isRegularSaturday = REGULAR_DUTY_DATES.includes(dateStr) && dayOfWeek === 6;
                  const dutyInfo = scheduleMap[dateStr];

                  let rowClass = "bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors";
                  let dateTextClass = "text-slate-700";
                  let dayTypeLabel = "";

                  // 依照放假類型給予不同底色與標示
                  if (isCNY) {
                    rowClass = "bg-red-50 border-b border-red-100 hover:bg-red-100";
                    dateTextClass = "text-red-600 font-bold";
                    dayTypeLabel = "春節";
                  } else if (isSundayDuty) {
                    rowClass = "bg-emerald-50 border-b border-emerald-100 hover:bg-emerald-100";
                    dateTextClass = "text-emerald-700 font-bold";
                    dayTypeLabel = "週日";
                  } else if (isNationalHoliday) {
                    rowClass = "bg-orange-50 border-b border-orange-100 hover:bg-orange-100";
                    dateTextClass = "text-orange-700 font-bold";
                    dayTypeLabel = "國假";
                  } else if (isRegularSaturday) {
                    rowClass = "bg-blue-50 border-b border-blue-100 hover:bg-blue-100";
                    dateTextClass = "text-blue-700 font-bold";
                    dayTypeLabel = "週六";
                  }

                  return (
                    <tr key={dateStr} className={rowClass}>
                      <td className="px-4 py-2 border-r border-slate-200/60 whitespace-nowrap">
                        <span className={dateTextClass}>
                          {dateObj.getMonth() + 1}/{dateObj.getDate()} ({WEEKDAYS[dayOfWeek]})
                        </span>
                        {dayTypeLabel && <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] bg-white/50 border ${dateTextClass.split(' ')[0].replace('text', 'border')}`}>{dayTypeLabel}</span>}
                      </td>
                      {stats.map(person => {
                        const isAssigned = dutyInfo && dutyInfo.assignments.some(a => a.id === person.id);
                        return (
                          <td key={`${dateStr}-${person.id}`} className="px-4 py-2 border-r border-slate-200/60 text-center">
                            {isAssigned ? (
                              <div className="flex flex-col items-center justify-center gap-1">
                                <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white shadow-sm ${
                                  dutyInfo.type === 'holiday' ? 'bg-orange-500' : 
                                  dutyInfo.type === 'sunday' ? 'bg-emerald-600' : 
                                  'bg-blue-600'
                                }`}>
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                                {dutyInfo.earnedPoints === 2 && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 rounded border border-red-200 leading-none py-0.5">+2分</span>}
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return tables;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">週末與國定假日排班系統</h1>
        </div>

        {/* Configuration Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
            <Settings className="w-5 h-5 text-slate-500" />
            <h2 className="text-xl font-semibold">排班條件設定</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 flex items-center">
                <Users className="w-4 h-4 mr-1" /> 參與排班人數
              </label>
              <input 
                type="number" 
                name="numPeople"
                min="1"
                value={config.numPeople} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">開始日期</label>
              <input 
                type="date"
                name="startDate" 
                value={config.startDate} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">產生幾個月</label>
              <input 
                type="number" 
                name="duration"
                min="1"
                max="12"
                value={config.duration} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">常規班起始人員</label>
              <select 
                name="startRegular" 
                value={config.startRegular} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              >
                {Array.from({ length: config.numPeople }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {peopleNames[i]?.trim() ? `${peopleNames[i]}` : `人員 ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">週日班起始人員</label>
              <select 
                name="startSunday" 
                value={config.startSunday} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              >
                {Array.from({ length: config.numPeople }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {peopleNames[i]?.trim() ? `${peopleNames[i]}` : `人員 ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 flex items-center">
                <TableIcon className="w-4 h-4 mr-1" /> 檢視模式
              </label>
              <select 
                name="viewMode" 
                value={config.viewMode} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              >
                <option value="calendar">行事曆</option>
                <option value="table">表格</option>
              </select>
            </div>
          </div>

          {/* 人員名稱設定 */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <label className="text-sm font-medium text-slate-600 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-1" /> 自訂人員名稱 (若留空則使用預設名稱)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {peopleNames.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`預設: 人員 ${index + 1}`}
                  className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col lg:flex-row items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-600 space-y-1 mb-4 lg:mb-0">
              <p className="flex items-center text-red-600 font-medium"><CheckCircle2 className="w-4 h-4 mr-2" />嚴格排除：農曆春節期間</p>
              <p className="flex items-center text-blue-600 font-medium"><CheckCircle2 className="w-4 h-4 mr-2" />常規排班：週六、連假與國定假日 (2人)</p>
              <p className="flex items-center text-emerald-600 font-medium"><CheckCircle2 className="w-4 h-4 mr-2" />週日排班：所有非春節週日 (獨立計算)</p>
              <p className="flex items-center text-purple-600 font-medium"><CheckCircle2 className="w-4 h-4 mr-2" />過勞防呆：相鄰排班日強制不重複，避免跨週連續上班</p>
            </div>
            <button 
              onClick={generateSchedule}
              className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm w-full lg:w-auto"
            >
              產生行事曆班表
            </button>
          </div>
        </div>

        {/* Output Section */}
        {hasGenerated && (
          <div className="mt-8 space-y-4">
            
            {/* Action Bar (下載按鈕) */}
            <div className="flex justify-end mb-2">
              <button 
                onClick={downloadAsImage} 
                disabled={isDownloading}
                className="flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Download className="w-5 h-5 mr-2" />
                )}
                {isDownloading ? '圖片生成中...' : '下載排班表與統計圖'}
              </button>
            </div>

            {/* 截圖範圍 (Capture Area) */}
            <div id="schedule-capture-area" className="flex flex-col space-y-8 bg-slate-50 p-2 sm:p-6 rounded-xl border border-slate-100">
              
              {/* View Switching (Calendar or Table) */}
              <div className="w-full">
                {config.viewMode === 'table' ? renderTableView() : renderCalendars()}
              </div>

              {}
              {/* Stats Section (Bottom Full Width) */}
              <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-4">
                  <h2 className="text-lg font-bold flex items-center text-slate-800">
                    <BarChart3 className="w-5 h-5 mr-2 text-slate-600" />
                    累積積分統計 (柱狀圖)
                  </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map(person => (
                    <div key={person.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                      <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                          {person.id}
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{person.name}</span>
                      </div>
                      
                      {/* Bar Charts Container */}
                      <div className="flex justify-around items-end pt-1 min-h-[160px]">
                        
                        {/* Regular Points Bar */}
                        <div className="flex flex-col items-center justify-end w-1/2 px-1">
                          <div className="text-xl font-black text-blue-600 mb-2 leading-none">{person.regularPoints}</div>
                          <div className="w-full flex flex-col items-center justify-end">
                            {/* 反轉陣列讓日期由下而上堆疊 */}
                            {person.regularDates.slice().reverse().map((dateStr, idx) => {
                              const pts = DUTY_POINTS_MAP[dateStr] || 1;
                              const baseH = 28; // 1分的高度 (px)
                              const gap = 4; // mb-1 的間距 (px)
                              const height = pts === 2 ? (baseH * 2 + gap) : baseH; // 2分的格子高度為兩倍加上間距
                              return (
                                <div key={`reg-${idx}`} 
                                     className="w-full max-w-[80px] bg-blue-50 border border-blue-200 text-blue-700 flex flex-col items-center justify-center rounded-md shadow-sm hover:bg-blue-100 transition-colors mb-1"
                                     style={{ height: `${height}px` }}>
                                  <span className="text-[11px] font-semibold">{dateStr.substring(5).replace('-', '/')}</span>
                                  {pts === 2 && <span className="text-red-500 font-bold ml-0.5 text-[10px] leading-none mt-0.5">+2</span>}
                                </div>
                              );
                            })}
                          </div>
                          <div className="text-xs font-bold text-slate-500 mt-3 bg-slate-50 px-2 py-0.5 rounded">常規</div>
                        </div>

                        {/* Divider */}
                        <div className="w-px bg-slate-200 self-stretch mx-1"></div>

                        {/* Sunday Points Bar */}
                        <div className="flex flex-col items-center justify-end w-1/2 px-1">
                          <div className="text-xl font-black text-emerald-600 mb-2 leading-none">{person.sundayPoints}</div>
                          <div className="w-full flex flex-col items-center justify-end">
                            {person.sundayDates.slice().reverse().map((dateStr, idx) => {
                              const pts = DUTY_POINTS_MAP[dateStr] || 1;
                              const baseH = 28;
                              const gap = 4;
                              const height = pts === 2 ? (baseH * 2 + gap) : baseH;
                              return (
                                <div key={`sun-${idx}`} 
                                     className="w-full max-w-[80px] bg-emerald-50 border border-emerald-200 text-emerald-700 flex flex-col items-center justify-center rounded-md shadow-sm hover:bg-emerald-100 transition-colors mb-1"
                                     style={{ height: `${height}px` }}>
                                  <span className="text-[11px] font-semibold">{dateStr.substring(5).replace('-', '/')}</span>
                                  {pts === 2 && <span className="text-red-500 font-bold ml-0.5 text-[10px] leading-none mt-0.5">+2</span>}
                                </div>
                              );
                            })}
                          </div>
                          <div className="text-xs font-bold text-slate-500 mt-3 bg-slate-50 px-2 py-0.5 rounded">週日</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
