import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HistoryIcon from '@mui/icons-material/History';
import TelegramIcon from '@mui/icons-material/Telegram';import VideoData from '../data/VideoData';
import { gsap } from 'gsap';

// ====================== ЦВЕТА (в стиле Home) ======================
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
    available: '#00E676',
    charging: '#FFC107',
    occupied: '#FF5252',
    maintenance: '#78909C',
  },
  border: {
    subtle: 'rgba(46, 125, 100, 0.3)',
    primary: '#2E7D64',
    highlight: '#00B886',
    gold: 'rgba(201, 160, 61, 0.5)',
  }
};

const Navigation = () => {
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navbarRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e) => setIsMobile(e.matches);

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { opacity: 0, y: -70 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    );
    gsap.fromTo(
      sidebarRef.current,
      { opacity: 0, x: isMobile ? 0 : 70 },
      { opacity: 1, x: 0, duration: 1.4, ease: 'power3.out', delay: 0.3 }
    );
    gsap.fromTo(
      sidebarRef.current.querySelectorAll('li, a'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'back.out(1.2)', delay: 0.7 }
    );
  }, [isMobile]);

  const filteredVideos = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return VideoData.filter(
      (video) =>
        video.snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.snippet.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  // Navbar Styles
  const navbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: isMobile ? '10px 14px' : '14px 24px',
    background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)`,
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    height: isMobile ? '52px' : '64px',
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.8), inset 0 0 15px ${colors.accent.secondary}`,
    borderBottom: `1px solid ${colors.accent.primary}`,
  };

  const logoStyle = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: '700',
    color: colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '6px' : '8px',
    fontFamily: 'Georgia, serif',
    textShadow: `0 0 8px ${colors.accent.primary}, 0 0 15px rgba(46, 125, 100, 0.5)`,
    letterSpacing: '1px',
    transition: 'all 0.4s ease',
    textDecoration: 'none',
  };

  const searchContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    maxWidth: isMobile ? '100%' : '600px',
    margin: isMobile ? '0 8px' : '0 20px',
    backgroundColor: colors.background.secondary,
    borderRadius: '8px',
    padding: isMobile ? '4px 8px' : '7px 14px',
    boxShadow: `inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 5px ${colors.accent.secondary}`,
    border: `1px solid ${colors.border.subtle}`,
    position: 'relative',
    transition: 'all 0.3s ease',
  };

  const searchInputStyle = {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: colors.text.primary,
    fontSize: isMobile ? '13px' : '15px',
    padding: isMobile ? '3px' : '6px',
    fontFamily: 'monospace',
    fontWeight: '400',
    letterSpacing: '0.5px',
    transition: 'color 0.3s ease',
    caretColor: colors.accent.highlight,
  };

  const searchIconStyle = {
    color: colors.text.secondary,
    fontSize: isMobile ? '18px' : '20px',
    transition: 'color 0.3s ease',
  };

  const searchResultsStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background.card,
    borderRadius: '8px',
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.8), 0 0 8px ${colors.accent.primary}`,
    border: `1px solid ${colors.accent.primary}`,
    marginTop: '8px',
    zIndex: 1001,
    maxHeight: '320px',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: `${colors.accent.primary} ${colors.background.tertiary}`,
  };

  const searchResultItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: isMobile ? '8px 10px' : '10px 14px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    color: colors.text.primary,
    borderBottom: `1px solid ${colors.border.subtle}`,
  };

  const thumbnailStyle = {
    width: isMobile ? '60px' : '80px',
    height: isMobile ? '34px' : '45px',
    borderRadius: '6px',
    objectFit: 'cover',
    marginRight: isMobile ? '8px' : '12px',
    border: `1px solid ${colors.accent.primary}`,
    transition: 'all 0.3s ease',
    boxShadow: `0 0 8px rgba(0, 0, 0, 0.6)`,
  };

  const resultTextStyle = {
    flex: 1,
  };

  const resultTitleStyle = {
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: 'Georgia, serif',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    letterSpacing: '0.5px',
  };

  const resultChannelStyle = {
    fontSize: isMobile ? '10px' : '12px',
    color: colors.accent.highlight,
    fontWeight: '400',
    fontFamily: 'monospace',
    letterSpacing: '0.5px',
    marginTop: '2px',
  };

  const profileLinkStyle = {
    color: colors.text.primary,
    padding: isMobile ? '6px' : '9px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Sidebar Styles
  const sidebarStyle = isMobile
    ? {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '12px 18px',
      background: `linear-gradient(135deg, ${colors.background.secondary}, ${colors.background.primary})`,
      boxShadow: `0 -4px 12px rgba(0, 0, 0, 0.8), inset 0 0 15px ${colors.accent.secondary}`,
      position: 'fixed',
      bottom: 0,
      left: 0,
      zIndex: 1000,
      borderTop: `1px solid ${colors.accent.primary}`,
    }
    : {
      display: 'flex',
      flexDirection: 'column',
      width: '260px',
      height: 'calc(100vh - 64px)',
      padding: '24px 20px',
      background: `linear-gradient(135deg, ${colors.background.secondary} 0%, ${colors.background.primary} 100%)`,
      position: 'fixed',
      top: '64px',
      right: 0,
      zIndex: 1000,
      boxShadow: `-4px 0 20px rgba(0, 0, 0, 0.6), inset 0 0 15px ${colors.accent.secondary}`,
      borderLeft: `1px solid ${colors.accent.primary}`,
    };

  const sidebarLogoStyle = isMobile
    ? { display: 'none' }
    : {
      fontSize: '20px',
      fontWeight: '700',
      color: colors.text.primary,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '32px',
      paddingBottom: '16px',
      borderBottom: `1px solid ${colors.border.subtle}`,
      fontFamily: 'Georgia, serif',
      textShadow: `0 0 8px ${colors.accent.primary}, 0 0 15px rgba(46, 125, 100, 0.5)`,
      letterSpacing: '1px',
      transition: 'all 0.4s ease',
    };

  const navLinksStyle = isMobile
    ? {
      display: 'flex',
      flexDirection: 'row',
      gap: '16px',
      flex: 1,
      justifyContent: 'flex-end',
    }
    : {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      flex: 1,
      marginBottom: '24px',
    };

  const linkStyle = isMobile
    ? {
      padding: '8px',
      borderRadius: '8px',
      transition: 'all 0.4s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background.tertiary,
      boxShadow: `inset 0 0 5px rgba(0, 0, 0, 0.5), 0 0 5px ${colors.accent.secondary}`,
      border: `1px solid ${colors.border.subtle}`,
    }
    : {
      color: colors.text.primary,
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 16px',
      borderRadius: '10px',
      transition: 'all 0.4s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      fontFamily: 'monospace',
      backgroundColor: 'transparent',
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'hidden',
      border: `1px solid transparent`,
    };

  const activeLinkStyle = isMobile
    ? {
      ...linkStyle,
      backgroundColor: colors.background.secondary,
      boxShadow: `0 0 12px ${colors.accent.highlight}, inset 0 0 8px ${colors.accent.primary}`,
      border: `1px solid ${colors.accent.highlight}`,
    }
    : {
      ...linkStyle,
      color: colors.accent.highlight,
      backgroundColor: `rgba(46, 125, 100, 0.15)`,
      border: `1px solid ${colors.accent.primary}`,
      transform: 'translateX(-4px)',
    };

  const hoverLinkStyle = isMobile
    ? {
      ...linkStyle,
      backgroundColor: colors.background.secondary,
      boxShadow: `0 0 12px ${colors.accent.highlight}, inset 0 0 8px ${colors.accent.primary}`,
      border: `1px solid ${colors.accent.highlight}`,
    }
    : {
      ...linkStyle,
      color: colors.accent.highlight,
      backgroundColor: `rgba(46, 125, 100, 0.08)`,
      border: `1px solid ${colors.border.subtle}`,
      transform: 'translateX(-2px)',
    };

  const getLinkStyle = (isActive, linkName) =>
    isActive ? activeLinkStyle : hoveredLink === linkName ? hoverLinkStyle : linkStyle;

  const iconStyle = {
    color: colors.text.secondary,
    fontSize: isMobile ? '20px' : '22px',
    transition: 'all 0.3s ease',
  };

  const activeIconStyle = {
    ...iconStyle,
    color: colors.accent.highlight,
    filter: `drop-shadow(0 0 4px ${colors.accent.highlight})`,
  };

  const getIconStyle = (isActive) => (isActive ? activeIconStyle : iconStyle);

  const links = [
    { name: 'Главная', icon: <HomeIcon />, to: '/' },
    { name: 'Отчёт о платеже', icon: <LocalFireDepartmentIcon />, to: '/hot' },
    // { name: 'История', icon: <HistoryIcon />, to: '/history' },
  ];

  return (
    <>
      <nav ref={navbarRef} style={navbarStyle}>
        <NavLink to="/" style={logoStyle}>
          <VideoLibraryIcon
            style={{
              color: colors.accent.highlight,
              fontSize: isMobile ? '20px' : '24px',
            }}
          />
          <span style={{ color: colors.accent.gold }}>VOLT</span>CITY
        </NavLink>

        <div style={searchContainerStyle} id="search-container">
          <input
            type="text"
            placeholder="Поиск станций..."
            style={searchInputStyle}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => {
              e.target.style.color = colors.text.highlight;
              document.querySelector('#search-container').style.boxShadow = `inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 10px ${colors.accent.highlight}`;
              document.querySelector('#search-container').style.borderColor = colors.accent.highlight;
            }}
            onBlur={(e) => {
              e.target.style.color = colors.text.primary;
              document.querySelector('#search-container').style.boxShadow = `inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 0 5px ${colors.accent.secondary}`;
              document.querySelector('#search-container').style.borderColor = colors.border.subtle;
            }}
          />
          <SearchIcon
            style={searchIconStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.accent.highlight;
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.text.secondary;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
          {filteredVideos.length > 0 && (
            <div style={searchResultsStyle}>
              {filteredVideos.map((video) => (
                <NavLink
                  to={`/video/${video.id}`}
                  key={video.id}
                  style={{ textDecoration: 'none' }}
                  onClick={() => setSearchQuery('')}
                >
                  <div
                    style={searchResultItemStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.background.tertiary;
                      e.currentTarget.style.borderColor = colors.accent.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = colors.border.subtle;
                    }}
                  >
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      style={thumbnailStyle}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x45/1A2A2A/00B886?text=NO+IMAGE';
                      }}
                    />
                    <div style={resultTextStyle}>
                      <div style={resultTitleStyle}>{video.snippet.title}</div>
                      <div style={resultChannelStyle}>{video.snippet.channelTitle}</div>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <NavLink
          to="/profile"
          style={({ isActive }) =>
            isActive
              ? {
                  ...profileLinkStyle,
                  boxShadow: `0 0 12px ${colors.accent.highlight}`,
                  backgroundColor: colors.background.secondary,
                  transform: 'scale(1.1)',
                }
              : profileLinkStyle
          }
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 0 12px ${colors.accent.highlight}`;
            e.currentTarget.style.backgroundColor = colors.background.secondary;
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
      </nav>

      <nav ref={sidebarRef} style={sidebarStyle}>
        {!isMobile && (
          <div style={sidebarLogoStyle}>
            <VideoLibraryIcon
              style={{
                color: colors.accent.highlight,
                fontSize: '22px',
              }}
            />
            <span style={{ color: colors.accent.gold }}>МЕНЮ</span>
          </div>
        )}
        <ul style={navLinksStyle}>
          {links.map((link) => (
            <li key={link.name} style={{ listStyle: 'none', position: 'relative' }}>
              <NavLink
                to={link.to}
                style={({ isActive }) => getLinkStyle(isActive, link.name.toLowerCase())}
                onMouseEnter={() => setHoveredLink(link.name.toLowerCase())}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {React.cloneElement(link.icon, {
                  style: getIconStyle(
                    hoveredLink === link.name.toLowerCase() || window.location.pathname === link.to
                  ),
                })}
                {!isMobile && <span>{link.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
        <a
          href="https://t.me/etoazz"
          target="_blank"
          rel="noopener noreferrer"
          style={hoveredLink === 'follow-us' ? hoverLinkStyle : linkStyle}
          onMouseEnter={() => setHoveredLink('follow-us')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <TelegramIcon style={getIconStyle(hoveredLink === 'follow-us')} />
          {!isMobile && <span>Следите за нами</span>}
        </a>
      </nav>
    </>
  );
};

export default Navigation;