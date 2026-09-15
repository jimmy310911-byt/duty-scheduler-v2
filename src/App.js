import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Users, Settings, AlertCircle, BarChart3, CheckCircle2, ChevronRight, ChevronLeft, Table as TableIcon, Download, Loader2, FileSpreadsheet } from 'lucide-react';

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

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const formatDate = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

const formatDateObj = (date) => {
  return formatDate(date.getFullYear(), date.getMonth(), date.getDate());
};

// 計算連續假期的特殊積分 (連假中間日給予 2 分補償)
const ALL_DUTY_DATES = [...new Set([...SUNDAY_DUTY_DATES, ...REGULAR_DUTY_DATES])].sort((a, b) => new Date(a) - new Date(b));

export default function DutyScheduler() {
  const [config, setConfig] = useState({
    numPeople: 6, // 預設 6 人，方便分 3A 3B
    startDate: '2026-10-01', 
    duration: 3, 
    viewMode: 'calendar',
    startRegularA: 1, 
    startRegularB: 2, 
    startSunday: 1,
    edgePoints: 2,   // 連假頭尾積分
    middlePoints: 3  // 中斷連假積分
  });
  
  // 動態運算排班點數地圖 (獨立記錄 dates 結構屬性，不再依賴 points 值反推)
  const dutyMetaMap = useMemo(() => {
    const map = {};
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
         // 如果連續放假 3 天(含)以上，套用自訂的頭尾與中斷積分，並獨立標記 isMiddle
         if (currentBlock.length >= 3) {
            map[currentBlock[0]] = { points: config.edgePoints, isEdge: true, isMiddle: false };
            map[currentBlock[currentBlock.length - 1]] = { points: config.edgePoints, isEdge: true, isMiddle: false };
            for (let j = 1; j < currentBlock.length - 1; j++) {
               map[currentBlock[j]] = { points: config.middlePoints, isEdge: false, isMiddle: true };
            }
         } else {
            // 一般週末 2 天或單一假日皆為 1 分
            for (let j = 0; j < currentBlock.length; j++) {
               map[currentBlock[j]] = { points: 1, isEdge: false, isMiddle: false };
            }
         }
         currentBlock = [];
      }
    }
    return map;
  }, [config.edgePoints, config.middlePoints]);

  // 使用物件陣列同時儲存姓名與 A/B 工區群組
  const [peopleConfig, setPeopleConfig] = useState(
    Array(6).fill(null).map((_, i) => ({
      name: '',
      group: i % 2 === 0 ? 'A' : 'B'
    }))
  ); 

  const [scheduleMap, setScheduleMap] = useState({});
  const [stats, setStats] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (['numPeople', 'duration', 'startRegularA', 'startRegularB', 'startSunday', 'edgePoints', 'middlePoints'].includes(name)) {
      parsedValue = parseInt(value, 10) || 1;
    }

    setConfig(prev => {
      let nextConfig = { ...prev, [name]: parsedValue };
      if (name === 'numPeople') {
        if (nextConfig.startRegularA > parsedValue) nextConfig.startRegularA = 1;
        if (nextConfig.startRegularB > parsedValue) nextConfig.startRegularB = 1;
        if (nextConfig.startSunday > parsedValue) nextConfig.startSunday = 1;
      }
      return nextConfig;
    });

    if (name === 'numPeople') {
      setPeopleConfig(prev => {
        const newConfig = [...prev];
        if (parsedValue > prev.length) {
          const additions = Array(parsedValue - prev.length).fill(null).map((_, idx) => ({
             name: '',
             group: (prev.length + idx) % 2 === 0 ? 'A' : 'B'
          }));
          return [...newConfig, ...additions];
        }
        return newConfig.slice(0, parsedValue);
      });
    }
  };

  const handlePersonChange = (index, field, value) => {
    const newConfig = [...peopleConfig];
    newConfig[index] = { ...newConfig[index], [field]: value };
    setPeopleConfig(newConfig);
  };

  const generateSchedule = () => {
    const { numPeople, startDate, duration, startRegularA, startRegularB, startSunday } = config;
    
    let peopleStats = Array.from({ length: numPeople }, (_, i) => ({
      id: i + 1,
      name: peopleConfig[i]?.name?.trim() || `人員 ${i + 1}`,
      group: peopleConfig[i]?.group || 'A',
      regularPoints: 0,
      sundayPoints: 0,
      lastRegularDuty: null,
      lastSundayDuty: null,
      regularDates: [],
      sundayDates: [],
      interruptedLwCount: 0,
      monthlyCounts: {} 
    }));

    let sundayQueue = [];
    for (let i = 0; i < numPeople; i++) {
      sundayQueue.push(((startSunday - 1 + i) % numPeople) + 1);
    }

    // 準備 A, B 兩組的獨立序列
    let groupAIds = peopleStats.filter(p => p.group === 'A').map(p => p.id);
    let groupBIds = peopleStats.filter(p => p.group === 'B').map(p => p.id);

    // 依照指定的起始人員調整 Queue 的順序
    let regularQueueA = [...groupAIds];
    if (groupAIds.includes(startRegularA)) {
       const idx = groupAIds.indexOf(startRegularA);
       regularQueueA = [...groupAIds.slice(idx), ...groupAIds.slice(0, idx)];
    }
    let regularQueueB = [...groupBIds];
    if (groupBIds.includes(startRegularB)) {
       const idx = groupBIds.indexOf(startRegularB);
       regularQueueB = [...groupBIds.slice(idx), ...groupBIds.slice(0, idx)];
    }

    const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
    const startDateObj = new Date(sYear, sMonth - 1, sDay);
    const endDate = new Date(sYear, sMonth - 1 + duration, 0); 

    let generatedScheduleMap = {};
    let currentBlockWorkers = new Map(); 
    let lastDutyDateObj = null; 
    let lastDayWorkers = new Set(); 

    // 選人演算法：加入防呆機制與特殊假日優先分配
    const pickPerson = (queue, pointKey, blockWorkers, stats, previousDayWorkers, isMiddle, currentMonthKey) => {
      if (!queue || queue.length === 0) return null;

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

      // 2. 針對高積分(中斷連假)的日子：根據結構上的 isMiddle 進行判斷，不受分數高低影響
      if (isMiddle) {
        const minInterruptedCount = Math.min(...eligibleIds.map(id => stats.find(p => p.id === id).interruptedLwCount));
        eligibleIds = eligibleIds.filter(id => stats.find(p => p.id === id).interruptedLwCount === minInterruptedCount);
      }

      // 3. 針對「同一個月內不要值到二次以上」的軟限制 (單月排班平均化)
      let underCapIds = eligibleIds.filter(id => (stats.find(p => p.id === id).monthlyCounts[currentMonthKey] || 0) < 2);
      
      if (underCapIds.length === 0) {
        const minMonthShifts = Math.min(...eligibleIds.map(id => stats.find(p => p.id === id).monthlyCounts[currentMonthKey] || 0));
        underCapIds = eligibleIds.filter(id => (stats.find(p => p.id === id).monthlyCounts[currentMonthKey] || 0) === minMonthShifts);
      }
      
      eligibleIds = underCapIds;

      // 4. 在剩下的候選人中，找尋積分最低者
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
      const currentMonthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

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
          const dutyMeta = dutyMetaMap[dateStr] || { points: 1, isMiddle: false, isEdge: false };
          const earnedPoints = dutyMeta.points;
          const isMiddle = dutyMeta.isMiddle;
          const isEdge = dutyMeta.isEdge;

          const chosenPerson = pickPerson(sundayQueue, 'sundayPoints', currentBlockWorkers, peopleStats, lastDayWorkers, isMiddle, currentMonthKey);

          if (chosenPerson) {
              chosenPerson.sundayPoints += earnedPoints;
              if (isMiddle) chosenPerson.interruptedLwCount += 1;
              chosenPerson.monthlyCounts[currentMonthKey] = (chosenPerson.monthlyCounts[currentMonthKey] || 0) + 1;
              chosenPerson.lastSundayDuty = new Date(d);
              chosenPerson.sundayDates.push(dateStr);
              currentBlockWorkers.set(chosenPerson.id, (currentBlockWorkers.get(chosenPerson.id) || 0) + 1);
              
              generatedScheduleMap[dateStr] = {
                assignments: [{ id: chosenPerson.id, name: chosenPerson.name, group: chosenPerson.group }],
                type: 'sunday',
                earnedPoints: earnedPoints,
                isMiddle: isMiddle,
                isEdge: isEdge
              };
              
              lastDayWorkers = new Set([chosenPerson.id]);
          }
        } else if (isRegular) {
          const dutyMeta = dutyMetaMap[dateStr] || { points: 1, isMiddle: false, isEdge: false };
          const earnedPoints = dutyMeta.points;
          const isMiddle = dutyMeta.isMiddle;
          const isEdge = dutyMeta.isEdge;

          let assignments = [];
          
          // 挑選 A 區負責人
          if (regularQueueA.length > 0) {
            const chosenA = pickPerson(regularQueueA, 'regularPoints', currentBlockWorkers, peopleStats, lastDayWorkers, isMiddle, currentMonthKey);
            if (chosenA) {
                chosenA.regularPoints += earnedPoints;
                if (isMiddle) chosenA.interruptedLwCount += 1;
                chosenA.monthlyCounts[currentMonthKey] = (chosenA.monthlyCounts[currentMonthKey] || 0) + 1;
                chosenA.lastRegularDuty = new Date(d);
                chosenA.regularDates.push(dateStr);
                currentBlockWorkers.set(chosenA.id, (currentBlockWorkers.get(chosenA.id) || 0) + 1);
                assignments.push({ id: chosenA.id, name: chosenA.name, group: 'A' });
            }
          }

          // 挑選 B 區負責人
          if (regularQueueB.length > 0) {
            const chosenB = pickPerson(regularQueueB, 'regularPoints', currentBlockWorkers, peopleStats, lastDayWorkers, isMiddle, currentMonthKey);
            if (chosenB) {
                chosenB.regularPoints += earnedPoints;
                if (isMiddle) chosenB.interruptedLwCount += 1;
                chosenB.monthlyCounts[currentMonthKey] = (chosenB.monthlyCounts[currentMonthKey] || 0) + 1;
                chosenB.lastRegularDuty = new Date(d);
                chosenB.regularDates.push(dateStr);
                currentBlockWorkers.set(chosenB.id, (currentBlockWorkers.get(chosenB.id) || 0) + 1);
                assignments.push({ id: chosenB.id, name: chosenB.name, group: 'B' });
            }
          }
          
          generatedScheduleMap[dateStr] = {
            assignments: assignments,
            type: isRegular && dayOfWeek !== 6 ? 'holiday' : 'regular',
            earnedPoints: earnedPoints,
            isMiddle: isMiddle,
            isEdge: isEdge
          };
          
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
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const element = document.getElementById('schedule-capture-area');
      if (!element) return;

      const canvas = await window.html2canvas(element, {
        scale: 2, 
        backgroundColor: '#f8fafc',
        useCORS: true,
      });

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

  const downloadAsExcel = async () => {
    setIsDownloadingExcel(true);
    try {
      if (!window.XLSX) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const wb = window.XLSX.utils.book_new();

      // 第一分頁：積分總覽與統計
      const summaryData = [
        ["累積積分總覽表"],
        ["人員", "組別", "常規班積分", "週日班積分", "總積分", `中斷連假 (+${config.middlePoints}分) 次數`]
      ];
      stats.forEach(p => {
        summaryData.push([
          p.name,
          p.group,
          p.regularPoints,
          p.sundayPoints,
          p.regularPoints + p.sundayPoints,
          p.interruptedLwCount
        ]);
      });
      
      // 在 Excel 中留一些空行，再附上特殊加分明細(等同柱狀圖細節)
      summaryData.push([]);
      summaryData.push(["各人員特殊加分明細 (排班日紀錄)"]);
      stats.forEach(p => {
        summaryData.push([`【${p.name}】 常規班特殊積分日:`]);
        const regDetails = p.regularDates
          .map(d => ({ date: d, meta: dutyMetaMap[d] }))
          .filter(item => item.meta && item.meta.points > 1)
          .map(item => `${item.date} (+${item.meta.points}分)`);
        summaryData.push(regDetails.length > 0 ? regDetails : ["無"]);
        
        summaryData.push([`【${p.name}】 週日班特殊積分日:`]);
        const sunDetails = p.sundayDates
          .map(d => ({ date: d, meta: dutyMetaMap[d] }))
          .filter(item => item.meta && item.meta.points > 1)
          .map(item => `${item.date} (+${item.meta.points}分)`);
        summaryData.push(sunDetails.length > 0 ? sunDetails : ["無"]);
        summaryData.push([]);
      });

      const summarySheet = window.XLSX.utils.aoa_to_sheet(summaryData);
      
      // 調整首頁欄寬
      summarySheet['!cols'] = [{wch: 20}, {wch: 10}, {wch: 15}, {wch: 15}, {wch: 10}, {wch: 25}];
      window.XLSX.utils.book_append_sheet(wb, summarySheet, "積分總覽");

      // 分頁：各月份排班表
      const { startDate, duration } = config;
      const [sYear, sMonth] = startDate.split('-').map(Number);
      let currentDate = new Date(sYear, sMonth - 1, 1);

      for (let m = 0; m < duration; m++) {
        const currentYear = currentDate.getFullYear();
        const currentMonthIndex = currentDate.getMonth();
        const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

        const monthData = [
          [`${currentYear}年${currentMonthIndex + 1}月 排班表`],
          ["日期", ...stats.map(p => `${p.name} (${p.group}區)`)]
        ];

        for (let i = 1; i <= daysInMonth; i++) {
          const dateObj = new Date(currentYear, currentMonthIndex, i);
          const dateStr = formatDateObj(dateObj);
          const dayOfWeek = dateObj.getDay();
          const dutyInfo = scheduleMap[dateStr];
          const isCNY = CNY_DATES.includes(dateStr);

          let dayLabel = "";
          if (isCNY) dayLabel = " (春節)";
          else if (SUNDAY_DUTY_DATES.includes(dateStr)) dayLabel = " (週日)";
          else if (REGULAR_DUTY_DATES.includes(dateStr) && dayOfWeek !== 6) dayLabel = " (國假)";
          else if (REGULAR_DUTY_DATES.includes(dateStr) && dayOfWeek === 6) dayLabel = " (週六)";

          const dateText = `${currentMonthIndex + 1}/${i} (${WEEKDAYS[dayOfWeek]})${dayLabel}`;
          const rowData = [dateText];

          stats.forEach(person => {
            const isAssigned = dutyInfo && dutyInfo.assignments.some(a => a.id === person.id);
            if (isAssigned) {
              const assignmentDetail = dutyInfo.assignments.find(a => a.id === person.id);
              let cellText = dutyInfo.type !== 'sunday' ? assignmentDetail.group : '✓';
              if (dutyInfo.earnedPoints > 1) {
                cellText += ` (+${dutyInfo.earnedPoints})`;
              }
              rowData.push(cellText);
            } else {
              rowData.push("");
            }
          });
          monthData.push(rowData);
        }

        const monthSheet = window.XLSX.utils.aoa_to_sheet(monthData);
        // 調整月份表欄寬
        const cols = [{wch: 20}]; // 日期欄位
        stats.forEach(() => cols.push({wch: 15})); // 人員欄位
        monthSheet['!cols'] = cols;

        window.XLSX.utils.book_append_sheet(wb, monthSheet, `${currentYear}年${currentMonthIndex + 1}月`);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      window.XLSX.writeFile(wb, `排班表_${config.startDate.replace(/-/g, '')}.xlsx`);
    } catch (error) {
      console.error("下載 EXCEL 失敗:", error);
    } finally {
      setIsDownloadingExcel(false);
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
      const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay(); 
      
      let days = [];
      
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null);
      }
      
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
          
          <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200">
            {WEEKDAYS.map((day, idx) => (
              <div key={day} className={`text-center py-2 text-sm font-bold ${idx === 0 || idx === 6 ? 'text-red-500' : 'text-slate-600'}`}>
                {day}
              </div>
            ))}
          </div>

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
                cellClass = "bg-slate-50 min-h-[110px] p-2 flex flex-col"; 
                textClass = "text-red-500 font-bold";
              } else if (isCNY) {
                cellClass = "bg-red-50 min-h-[110px] p-2 flex flex-col border-red-100"; 
                textClass = "text-red-500 font-bold";
              }

              return (
                <div key={dateStr} className={cellClass}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={textClass}>{dateObj.getDate()}</span>
                    {isCNY && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">春節</span>}
                  </div>
                  
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
                                {dutyInfo.type !== 'sunday' && <span className="mr-0.5 opacity-70">[{assignee.group}]</span>}
                                {assignee.name}
                                {dutyInfo.earnedPoints > 1 && (
                                  <span 
                                    className={`ml-1 text-[10px] px-1 rounded shadow-sm border ${
                                      dutyInfo.isMiddle 
                                        ? 'text-red-600 bg-red-100 border-red-200' 
                                        : 'text-orange-600 bg-orange-100 border-orange-200'
                                    }`} 
                                    title={dutyInfo.isMiddle ? "連假中斷補償" : "連假頭尾補償"}
                                  >
                                    +{dutyInfo.earnedPoints}
                                  </span>
                                )}
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
                      {person.name} <span className="text-[10px] font-normal text-slate-500 block">({person.group}區)</span>
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
                        const assignmentDetail = isAssigned ? dutyInfo.assignments.find(a => a.id === person.id) : null;

                        return (
                          <td key={`${dateStr}-${person.id}`} className="px-4 py-2 border-r border-slate-200/60 text-center">
                            {isAssigned ? (
                              <div className="flex flex-col items-center justify-center gap-1">
                                <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white shadow-sm font-bold text-[11px] ${
                                  dutyInfo.type === 'holiday' ? 'bg-orange-500' : 
                                  dutyInfo.type === 'sunday' ? 'bg-emerald-600' : 
                                  'bg-blue-600'
                                }`}>
                                  {dutyInfo.type !== 'sunday' ? assignmentDetail.group : <CheckCircle2 className="w-4 h-4" />}
                                </div>
                                {dutyInfo.earnedPoints > 1 && (
                                  <span className={`text-[10px] font-bold px-1.5 rounded border leading-none py-0.5 ${
                                    dutyInfo.isMiddle 
                                      ? 'text-red-600 bg-red-50 border-red-200' 
                                      : 'text-orange-600 bg-orange-50 border-orange-200'
                                  }`}>
                                    +{dutyInfo.earnedPoints}分
                                  </span>
                                )}
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
        
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">週末與國定假日排班系統</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
            <Settings className="w-5 h-5 text-slate-500" />
            <h2 className="text-xl font-semibold">排班條件設定</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 flex items-center">
                <Users className="w-4 h-4 mr-1" /> 參與人數
              </label>
              <input 
                type="number" 
                name="numPeople"
                min="2"
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
              <label className="text-sm font-medium text-slate-600">A區 常規起始人</label>
              <select 
                name="startRegularA" 
                value={config.startRegularA} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              >
                {peopleConfig.map((p, i) => (
                  p.group === 'A' && (
                    <option key={i} value={i + 1}>
                      {p.name?.trim() ? `${p.name}` : `人員 ${i + 1}`}
                    </option>
                  )
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">B區 常規起始人</label>
              <select 
                name="startRegularB" 
                value={config.startRegularB} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              >
                {peopleConfig.map((p, i) => (
                  p.group === 'B' && (
                    <option key={i} value={i + 1}>
                      {p.name?.trim() ? `${p.name}` : `人員 ${i + 1}`}
                    </option>
                  )
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">連假頭尾積分</label>
              <input 
                type="number" 
                name="edgePoints"
                min="1"
                value={config.edgePoints} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">中斷連假積分</label>
              <input 
                type="number" 
                name="middlePoints"
                min="1"
                value={config.middlePoints} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <label className="text-sm font-medium text-slate-600 flex items-center">
                <Users className="w-4 h-4 mr-1" /> 自訂人員名稱與 A/B 工區組別
              </label>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
                <label className="text-sm font-medium text-slate-600">週日班(不分區) 起始人:</label>
                <select 
                  name="startSunday" 
                  value={config.startSunday} 
                  onChange={handleInputChange}
                  className="px-2 py-1 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {peopleConfig.map((p, i) => (
                    <option key={i} value={i + 1}>
                      {p.name?.trim() ? `${p.name} (${p.group})` : `人員 ${i + 1} (${p.group})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {peopleConfig.map((person, index) => (
                <div key={index} className="flex bg-white p-1.5 rounded-lg border border-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm">
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => handlePersonChange(index, 'name', e.target.value)}
                    placeholder={`預設: 人員 ${index + 1}`}
                    className="w-full px-2 py-1.5 text-sm bg-transparent outline-none"
                  />
                  <div className="w-px bg-slate-200 mx-1"></div>
                  <select
                    value={person.group}
                    onChange={(e) => handlePersonChange(index, 'group', e.target.value)}
                    className="px-1 py-1.5 text-sm font-bold bg-transparent outline-none cursor-pointer text-slate-700 hover:text-blue-600"
                  >
                    <option value="A">A區</option>
                    <option value="B">B區</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col lg:flex-row items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-600 space-y-1 mb-4 lg:mb-0">
              <p className="flex items-center text-red-600 font-medium"><CheckCircle2 className="w-4 h-4 mr-2" />嚴格排除：農曆春節期間</p>
              <p className="flex items-center text-blue-600 font-medium"><CheckCircle2 className="w-4 h-4 mr-2" />常規排班：週六、連假與國定假日 (A、B工區各派1人)</p>
              <p className="flex items-center text-emerald-600 font-medium"><CheckCircle2 className="w-4 h-4 mr-2" />週日排班：所有非春節週日 (單人不分區，獨立計算)</p>
              <p className="flex items-center text-purple-600 font-medium"><CheckCircle2 className="w-4 h-4 mr-2" />相鄰防呆：相鄰排班日強制不重複，並優先將中斷連假(+{config.middlePoints}分)平均分配</p>
              <p className="flex items-center text-amber-600 font-medium"><CheckCircle2 className="w-4 h-4 mr-2" />單月防呆：強制將同月班次平均攤平，避免單月集中排班過多次</p>
            </div>
            <button 
              onClick={generateSchedule}
              className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm w-full lg:w-auto"
            >
              產生行事曆班表
            </button>
          </div>
        </div>

        {hasGenerated && (
          <div className="mt-8 space-y-4">
            
            <div className="flex flex-wrap justify-end gap-3 mb-2">
              <button 
                onClick={downloadAsExcel} 
                disabled={isDownloadingExcel}
                className="flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloadingExcel ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-5 h-5 mr-2" />
                )}
                {isDownloadingExcel ? '處理中...' : '下載 EXCEL (表格)'}
              </button>
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
                {isDownloading ? '圖片生成中...' : '下載圖片 (完整版面)'}
              </button>
            </div>

            <div id="schedule-capture-area" className="flex flex-col space-y-8 bg-slate-50 p-2 sm:p-6 rounded-xl border border-slate-100">
              
              <div className="w-full">
                {config.viewMode === 'table' ? renderTableView() : renderCalendars()}
              </div>

              {/* 新增：累積積分總覽表 */}
              <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-4">
                  <h2 className="text-lg font-bold flex items-center text-slate-800">
                    <TableIcon className="w-5 h-5 mr-2 text-slate-600" />
                    累積積分總覽表
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 font-bold border-r border-slate-200 w-32">人員</th>
                        <th className="px-4 py-3 font-bold border-r border-slate-200 text-center w-24">組別</th>
                        <th className="px-4 py-3 font-bold border-r border-slate-200 text-center">常規班積分</th>
                        <th className="px-4 py-3 font-bold border-r border-slate-200 text-center">週日班積分</th>
                        <th className="px-4 py-3 font-bold text-center">總積分</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map(person => (
                        <tr key={`summary-${person.id}`} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2 border-r border-slate-200/60 font-medium text-slate-800 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {person.id}
                            </div>
                            <span className="truncate font-bold">{person.name}</span>
                          </td>
                          <td className="px-4 py-2 border-r border-slate-200/60 text-center font-bold text-slate-600">
                            {person.group}區
                          </td>
                          <td className="px-4 py-2 border-r border-slate-200/60 text-center text-blue-600 font-bold text-base">
                            {person.regularPoints}
                          </td>
                          <td className="px-4 py-2 border-r border-slate-200/60 text-center text-emerald-600 font-bold text-base">
                            {person.sundayPoints}
                          </td>
                          <td className="px-4 py-2 text-center text-slate-900 font-black text-lg bg-slate-50/50">
                            {person.regularPoints + person.sundayPoints}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

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
                      <div className="flex items-center space-x-2 mb-2 pb-3 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {person.id}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">
                            {person.name} <span className="text-slate-400 font-normal text-xs ml-0.5">({person.group}區)</span>
                          </span>
                          <span className="text-[11px] font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-sm mt-0.5 inline-block w-fit">
                            中斷連假 (+{config.middlePoints}分): {person.interruptedLwCount} 次
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-around items-end pt-2 min-h-[160px]">
                        
                        <div className="flex flex-col items-center justify-end w-1/2 px-1">
                          <div className="text-xl font-black text-blue-600 mb-2 leading-none">{person.regularPoints}</div>
                          <div className="w-full flex flex-col items-center justify-end">
                            {person.regularDates.slice().reverse().map((dateStr, idx) => {
                              const meta = dutyMetaMap[dateStr] || {points: 1, isMiddle: false, isEdge: false};
                              const pts = meta.points;
                              const baseH = 28; 
                              const gap = 4; 
                              const height = pts > 1 ? (baseH * pts + gap * (pts - 1)) : baseH; 
                              return (
                                <div key={`reg-${idx}`} 
                                     className="w-full max-w-[80px] bg-blue-50 border border-blue-200 text-blue-700 flex flex-col items-center justify-center rounded-md shadow-sm hover:bg-blue-100 transition-colors mb-1"
                                     style={{ height: `${height}px` }}>
                                  <span className="text-[11px] font-semibold">{dateStr.substring(5).replace('-', '/')}</span>
                                  {pts > 1 && <span className={`font-bold ml-0.5 text-[10px] leading-none mt-0.5 ${meta.isMiddle ? 'text-red-500' : 'text-orange-500'}`}>+{pts}</span>}
                                </div>
                              );
                            })}
                          </div>
                          <div className="text-xs font-bold text-slate-500 mt-3 bg-slate-50 px-2 py-0.5 rounded">常規</div>
                        </div>

                        <div className="w-px bg-slate-200 self-stretch mx-1"></div>

                        <div className="flex flex-col items-center justify-end w-1/2 px-1">
                          <div className="text-xl font-black text-emerald-600 mb-2 leading-none">{person.sundayPoints}</div>
                          <div className="w-full flex flex-col items-center justify-end">
                            {person.sundayDates.slice().reverse().map((dateStr, idx) => {
                              const meta = dutyMetaMap[dateStr] || {points: 1, isMiddle: false, isEdge: false};
                              const pts = meta.points;
                              const baseH = 28;
                              const gap = 4;
                              const height = pts > 1 ? (baseH * pts + gap * (pts - 1)) : baseH;
                              return (
                                <div key={`sun-${idx}`} 
                                     className="w-full max-w-[80px] bg-emerald-50 border border-emerald-200 text-emerald-700 flex flex-col items-center justify-center rounded-md shadow-sm hover:bg-emerald-100 transition-colors mb-1"
                                     style={{ height: `${height}px` }}>
                                  <span className="text-[11px] font-semibold">{dateStr.substring(5).replace('-', '/')}</span>
                                  {pts > 1 && <span className={`font-bold ml-0.5 text-[10px] leading-none mt-0.5 ${meta.isMiddle ? 'text-red-500' : 'text-orange-500'}`}>+{pts}</span>}
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
