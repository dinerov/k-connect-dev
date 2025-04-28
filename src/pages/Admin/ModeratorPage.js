import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Paper, 
  Avatar, 
  Container, 
  Button, 
  Divider,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Switch,
  Tooltip,
  Badge,
  CardMedia,
  CardActions,
  Fade,
  Zoom,
  Stack,
  DialogContentText,
  styled
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoIcon from '@mui/icons-material/Photo';
import CommentIcon from '@mui/icons-material/Comment';
import BugReportIcon from '@mui/icons-material/BugReport';
import PersonIcon from '@mui/icons-material/Person';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaidIcon from '@mui/icons-material/Paid';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Link } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import BlockIcon from '@mui/icons-material/Block';
import HistoryIcon from '@mui/icons-material/History';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Create styled Dialog component with blurred background
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    zIndex: 999999999999
  },
  "& .MuiDialog-paper": {
    borderRadius: 12,
    background: 'rgba(18, 18, 18, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      borderRadius: 0,
    }
  },
  "& .MuiDialogTitle-root": {
    fontSize: '1.2rem',
    fontWeight: 500
  },
  "& .MuiDialogContentText-root": {
    fontSize: '0.95rem',
    lineHeight: 1.5,
    overflowWrap: 'break-word',
    wordBreak: 'break-word'
  },
  "& .MuiDialogContent-root": {
    padding: '16px 24px',
    '@media (max-width: 600px)': {
      padding: '12px 16px',
      fontSize: '0.9rem'
    }
  }
}));

// Snackbar style with high z-index
const snackbarStyle = {
  zIndex: 9999999
};

const ModeratorPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moderatorData, setModeratorData] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [error, setError] = useState(null);
  const [lastModeratorCheck, setLastModeratorCheck] = useState(0);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Загрузка данных
  const [posts, setPosts] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [bugReports, setBugReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [badges, setBadges] = useState([]);
  
  // Dialog states
  const [deletePostDialogOpen, setDeletePostDialogOpen] = useState(false);
  const [deleteTrackDialogOpen, setDeleteTrackDialogOpen] = useState(false);
  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false);
  const [deleteAvatarDialogOpen, setDeleteAvatarDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [bugReportStatusDialogOpen, setBugReportStatusDialogOpen] = useState(false);
  const [editBadgeDialogOpen, setEditBadgeDialogOpen] = useState(false);
  const [deleteBadgeDialogOpen, setDeleteBadgeDialogOpen] = useState(false);
  
  // Selected items
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBugReport, setSelectedBugReport] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  
  // Form states
  const [editUserName, setEditUserName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [bugReportStatus, setBugReportStatus] = useState('');
  const [editBadgeName, setEditBadgeName] = useState('');
  const [editBadgeDescription, setEditBadgeDescription] = useState('');
  const [editBadgePrice, setEditBadgePrice] = useState('');
  const [editBadgeActive, setEditBadgeActive] = useState(true);
  const [editBadgeImage, setEditBadgeImage] = useState(null);
  const [editBadgeImagePreview, setEditBadgeImagePreview] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1); // Страница начинается с 1
  
  // Create separate page states for each tab
  const [pageStates, setPageStates] = useState({
    posts: 1,
    tracks: 1,
    comments: 1,
    users: 1,
    bugReports: 1,
    badges: 1
  });
  
  const [hasMore, setHasMore] = useState({
    posts: true,
    tracks: true,
    comments: true,
    users: true,
    bugReports: true,
    badges: true
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Refs for infinite scroll
  const postsObserver = useRef();
  const tracksObserver = useRef();
  const commentsObserver = useRef();
  const usersObserver = useRef();
  const bugReportsObserver = useRef();
  const badgesObserver = useRef();

  // Search state for each tab
  const [search, setSearch] = useState({
    posts: '',
    tracks: '',
    comments: '',
    users: '',
    bugReports: '',
    badges: ''
  });
  
  // Debounce timeout for search
  const searchTimeout = useRef(null);

  // Новые состояния для предупреждений и банов
  const [warningUser, setWarningUser] = useState(null);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [warningData, setWarningData] = useState({
    reason: '',
    details: ''
  });
  
  const [banUser, setBanUser] = useState(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banData, setBanData] = useState({
    reason: '',
    details: '',
    duration_days: 30
  });
  
  const [userWarningsDialogOpen, setUserWarningsDialogOpen] = useState(false);
  const [userBansDialogOpen, setUserBansDialogOpen] = useState(false);
  const [selectedUserHistory, setSelectedUserHistory] = useState(null);
  const [userWarnings, setUserWarnings] = useState([]);
  const [userBans, setUserBans] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Add state for statistics
  const [moderatorStats, setModeratorStats] = useState({
    deleted_posts: 0,
    deleted_tracks: 0,
    deleted_comments: 0,
    deleted_avatars: 0,
    updated_users: 0,
    warnings_issued: 0,
    bans_issued: 0,
    total_actions: 0,
    loading: true
  });
  
  // Проверяем статус при монтировании
  useEffect(() => {
    checkModeratorStatus();
    
    // Load moderator statistics
    fetchModeratorStats();
  }, []);

  // Загрузка данных при изменении вкладки
  useEffect(() => {
    if (moderatorData) {
      // Сбрасываем состояние для новой вкладки
      resetTabData();
      loadTabData(tabValue);
    }
  }, [tabValue]);
  
  // Сброс состояния для новой вкладки
  const resetTabData = () => {
    // Reset page state to 1
    setPage(1);
    
    // Reset all page states for each tab
    setPageStates({
      posts: 1,
      tracks: 1,
      comments: 1,
      users: 1,
      bugReports: 1,
      badges: 1
    });
    
    // Reset hasMore state
    setHasMore({
      posts: true,
      tracks: true,
      comments: true,
      users: true,
      bugReports: true,
      badges: true
    });
  };

  // Проверяем статус модератора и получаем права доступа
  const checkModeratorStatus = async () => {
    try {
      // Проверяем, не выполняется ли уже проверка в другом компоненте
      if (window._moderatorCheckInProgress) {
        console.log('ModeratorPage: Moderator check already in progress, waiting...');
        // Ждем завершения текущей проверки
        await new Promise(resolve => {
          const checkInterval = setInterval(() => {
            if (!window._moderatorCheckInProgress) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
        });
        return;
      }
      
      // Используем кэш, если проверка была недавно (в течение 15 минут)
      const now = Date.now();
      if (now - lastModeratorCheck < 15 * 60 * 1000 && moderatorData) {
        console.log('ModeratorPage: Using cached moderator data');
        return;
      }
      
      // Первичная быстрая проверка - имеет ли пользователь вообще доступ модератора
      window._moderatorCheckInProgress = true;
      const quickCheckResponse = await axios.get('/api/moderator/quick-status');
      
      if (!quickCheckResponse.data.is_moderator) {
        // Если пользователь не является модератором, не делаем основной запрос
        setLoading(false);
        showNotification('error', 'У вас нет прав модератора');
        navigate('/'); // Перенаправляем на главную страницу
        window._moderatorCheckInProgress = false;
        return;
      }
      
      // Если пользователь прошел быструю проверку, делаем полный запрос для получения прав
      setLoading(true);
      const response = await axios.get('/api/moderator/status');
      
      if (response.data.is_moderator) {
        setModeratorData(response.data);
        setPermissions(response.data.permissions);
        // Обновляем время последней проверки
        setLastModeratorCheck(now);
      } else {
        // User is not a moderator
        showNotification('error', 'У вас нет прав модератора');
        navigate('/'); // Перенаправляем на главную страницу
      }
    } catch (error) {
      console.error('Error checking moderator status:', error);
      showNotification('error', 'Не удалось проверить права модератора');
      navigate('/'); // Перенаправляем на главную страницу в случае ошибки
    } finally {
      setLoading(false);
      // Снимаем флаг проверки
      window._moderatorCheckInProgress = false;
    }
  };

  // Функция для получения статистики действий модератора
  const fetchModeratorStats = async () => {
    try {
      setModeratorStats(prev => ({ ...prev, loading: true }));
      
      // Запрос к API для получения действий модератора
      const response = await axios.get('/api/moderator/actions');
      
      if (response.data && response.data.success) {
        const stats = response.data.stats || {};
        
        // Обновляем статистику
        setModeratorStats({
          deleted_posts: stats.deleted_posts || 0,
          deleted_tracks: stats.deleted_tracks || 0,
          deleted_comments: stats.deleted_comments || 0,
          deleted_avatars: stats.deleted_avatars || 0,
          updated_users: stats.updated_users || 0,
          warnings_issued: stats.warnings_issued || 0,
          bans_issued: stats.bans_issued || 0,
          total_actions: stats.total_actions || 0,
          loading: false
        });
      } else {
        console.error('Ошибка при получении статистики модератора:', response.data?.error || 'Неизвестная ошибка');
      }
    } catch (error) {
      console.error('Ошибка при получении статистики:', error);
    } finally {
      setModeratorStats(prev => ({ ...prev, loading: false }));
    }
  };

  // Show notification
  const showNotification = (severity, message) => {
    setSnackbar({
      open: true,
      severity,
      message
    });
  };

  // Загрузка данных для активной вкладки
  const loadTabData = (tabIndex) => {
    // Сбрасываем данные
    setPage(1);
    setHasMore(prev => ({...prev}));

    switch (tabIndex) {
      case 0: // Профиль
        // Для профиля не нужно загружать дополнительные данные, они загружаются в checkModeratorStatus
        break;
      case 1: // Посты
        if (permissions.delete_posts) {
          setPosts([]);
          fetchPosts();
        }
        break;
      case 2: // Треки
        if (permissions.delete_music) {
          setTracks([]);
          fetchTracks();
        }
        break;
      case 3: // Комментарии
        if (permissions.delete_comments) {
          setComments([]);
          fetchComments();
        }
        break;
      case 4: // Пользователи
        if (permissions.change_user_name || permissions.change_username || permissions.delete_avatar) {
          setUsers([]);
          fetchUsers();
        }
        break;
      case 5: // Баг-репорты
        if (permissions.manage_bug_reports || permissions.delete_bug_reports) {
          setBugReports([]);
          fetchBugReports();
        }
        break;
      case 6: // Бейджики
        if (permissions.edit_badges || permissions.delete_badges) {
          setBadges([]);
          fetchBadges();
        }
        break;
      default:
        break;
    }
  };
  
  // Обработка изменения строки поиска
  const handleSearchChange = (tab, value) => {
    setSearch(prev => ({...prev, [tab]: value}));
    
    // Отменяем предыдущий таймаут поиска
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Устанавливаем новый таймаут для поиска
    searchTimeout.current = setTimeout(() => {
      // Reset the specific tab's page state
      setPageStates(prev => ({
        ...prev,
        [tab]: 1
      }));
      
      // Сбрасываем пагинацию и данные
      switch (tab) {
        case 'posts':
          setPosts([]);
          fetchPosts(false, value);
          break;
        case 'tracks':
          setTracks([]);
          fetchTracks(false, value);
          break;
        case 'comments':
          setComments([]);
          fetchComments(false, value);
          break;
        case 'users':
          setUsers([]);
          fetchUsers(false, value);
          break;
        case 'bugReports':
          setBugReports([]);
          fetchBugReports(false, value);
          break;
        case 'badges':
          setBadges([]);
          fetchBadges(false, value);
          break;
        default:
          break;
      }
    }, 500);
  };

  // Очистка поиска
  const clearSearch = (tab) => {
    setSearch(prev => ({...prev, [tab]: ''}));
    
    // Reset the specific tab's page state
    setPageStates(prev => ({
      ...prev,
      [tab]: 1
    }));
    
    // Сбрасываем пагинацию и данные
    switch (tab) {
      case 'posts':
        setPosts([]);
        fetchPosts(false, '');
        break;
      case 'tracks':
        setTracks([]);
        fetchTracks(false, '');
        break;
      case 'comments':
        setComments([]);
        fetchComments(false, '');
        break;
      case 'users':
        setUsers([]);
        fetchUsers(false, '');
        break;
      case 'bugReports':
        setBugReports([]);
        fetchBugReports(false, '');
        break;
      case 'badges':
        setBadges([]);
        fetchBadges(false, '');
        break;
      default:
        break;
    }
  };

  // Функции для работы с данными
  const fetchPosts = async (loadMore = false, searchQuery = search.posts) => {
    try {
      if (!hasMore.posts && loadMore) return;
      
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.posts : 1;
      
      const response = await axios.get(`/api/moderator/posts?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      
      if (response.data && response.data.posts) {
        const newPosts = response.data.posts;
        if (loadMore) {
          setPosts(prevPosts => [...prevPosts, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        
        // Проверяем, есть ли еще записи
        setHasMore(prev => ({
          ...prev,
          posts: newPosts.length === rowsPerPage
        }));
        
        if (loadMore) {
          setPageStates(prev => ({
            ...prev,
            posts: prev.posts + 1
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      showNotification('error', 'Не удалось загрузить посты');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  const fetchTracks = async (loadMore = false, searchQuery = search.tracks) => {
    try {
      if (!hasMore.tracks && loadMore) return;
      
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.tracks : 1;
      
      const response = await axios.get(`/api/moderator/tracks?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      
      if (response.data && response.data.tracks) {
        const newTracks = response.data.tracks;
        if (loadMore) {
          setTracks(prevTracks => [...prevTracks, ...newTracks]);
        } else {
          setTracks(newTracks);
        }
        
        // Проверяем, есть ли еще записи
        setHasMore(prev => ({
          ...prev,
          tracks: newTracks.length === rowsPerPage
        }));
        
        if (loadMore) {
          setPageStates(prev => ({
            ...prev,
            tracks: prev.tracks + 1
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
      showNotification('error', 'Не удалось загрузить треки');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  const fetchComments = async (loadMore = false, searchQuery = search.comments) => {
    try {
      if (!hasMore.comments && loadMore) return;
      
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.comments : 1;
      
      const response = await axios.get(`/api/moderator/comments?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      
      if (response.data && response.data.comments) {
        const newComments = response.data.comments;
        if (loadMore) {
          setComments(prevComments => [...prevComments, ...newComments]);
        } else {
          setComments(newComments);
        }
        
        // Проверяем, есть ли еще записи
        setHasMore(prev => ({
          ...prev,
          comments: newComments.length === rowsPerPage
        }));
        
        if (loadMore) {
          setPageStates(prev => ({
            ...prev,
            comments: prev.comments + 1
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      showNotification('error', 'Не удалось загрузить комментарии');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  const fetchUsers = async (loadMore = false, searchQuery = search.users) => {
    try {
      if (!hasMore.users && loadMore) return;
      
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.users : 1;
      
      const response = await axios.get(`/api/moderator/users?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      
      if (response.data && response.data.users) {
        const newUsers = response.data.users;
        if (loadMore) {
          setUsers(prevUsers => [...prevUsers, ...newUsers]);
        } else {
          setUsers(newUsers);
        }
        
        // Проверяем, есть ли еще записи
        setHasMore(prev => ({
          ...prev,
          users: newUsers.length === rowsPerPage
        }));
        
        if (loadMore) {
          setPageStates(prev => ({
            ...prev,
            users: prev.users + 1
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('error', 'Не удалось загрузить пользователей');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  const fetchBugReports = async (loadMore = false, searchQuery = search.bugReports) => {
    try {
      // Explicitly check if we have permission to view bug reports
      if (!permissions.manage_bug_reports && !permissions.delete_bug_reports) {
        console.error('No permission to view bug reports');
        showNotification('error', 'У вас нет прав на просмотр баг-репортов');
        return;
      }
      
      if (!hasMore.bugReports && loadMore) return;
      
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.bugReports : 1;
      
      console.log(`[DEBUG] Fetching bug reports: page=${currentPage}, search=${searchQuery}`);
      
      const response = await axios.get(`/api/moderator/bug-reports?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      
      console.log('[DEBUG] Bug reports API response:', response.data);
      
      // Check if the response has bug_reports field
      if (response.data && response.data.bug_reports) {
        const newReports = response.data.bug_reports;
        console.log(`[DEBUG] Bug reports found: ${newReports.length}`);
        
        if (loadMore) {
          setBugReports(prevReports => [...prevReports, ...newReports]);
        } else {
          setBugReports(newReports);
        }
        
        // Проверяем, есть ли еще записи
        setHasMore(prev => ({
          ...prev,
          bugReports: newReports.length === rowsPerPage
        }));
        
        if (loadMore) {
          setPageStates(prev => ({
            ...prev,
            bugReports: prev.bugReports + 1
          }));
        }
      } else {
        console.error('[DEBUG] Invalid bug reports response format:', response.data);
        showNotification('error', 'Неверный формат ответа от сервера');
      }
    } catch (error) {
      console.error('Error fetching bug reports:', error);
      console.error('Error response:', error.response?.data);
      showNotification('error', error.response?.data?.error || 'Не удалось загрузить баг-репорты');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  const fetchBadges = async (loadMore = false, searchQuery = search.badges) => {
    try {
      // Проверяем права на работу с бейджиками
      if (!permissions.edit_badges && !permissions.delete_badges) {
        console.error('No permission to view badges');
        showNotification('error', 'У вас нет прав на просмотр бейджиков');
        return;
      }
      
      if (!hasMore.badges && loadMore) return;
      
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.badges : 1;
      
      console.log(`[DEBUG] Fetching badges: page=${currentPage}, search=${searchQuery}`);
      
      const response = await axios.get(`/api/moderator/badges?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      
      console.log('[DEBUG] Badges API response:', response.data);
      
      if (response.data && response.data.badges) {
        const newBadges = response.data.badges;
        console.log(`[DEBUG] Badges found: ${newBadges.length}`);
        
        if (loadMore) {
          setBadges(prevBadges => [...prevBadges, ...newBadges]);
        } else {
          setBadges(newBadges);
        }
        
        // Проверяем, есть ли еще записи
        setHasMore(prev => ({
          ...prev,
          badges: newBadges.length === rowsPerPage
        }));
        
        if (loadMore) {
          setPageStates(prev => ({
            ...prev,
            badges: prev.badges + 1
          }));
        }
      } else {
        console.error('[DEBUG] Invalid badges response format:', response.data);
        showNotification('error', 'Неверный формат ответа от сервера при загрузке бейджиков');
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
      console.error('Error response:', error.response?.data);
      showNotification('error', error.response?.data?.error || 'Не удалось загрузить бейджики');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  // Intersection Observer callback functions for infinite scroll
  const lastPostElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (postsObserver.current) postsObserver.current.disconnect();
    
    postsObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.posts) {
        fetchPosts(true);
      }
    });
    
    if (node) postsObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.posts]);

  const lastTrackElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (tracksObserver.current) tracksObserver.current.disconnect();
    
    tracksObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.tracks) {
        fetchTracks(true);
      }
    });
    
    if (node) tracksObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.tracks]);

  const lastCommentElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (commentsObserver.current) commentsObserver.current.disconnect();
    
    commentsObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.comments) {
        fetchComments(true);
      }
    });
    
    if (node) commentsObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.comments]);

  const lastUserElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (usersObserver.current) usersObserver.current.disconnect();
    
    usersObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.users) {
        fetchUsers(true);
      }
    });
    
    if (node) usersObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.users]);

  const lastBugReportElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (bugReportsObserver.current) bugReportsObserver.current.disconnect();
    
    bugReportsObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.bugReports) {
        fetchBugReports(true);
      }
    });
    
    if (node) bugReportsObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.bugReports]);

  const lastBadgeElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (badgesObserver.current) badgesObserver.current.disconnect();
    
    badgesObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.badges) {
        fetchBadges(true);
      }
    });
    
    if (node) badgesObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.badges]);

  // Обработчики действий модератора
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/api/moderator/posts/${selectedPost.id}`);
      
      if (response.data.success) {
        showNotification('success', 'Пост успешно удален');
        setPosts(posts.filter(post => post.id !== selectedPost.id));
      } else {
        throw new Error(response.data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showNotification('error', 'Не удалось удалить пост');
    } finally {
      setLoading(false);
      setDeletePostDialogOpen(false);
    }
  };

  const handleDeleteTrack = async () => {
    if (!selectedTrack) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/api/moderator/tracks/${selectedTrack.id}`);
      
      if (response.data.success) {
        showNotification('success', 'Трек успешно удален');
        setTracks(tracks.filter(track => track.id !== selectedTrack.id));
      } else {
        throw new Error(response.data.error || 'Failed to delete track');
      }
    } catch (error) {
      console.error('Error deleting track:', error);
      showNotification('error', 'Не удалось удалить трек');
    } finally {
      setLoading(false);
      setDeleteTrackDialogOpen(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/api/moderator/comments/${selectedComment.id}`);
      
      if (response.data.success) {
        showNotification('success', 'Комментарий успешно удален');
        setComments(comments.filter(comment => comment.id !== selectedComment.id));
      } else {
        throw new Error(response.data.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      showNotification('error', 'Не удалось удалить комментарий');
    } finally {
      setLoading(false);
      setDeleteCommentDialogOpen(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/api/moderator/users/${selectedUser.id}/avatar`);
      
      if (response.data.success) {
        showNotification('success', 'Аватар пользователя успешно удален');
        // Обновляем список пользователей с новым состоянием аватара
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, photo: null } 
            : user
        ));
      } else {
        throw new Error(response.data.error || 'Failed to delete avatar');
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      showNotification('error', 'Не удалось удалить аватар');
    } finally {
      setLoading(false);
      setDeleteAvatarDialogOpen(false);
    }
  };

  const handleUpdateUserInfo = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const payload = {};
      
      if (permissions.change_user_name && editUserName) {
        payload.name = editUserName;
      }
      
      if (permissions.change_username && editUsername) {
        payload.username = editUsername;
      }
      
      const response = await axios.put(`/api/moderator/users/${selectedUser.id}`, payload);
      
      if (response.data.success) {
        showNotification('success', 'Информация о пользователе обновлена');
        // Обновляем список пользователей
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { 
                ...user, 
                name: payload.name || user.name, 
                username: payload.username || user.username 
              } 
            : user
        ));
      } else {
        throw new Error(response.data.error || 'Failed to update user info');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      showNotification('error', 'Не удалось обновить информацию о пользователе');
    } finally {
      setLoading(false);
      setEditUserDialogOpen(false);
    }
  };

  const handleUpdateBugReportStatus = async () => {
    if (!selectedBugReport || !bugReportStatus) return;
    
    try {
      setLoading(true);
      const response = await axios.put(`/api/moderator/bug-reports/${selectedBugReport.id}`, {
        status: bugReportStatus
      });
      
      if (response.data.success) {
        showNotification('success', 'Статус баг-репорта обновлен');
        // Обновляем список баг-репортов
        setBugReports(bugReports.map(report => 
          report.id === selectedBugReport.id 
            ? { ...report, status: bugReportStatus } 
            : report
        ));
      } else {
        throw new Error(response.data.error || 'Failed to update bug report status');
      }
    } catch (error) {
      console.error('Error updating bug report status:', error);
      showNotification('error', 'Не удалось обновить статус баг-репорта');
    } finally {
      setLoading(false);
      setBugReportStatusDialogOpen(false);
    }
  };

  const handleDeleteBugReport = async (reportId) => {
    try {
      // Check if we have permission to delete bug reports
      if (!permissions.delete_bug_reports) {
        showNotification('error', 'У вас нет прав на удаление баг-репортов');
        return;
      }
      
      // Confirm deletion
      if (!window.confirm('Вы уверены, что хотите удалить этот баг-репорт?')) {
        return;
      }
      
      setLoading(true);
      const response = await axios.delete(`/api/moderator/bug-reports/${reportId}`);
      
      if (response.data && response.data.success) {
        // Remove the deleted bug report from the state
        setBugReports(prevReports => prevReports.filter(report => report.id !== reportId));
        showNotification('success', 'Баг-репорт успешно удален');
      }
    } catch (error) {
      console.error('Error deleting bug report:', error);
      showNotification('error', error.response?.data?.error || 'Ошибка при удалении баг-репорта');
    } finally {
      setLoading(false);
    }
  };

  // Открытие диалогов
  const openDeletePostDialog = (post) => {
    setSelectedPost(post);
    setDeletePostDialogOpen(true);
  };

  const openDeleteTrackDialog = (track) => {
    setSelectedTrack(track);
    setDeleteTrackDialogOpen(true);
  };

  const openDeleteCommentDialog = (comment) => {
    setSelectedComment(comment);
    setDeleteCommentDialogOpen(true);
  };

  const openDeleteAvatarDialog = (user) => {
    setSelectedUser(user);
    setDeleteAvatarDialogOpen(true);
  };

  const openEditUserDialog = (user) => {
    setSelectedUser(user);
    setEditUserName(user.name || '');
    setEditUsername(user.username || '');
    setEditUserDialogOpen(true);
  };

  const openBugReportStatusDialog = (report) => {
    setSelectedBugReport(report);
    setBugReportStatus(report.status || 'Открыт');
    setBugReportStatusDialogOpen(true);
  };

  // Debug functions
  const debugBugReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/moderator/debug/bug-reports');
      console.log('[DEBUG] Bug reports debug info:', response.data);
      
      const { total_bug_reports, sample_reports, user_permissions } = response.data;
      
      let message = `Всего баг-репортов в базе: ${total_bug_reports}\n`;
      message += `Права: manage=${user_permissions.manage_bug_reports}, delete=${user_permissions.delete_bug_reports}\n\n`;
      
      if (sample_reports.length > 0) {
        message += 'Примеры баг-репортов:\n';
        sample_reports.forEach(report => {
          message += `- ID ${report.id}: ${report.subject} (${report.status || 'Нет статуса'})\n`;
        });
      } else {
        message += 'В базе данных нет баг-репортов.';
      }
      
      alert(message);
    } catch (error) {
      console.error('Error in debug function:', error);
      alert(`Ошибка при отладке: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add the deepDebugBugReports function
  const deepDebugBugReports = async () => {
    setLoading(true);
    console.log('Performing deep debug of bug reports...');
    
    try {
      // Try to access admin debug endpoint first
      const adminCheckResponse = await axios.get('/api/admin/debug/bug-report-table');
      console.log('Admin DB check response:', adminCheckResponse.data);
      
      const tableInfo = adminCheckResponse.data.table_info || {};
      const sampleData = adminCheckResponse.data.sample_data || [];
      const permissionsInfo = adminCheckResponse.data.permissions_info || {};
      
      // Create formatted message for alert
      let alertMessage = `🔍 Database Direct Check:\n`;
      alertMessage += `Table columns: ${Object.keys(tableInfo).join(', ')}\n\n`;
      alertMessage += `Found ${sampleData.length} bug reports in DB directly.\n`;
      alertMessage += `Moderator permissions: ${JSON.stringify(permissionsInfo)}\n\n`;
      
      if (sampleData.length > 0) {
        alertMessage += `Sample data (first report):\n`;
        alertMessage += JSON.stringify(sampleData[0], null, 2);
      }
      
      alert(alertMessage);
      
      // Compare with regular API call
      try {
        const regularResponse = await axios.get('/api/moderator/bug-reports');
        console.log('Regular API response:', regularResponse.data);
        
        // Check pagination parameters
        const paginationResponse = await axios.get('/api/moderator/bug-reports?page=1&per_page=10');
        console.log('Pagination check response:', paginationResponse.data);
        
        const regularData = regularResponse.data.bug_reports || [];
        const paginationData = paginationResponse.data.bug_reports || [];
        
        let compareMessage = `📊 API Comparison:\n`;
        compareMessage += `Regular API found: ${regularData.length} reports\n`;
        compareMessage += `Pagination API found: ${paginationData.length} reports\n`;
        compareMessage += `Database direct found: ${sampleData.length} reports\n\n`;
        
        if (regularData.length === 0 && sampleData.length > 0) {
          compareMessage += `⚠️ ISSUE DETECTED: Data exists in DB but not in API response!\n`;
          compareMessage += `Possible causes:\n`;
          compareMessage += `- Permission filtering might be incorrect\n`;
          compareMessage += `- API response format mismatch\n`;
          compareMessage += `- Field name differences\n`;
        }
        
        alert(compareMessage);
        
      } catch (regularError) {
        console.error('Error fetching regular bug reports for comparison:', regularError);
        alert(`Failed to fetch regular bug reports: ${regularError.message}`);
      }
      
    } catch (adminError) {
      console.error('Admin debug check failed:', adminError);
      alert(`Admin debug check failed: ${adminError.message}. Trying regular debug...`);
      
      // Fallback to regular debug if admin check fails
      try {
        const debugResponse = await axios.get('/api/moderator/debug/bug-reports');
        console.log('Regular debug response:', debugResponse.data);
        
        const totalReports = debugResponse.data.total_reports || 0;
        const sampleReports = debugResponse.data.sample_reports || [];
        const permissions = debugResponse.data.permissions || {};
        
        let fallbackMessage = `🔍 Debug Check Results:\n`;
        fallbackMessage += `Total bug reports: ${totalReports}\n`;
        fallbackMessage += `User permissions: ${JSON.stringify(permissions)}\n\n`;
        
        if (sampleReports.length > 0) {
          fallbackMessage += `Sample reports:\n`;
          fallbackMessage += JSON.stringify(sampleReports[0], null, 2);
        } else {
          fallbackMessage += `No sample reports found.`;
        }
        
        alert(fallbackMessage);
        
      } catch (debugError) {
        console.error('Regular debug also failed:', debugError);
        alert(`All debug attempts failed. Please check server logs.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Unauthorized redirect
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Render loading state
  if (loading && !moderatorData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Проверка прав доступа...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Render unauthorized state
  if (!loading && !moderatorData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <SecurityIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            Доступ запрещен
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            У вас нет прав модератора. Обратитесь к администратору для получения доступа.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Вернуться на главную
          </Button>
        </Paper>
      </Container>
    );
  }

  // Обновляем рендеринг вкладки постов для бесконечной прокрутки
  const renderPosts = () => {
    return (
      <>
        <Box sx={{ mb: 3 }}>
          <TextField 
            fullWidth
            placeholder="Поиск по постам..."
            value={search.posts}
            onChange={(e) => handleSearchChange('posts', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search.posts ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearSearch('posts')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            variant="outlined"
            size="small"
          />
        </Box>
        
        <Box sx={{ width: '100%' }}>
          {posts.map((post, index) => (
            <Paper 
              key={post.id}
              ref={index === posts.length - 1 ? lastPostElementRef : null}
              sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, position: 'relative' }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 0 }, width: { xs: 'calc(100% - 48px)', sm: 'auto' } }}>
                  <Avatar 
                    src={post.author_avatar ? 
                      (post.author_avatar.startsWith('/') ? post.author_avatar : `/static/uploads/avatar/${post.author_id}/${post.author_avatar}`) : 
                      undefined}
                    sx={{ mr: 1, width: 40, height: 40 }} 
                    onClick={() => navigate(`/profile/${post.author_username}`)}
                    style={{ cursor: 'pointer' }}
                  />
                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      onClick={() => navigate(`/profile/${post.author_username}`)}
                      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {post.author_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{post.author_username}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ mr: 1, height: 36 }}
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    Открыть пост
                  </Button>
                  <IconButton 
                    color="error" 
                    onClick={() => openDeletePostDialog(post)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ mb: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word', cursor: 'pointer' }}
                onClick={() => navigate(`/post/${post.id}`)}
              >
                {post.content}
              </Typography>
              
              {post.image && (
                <Box 
                  sx={{ mb: 2, maxWidth: '100%', maxHeight: 300, overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <img 
                    src={post.image.startsWith('/') ? post.image : `/static/uploads/posts/${post.id}/${post.image}`} 
                    alt="Post attachment" 
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                  />
                </Box>
              )}
              
              <Typography variant="caption" color="text.secondary">
                {new Date(post.created_at).toLocaleString()} • {post.comments_count || 0} комментариев • {post.likes_count || 0} лайков
              </Typography>
            </Paper>
          ))}
        </Box>
        
        {loadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        
        {!hasMore.posts && posts.length > 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
            Больше постов нет
          </Typography>
        )}
      </>
    );
  };

  // Add copy link functionality for tracks
  const copyTrackLink = (track) => {
    const trackLink = `${window.location.origin}/music?track=${track.id}`;
    navigator.clipboard.writeText(trackLink)
      .then(() => {
        showNotification('success', 'Ссылка на трек скопирована в буфер обмена');
      })
      .catch(err => {
        console.error('Не удалось скопировать ссылку:', err);
        showNotification('error', 'Не удалось скопировать ссылку');
      });
  };

  // Open track in music player
  const openTrack = (track) => {
    navigate(`/music?track=${track.id}`);
  };

  // Обновляем рендеринг вкладки треков для бесконечной прокрутки
  const renderTracks = () => {
    return (
      <>
        <Box sx={{ mb: 3 }}>
          <TextField 
            fullWidth
            placeholder="Поиск по трекам..."
            value={search.tracks}
            onChange={(e) => handleSearchChange('tracks', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search.tracks ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearSearch('tracks')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            variant="outlined"
            size="small"
          />
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Обложка</TableCell>
                <TableCell>Название</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Артист</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Альбом</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Загружено</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tracks.map((track, index) => (
                <TableRow 
                  key={track.id}
                  ref={index === tracks.length - 1 ? lastTrackElementRef : null}
                >
                  <TableCell>
                    <Avatar 
                      src={track.cover ? `/static/music/${track.user_id}/${track.id}/${track.cover}` : "/static/uploads/system/album_placeholder.jpg"}
                      variant="rounded"
                      sx={{ width: 50, height: 50, cursor: 'pointer' }}
                      onClick={() => openTrack(track)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      noWrap 
                      sx={{ 
                        maxWidth: { xs: 100, sm: 150, md: 'none' },
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => openTrack(track)}
                    >
                      {track.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
                      {track.artist}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{track.artist}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{track.album || 'Нет данных'}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{new Date(track.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box display="flex">
                      <IconButton 
                        color="primary" 
                        onClick={() => copyTrackLink(track)}
                        title="Копировать ссылку на трек"
                        size="small"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="primary" 
                        onClick={() => openTrack(track)}
                        title="Открыть трек"
                        size="small"
                      >
                        <PlayArrowIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => openDeleteTrackDialog(track)}
                        title="Удалить трек"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  // Обновляем рендеринг вкладки пользователей для бесконечной прокрутки
  const renderUsers = () => {
    return (
      <>
        <Box sx={{ mb: 3 }}>
          <TextField 
            fullWidth
            placeholder="Поиск по пользователям..."
            value={search.users}
            onChange={(e) => handleSearchChange('users', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search.users ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearSearch('users')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            variant="outlined"
            size="small"
          />
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Аватар</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Username</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Дата регистрации</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow 
                  key={user.id}
                  ref={index === users.length - 1 ? lastUserElementRef : null}
                >
                  <TableCell>
                    <Avatar 
                      src={user.photo ? (user.photo.startsWith('/') ? user.photo : `/static/uploads/avatar/${user.id}/${user.photo}`) : undefined}
                      sx={{ width: 40, height: 40, cursor: 'pointer' }}
                      onClick={() => navigate(`/profile/${user.username}`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      noWrap 
                      sx={{ 
                        maxWidth: { xs: 120, sm: 'none' }, 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => navigate(`/profile/${user.username}`)}
                    >
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
                      @{user.username}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Typography 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => navigate(`/profile/${user.username}`)}
                    >
                      @{user.username}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/profile/${user.username}`)}
                        title="Профиль пользователя"
                      >
                        <PersonIcon fontSize="small" />
                      </IconButton>
                      
                      {(permissions.change_user_name || permissions.change_username) && (
                        <IconButton 
                          color="primary" 
                          onClick={() => openEditUserDialog(user)}
                          title="Изменить данные"
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      
                      {permissions.delete_avatar && user.photo && (
                        <IconButton 
                          color="warning" 
                          onClick={() => openDeleteAvatarDialog(user)}
                          title="Удалить аватар"
                          size="small"
                        >
                          <PhotoIcon fontSize="small" />
                        </IconButton>
                      )}
                      
                      
                      <Tooltip title="Предупреждения">
                        <IconButton 
                          color="warning" 
                          onClick={() => openUserWarningsDialog(user)}
                          size="small"
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Выдать предупреждение">
                        <IconButton 
                          color="warning" 
                          onClick={() => openWarningDialog(user)}
                          size="small"
                        >
                          <WarningIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Баны">
                        <IconButton 
                          color="error" 
                          onClick={() => openUserBansDialog(user)}
                          size="small"
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Забанить пользователя">
                        <IconButton 
                          color="error" 
                          onClick={() => openBanDialog(user)}
                          size="small"
                        >
                          <BlockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        
        <StyledDialog open={warningDialogOpen} onClose={() => setWarningDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Выдать предупреждение пользователю {warningUser?.name} (@{warningUser?.username})
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Причина предупреждения"
              value={warningData.reason}
              onChange={(e) => setWarningData({...warningData, reason: e.target.value})}
              margin="normal"
              variant="outlined"
              required
              helperText="Укажите причину, по которой выдается предупреждение"
            />
            <TextField
              fullWidth
              label="Дополнительная информация"
              value={warningData.details}
              onChange={(e) => setWarningData({...warningData, details: e.target.value})}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              helperText="При необходимости укажите дополнительную информацию"
            />
            <Alert severity="warning" sx={{ mt: 2 }}>
              При получении 3 предупреждений пользователь будет автоматически заблокирован на 30 дней!
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWarningDialogOpen(false)}>Отмена</Button>
            <Button 
              onClick={handleIssueWarning} 
              color="warning" 
              variant="contained"
              disabled={!warningData.reason.trim()}
            >
              Выдать предупреждение
            </Button>
          </DialogActions>
        </StyledDialog>
        
        
        <StyledDialog open={banDialogOpen} onClose={() => setBanDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Заблокировать пользователя {banUser?.name} (@{banUser?.username})
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Причина блокировки"
              value={banData.reason}
              onChange={(e) => setBanData({...banData, reason: e.target.value})}
              margin="normal"
              variant="outlined"
              required
              helperText="Укажите причину, по которой блокируется пользователь"
            />
            <TextField
              fullWidth
              label="Дополнительная информация"
              value={banData.details}
              onChange={(e) => setBanData({...banData, details: e.target.value})}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              helperText="При необходимости укажите дополнительную информацию"
            />
            <TextField
              fullWidth
              label="Срок блокировки (дней)"
              type="number"
              value={banData.duration_days}
              onChange={(e) => setBanData({...banData, duration_days: parseInt(e.target.value) || 1})}
              margin="normal"
              variant="outlined"
              required
              inputProps={{ min: 1, max: 365 }}
              helperText="Укажите срок блокировки в днях (от 1 до 365)"
            />
            <Alert severity="error" sx={{ mt: 2 }}>
              Во время блокировки пользователь не сможет авторизоваться в аккаунте!
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBanDialogOpen(false)}>Отмена</Button>
            <Button 
              onClick={handleBanUser} 
              color="error" 
              variant="contained"
              disabled={!banData.reason.trim() || banData.duration_days < 1}
            >
              Заблокировать
            </Button>
          </DialogActions>
        </StyledDialog>
        
        
        <StyledDialog open={userWarningsDialogOpen} onClose={() => setUserWarningsDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Предупреждения пользователя {selectedUserHistory?.name} (@{selectedUserHistory?.username})
          </DialogTitle>
          <DialogContent>
            {loadingHistory ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            ) : userWarnings.length > 0 ? (
              <List>
                {userWarnings.map((warning) => (
                  <Paper key={warning.id} sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <WarningIcon color="warning" sx={{ mr: 1 }} />
                          {warning.reason}
                          {warning.is_active ? (
                            <Chip 
                              label="Активно" 
                              color="warning" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          ) : (
                            <Chip 
                              label="Снято" 
                              color="default" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Выдано: {new Date(warning.created_at).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Модератор: {warning.admin_name} {warning.admin_username ? `(@${warning.admin_username})` : ''}
                        </Typography>
                        {warning.details && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {warning.details}
                          </Typography>
                        )}
                      </Box>
                      {warning.is_active && (
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          size="small"
                          onClick={() => handleRemoveWarning(warning.id)}
                        >
                          Снять предупреждение
                        </Button>
                      )}
                    </Box>
                  </Paper>
                ))}
              </List>
            ) : (
              <Alert severity="info">У пользователя нет предупреждений</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserWarningsDialogOpen(false)}>Закрыть</Button>
            <Button 
              color="warning" 
              variant="contained" 
              onClick={() => {
                setUserWarningsDialogOpen(false);
                openWarningDialog(selectedUserHistory);
              }}
            >
              Выдать предупреждение
            </Button>
          </DialogActions>
        </StyledDialog>
        
        
        <StyledDialog open={userBansDialogOpen} onClose={() => setUserBansDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Блокировки пользователя {selectedUserHistory?.name} (@{selectedUserHistory?.username})
          </DialogTitle>
          <DialogContent>
            {loadingHistory ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            ) : userBans.length > 0 ? (
              <List>
                {userBans.map((ban) => (
                  <Paper key={ban.id} sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <BlockIcon color="error" sx={{ mr: 1 }} />
                          {ban.reason}
                          {ban.is_active && !ban.is_expired ? (
                            <Chip 
                              label="Активно" 
                              color="error" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          ) : (
                            <Chip 
                              label={ban.is_active ? "Истекло" : "Снято"} 
                              color="default" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                          {ban.is_auto_ban && (
                            <Chip 
                              label="Авто" 
                              color="primary" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Начало: {new Date(ban.start_date).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Окончание: {ban.formatted_end_date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Модератор: {ban.admin_name} {ban.admin_username ? `(@${ban.admin_username})` : ''}
                        </Typography>
                        {ban.is_active && !ban.is_expired && (
                          <Typography variant="body2" color="error">
                            Осталось дней: {ban.remaining_days}
                          </Typography>
                        )}
                        {ban.details && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {ban.details}
                          </Typography>
                        )}
                      </Box>
                      {ban.is_active && !ban.is_expired && (
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          size="small"
                          onClick={() => handleRemoveBan(ban.id)}
                        >
                          Снять блокировку
                        </Button>
                      )}
                    </Box>
                  </Paper>
                ))}
              </List>
            ) : (
              <Alert severity="info">У пользователя нет блокировок</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserBansDialogOpen(false)}>Закрыть</Button>
            <Button 
              color="error" 
              variant="contained" 
              onClick={() => {
                setUserBansDialogOpen(false);
                openBanDialog(selectedUserHistory);
              }}
            >
              Заблокировать
            </Button>
          </DialogActions>
        </StyledDialog>
      </>
    );
  };

  // Обновляем рендеринг вкладки комментариев для бесконечной прокрутки
  const renderComments = () => {
    return (
      <>
        <Box sx={{ mb: 3 }}>
          <TextField 
            fullWidth
            placeholder="Поиск по комментариям..."
            value={search.comments}
            onChange={(e) => handleSearchChange('comments', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search.comments ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearSearch('comments')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            variant="outlined"
            size="small"
          />
        </Box>

        <List sx={{ width: '100%' }}>
          {comments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              <Paper 
                sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, bgcolor: 'background.default' }}
                ref={index === comments.length - 1 ? lastCommentElementRef : null}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 0 }, width: { xs: 'calc(100% - 48px)', sm: 'auto' } }}>
                    <Avatar 
                      src={comment.author_avatar ? 
                        (comment.author_avatar.startsWith('/') ? comment.author_avatar : `/static/uploads/avatar/${comment.author_id}/${comment.author_avatar}`) : 
                        undefined}
                      sx={{ mr: 1, width: 32, height: 32, cursor: 'pointer' }} 
                      onClick={() => navigate(`/profile/${comment.author_username}`)}
                    />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        noWrap 
                        sx={{ 
                          maxWidth: { xs: 150, sm: 'none' },
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => navigate(`/profile/${comment.author_username}`)}
                      >
                        {comment.author_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex">
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mr: 1, height: 30 }}
                      onClick={() => navigate(`/post/${comment.post_id}`)}
                    >
                      К посту
                    </Button>
                    <IconButton color="error" onClick={() => openDeleteCommentDialog(comment)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mt: 1, mb: 1, 
                    wordBreak: 'break-word',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/post/${comment.post_id}`)}
                >
                  {comment.content}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  К посту: <span 
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate(`/post/${comment.post_id}`)}
                  >
                    #{comment.post_id}
                  </span>
                </Typography>
              </Paper>
            </React.Fragment>
          ))}
        </List>
      </>
    );
  };

  // Обновляем рендеринг вкладки баг-репортов для бесконечной прокрутки
  const renderBugReports = () => {
    // Check if we have any bug report related permissions
    if (!permissions.manage_bug_reports && !permissions.delete_bug_reports) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <BugReportIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            У вас нет прав на управление баг-репортами
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Box sx={{ display: 'flex', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6">Управление баг-репортами</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <TextField
            placeholder="Поиск баг-репортов"
            size="small"
            value={search.bugReports}
            onChange={(e) => handleSearchChange('bugReports', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search.bugReports ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearSearch('bugReports')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            variant="outlined"
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Заголовок</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Дата</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bugReports.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2">
                        Нет баг-репортов для отображения
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="primary" 
                          onClick={debugBugReports}
                          startIcon={<BugReportIcon />}
                        >
                          Проверить данные
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="warning" 
                          onClick={deepDebugBugReports}
                          startIcon={<BugReportIcon />}
                        >
                          Глубокая проверка БД
                        </Button>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              
              {loading && !loadingMore && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={32} sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
              )}
              
              {bugReports.map((report, index) => (
                <TableRow 
                  key={report.id}
                  ref={index === bugReports.length - 1 ? lastBugReportElementRef : null}
                >
                  <TableCell>{report.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={report.user_photo ? 
                          (report.user_photo.startsWith('/') ? report.user_photo : `/static/uploads/avatar/${report.user_id}/${report.user_photo}`) 
                          : undefined} 
                        sx={{ mr: 1, width: 24, height: 24 }}
                      />
                      <Typography variant="body2">{report.user_name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{report.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      {report.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={report.status || 'Открыт'}
                      color={
                        report.status === 'Открыт' ? 'error' :
                        report.status === 'В обработке' ? 'warning' :
                        report.status === 'Решено' ? 'success' :
                        'default'
                      }
                      size="small"
                      sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      {permissions.manage_bug_reports && (
                        <IconButton 
                          size="small" 
                          onClick={() => openBugReportStatusDialog(report)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {permissions.delete_bug_reports && (
                        <IconButton 
                          color="error" 
                          size="small" 
                          onClick={() => handleDeleteBugReport(report.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              
              {loadingMore && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={24} sx={{ my: 1 }} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  // Открыть диалог редактирования бейджика
  const openEditBadgeDialog = (badge) => {
    setSelectedBadge(badge);
    setEditBadgeName(badge.name);
    setEditBadgeDescription(badge.description || '');
    setEditBadgePrice(badge.price.toString());
    setEditBadgeActive(badge.is_active);
    setEditBadgeImage(null);
    setEditBadgeImagePreview(`/static/images/bages/shop/${badge.image_path}`);
    setEditBadgeDialogOpen(true);
  };

  // Открыть диалог удаления бейджика
  const openDeleteBadgeDialog = (badge) => {
    setSelectedBadge(badge);
    setDeleteBadgeDialogOpen(true);
  };

  // Обработка редактирования бейджика
  const handleUpdateBadge = async () => {
    try {
      if (!selectedBadge) return;

      // Проверяем валидность данных
      if (!editBadgeName) {
        showNotification('error', 'Название бейджика не может быть пустым');
        return;
      }

      // Проверяем цену
      const price = parseInt(editBadgePrice);
      if (isNaN(price) || price <= 0) {
        showNotification('error', 'Цена должна быть положительным числом');
        return;
      }

      setLoading(true);
      
      let response;
      
      // Если есть новое изображение, используем FormData
      if (editBadgeImage) {
        const formData = new FormData();
        formData.append('name', editBadgeName);
        formData.append('description', editBadgeDescription || '');
        formData.append('price', price);
        formData.append('is_active', editBadgeActive);
        formData.append('image', editBadgeImage);
        
        console.log('[DEBUG] Updating badge with image:', {
          id: selectedBadge.id,
          name: editBadgeName,
          description: editBadgeDescription,
          price: price,
          is_active: editBadgeActive
        });
        
        response = await axios.put(`/api/moderator/badges/${selectedBadge.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Если изображение не изменилось, используем JSON
        const data = {
          name: editBadgeName,
          description: editBadgeDescription || '',
          price: price,
          is_active: editBadgeActive
        };
        
        console.log('[DEBUG] Updating badge without image:', {
          id: selectedBadge.id,
          ...data
        });
        
        response = await axios.put(`/api/moderator/badges/${selectedBadge.id}`, data);
      }
      
      console.log('[DEBUG] Badge update response:', response.data);
      
      if (response.data.success) {
        showNotification('success', 'Бейджик успешно обновлен');
        
        // Обновляем бейджик в списке
        setBadges(prev => 
          prev.map(badge => 
            badge.id === selectedBadge.id 
              ? { 
                  ...badge, 
                  name: editBadgeName, 
                  description: editBadgeDescription || '',
                  price: price,
                  is_active: editBadgeActive,
                  image_path: response.data.badge.image_path || badge.image_path
                }
              : badge
          )
        );
        
        setEditBadgeDialogOpen(false);
      } else {
        console.error('[DEBUG] Badge update error:', response.data);
        showNotification('error', response.data.error || 'Не удалось обновить бейджик');
      }
    } catch (error) {
      console.error('Ошибка при обновлении бейджика:', error);
      console.error('Детали ошибки:', error.response?.data);
      showNotification('error', error.response?.data?.error || 'Не удалось обновить бейджик');
    } finally {
      setLoading(false);
    }
  };

  // Обработка удаления бейджика
  const handleDeleteBadge = async () => {
    try {
      if (!selectedBadge) return;
      
      setLoading(true);
      
      console.log(`[DEBUG] Deleting badge: ${selectedBadge.id} (${selectedBadge.name})`);
      
      const response = await axios.delete(`/api/moderator/badges/${selectedBadge.id}`);
      
      console.log('[DEBUG] Badge delete response:', response.data);
      
      if (response.data.success) {
        showNotification('success', 'Бейджик успешно удален');
        
        // Удаляем бейджик из списка
        setBadges(prev => prev.filter(badge => badge.id !== selectedBadge.id));
        
        setDeleteBadgeDialogOpen(false);
      } else {
        console.error('[DEBUG] Badge delete error:', response.data);
        showNotification('error', response.data.error || 'Не удалось удалить бейджик');
      }
    } catch (error) {
      console.error('Ошибка при удалении бейджика:', error);
      console.error('Детали ошибки:', error.response?.data);
      showNotification('error', error.response?.data?.error || 'Не удалось удалить бейджик');
    } finally {
      setLoading(false);
    }
  };

  // Обработка изменения изображения бейджика
  const handleBadgeImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Проверяем тип файла (SVG и GIF для модераторов)
      if (file.type !== 'image/svg+xml' && file.type !== 'image/gif') {
        showNotification('error', 'Разрешены только SVG и GIF файлы');
        return;
      }

      setEditBadgeImage(file);
      
      // Создаем превью изображения
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditBadgeImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Рендер бейджиков
  const renderBadges = () => {
    // Проверяем права на просмотр бейджиков
    if (!permissions.edit_badges && !permissions.delete_badges) {
      return (
        <Alert severity="warning" sx={{ mt: 2 }}>
          У вас нет прав на управление бейджиками
        </Alert>
      );
    }
    
    // Если идет загрузка и данных еще нет
    if (loading && badges.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    // Если данных нет после загрузки
    if (!loading && badges.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Бейджики не найдены
        </Alert>
      );
    }
    
    // Проверяем, есть ли ошибки в данных бейджиков
    try {
      return (
        <>
          
          <Box sx={{ mb: 3, mt: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
              placeholder="Поиск бейджиков..."
              variant="outlined"
              size="small"
              fullWidth
              value={search.badges}
              onChange={(e) => handleSearchChange('badges', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search.badges && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => clearSearch('badges')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
          
          
          <Grid container spacing={3}>
            {badges.map((badge, index) => {
              // Безопасная проверка полей бейджика
              if (!badge || typeof badge !== 'object') {
                console.error('[DEBUG] Invalid badge object:', badge);
                return null;
              }
              
              // Для последнего элемента добавляем ref для бесконечной прокрутки
              const isLastElement = index === badges.length - 1;
              
              return (
                <Zoom in key={badge.id} style={{ transitionDelay: `${index * 50}ms` }}>
                  <Grid 
                    item 
                    xs={12} sm={6} md={4} lg={3} 
                    ref={isLastElement ? lastBadgeElementRef : null}
                  >
                    <Card 
                      elevation={3}
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 6
                        },
                        bgcolor: badge.is_active ? 'background.paper' : 'rgba(0,0,0,0.05)'
                      }}
                    >
                      <CardHeader
                        avatar={
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Tooltip title={badge.is_active ? 'Активен' : 'Неактивен'}>
                                <Avatar 
                                  sx={{ 
                                    width: 15, 
                                    height: 15, 
                                    bgcolor: badge.is_active ? 'success.main' : 'text.disabled' 
                                  }}
                                >
                                  {badge.is_active ? <CheckCircleIcon sx={{ width: 10, height: 10 }} /> : <VisibilityOffIcon sx={{ width: 10, height: 10 }} />}
                                </Avatar>
                              </Tooltip>
                            }
                          >
                            <Avatar 
                              src={badge.creator_avatar ? `/avatar/${badge.creator_id}/${badge.creator_avatar}` : undefined}
                              alt={badge.creator_name || 'Creator'} 
                              sx={{ bgcolor: 'primary.main' }}
                            >
                              {badge.creator_name?.charAt(0) || 'U'}
                            </Avatar>
                          </Badge>
                        }
                        title={
                          <Tooltip title={`Создатель: ${badge.creator_name || 'Неизвестно'}`}>
                            <Typography variant="subtitle1" noWrap>
                              {badge.name ? (badge.name.length > 7 ? badge.name.slice(0, 7) + '...' : badge.name) : 'Бейджик'}
                            </Typography>
                          </Tooltip>
                        }
                        subheader={
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {badge.description ? (badge.description.length > 7 ? badge.description.slice(0, 7) + '...' : badge.description) : 'Нет'}
                          </Typography>
                        }
                        action={
                          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            {permissions.edit_badges && (
                              <IconButton 
                                onClick={() => openEditBadgeDialog(badge)}
                                aria-label="Редактировать бейджик"
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                            {permissions.delete_badges && (
                              <IconButton 
                                onClick={() => openDeleteBadgeDialog(badge)}
                                aria-label="Удалить бейджик"
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        }
                      />
                      <CardMedia
                        component="img"
                        sx={{
                          objectFit: 'contain',
                          p: 2,
                          height: 140,
                          filter: badge.is_active ? 'none' : 'grayscale(100%)'
                        }}
                        image={badge.image_path ? `/static/images/bages/shop/${badge.image_path}` : '/static/images/bages/default.svg'}
                        alt={badge.name || 'Бейджик'}
                        onError={(e) => {
                          console.error(`[DEBUG] Error loading badge image: ${badge.image_path}`);
                          e.target.src = '/static/images/bages/default.svg';
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            icon={<PaidIcon />} 
                            label={`${badge.price || 0} баллов`} 
                            color="primary" 
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: 1 }}
                          />
                          <Chip 
                            icon={<CreditCardIcon />} 
                            label={`${badge.copies_sold || 0} продано`} 
                            color="secondary" 
                            variant="outlined"
                            size="small" 
                            sx={{ borderRadius: 1 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Zoom>
              );
            })}
          </Grid>
          
          
          {loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress size={30} />
            </Box>
          )}
          
          
          {hasMore.badges && badges.length > 0 && (
            <div ref={lastBadgeElementRef} style={{ height: '20px' }}></div>
          )}
        </>
      );
    } catch (error) {
      console.error('[DEBUG] Error rendering badges:', error);
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          Ошибка при отображении бейджиков: {error.message}
        </Alert>
      );
    }
  };

  // Рендер профиля модератора
  const renderProfile = () => {
    // Если данные еще загружаются
    if (loading && !moderatorData) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    // Если данные отсутствуют
    if (!moderatorData) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          Не удалось загрузить данные модератора
        </Alert>
      );
    }
    
    // Рассчитываем дату назначения модератором
    const assignedDate = moderatorData.assigned_info?.assigned_at 
      ? new Date(moderatorData.assigned_info.assigned_at) 
      : null;
    
    // Вычисляем, сколько дней прошло с момента назначения
    const daysSinceAssigned = assignedDate 
      ? Math.floor((new Date() - assignedDate) / (1000 * 60 * 60 * 24)) 
      : null;
      
    return (
      <Grid container spacing={3}>
        
        <Grid item xs={12} md={4}>
          <Card 
            elevation={3} 
            sx={{
              height: '100%',
              background: 'linear-gradient(to bottom right, rgb(35 35 35 / 95%), rgb(0 0 0 / 90%))',
              color: 'white',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(63,81,181,0.2) 0%, rgba(63,81,181,0) 70%)',
                zIndex: 0
              }} 
            />
            
            <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src={user?.photo ? `/avatar/${user.id}/${user.photo}` : null}
                  sx={{ 
                    width: 80, 
                    height: 80,
                    bgcolor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  {user?.name?.charAt(0) || 'M'}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {user?.name || 'Модератор'}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)">
                    @{user?.username || 'username'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
              
              <Typography variant="subtitle1" color="primary.light" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                Статус модератора
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip 
                  icon={moderatorData.moderator_level >= 3 ? <VerifiedUserIcon /> : <SecurityIcon />}
                  label={moderatorData.moderator_level >= 3 ? 'Администратор' : 'Модератор'} 
                  color={moderatorData.moderator_level >= 3 ? 'secondary' : 'primary'}
                  variant="filled"
                  sx={{ 
                    borderRadius: 2,
                    background: moderatorData.moderator_level >= 3 
                      ? 'linear-gradient(45deg, #9c27b0 30%, #d500f9 90%)'
                      : 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              
              {assignedDate && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ mr: 1, fontSize: '0.9rem' }} />
                    Назначен модератором
                  </Typography>
                  <Typography variant="body1" color="rgba(255,255,255,0.9)">
                    {assignedDate.toLocaleDateString()} 
                    <Typography component="span" variant="body2" color="rgba(255,255,255,0.6)" sx={{ ml: 1 }}>
                      ({daysSinceAssigned} {daysSinceAssigned === 1 ? 'день' : daysSinceAssigned < 5 ? 'дня' : 'дней'})
                    </Typography>
                  </Typography>
                </Box>
              )}
              
              {moderatorData.assigned_info?.assigned_by?.name && (
                <Box>
                  <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" gutterBottom>
                    Назначен администратором
                  </Typography>
                  <Typography variant="body1" color="rgba(255,255,255,0.9)">
                    {moderatorData.assigned_info.assigned_by.name}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        
        <Grid item xs={12} md={8}>
          <Card 
            elevation={3}
            sx={{
              height: '100%',
              background: 'linear-gradient(to bottom right, rgb(35 35 35 / 95%), rgb(0 0 0 / 90%))',
              color: 'white',
              borderRadius: 2
            }}
          >
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VerifiedUserIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary.light">
                    Права модератора
                  </Typography>
                </Box>
              }
              sx={{ 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                pb: 1
              }}
            />
            
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <PermissionItem 
                    title="Удаление постов" 
                    enabled={permissions.delete_posts}
                    icon={<PostAddIcon />}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <PermissionItem 
                    title="Удаление музыки" 
                    enabled={permissions.delete_music}
                    icon={<MusicNoteIcon />}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <PermissionItem 
                    title="Удаление комментариев" 
                    enabled={permissions.delete_comments}
                    icon={<CommentIcon />}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <PermissionItem 
                    title="Удаление аватаров" 
                    enabled={permissions.delete_avatar}
                    icon={<PhotoIcon />}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <PermissionItem 
                    title="Изменение имён" 
                    enabled={permissions.change_user_name}
                    icon={<PersonIcon />}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <PermissionItem 
                    title="Изменение username" 
                    enabled={permissions.change_username}
                    icon={<EditIcon />}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <PermissionItem 
                    title="Управление баг-репортами" 
                    enabled={permissions.manage_bug_reports}
                    icon={<BugReportIcon />}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <PermissionItem 
                    title="Удаление баг-репортов" 
                    enabled={permissions.delete_bug_reports}
                    icon={<DeleteIcon />}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <PermissionItem 
                    title="Редактирование бейджиков" 
                    enabled={permissions.edit_badges}
                    icon={<EmojiEventsIcon />}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <PermissionItem 
                    title="Удаление бейджиков" 
                    enabled={permissions.delete_badges}
                    icon={<DeleteIcon />}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        
        <Grid item xs={12}>
          <Card 
            elevation={3}
            sx={{
              background: 'linear-gradient(to bottom right, rgb(35 35 35 / 95%), rgb(0 0 0 / 90%))',
              color: 'white',
              borderRadius: 2
            }}
          >
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary.light">
                    Статистика работы модератора
                  </Typography>
                </Box>
              }
              sx={{ 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                pb: 1
              }}
            />
            
            <CardContent sx={{ p: 3 }}>
              {moderatorStats.loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(63,81,181,0.05)', 
                      borderRadius: 2,
                      border: '1px solid rgba(63,81,181,0.1)',
                      mb: 2
                    }}>
                      <Typography variant="subtitle2" color="primary.light" gutterBottom>
                        Удаление контента
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PostAddIcon sx={{ mr: 1, fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              Посты: <strong>{moderatorStats.deleted_posts}</strong>
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <MusicNoteIcon sx={{ mr: 1, fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              Треки: <strong>{moderatorStats.deleted_tracks}</strong>
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CommentIcon sx={{ mr: 1, fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              Комментарии: <strong>{moderatorStats.deleted_comments}</strong>
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhotoIcon sx={{ mr: 1, fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              Аватары: <strong>{moderatorStats.deleted_avatars}</strong>
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255,152,0,0.05)', 
                      borderRadius: 2,
                      border: '1px solid rgba(255,152,0,0.1)',
                      mb: 2
                    }}>
                      <Typography variant="subtitle2" color="warning.light" gutterBottom>
                        Наказания
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <WarningAmberIcon sx={{ mr: 1, fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              Предупреждения: <strong>{moderatorStats.warnings_issued}</strong>
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BlockIcon sx={{ mr: 1, fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              Баны: <strong>{moderatorStats.bans_issued}</strong>
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1, fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }} />
                            <Typography variant="body2" color="rgba(255,255,255,0.7)">
                              Обновление данных: <strong>{moderatorStats.updated_users}</strong>
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(208, 188, 255, 0.1) 0%, rgba(208, 188, 255, 0.05) 100%)',
                      border: '1px solid rgba(208, 188, 255, 0.2)'
                    }}>
                      <Typography variant="subtitle1" color="primary.light" sx={{ fontWeight: 'bold' }}>
                        Всего действий: <strong>{moderatorStats.total_actions}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };
  
  // Компонент для отображения права модератора
  const PermissionItem = ({ title, enabled, icon }) => {
    return (
      <Paper 
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: enabled ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.3)',
          border: `1px solid ${enabled ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.1)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: enabled ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.05)',
              mr: 1.5
            }}
          >
            {React.cloneElement(icon, { fontSize: 'small', color: enabled ? 'success' : 'disabled' })}
          </Avatar>
          <Typography variant="body1" color={enabled ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'}>
            {title}
          </Typography>
        </Box>
        
        {enabled ? (
          <CheckCircleIcon color="success" />
        ) : (
          <DoNotDisturbIcon color="disabled" sx={{ opacity: 0.5 }} />
        )}
      </Paper>
    );
  };

  // Открыть диалог предупреждения
  const openWarningDialog = (user) => {
    setWarningUser(user);
    setWarningData({
      reason: '',
      details: ''
    });
    setWarningDialogOpen(true);
  };
  
  // Открыть диалог бана
  const openBanDialog = (user) => {
    setBanUser(user);
    setBanData({
      reason: '',
      details: '',
      duration_days: 30
    });
    setBanDialogOpen(true);
  };
  
  // Открыть диалог истории предупреждений
  const openUserWarningsDialog = async (user) => {
    setSelectedUserHistory(user);
    setLoadingHistory(true);
    setUserWarningsDialogOpen(true);
    
    try {
      const response = await axios.get(`/api/user/${user.id}/warnings`);
      if (response.data.success) {
        setUserWarnings(response.data.warnings);
      } else {
        showNotification('error', 'Не удалось загрузить историю предупреждений');
      }
    } catch (error) {
      console.error('Ошибка при загрузке предупреждений:', error);
      showNotification('error', 'Ошибка при загрузке предупреждений');
    } finally {
      setLoadingHistory(false);
    }
  };
  
  // Открыть диалог истории банов
  const openUserBansDialog = async (user) => {
    setSelectedUserHistory(user);
    setLoadingHistory(true);
    setUserBansDialogOpen(true);
    
    try {
      const response = await axios.get(`/api/user/${user.id}/bans`);
      if (response.data.success) {
        setUserBans(response.data.bans);
      } else {
        showNotification('error', 'Не удалось загрузить историю банов');
      }
    } catch (error) {
      console.error('Ошибка при загрузке банов:', error);
      showNotification('error', 'Ошибка при загрузке банов');
    } finally {
      setLoadingHistory(false);
    }
  };
  
  // Выдать предупреждение пользователю
  const handleIssueWarning = async () => {
    if (!warningUser) return;
    
    if (!warningData.reason.trim()) {
      showNotification('error', 'Укажите причину предупреждения');
      return;
    }
    
    try {
      const response = await axios.post('/api/moderator/warnings', {
        user_id: warningUser.id,
        reason: warningData.reason,
        details: warningData.details
      });
      
      if (response.data.success) {
        showNotification('success', 'Предупреждение успешно выдано');
        
        // Если был автоматический бан
        if (response.data.auto_ban) {
          showNotification('info', `Пользователь автоматически заблокирован за 3 предупреждения до ${response.data.ban_info.formatted_end_date}`);
        }
        
        setWarningDialogOpen(false);
      } else {
        showNotification('error', response.data.message || 'Ошибка при выдаче предупреждения');
      }
    } catch (error) {
      console.error('Ошибка при выдаче предупреждения:', error);
      showNotification('error', 'Ошибка при выдаче предупреждения');
    }
  };
  
  // Забанить пользователя
  const handleBanUser = async () => {
    if (!banUser) return;
    
    if (!banData.reason.trim()) {
      showNotification('error', 'Укажите причину бана');
      return;
    }
    
    try {
      const response = await axios.post('/api/moderator/bans', {
        user_id: banUser.id,
        reason: banData.reason,
        details: banData.details,
        duration_days: banData.duration_days
      });
      
      if (response.data.success) {
        showNotification('success', `Пользователь заблокирован до ${response.data.formatted_end_date}`);
        setBanDialogOpen(false);
      } else {
        showNotification('error', response.data.message || 'Ошибка при бане пользователя');
      }
    } catch (error) {
      console.error('Ошибка при бане пользователя:', error);
      showNotification('error', 'Ошибка при бане пользователя');
    }
  };
  
  // Снять предупреждение
  const handleRemoveWarning = async (warningId) => {
    try {
      const response = await axios.delete(`/api/moderator/warnings/${warningId}`);
      
      if (response.data.success) {
        showNotification('success', 'Предупреждение успешно снято');
        // Обновляем список предупреждений
        setUserWarnings(userWarnings.map(warning => 
          warning.id === warningId ? { ...warning, is_active: false } : warning
        ));
      } else {
        showNotification('error', response.data.message || 'Ошибка при снятии предупреждения');
      }
    } catch (error) {
      console.error('Ошибка при снятии предупреждения:', error);
      showNotification('error', 'Ошибка при снятии предупреждения');
    }
  };
  
  // Снять бан
  const handleRemoveBan = async (banId) => {
    try {
      const response = await axios.delete(`/api/moderator/bans/${banId}`);
      
      if (response.data.success) {
        showNotification('success', 'Бан успешно снят');
        // Обновляем список банов
        setUserBans(userBans.map(ban => 
          ban.id === banId ? { ...ban, is_active: false } : ban
        ));
      } else {
        showNotification('error', response.data.message || 'Ошибка при снятии бана');
      }
    } catch (error) {
      console.error('Ошибка при снятии бана:', error);
      showNotification('error', 'Ошибка при снятии бана');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      
      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
        <SecurityIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Box>
          <Typography variant="h5" component="h1" gutterBottom>
            Панель модератора
          </Typography>
          {moderatorData && (
            <Typography variant="body2" color="text.secondary">
              {moderatorData.moderator_level >= 3 ? 'Администратор' : 'Модератор'} • {new Date().toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </Paper>
      
      
      <Paper sx={{ p: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab icon={<DashboardIcon />} label="Профиль" />
          <Tab icon={<PostAddIcon />} label="Посты" disabled={!permissions.delete_posts} />
          <Tab icon={<MusicNoteIcon />} label="Треки" disabled={!permissions.delete_music} />
          <Tab icon={<CommentIcon />} label="Комментарии" disabled={!permissions.delete_comments} />
          <Tab icon={<PersonIcon />} label="Пользователи" disabled={!permissions.change_user_name && !permissions.change_username && !permissions.delete_avatar} />
          <Tab icon={<BugReportIcon />} label="Баг-репорты" disabled={!permissions.manage_bug_reports && !permissions.delete_bug_reports} />
          <Tab icon={<EmojiEventsIcon />} label="Бейджики" disabled={!permissions.edit_badges && !permissions.delete_badges} />
        </Tabs>
        
        
        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && renderProfile()}
          {tabValue === 1 && renderPosts()}
          {tabValue === 2 && renderTracks()}
          {tabValue === 3 && renderComments()}
          {tabValue === 4 && renderUsers()}
          {tabValue === 5 && renderBugReports()}
          {tabValue === 6 && renderBadges()}
        </Box>
      </Paper>
      
      
      <StyledDialog open={deletePostDialogOpen} onClose={() => setDeletePostDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(244, 67, 54, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="error.light">
              Удаление поста
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              mb: 1
            }}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom>
              Вы действительно хотите удалить этот пост?
            </Typography>
            
            {selectedPost && (
              <Box sx={{ mt: 2, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.3)', p: 2 }}>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">{selectedPost.content}</Typography>
                {selectedPost.image && (
                  <Box sx={{ mt: 1, maxWidth: '100%', maxHeight: 200, overflow: 'hidden', borderRadius: 1 }}>
                    <img 
                      src={selectedPost.image.startsWith('/') ? selectedPost.image : `/static/uploads/posts/${selectedPost.id}/${selectedPost.image}`}
                      alt="Post attachment" 
                      style={{ width: '100%', height: 'auto', borderRadius: '4px' }} 
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setDeletePostDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeletePost} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={deleteTrackDialogOpen} onClose={() => setDeleteTrackDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(244, 67, 54, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="error.light">
              Удаление трека
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              mb: 1
            }}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom>
              Вы действительно хотите удалить этот трек?
            </Typography>
            
            {selectedTrack && (
              <Box sx={{ mt: 2, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.3)', p: 2 }}>
                <Typography variant="body1" fontWeight="bold" color="rgba(255,255,255,0.9)">{selectedTrack.title}</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">Артист: {selectedTrack.artist}</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">Альбом: {selectedTrack.album || 'Нет данных'}</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setDeleteTrackDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteTrack} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={deleteCommentDialogOpen} onClose={() => setDeleteCommentDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(244, 67, 54, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="error.light">
              Удаление комментария
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              mb: 1
            }}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom>
              Вы действительно хотите удалить этот комментарий?
            </Typography>
            
            {selectedComment && (
              <Box sx={{ mt: 2, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.3)', p: 2 }}>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">{selectedComment.content}</Typography>
                {selectedComment.image && (
                  <Box sx={{ mt: 1, maxWidth: '100%', maxHeight: 200, overflow: 'hidden', borderRadius: 1 }}>
                    <img 
                      src={selectedComment.image} 
                      alt="Comment attachment" 
                      style={{ width: '100%', height: 'auto', borderRadius: '4px' }} 
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setDeleteCommentDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteComment} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={deleteAvatarDialogOpen} onClose={() => setDeleteAvatarDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(244, 67, 54, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="error.light">
              Удаление аватара пользователя
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              mb: 1
            }}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom>
              Вы действительно хотите удалить аватар пользователя <Box component="span" fontWeight="bold" color="error.light">{selectedUser?.name}</Box>?
            </Typography>
            
            {selectedUser && selectedUser.photo && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Avatar 
                  src={`/static/uploads/avatar/${selectedUser.id}/${selectedUser.photo}`}
                  alt={selectedUser.name}
                  sx={{ width: 150, height: 150, border: '3px solid rgba(244, 67, 54, 0.3)' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setDeleteAvatarDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteAvatar} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={editUserDialogOpen} onClose={() => setEditUserDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(90deg, rgba(25,118,210,0.2) 0%, rgba(0,0,0,0) 100%)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(25,118,210,0.2) 0%, rgba(25,118,210,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <EditIcon color="primary" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="primary.light">
              Редактирование пользователя
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(25,118,210,0.05)',
              border: '1px solid rgba(25,118,210,0.2)',
              mb: 2
            }}
          >
            {selectedUser && (
              <Grid container spacing={2}>
                <Grid item xs={12} display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar 
                    src={selectedUser.photo ? `/static/uploads/avatar/${selectedUser.id}/${selectedUser.photo}` : undefined}
                    alt={selectedUser.name}
                    sx={{ width: 60, height: 60, border: '2px solid rgba(25,118,210,0.3)' }}
                  />
                  <Box>
                    <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" fontWeight="bold">
                      {selectedUser.name}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.6)">
                      ID: {selectedUser.id}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    label="Имя пользователя"
                    type="text"
                    fullWidth
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.87)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(25,118,210,0.15)',
                          boxShadow: '0 0 0 2px rgba(25,118,210,0.3)'
                        }
                      }
                    }}
                    InputLabelProps={{
                      sx: { color: 'rgba(255,255,255,0.7)' }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)'
                      },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Юзернейм"
                    type="text"
                    fullWidth
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    variant="outlined"
                    size="small"
                    helperText="Допускаются только латинские буквы, цифры и символы: . _ -"
                    FormHelperTextProps={{
                      sx: { color: 'rgba(255,255,255,0.5)' }
                    }}
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.87)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(25,118,210,0.15)',
                          boxShadow: '0 0 0 2px rgba(25,118,210,0.3)'
                        }
                      }
                    }}
                    InputLabelProps={{
                      sx: { color: 'rgba(255,255,255,0.7)' }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)'
                      },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setEditUserDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleUpdateUserInfo} 
            color="primary" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={bugReportStatusDialogOpen} onClose={() => setBugReportStatusDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(90deg, rgba(156,39,176,0.2) 0%, rgba(0,0,0,0) 100%)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(156,39,176,0.2) 0%, rgba(156,39,176,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <BugReportIcon sx={{ mr: 1.5, fontSize: 24, color: '#9c27b0' }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#ba68c8' }}>
              Изменение статуса баг-репорта
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(156,39,176,0.05)',
              border: '1px solid rgba(156,39,176,0.2)',
              mb: 2
            }}
          >
            {selectedBugReport && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom fontWeight="bold">
                    {selectedBugReport.subject}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mb: 2 }}>
                    ID: {selectedBugReport.id} | Дата: {new Date(selectedBugReport.date).toLocaleString()}
                  </Typography>
                  <Divider sx={{ my: 2, bgcolor: 'rgba(156,39,176,0.2)' }} />
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel id="bug-status-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>Статус</InputLabel>
                    <Select
                      labelId="bug-status-label"
                      value={bugReportStatus}
                      onChange={(e) => setBugReportStatus(e.target.value)}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.87)',
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.2)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#9c27b0'
                        }
                      }}
                    >
                      <MenuItem value="Открыт">Открыт</MenuItem>
                      <MenuItem value="В работе">В работе</MenuItem>
                      <MenuItem value="Исправлен">Исправлен</MenuItem>
                      <MenuItem value="Закрыт">Закрыт</MenuItem>
                      <MenuItem value="Отклонён">Отклонён</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setBugReportStatusDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleUpdateBugReportStatus} 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={editBadgeDialogOpen} onClose={() => setEditBadgeDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(90deg, rgba(63,81,181,0.2) 0%, rgba(0,0,0,0) 100%)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(63,81,181,0.2) 0%, rgba(63,81,181,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h5" fontWeight="bold" color="primary.light">
              Редактирование бейджика
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.6)">
              Измените параметры бейджика и сохраните изменения
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 3, bgcolor: 'transparent' }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Название бейджика"
                type="text"
                fullWidth
                value={editBadgeName}
                onChange={(e) => setEditBadgeName(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.87)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(63,81,181,0.15)',
                      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.3)'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255,255,255,0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Описание"
                type="text"
                fullWidth
                multiline
                rows={2}
                value={editBadgeDescription}
                onChange={(e) => setEditBadgeDescription(e.target.value)}
                variant="outlined"
                size="small"
                helperText="Кратко опишите бейджик"
                FormHelperTextProps={{
                  sx: { color: 'rgba(255,255,255,0.5)' }
                }}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.87)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(63,81,181,0.15)',
                      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.3)'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255,255,255,0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Цена (баллы)"
                type="number"
                fullWidth
                value={editBadgePrice}
                onChange={(e) => setEditBadgePrice(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PaidIcon color="primary" /></InputAdornment>,
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.87)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(63,81,181,0.15)',
                      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.3)'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255,255,255,0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  height: '100%'
                }}
              >
                <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.87)">Активен</Typography>
                <Switch 
                  checked={editBadgeActive}
                  onChange={(e) => setEditBadgeActive(e.target.checked)}
                  color="primary"
                  sx={{ 
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4caf50',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.08)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4caf50',
                    },
                  }}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  p: 3,
                  borderRadius: 2,
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center' }}>
                  {editBadgeImagePreview ? (
                    <>
                      <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={editBadgeImagePreview} 
                          alt="Предпросмотр"
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: 150, 
                            borderRadius: 8,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                          }}
                        />
                        <Fade in timeout={500}>
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: -8, 
                              right: -8, 
                              background: 'rgba(0,0,0,0.5)',
                              borderRadius: '50%',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                          >
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => {
                                setEditBadgeImage(null);
                                setEditBadgeImagePreview('');
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Fade>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="rgba(255,255,255,0.6)" align="center" sx={{ mb: 2 }}>
                      Загрузите новое SVG или GIF изображение бейджика
                    </Typography>
                  )}
                  
                  <Button 
                    component="label" 
                    variant="outlined" 
                    startIcon={<FileUploadIcon />}
                    sx={{ 
                      borderRadius: 8,
                      py: 0.5,
                      px: 2,
                      background: 'rgba(63,81,181,0.1)',
                      borderColor: 'rgba(63, 81, 181, 0.5)',
                      color: 'rgba(255,255,255,0.87)',
                      '&:hover': {
                        background: 'rgba(63,81,181,0.2)',
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    Загрузить SVG/GIF
                    <input
                      type="file"
                      accept=".svg,.gif"
                      hidden
                      onChange={handleBadgeImageChange}
                    />
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setEditBadgeDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleUpdateBadge} 
            color="primary" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={deleteBadgeDialogOpen} onClose={() => setDeleteBadgeDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(244, 67, 54, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="error.light">
              Удаление бейджика
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              mb: 1
            }}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom>
              Вы действительно хотите удалить бейджик <Box component="span" fontWeight="bold" color="error.light">"{selectedBadge?.name}"</Box>?
            </Typography>
            
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Это действие <Box component="span" fontWeight="bold" color="error.light">нельзя отменить</Box>. 
              При удалении бейджика будут также удалены:
            </Typography>
            
            <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
              <Typography component="li" variant="body2" color="rgba(255,255,255,0.6)">
                Все достижения пользователей, связанные с этим бейджиком
              </Typography>
              <Typography component="li" variant="body2" color="rgba(255,255,255,0.6)">
                Все записи о покупках этого бейджика
              </Typography>
              <Typography component="li" variant="body2" color="rgba(255,255,255,0.6)">
                SVG-файл изображения бейджика
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setDeleteBadgeDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteBadge} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        sx={snackbarStyle}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ModeratorPage;