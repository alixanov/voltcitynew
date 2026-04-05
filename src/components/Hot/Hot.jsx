import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import VideoData from '../data/VideoData';

// ====================== ЦВЕТА (премиум / юридический стиль) ======================
const colors = {
  background: {
    primary: '#0A1A1A',
    secondary: '#0F2424',
    tertiary: '#153030',
    card: '#1A2A2A',
    elevated: '#1E3030',
  },
  accent: {
    primary: '#2E7D64',
    secondary: '#1B5E4A',
    highlight: '#00B886',
    gold: '#C9A03D',
    copper: '#B87333',
  },
  text: {
    primary: '#E8EDE9',
    secondary: '#A8B8B0',
    tertiary: '#6B8A7A',
    highlight: '#FFFFFF',
    gold: '#D4AF37',
  },
  status: {
    paid: '#00E676',
    pending: '#FFC107',
    failed: '#FF5252',
  },
  border: {
    subtle: 'rgba(46, 125, 100, 0.3)',
    primary: '#2E7D64',
    highlight: '#00B886',
    gold: 'rgba(201, 160, 61, 0.5)',
  }
};

// ====================== АНИМАЦИИ ======================
const pulseGreen = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(46, 125, 100, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(46, 125, 100, 0); }
  100% { box-shadow: 0 0 0 0 rgba(46, 125, 100, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ====================== СТИЛИ ======================
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%);
  position: relative;
  padding: ${({ isMobile }) => (isMobile ? '80px 12px 20px' : '80px 24px 24px')};
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${colors.accent.primary} 0%, ${colors.accent.gold} 50%, ${colors.accent.primary} 100%);
    z-index: 100;
  }
`;

const Header = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${({ isMobile }) => (isMobile ? '22px' : '28px')};
  font-weight: 600;
  color: ${colors.accent.gold};
  font-family: 'Georgia', serif;
  letter-spacing: 2px;
  margin-bottom: 8px;
  
  &::before {
    content: '📊';
    margin-right: 10px;
  }
`;

const Subtitle = styled.div`
  font-size: 12px;
  color: ${colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: ${colors.background.card};
  border-radius: 12px;
  padding: 12px 24px;
  text-align: center;
  border: 1px solid ${colors.border.subtle};
  
  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: ${colors.accent.highlight};
    font-family: monospace;
  }
  
  .stat-label {
    font-size: 10px;
    color: ${colors.text.tertiary};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
  }
`;

const TableContainer = styled.div`
  background: ${colors.background.card};
  border-radius: 16px;
  border: 1px solid ${colors.border.subtle};
  overflow-x: auto;
  overflow-y: auto;
  max-height: 70vh;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: monospace;
  min-width: 800px;
  
  th {
    background: ${colors.background.tertiary};
    color: ${colors.accent.gold};
    padding: 14px 12px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 2px solid ${colors.accent.primary};
    position: sticky;
    top: 0;
  }
  
  td {
    padding: 12px;
    border-bottom: 1px solid ${colors.border.subtle};
    color: ${colors.text.secondary};
    font-size: 13px;
    transition: all 0.2s ease;
  }
  
  tr {
    transition: all 0.2s ease;
    animation: ${fadeIn} 0.3s ease;
    
    &:hover {
      background: rgba(46, 125, 100, 0.1);
      
      td {
        color: ${colors.text.primary};
      }
    }
  }
`;

const CarNumber = styled.span`
  display: inline-block;
  background: ${colors.background.tertiary};
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
  color: ${colors.accent.highlight};
  border-left: 3px solid ${colors.accent.gold};
  font-family: monospace;
  
  &::before {
    content: '[';
    color: ${colors.text.tertiary};
  }
  &::after {
    content: ']';
    color: ${colors.text.tertiary};
  }
`;

const Amount = styled.span`
  font-weight: 700;
  color: ${({ status }) => 
    status === 'paid' ? colors.status.paid : 
    status === 'pending' ? colors.status.pending : 
    colors.status.failed
  };
  font-size: 14px;
  
  &::after {
    content: ' UZS';
    font-weight: 400;
    font-size: 10px;
    color: ${colors.text.tertiary};
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ status }) =>
    status === 'paid' ? 'rgba(0, 230, 118, 0.15)' :
    status === 'pending' ? 'rgba(255, 193, 7, 0.15)' :
    'rgba(255, 82, 82, 0.15)'
  };
  color: ${({ status }) =>
    status === 'paid' ? colors.status.paid :
    status === 'pending' ? colors.status.pending :
    colors.status.failed
  };
  
  &::before {
    content: '●';
    font-size: 8px;
    animation: ${({ status }) => status === 'pending' ? pulseGreen : 'none'} 1.5s infinite;
  }
`;

const Duration = styled.span`
  font-family: monospace;
  color: ${colors.text.primary};
`;

const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button`
  background: ${({ active }) => active ? colors.accent.primary : colors.background.tertiary};
  color: ${({ active }) => active ? colors.text.primary : colors.text.secondary};
  border: 1px solid ${({ active }) => active ? colors.accent.highlight : colors.border.subtle};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-family: monospace;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.accent.primary};
    color: ${colors.text.primary};
    border-color: ${colors.accent.highlight};
  }
`;

const SkeletonRow = styled.div`
  background: linear-gradient(90deg, #1A2A2A 25%, #243A3A 50%, #1A2A2A 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  height: 48px;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 4px;
`;

const SkeletonTable = () => (
  <>
    {Array(5).fill().map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </>
);

// ====================== ГЕНЕРАЦИЯ ОТЧЁТОВ ======================
const generateReports = (stations) => {
  const carNumbers = [
    '50S778CA', '01A123BB', '77B456CC', '30C789DD', '88D012EE',
    '10E345FF', '99F678GG', '22G901HH', '55H234II', '41J567JJ',
    '07K890KK', '33L123LL', '66M456MM', '82N789NN', '14O012OO'
  ];
  
  const statuses = ['paid', 'paid', 'paid', 'pending', 'paid', 'paid', 'failed', 'paid'];
  const reports = [];

  stations.forEach((station, stationIndex) => {
    const numReports = station.totalPorts || Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < numReports; i++) {
      const carNumber = carNumbers[Math.floor(Math.random() * carNumbers.length)];
      const hours = Math.floor(Math.random() * 4) + 1;
      const minutes = Math.floor(Math.random() * 60);
      const durationMinutes = hours * 60 + minutes;
      const amount = Math.floor(durationMinutes * 500) + 10000;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const date = new Date(station.snippet.publishedAt);
      date.setHours(date.getHours() + Math.floor(Math.random() * 72));
      
      reports.push({
        id: `${station.id}-${i}`,
        stationId: station.id,
        stationAddress: station.address || station.snippet.title.substring(0, 50),
        stationOperator: station.operator || station.snippet.channelTitle,
        carNumber: carNumber,
        date: date.toISOString(),
        duration: { hours, minutes: minutes.toString().padStart(2, '0') },
        durationMinutes: durationMinutes,
        amount: amount,
        status: status,
        connector: station.connector || 'CCS',
        power: station.power || '50 кВт'
      });
    }
  });
  
  return reports.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// ====================== ФУНКЦИИ ФОРМАТИРОВАНИЯ ======================
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const formatDuration = (hours, minutes) => {
  if (hours > 0) {
    return `${hours} ч ${minutes} мин`;
  }
  return `${minutes} мин`;
};

const formatAmount = (amount) => {
  return amount.toLocaleString('ru-RU');
};

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
};

// ====================== ОСНОВНОЙ КОМПОНЕНТ ======================
const Hot = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    avgAmount: 0
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const generatedReports = generateReports(VideoData);
      setReports(generatedReports);
      setFilteredReports(generatedReports);
      
      const totalAmount = generatedReports.reduce((sum, r) => sum + r.amount, 0);
      setStats({
        total: generatedReports.length,
        totalAmount: totalAmount,
        avgAmount: Math.floor(totalAmount / generatedReports.length)
      });
      
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredReports(reports);
    } else if (filter === 'paid') {
      setFilteredReports(reports.filter(r => r.status === 'paid'));
    } else if (filter === 'pending') {
      setFilteredReports(reports.filter(r => r.status === 'pending'));
    } else if (filter === 'failed') {
      setFilteredReports(reports.filter(r => r.status === 'failed'));
    }
  }, [filter, reports]);

  const getStatusText = (status) => {
    switch(status) {
      case 'paid': return 'Оплачено';
      case 'pending': return 'Ожидание';
      case 'failed': return 'Ошибка';
      default: return 'Неизвестно';
    }
  };

  return (
    <PageContainer isMobile={isMobile}>
      <Header>
        <Title isMobile={isMobile}>Отчёт о зарядке электромобилей</Title>
        <Subtitle>Журнал операций • Зарядные станции Узбекистана</Subtitle>
      </Header>

      <StatsRow>
        <StatCard>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Всего операций</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{formatAmount(stats.totalAmount)}</div>
          <div className="stat-label">Общая сумма (UZS)</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{formatAmount(stats.avgAmount)}</div>
          <div className="stat-label">Средний чек (UZS)</div>
        </StatCard>
      </StatsRow>

      <FilterBar>
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          Все операции
        </FilterButton>
        <FilterButton active={filter === 'paid'} onClick={() => setFilter('paid')}>
          ✅ Оплаченные
        </FilterButton>
        <FilterButton active={filter === 'pending'} onClick={() => setFilter('pending')}>
          ⏳ Ожидание
        </FilterButton>
        <FilterButton active={filter === 'failed'} onClick={() => setFilter('failed')}>
          ❌ Ошибки
        </FilterButton>
      </FilterBar>

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>№</th>
              <th>Номер ТС</th>
              <th>Дата и время</th>
              <th>Длительность</th>
              <th>Станция</th>
              <th>Сумма (UZS)</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" style={{ padding: 0 }}>
                  <SkeletonTable />
                </td>
              </tr>
            ) : (
              filteredReports.map((report, index) => (
                <tr key={report.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/video/${report.stationId}`} style={{ textDecoration: 'none' }}>
                      <CarNumber>{report.carNumber}</CarNumber>
                    </Link>
                  </td>
                  <td>{formatDateTime(report.date)}</td>
                  <td>
                    <Duration>{formatDuration(report.duration.hours, report.duration.minutes)}</Duration>
                  </td>
                  <td>
                    <Link to={`/video/${report.stationId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ fontSize: '11px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {report.stationAddress.length > 30 ? report.stationAddress.substring(0, 30) + '…' : report.stationAddress}
                      </div>
                      <div style={{ fontSize: '9px', color: colors.text.tertiary }}>{report.stationOperator}</div>
                    </Link>
                  </td>
                  <td>
                    <Amount status={report.status}>
                      {formatAmount(report.amount)}
                    </Amount>
                  </td>
                  <td>
                    <StatusBadge status={report.status}>
                      {getStatusText(report.status)}
                    </StatusBadge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </StyledTable>
      </TableContainer>

      {!isLoading && filteredReports.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: colors.text.tertiary }}>
          Нет операций для отображения
        </div>
      )}
    </PageContainer>
  );
};

export default Hot;