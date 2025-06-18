import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Container, 
  Grid, 
  Avatar, 
  Paper, 
  Tabs, 
  Tab, 
  IconButton, 
  Snackbar, 
  Alert, 
  TextField, 
  Tooltip, 
  Link as MuiLink,
  ImageList,
  ImageListItem,
  Chip,
  SvgIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import PostService from '../../services/PostService';
import 'react-medium-image-zoom/dist/styles.css';
import { ThemeSettingsContext } from '../../App';
import { formatDate } from '../../utils/dateUtils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TabContentLoader from '../../components/UI/TabContentLoader';
import { UsernameCard, VerificationBadge } from '../../UIKIT';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MusicSelectDialog from '../../components/Music/MusicSelectDialog';
import InfoIcon from '@mui/icons-material/Info';
import CakeIcon from '@mui/icons-material/Cake';
import TodayIcon from '@mui/icons-material/Today';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DiamondIcon from '@mui/icons-material/Diamond';
import ChatIcon from '@mui/icons-material/Chat';
import WarningIcon from '@mui/icons-material/Warning';
import BlockIcon from '@mui/icons-material/Block';
import { Icon } from '@iconify/react';
import { PostsFeed, WallFeed } from './components';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { MusicContext } from '../../context/MusicContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import DynamicIslandNotification from '../../components/DynamicIslandNotification';
import { Stories } from '../../UIKIT/Stories';
import { useLanguage } from '../../context/LanguageContext';


const PostInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(0, 0, 0, 0.2)'
      : 'rgba(0, 0, 0, 0.03)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    border: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid rgba(0, 0, 0, 0.05)',
    fontSize: '0.95rem',
    padding: theme.spacing(1, 1.5),
    color: theme.palette.text.primary,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: 'rgba(208, 188, 255, 0.3)',
      background: theme.palette.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.25)'
        : 'rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-focused': {
      borderColor: 'rgba(208, 188, 255, 0.5)',
      boxShadow: '0 0 0 2px rgba(208, 188, 255, 0.1)'
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  width: '100%'
}));


const PostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 0, 0),
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  marginTop: theme.spacing(1.5)
}));





const PublishButton = styled(Button)(({ theme }) => ({
  borderRadius: '18px',
  textTransform: 'none',
  fontSize: '0.6rem',
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(124, 77, 255, 0.25)',
  padding: theme.spacing(0.4, 1.5),
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, rgb(180 163 220) 0%, rgb(177 161 216) 100%)'
    : 'linear-gradient(90deg, rgb(124 77 255) 0%, rgb(148 108 255) 100%)',
  color: theme.palette.mode === 'dark' ? '#000' : '#fff',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(124, 77, 255, 0.35)',
  },
  '&.Mui-disabled': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)',
    color: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(0, 0, 0, 0.3)'
  }
}));


const CreatePost = ({ onPostCreated, postType = 'post', recipientId = null }) => {
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);
  const { playTrack, currentTrack, isPlaying, togglePlay } = useContext(MusicContext);
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaType, setMediaType] = useState('');
  const [mediaPreview, setMediaPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaNotification, setMediaNotification] = useState({ open: false, message: '' });
  const [musicSelectOpen, setMusicSelectOpen] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });
  const [rateLimitDialog, setRateLimitDialog] = useState({
    open: false,
    message: '',
    timeRemaining: 0
  });
  const [showSizeError, setShowSizeError] = useState(false);
  const [sizeErrorMessage, setSizeErrorMessage] = useState('');

  // Добавляем константы в начало компонента
  const MAX_VIDEO_SIZE = 150 * 1024 * 1024; // 150MB in bytes
  const MAX_PHOTO_SIZE = 50 * 1024 * 1024;  // 50MB in bytes
  const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif'
  ];
  const ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska'
  ];

  useEffect(() => {
    if (error) setError('');
  }, [content, mediaFiles, selectedTracks, error]);

  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (!files.length) return;

    let hasInvalidSize = false;

    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        setSizeErrorMessage(`Размер видео превышает лимит в 150МБ`);
        setShowSizeError(true);
        hasInvalidSize = true;
      }

      if (isImage && file.size > MAX_PHOTO_SIZE) {
        setSizeErrorMessage(`Размер изображения превышает лимит в 50МБ`);
        setShowSizeError(true);
        hasInvalidSize = true;
      }
    });

    if (hasInvalidSize) return;

    processFiles(files);
  };

  const handleMediaChange = (event) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files.length) return;

    let hasInvalidSize = false;
    
    // Проверяем размер после выбора
    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (isVideo && file.size > MAX_VIDEO_SIZE) {
        setSizeErrorMessage(`Размер видео превышает лимит в 150МБ`);
        setShowSizeError(true);
        hasInvalidSize = true;
      }

      if (isImage && file.size > MAX_PHOTO_SIZE) {
        setSizeErrorMessage(`Размер изображения превышает лимит в 50МБ`);
        setShowSizeError(true);
        hasInvalidSize = true;
      }
    });

    if (hasInvalidSize) {
      event.target.value = '';
      return;
    }

    processFiles(files);
  };

  // Обновляем processFiles для работы с уже проверенными файлами
  const processFiles = (files) => {
    if (!files.length) return;

    // Проверяем MIME-типы файлов
    const allFiles = Array.from(files);
    const validTypeFiles = allFiles.filter(file => {
      const isValidImage = ALLOWED_IMAGE_TYPES.includes(file.type);
      const isValidVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

      if (!isValidImage && !isValidVideo) {
        window.dispatchEvent(new CustomEvent('showError', {
          detail: {
            message: `Неподдерживаемый формат файла: ${file.name}. Разрешены только изображения (JPEG, PNG, GIF, WEBP) и видео (MP4, WEBM, MOV, AVI, MKV)`,
            severity: 'error'
          }
        }));
        return false;
      }
      return true;
    });

    if (validTypeFiles.length === 0) {
      return;
    }

    const imageFiles = validTypeFiles.filter(file => ALLOWED_IMAGE_TYPES.includes(file.type));
    const videoFiles = validTypeFiles.filter(file => ALLOWED_VIDEO_TYPES.includes(file.type));

    // Если уже есть видео, не позволяем добавлять изображения
    if (mediaType === 'video' && imageFiles.length > 0) {
      setMediaNotification({
        open: true,
        message: 'Нельзя прикрепить фото и видео одновременно'
      });
      return;
    }

    // Если уже есть изображения, не позволяем добавлять видео
    if (mediaType === 'image' && videoFiles.length > 0) {
      setMediaNotification({
        open: true,
        message: 'Нельзя прикрепить фото и видео одновременно'
      });
      return;
    }

    // Обработка видео
    if (videoFiles.length > 0) {
      setMediaFiles([videoFiles[0]]);
      setMediaType('video');
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview([reader.result]);
      };
      reader.readAsDataURL(videoFiles[0]);
      return;
    }

    // Обработка изображений
    if (imageFiles.length > 0) {
      setMediaFiles(prev => [...prev, ...imageFiles]);
      setMediaType('image');
      
      // Создаем превью для всех изображений
      const newPreviews = [];
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === imageFiles.length) {
            setMediaPreview(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveMedia = () => {
    setMediaFiles([]);
    setMediaPreview([]);
    setMediaType('');
    setSelectedTracks([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMusicSelect = (tracks) => {
    setSelectedTracks(tracks);
  };

  const handleRemoveTrack = (trackId) => {
    setSelectedTracks(prev => prev.filter(track => track.id !== trackId));
  };

  const clearForm = () => {
    setContent('');
    setMediaFiles([]);
    setMediaPreview([]);
    setMediaType('');
    setSelectedTracks([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTrackPlay = (track, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (currentTrack && currentTrack.id === track.id) {
      togglePlay(); 
    } else {
      playTrack(track); 
    }
  };

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData;
    if (clipboardData.items) {
      const items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();  
          const file = items[i].getAsFile();
          if (file) {
            if (mediaType && mediaType === 'video') {
              setMediaNotification({
                open: true,
                message: 'Нельзя прикрепить фото и видео одновременно'
              });
              return;
            }

            // Обновляем тип медиа на 'images' для множественной загрузки
            setMediaType('images');
            setMediaFiles(prev => [...prev, file]);
            
            const reader = new FileReader();
            reader.onloadend = () => {
              setMediaPreview(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0 && selectedTracks.length === 0) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      console.log("Starting post submission...");
      
      const formData = new FormData();
      formData.append('content', content.trim());
      
      console.log("Added content to FormData:", content.trim());
      
      if (postType && postType !== 'post') {
        formData.append('type', postType);
      }
      
      if (recipientId) {
        formData.append('recipient_id', recipientId);
      }
      
      if (mediaType === 'image') {
        // Отправляем все изображения с правильным форматом
        mediaFiles.forEach((file, index) => {
          console.log(`Adding image[${index}]:`, file.name, file.size);
          formData.append(`images[${index}]`, file); // Исправлено на правильный формат
        });
      } else if (mediaType === 'video') {
        console.log("Adding video to FormData:", mediaFiles[0].name, mediaFiles[0].size);
        formData.append('video', mediaFiles[0]);
      }
      
      if (selectedTracks.length > 0) {
        console.log(`Adding ${selectedTracks.length} music tracks to post`);
        
        const trackData = selectedTracks.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          duration: track.duration,
          file_path: track.file_path,
          cover_path: track.cover_path
        }));
        formData.append('music', JSON.stringify(trackData));
      }
      
      console.log("Sending post request to server...");
      const response = await PostService.createPost(formData);
      console.log('Post created:', response);
      
      if (response && response.success) {
        clearForm();
        if (onPostCreated && response.post) {
          onPostCreated(response.post);
        }
        console.log('Post created successfully');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      
      if (error.response && error.response.status === 429) {
        const rateLimit = error.response.data.rate_limit;
        let errorMessage = "Превышен лимит публикации постов. ";
        
        if (rateLimit && rateLimit.reset) {
          const resetTime = new Date(rateLimit.reset * 1000);
          const now = new Date();
          const diffSeconds = Math.round((resetTime - now) / 1000);
          
          if (diffSeconds > 60) {
            const minutes = Math.floor(diffSeconds / 60);
            const seconds = diffSeconds % 60;
            errorMessage += `Следующий пост можно опубликовать через ${minutes} мин. ${seconds} сек.`;
          } else {
            errorMessage += `Следующий пост можно опубликовать через ${diffSeconds} сек.`;
          }
        } else {
          errorMessage += "Пожалуйста, повторите попытку позже.";
        }
        
        setError(errorMessage);
      } else if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Произошла ошибка при создании поста. Пожалуйста, попробуйте еще раз.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        borderRadius: 1,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',

      }}
    >
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      
      <Box 
        component="form" 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        sx={{ 
          position: 'relative',
          zIndex: 1 
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            borderRadius: '12px',
            border: isDragging ? '2px dashed #D0BCFF' : 'none',
            backgroundColor: isDragging ? 'rgba(208, 188, 255, 0.05)' : 'transparent',
            padding: isDragging ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
        >
          {isDragging && (
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                backgroundColor: 'rgba(26, 26, 26, 0.7)',
                borderRadius: '12px',
                zIndex: 10,
                opacity: isDragging ? 1 : 0,
                transition: 'opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
            >
              <ImageOutlinedIcon sx={{ fontSize: 40, color: '#D0BCFF', mb: 1, filter: 'drop-shadow(0 0 8px rgba(208, 188, 255, 0.6))' }} />
              <Typography variant="body1" color="primary" sx={{ fontWeight: 'medium', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                Перетащите файлы сюда
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Avatar 
              src={user.photo ? `/static/uploads/avatar/${user.id}/${user.photo}` : undefined}
              alt={user.name}
              sx={{ 
                mr: 1.5, 
                width: 40, 
                height: 40, 
                border: '2px solid rgba(208, 188, 255)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)'
                }
              }}
            />
            <PostInput
              placeholder={postType === 'wall' ? t('profile.create_post.wall_placeholder') : t('profile.create_post.placeholder')}
              multiline
              maxRows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              fullWidth
            />
          </Box>
          
          
          {mediaPreview.length > 0 && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Box sx={{ 
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }}>
                {mediaType === 'image' ? (
                  <ImageList 
                    sx={{ 
                      width: '100%', 
                      height: 'auto',
                      maxHeight: 500,
                      margin: 0,
                      padding: 1
                    }} 
                    cols={mediaPreview.length > 3 ? 3 : mediaPreview.length} 
                    rowHeight={164}
                    gap={8}
                  >
                    {mediaPreview.map((preview, index) => (
                      <ImageListItem 
                        key={index}
                        sx={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{ 
                            objectFit: 'cover',
                            height: '100%',
                            width: '100%',
                            borderRadius: '8px'
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            setMediaFiles(prev => prev.filter((_, i) => i !== index));
                            setMediaPreview(prev => prev.filter((_, i) => i !== index));
                            if (mediaPreview.length === 1) {
                              setMediaType('');
                            }
                          }}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            padding: '4px',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            },
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <video
                    src={mediaPreview[0]}
                    controls
                    style={{ 
                      width: '100%', 
                      maxHeight: '300px',
                      borderRadius: '12px'
                    }}
                  />
                )}
                {mediaType === 'video' && (
                  <IconButton
                    onClick={handleRemoveMedia}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      },
                      padding: '8px',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}
          
          
          {selectedTracks.length > 0 && (
            <Box sx={{ mt: 2, mb: 1 }}>
              {selectedTracks.map(track => (
                <Box 
                  key={track.id}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    py: 1, 
                    px: 2, 
                    mb: 1, 
                    borderRadius: '8px',
                    bgcolor: theme => theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)',
                    border: theme => theme.palette.mode === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.08)'
                      : '1px solid rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '4px', 
                      overflow: 'hidden',
                      mr: 1.5,
                      position: 'relative',
                      bgcolor: theme => theme.palette.mode === 'dark' 
                        ? 'rgba(0, 0, 0, 0.3)'
                        : 'rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img 
                      src={track.cover_path.startsWith('/static/') ? track.cover_path : `/static/uploads/music/covers/${track.cover_path}`} 
                      alt={track.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/uploads/system/album_placeholder.jpg';
                      }}
                    />
                    <MusicNoteIcon 
                      sx={{ 
                        position: 'absolute', 
                        fontSize: 16, 
                        color: 'rgba(255, 255, 255, 0.7)'
                      }} 
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap>
                      {track.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {track.artist}
                    </Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={() => handleRemoveTrack(track.id)}
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          
          <PostActions>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                multiple
                style={{ display: 'none' }}
                id="media-upload-profile"
              />
              <label htmlFor="media-upload-profile">
                <Button
                  component="span"
                  startIcon={<ImageOutlinedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    color: mediaFiles.length > 0 || selectedTracks.length > 0 ? 'primary.main' : 'text.secondary',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    border: mediaFiles.length > 0 || selectedTracks.length > 0 
                      ? '1px solid rgba(208, 188, 255, 0.5)'
                      : theme => theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.12)'
                        : '1px solid rgba(0, 0, 0, 0.12)',
                    padding: '4px 10px',
                    '&:hover': {
                      backgroundColor: 'rgba(208, 188, 255, 0.08)',
                      borderColor: 'rgba(208, 188, 255, 0.4)'
                    }
                  }}
                  size="small"
                >
                  {mediaFiles.length > 0 ? t('profile.create_post.files_count', { count: mediaFiles.length }) : t('profile.create_post.media')}
                </Button>
              </label>
              
              
              <Button
                onClick={() => setMusicSelectOpen(true)}
                startIcon={<MusicNoteIcon sx={{ fontSize: 18 }} />}
                sx={{
                  color: selectedTracks.length > 0 ? 'primary.main' : 'text.secondary',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  padding: '4px 10px',
                  border: selectedTracks.length > 0 
                    ? '1px solid rgba(208, 188, 255, 0.5)' 
                    : theme => theme.palette.mode === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.12)'
                      : '1px solid rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    backgroundColor: 'rgba(208, 188, 255, 0.08)',
                    borderColor: 'rgba(208, 188, 255, 0.4)'
                  }
                }}
                size="small"
              >
                {selectedTracks.length > 0 ? t('profile.create_post.music_count', { count: selectedTracks.length }) : t('profile.create_post.music')}
              </Button>
            </Box>
            
            <PublishButton 
              variant="contained" 
              onClick={handleSubmit}
              disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0 && selectedTracks.length === 0)}
              endIcon={isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
              size="small"
            >
              {t('profile.create_post.publish')}
            </PublishButton>
          </PostActions>
          
          
          <MusicSelectDialog
            open={musicSelectOpen}
            onClose={() => setMusicSelectOpen(false)}
            onSelectTracks={handleMusicSelect}
            maxTracks={3}
          />
        </Box>
      </Box>
      
      <Snackbar
        open={mediaNotification.open}
        autoHideDuration={3000}
        onClose={() => setMediaNotification({ ...mediaNotification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setMediaNotification({ ...mediaNotification, open: false })} 
          severity="warning"
          sx={{ width: '100%' }}
        >
          {mediaNotification.message}
        </Alert>
      </Snackbar>
      
      {/* Добавляем DynamicIslandNotification */}
      <DynamicIslandNotification
        open={showSizeError}
        message={sizeErrorMessage}
        shortMessage="Ошибка размера файла"
        notificationType="error"
        animationType="pill"
        autoHideDuration={5000}
        onClose={() => setShowSizeError(false)}
      />
    </Paper>
  );
};


const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <TabContentLoader tabIndex={index}>
          <Box sx={{ pt: 0 }}>
            {children}
          </Box>
        </TabContentLoader>
      )}
    </div>
  );
};


const UserStatus = ({ statusText, statusColor }) => {
  const { t } = useLanguage();
  if (!statusText) return null;
  
  
  const getContrastTextColor = (hexColor) => {
    
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  
  const createGradientColor = (hexColor) => {
    
    let r = parseInt(hexColor.substr(1, 2), 16);
    let g = parseInt(hexColor.substr(3, 2), 16);
    let b = parseInt(hexColor.substr(5, 2), 16);
    
    
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    
    if (brightness < 128) {
      
      r = Math.min(255, r + 30);
      g = Math.min(255, g + 30);
      b = Math.min(255, b + 30);
    } else {
      
      r = Math.max(0, r - 30);
      g = Math.max(0, g - 30);
      b = Math.max(0, b - 30);
    }
    
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  
  const gradientColor = createGradientColor(statusColor || '#D0BCFF');
  const textColor = getContrastTextColor(statusColor || '#D0BCFF');

  
  const parseStatusText = (text) => {
    
    const iconTagRegex = /\{(\w+)\}/;
    const match = text.match(iconTagRegex);
    
    
    const result = {
      text: text,
      iconName: null
    };
    
    if (match) {
      
      result.iconName = match[1].toLowerCase();
      
      result.text = text.replace(iconTagRegex, '').trim();
    }
    
    return result;
  };
  
  
  const parsedStatus = parseStatusText(statusText);
  
  
  const getIconByName = (iconName) => {
    switch (iconName) {
      case 'minion':
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M402.667 518C367.33 518 332.786 507.523 303.405 487.89C274.023 468.257 251.123 440.353 237.6 407.707C224.077 375.06 220.539 339.137 227.433 304.478C234.327 269.82 251.343 237.984 276.33 212.997C301.317 188.01 333.153 170.994 367.81 164.1C402.47 157.206 438.393 160.744 471.04 174.267C503.687 187.79 531.59 210.69 551.223 240.072C570.853 269.453 581.333 303.997 581.333 339.333C581.333 362.797 576.713 386.03 567.733 407.707C558.753 429.383 545.593 449.08 529.003 465.67C512.413 482.26 492.717 495.42 471.04 504.4C449.363 513.38 426.13 518 402.667 518ZM402.667 210.667C377.22 210.667 352.343 218.213 331.183 232.351C310.024 246.489 293.533 266.584 283.794 290.095C274.056 313.606 271.508 339.477 276.472 364.437C281.437 389.393 293.691 412.32 311.686 430.313C329.68 448.31 352.607 460.563 377.567 465.527C402.523 470.493 428.393 467.943 451.907 458.207C475.417 448.467 495.51 431.977 509.65 410.817C523.787 389.657 531.333 364.78 531.333 339.333C531.333 305.209 517.777 272.482 493.647 248.353C469.517 224.223 436.79 210.667 402.667 210.667Z" fill="currentColor"/>
            <path d="M400 643.667C376.53 643.72 353.28 639.123 331.597 630.14C309.913 621.157 290.224 607.97 273.667 591.333C269.251 586.593 266.847 580.327 266.961 573.85C267.075 567.373 269.699 561.193 274.28 556.613C278.86 552.033 285.04 549.407 291.516 549.293C297.993 549.18 304.261 551.583 309 556C333.693 579.057 366.216 591.88 400 591.88C433.783 591.88 466.31 579.057 491 556C495.74 551.583 502.006 549.18 508.483 549.293C514.96 549.407 521.14 552.033 525.72 556.613C530.303 561.193 532.926 567.373 533.04 573.85C533.153 580.327 530.75 586.593 526.333 591.333C509.776 607.97 490.086 621.157 468.403 630.14C446.72 639.123 423.47 643.72 400 643.667Z" fill="currentColor"/>
            <path d="M402.667 400C436.173 400 463.333 372.837 463.333 339.333C463.333 305.828 436.173 278.666 402.667 278.666C369.163 278.666 342 305.828 342 339.333C342 372.837 369.163 400 402.667 400Z" fill="currentColor"/>
            <path d="M666.666 755.333C660.036 755.333 653.676 752.7 648.99 748.01C644.3 743.323 641.666 736.963 641.666 730.333V333.333C637.156 272.944 609.983 216.492 565.596 175.297C521.21 134.102 462.89 111.209 402.333 111.209C341.776 111.209 283.457 134.102 239.07 175.297C194.684 216.492 167.511 272.944 163 333.333V730.333C163 736.963 160.366 743.323 155.678 748.01C150.989 752.7 144.631 755.333 138 755.333C131.37 755.333 125.011 752.7 120.322 748.01C115.634 743.323 113 736.963 113 730.333V333.333C115.55 258.166 147.202 186.929 201.278 134.656C255.354 82.3832 327.623 53.1636 402.833 53.1636C478.043 53.1636 550.313 82.3832 604.39 134.656C658.466 186.929 690.116 258.166 692.666 333.333V730.333C692.623 733.69 691.913 737.003 690.58 740.08C689.246 743.16 687.313 745.943 684.893 748.27C682.476 750.597 679.62 752.417 676.49 753.63C673.36 754.843 670.023 755.423 666.666 755.333Z" fill="currentColor"/>
            <path d="M666.666 755.333H138C131.37 755.333 125.011 752.7 120.322 748.01C115.634 743.323 113 736.963 113 730.333C113 723.703 115.634 717.343 120.322 712.657C125.011 707.967 131.37 705.333 138 705.333H666.666C673.296 705.333 679.656 707.967 684.343 712.657C689.033 717.343 691.666 723.703 691.666 730.333C691.666 736.963 689.033 743.323 684.343 748.01C679.656 752.7 673.296 755.333 666.666 755.333Z" fill="currentColor"/>
            </svg>

          </SvgIcon>
        );
      case 'heart':
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z"/>
            </svg>
          </SvgIcon>
        );
      case 'star':
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"/>
            </svg>
          </SvgIcon>
        );
      case 'music':
        return <MusicNoteIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'location':
        return <LocationOnIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'cake':
        return <CakeIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      case 'chat':
        return <ChatIcon sx={{ fontSize: 18, opacity: 0.8 }} />;
      default:
        
        return (
          <SvgIcon sx={{ fontSize: 18, opacity: 0.8 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
            </svg>
          </SvgIcon>
        );
    }
  };

  
  const StatusIcon = getIconByName(parsedStatus.iconName);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        delay: 0.2
      }}
      style={{
        position: 'absolute',
        left: '100%',
        top: '60%',
        zIndex: 10
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'transparent',
          filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.2))`,
          maxWidth: '200px',
          transform: 'translateX(10px)',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: -8,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 14px 14px 0',
            borderColor: `transparent ${statusColor || '#D0BCFF'} transparent transparent`,
            transform: 'rotate(40deg)',
            filter: 'drop-shadow(-3px 2px 2px rgba(0,0,0,0.1))',
            zIndex: 0
          }
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${statusColor || '#D0BCFF'} 0%, ${gradientColor} 100%)`,
            color: textColor,
            padding: '8px 12px',
            borderRadius: '18px',
            fontSize: '14px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            boxShadow: `inset 0 0 10px rgba(255,255,255,0.15), 
                        0 1px 1px rgba(0,0,0,0.1),
                        0 4px 10px rgba(0,0,0,0.15)`,
            backdropFilter: 'blur(4px)',
            border: `1px solid ${statusColor === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            position: 'relative'
          }}
        >
          {StatusIcon}
          <Box 
            sx={{ 
              overflow: 'hidden',
              maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
            }}
          >
            <Box
              className="scrolling-text"
              sx={{
                whiteSpace: 'nowrap',
                display: 'inline-block',
                animation: parsedStatus.text.length > 15 ? 'scrollText 10s linear infinite' : 'none',
                '@keyframes scrollText': {
                  '0%': { transform: 'translateX(0%)' },
                  '25%': { transform: 'translateX(0%)' },
                  '75%': { transform: parsedStatus.text.length > 15 ? 'translateX(-50%)' : 'translateX(0%)' },
                  '100%': { transform: 'translateX(0%)' }
                },
                '&::after': parsedStatus.text.length > 15 ? {
                  content: `" • ${parsedStatus.text} • "`,
                  paddingLeft: '10px'
                } : {}
              }}
            >
              {parsedStatus.text}
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};


const requireAuth = (user, isAuthenticated, navigate) => {
  if (!isAuthenticated || !user) {
    
    navigate('/login', { 
      state: { 
        from: window.location.pathname,
        message: 'Для выполнения этого действия необходима авторизация'
      } 
    });
    return false;
  }
  return true;
};


const getLighterColor = (hexColor, factor = 0.3) => {
  if (!hexColor || hexColor === 'transparent' || hexColor.startsWith('rgba')) {
    return hexColor;
  }
  
  
  const hex = hexColor.replace('#', '');
  
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  
  const lighter = (component) => Math.min(255, Math.floor(component + (255 - component) * factor));
  
  
  return `#${lighter(r).toString(16).padStart(2, '0')}${lighter(g).toString(16).padStart(2, '0')}${lighter(b).toString(16).padStart(2, '0')}`;
};


const SubscriptionBadge = ({ duration, subscriptionDate, subscriptionType }) => {
  const { t } = useLanguage();
  
  if (!duration || duration < 1 || subscriptionType !== 'ultimate') return null;
  
  console.log(`SubscriptionBadge: duration=${duration}, type=${subscriptionType}`); 
  
  
  let badgeType = 'bronze'; 
  if (duration >= 6) {
    badgeType = 'diamond';
  } else if (duration >= 3) {
    badgeType = 'gold';
  } else if (duration >= 2) {
    badgeType = 'silver';
  }
  
  console.log(`SubscriptionBadge: selected badge type=${badgeType}`); 
  
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const tooltipText = `${t('profile.subscription.subscriber')} • ${duration} ${t('profile.subscription.days_left')}`;
  
  return (
    <Tooltip title={tooltipText} arrow placement="top">
      <Box 
        component="img" 
        src={`/static/subs/${badgeType}.svg`}
        alt={`${badgeType} подписка`}
        sx={{ 
          width: 24, 
          height: 24, 
          ml: 0.5,
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.2)'
          }
        }} 
      />
    </Tooltip>
  );
};

const ProfilePage = () => {
  const { t } = useLanguage();
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [ownedUsernames, setOwnedUsernames] = useState([]);
  const [photos, setPhotos] = useState([]);  
  const [videos, setVideos] = useState([]);  
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [socials, setSocials] = useState([]);
  const [page, setPage] = useState(1);
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const { themeSettings, setProfileBackground, clearProfileBackground } = useContext(ThemeSettingsContext);
  const [totalLikes, setTotalLikes] = useState(0);
  
  const [isOnline, setIsOnline] = useState(false);
  const [lastActive, setLastActive] = useState(null);
  
  const [fallbackAvatarUrl, setFallbackAvatarUrl] = useState('');
  
  const [medals, setMedals] = useState([]);
  const [loadingMedals, setLoadingMedals] = useState(false);
  
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [usernameCardAnchor, setUsernameCardAnchor] = useState(null);
  const [usernameCardOpen, setUsernameCardOpen] = useState(false);
  

  const [userBanInfo, setUserBanInfo] = useState(null);
  

  const [isCurrentUserModerator, setIsCurrentUserModerator] = useState(false);
  
  
  const openLightbox = (imageUrl) => {
    console.log("Opening lightbox for image:", imageUrl);
    if (typeof imageUrl === 'string') {
      setCurrentImage(imageUrl);
      setLightboxIsOpen(true);
    } else {
      console.error("Invalid image URL provided to lightbox:", imageUrl);
    }
  };
  
  
  const closeLightbox = () => {
    setLightboxIsOpen(false);
  };
  
  
  const showNotification = (severity, message) => {
    setSnackbar({
      open: true,
      severity,
      message: message || t('profile.errors.load_failed')
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  

  
  const handleFollow = async () => {
    
    if (!requireAuth(currentUser, isAuthenticated, navigate)) {
      return;
    }
    
    try {
      const response = await axios.post('/api/profile/follow', {
        followed_id: user.id
      });
      
      if (response.data.success) {
        setFollowing(response.data.is_following);
        setFollowersCount(prev => response.data.is_following ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };
  
  const handlePostCreated = (newPost) => {
    showNotification('success', 'Пост успешно создан');
  };
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        console.log(`Fetching profile for username: ${username}`);
        
        const response = await axios.get(`/api/profile/${username}`);
        console.log("Profile API response:", response.data);
        
        
        console.log("Profile achievement data:", {
          rootAchievement: response.data.achievement_data,
          userAchievement: response.data.user?.achievement
        });
        
        
        if (response.data.user) {
          
          if (response.data.user.verification_status === undefined && response.data.verification) {
            response.data.user.verification_status = response.data.verification.status || null;
          }
          
          
          if (response.data.achievement) {
            response.data.user.achievement = response.data.achievement;
            console.log('Copied achievement data from root to user object:', response.data.achievement);
          }
          
          // Копируем connect_info из корневого объекта, если он есть
          if (response.data.connect_info) {
            response.data.user.connect_info = response.data.connect_info;
            console.log('Copied connect_info from root to user object:', response.data.connect_info);
          }
          
          setUser(response.data.user);
          
          
          if (response.data.user.total_likes !== undefined) {
            setTotalLikes(response.data.user.total_likes);
          }
          
          
          if (response.data.subscription) {
            response.data.user.subscription = response.data.subscription;
            console.log('Subscription data found:', response.data.subscription);
          } else if (response.data.user.subscription) {
            console.log('Subscription data found in user object:', response.data.user.subscription);
          } else {
            console.log('No subscription data found in API response');
            console.log('Full API response:', response.data);
          }
          
          
          
          if (response.data.user.photos) {
            
            const photosData = Array.isArray(response.data.user.photos) ? response.data.user.photos : [];
            setPhotos(photosData);
          } else {
            setPhotos([]);
          }
          
          if (response.data.user.videos) {
            
            const videosData = Array.isArray(response.data.user.videos) ? response.data.user.videos : [];
            setVideos(videosData);
          } else {
            setVideos([]);
          }
          
          
          if (response.data.user.followers_count !== undefined) {
            setFollowersCount(response.data.user.followers_count);
          }
          
          if (response.data.user.following_count !== undefined) {
            setFollowingCount(response.data.user.following_count);
          }
          
          
          if (response.data.user.is_following !== undefined) {
            setFollowing(response.data.user.is_following);
          } else if (response.data.is_following !== undefined) {
            setFollowing(response.data.is_following);
          }
          
          if (response.data.user.posts_count !== undefined) {
            setPostsCount(response.data.user.posts_count);
          } else if (response.data.posts_count !== undefined) {
            setPostsCount(response.data.posts_count);
          }
          
          
          if (response.data.socials) {
            setSocials(response.data.socials);
          }
          
          try {
            const usernamesResponse = await axios.get(`/api/username/purchased/${response.data.user.id}`);
            if (usernamesResponse.data.success) {
              const otherUsernames = usernamesResponse.data.usernames
                .filter(item => !item.is_active && item.username !== response.data.user.username)
                .map(item => item.username);
              
              setOwnedUsernames(otherUsernames);
            }
          } catch (error) {
            console.error('Error fetching owned usernames:', error);
            setOwnedUsernames([]);
          }
          

          if (response.data.user.ban || response.data.ban) {
            setUserBanInfo(response.data.user.ban || response.data.ban);
          } else {
            setUserBanInfo(null);
          }
          

          if (response.data.current_user_is_moderator !== undefined) {
            setIsCurrentUserModerator(response.data.current_user_is_moderator);
          }
        } else {
          console.error('User data not found in response', response.data);
          setUser(null); 
        }
      } catch (error) {
        console.error('Error fetching profile', error);
        if (error.response && error.response.status === 404) {
          
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    
    fetchUserProfile();
  }, [username, setLoading, setUser, setFollowersCount, setFollowingCount, setFollowing, setPostsCount, setSocials, setTotalLikes]);
  
  
  useEffect(() => {
    if (!currentUser) {
      setUser(null);
    }
  }, [currentUser]);

  
  useEffect(() => {
    
    if (user && user.id) {
      setLoadingFollowers(true);
      setLoadingFollowing(true);
      setLoadingFriends(true);
      
      console.log(`Загрузка подписчиков для пользователя ${user.id}`);
      
      axios.get(`/api/profile/${user.id}/followers`)
        .then(response => {
          console.log('Ответ API подписчиков:', response.data);
          if (response.data && response.data.followers) {
            
            const followersData = Array.isArray(response.data.followers) 
              ? response.data.followers.filter(f => f && typeof f === 'object') 
              : [];
            console.log(`Получено ${followersData.length} подписчиков`);
            setFollowers(followersData);
          } else {
            
            console.warn('Нет данных о подписчиках в ответе API');
            setFollowers([]);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки подписчиков:', error);
          setFollowers([]); 
        })
        .finally(() => {
          setLoadingFollowers(false);
        });
      
      console.log(`Загрузка подписок для пользователя ${user.id}`);
      
      axios.get(`/api/profile/${user.id}/following`)
        .then(response => {
          console.log('Ответ API подписок:', response.data);
          if (response.data && response.data.following) {
            
            const followingData = Array.isArray(response.data.following) 
              ? response.data.following.filter(f => f && typeof f === 'object') 
              : [];
            console.log(`Получено ${followingData.length} подписок`);
            setFollowingList(followingData);
          } else {
            
            console.warn('Нет данных о подписках в ответе API');
            setFollowingList([]);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки подписок:', error);
          setFollowingList([]); 
        })
        .finally(() => {
          setLoadingFollowing(false);
        });
        
      console.log(`Загрузка друзей для пользователя ${user.id}`);
      
      axios.get(`/api/profile/${user.id}/friends`)
        .then(response => {
          console.log('Ответ API друзей:', response.data);
          if (response.data && response.data.friends) {
            
            const friendsData = Array.isArray(response.data.friends) 
              ? response.data.friends.filter(f => f && typeof f === 'object') 
              : [];
            console.log(`Получено ${friendsData.length} друзей`);
            setFriends(friendsData);
          } else {
            
            console.warn('Нет данных о друзьях в ответе API');
            setFriends([]);
          }
        })
        .catch(error => {
          console.error('Ошибка загрузки друзей:', error);
          setFriends([]); 
        })
        .finally(() => {
          setLoadingFriends(false);
        });
    }
  }, [user]);

  
  useEffect(() => {
    const fetchTotalLikes = async () => {
      try {
        if (user && user.id) {
          const response = await axios.get(`/api/profile/${user.id}/stats`);
          if (response.data && response.data.total_likes !== undefined) {
            setTotalLikes(response.data.total_likes);
          } else {
            setTotalLikes(0);
          }
        }
      } catch (error) {
        console.error('Error fetching total likes:', error);
        setTotalLikes(0);
      }
    };
    
    if (user && user.id) {
      fetchTotalLikes();
    }
  }, [user]);

  
  const fetchOnlineStatus = async () => {
    try {
      if (!username) return;
      
      const response = await axios.get(`/api/profile/${username}/online_status`);
      
      if (response.data.success) {
        setIsOnline(response.data.is_online);
        setLastActive(response.data.last_active);
      }
    } catch (error) {
      console.error('Error fetching online status:', error);
    }
  };
  
  
  useEffect(() => {
    if (username) {
      fetchOnlineStatus();
    }
  }, [username]);

  
  useEffect(() => {
    if (user) {
      console.log('User state after setting:', {
        name: user.name,
        achievement: user.achievement,
        verification_status: user.verification_status
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      fetchUserMedals();
    }
  }, [user]);

  const fetchUserMedals = async () => {
    try {
      setLoadingMedals(true);
      const response = await axios.get(`/api/profile/${user.id}/medals`);
      if (response.data.success) {
        setMedals(response.data.medals || []);
      } else {
        console.error('Error fetching medals:', response.data.error);
        setMedals([]);
      }
    } catch (error) {
      console.error('Error fetching medals:', error);
      setMedals([]);
    } finally {
      setLoadingMedals(false);
    }
  };


  const handleUsernameClick = (event, username) => {
    event.preventDefault();
    setSelectedUsername(username);
    setUsernameCardOpen(true);
  };
  
  const handleCloseUsernameCard = () => {
    setUsernameCardOpen(false);
  };

  useEffect(() => {
    if (user && user.profile_background_url) {
      setProfileBackground(user.profile_background_url);
      return () => clearProfileBackground();
    } else {
      clearProfileBackground();
    }
  }, [user && user.profile_background_url]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="h5">Пользователь не найден</Typography>
        <Button 
            component={Link} 
            to="/" 
          variant="contained" 
          color="primary" 
            sx={{ mt: 2, borderRadius: 20, textTransform: 'none' }}
        >
          Вернуться на главную
        </Button>
        </Box>
      </Container>
    );
  }
  
  const isCurrentUser = currentUser && currentUser.username === user.username;
  
  const WallPostsTab = ({ userId }) => {
    return (
      <WallFeed userId={userId} />
    );
  };

  const PostsTab = () => {
    return (
      <PostsFeed userId={user?.id} statusColor={user?.status_color} />
    );
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        pt: 0, 
        pb: 4, 
        px: { xs: 0.5, sm: 1 },
        width: '100%',
        marginRight: 'auto',
        marginLeft: '0!important',
        paddingTop: '24px',
        paddingBottom: '40px',
        paddingLeft: '0',
        paddingRight: '0',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Grid 
        container 
        spacing={0.5}
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          flexWrap: { xs: 'nowrap', md: 'nowrap' }
        }}
      >
        
        <Grid item xs={12} md={5} sx={{ 
          position: { xs: 'static', md: 'sticky' },
          top: '60px',
          height: 'fit-content',
          zIndex: 2
        }}>
          
          <Paper sx={{ 
            p: 0, 
            borderRadius: '16px', 
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            mb: '5px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 2
          }}>
            
            {/* Banner section */}
            {user?.profile_id !== 2 ? (
              
              user?.banner_url ? (
                <Box sx={{ 
                  width: '100%',
                  height: { xs: 150, sm: 200 },
                  backgroundImage: `url(${user.banner_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1
                  }
                }}></Box>
              ) : (
                <Box sx={{ 
                  width: '100%',
                  height: { xs: 100, sm: 120 },
                  position: 'relative',

                }}></Box>
              )
            ) : (
              
              null
            )}
            
            <Box sx={{ px: 3, pb: 3, pt: 0, mt: user?.profile_id === 2 ? 2 : -7 }}>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                
                <Box sx={{ position: 'relative' }}>
                  <Tooltip title="Открыть аватар" arrow placement="top">
                    <Avatar 
                      src={user?.avatar_url} 
                      alt={user?.name}
                      onClick={() => {
                        const imageUrl = user?.avatar_url || fallbackAvatarUrl;
                        if (imageUrl) openLightbox(imageUrl);
                      }}
                      sx={{ 
                        width: { xs: 110, sm: 130 }, 
                        height: { xs: 110, sm: 130 }, 
                        border: (user?.status_color && user?.status_text && user?.subscription) 
                          ? `4px solid ${user.status_color}` 
                          : user?.subscription 
                            ? `4px solid ${user.subscription.type === 'premium' ? 'rgba(186, 104, 200)' : user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255)' : user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255)' : 'rgba(66, 165, 245)'}` 
                          : theme => theme.palette.mode === 'dark'
                              ? '4px solid #121212'
                              : '4px solid #ffffff',
                        boxShadow: (user?.status_color && user?.status_text && user.subscription) 
                          ? `0 0 15px ${user.status_color}80` 
                          : user?.subscription 
                            ? (user.subscription.type === 'premium' ? '0 0 15px rgba(186, 104, 200, 0.5)' : user.subscription.type === 'pick-me' ? '0 0 15px rgba(208, 188, 255, 0.5)' : user.subscription.type === 'ultimate' ? '0 0 15px rgba(124, 77, 255, 0.5)' : '0 0 15px rgba(66, 165, 245, 0.5)') 
                            : '0 8px 20px rgba(0, 0, 0, 0.25)',
                        bgcolor: 'primary.dark',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow: (user?.status_color && user?.status_text && user.subscription) 
                            ? `0 0 20px ${user.status_color}B3` 
                            : user?.subscription 
                              ? (user.subscription.type === 'premium' ? '0 0 20px rgba(186, 104, 200, 0.7)' : user.subscription.type === 'pick-me' ? '0 0 20px rgba(208, 188, 255, 0.7)' : user.subscription.type === 'ultimate' ? '0 0 20px rgba(124, 77, 255, 0.7)' : '0 0 20px rgba(66, 165, 245, 0.7)') 
                              : '0 10px 25px rgba(0, 0, 0, 0.35)',
                          border: (user?.status_color && user?.status_text && user.subscription) 
                            ? `4px solid ${user.status_color}CC` 
                            : user?.subscription 
                              ? `4px solid ${user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.8)' : user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.8)' : user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.8)' : 'rgba(66, 165, 245, 0.8)'}`
                              : '4px solid rgba(208, 188, 255, 0.4)'
                        }
                      }}
                      onError={(e) => {
                        if (user?.id) {
                          const fallbackSrc = `/static/uploads/avatar/${user.id}/${user.photo || 'default.png'}`;
                          e.currentTarget.src = fallbackSrc;
                          setFallbackAvatarUrl(fallbackSrc);
                        }
                      }}
                    />
                  </Tooltip>
                  
                  
                  {isOnline && user?.subscription?.type !== 'channel' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: '#4caf50',
                        border: theme => theme.palette.mode === 'dark'
                          ? '2px solid #121212'
                          : '2px solid #ffffff',
                        bottom: 5,
                        right: 15,
                        boxShadow: '0 0 8px rgba(76, 175, 80, 0.9)',
                        zIndex: 2,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)'
                          },
                          '70%': {
                            boxShadow: '0 0 0 6px rgba(76, 175, 80, 0)'
                          },
                          '100%': {
                            boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)'
                          }
                        }
                      }}
                    />
                  )}
                  
                  
                  <UserStatus statusText={user?.status_text} statusColor={user?.status_color} />
                </Box>
                

              </Box>
              
              
              <Box sx={{ mt: 2, whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: user?.profile_id === 2 ? '#fff' : 'inherit',
                        textShadow: user?.profile_id === 2 ? '0 1px 3px rgba(0,0,0,0.7)' : 'none',
                        background: user?.profile_id === 2 ? 'none' : theme => theme.palette.mode === 'dark' 
                          ? 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%)'
                          : 'linear-gradient(90deg, #000 0%, rgba(0,0,0,0.8) 100%)',
                        WebkitBackgroundClip: user?.profile_id === 2 ? 'unset' : 'text',
                        WebkitTextFillColor: user?.profile_id === 2 ? 'unset' : 'transparent'
                      }}>
                      {user?.name || 'Пользователь'}
                    </Typography>
                    <VerificationBadge status={user?.verification_status} size="small" />
                    
                    {/* Добавляем значок подписки, если у пользователя есть подписка */}
                    {user?.subscription && user.subscription.total_duration_months > 0 && (
                      <SubscriptionBadge 
                        duration={user.subscription.total_duration_months} 
                        subscriptionDate={user.subscription.subscription_date}
                        subscriptionType={user.subscription.type}
                      />
                    )}

                    {user?.achievement && (
                      <Box 
                        component="img" 
                        sx={{ 
                          width: 'auto', 
                          height: 25, 
                          ml: 0.5
                        }} 
                        src={`/static/images/bages/${user.achievement.image_path}`} 
                        alt={user.achievement.bage}
                        onError={(e) => {
                          console.error("Achievement badge failed to load:", e);
                          if (e.target && e.target instanceof HTMLImageElement) {
                            e.target.style.display = 'none';
                          }
                        }}
                      />
                    )}
                  </Box>


                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, flexWrap: 'wrap', maxWidth: '100%' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      color: user?.profile_id === 2 ? 'rgba(255,255,255,0.9)' : theme => theme.palette.text.secondary,
                      textShadow: user?.profile_id === 2 ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      background: user?.profile_id === 2 
                        ? 'rgba(0,0,0,0.3)'
                        : theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 4,
                      border: user?.profile_id === 2
                        ? '1px solid rgba(255,255,255,0.15)'
                        : theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    @{user?.username || 'username'}
                  </Typography>

                  {user?.connect_info && user.connect_info.length > 0 && (
                    <>
                      <LinkRoundedIcon 
                        sx={theme => ({ 
                          width: '2em',
                          height: '2em',
                          fontSize: 16,
                          color: user?.profile_id === 2 ? 'rgba(255,255,255,0.9)' : theme.palette.text.secondary
                        })} 
                      />
                      <Typography
                        variant="body2"
                        component={Link}
                        to={`/profile/${user.connect_info[0].username}`}
                        sx={theme => ({
                          fontWeight: 500,
                          color: user?.profile_id === 2 ? 'rgba(255,255,255,0.9)' : theme.palette.text.secondary,
                          textShadow: user?.profile_id === 2 ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          background: user?.profile_id === 2
                            ? 'rgba(0,0,0,0.3)'
                            : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                          px: 1.2,
                          py: 0.4,
                          borderRadius: 4,
                          border: user?.profile_id === 2
                            ? '1px solid rgba(255,255,255,0.15)'
                            : theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'none',
                            background: user?.profile_id === 2
                              ? 'rgba(0,0,0,0.4)'
                              : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                          }
                        })}
                      >
                        @{user.connect_info[0].username}
                      </Typography>
                    </>
                  )}

                  {userBanInfo ? (
                    <Tooltip 
                      title={
                        <Box sx={{ p: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Аккаунт заблокирован</Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>Причина: {userBanInfo.reason}</Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>До: {userBanInfo.end_date}</Typography>
                          {userBanInfo.remaining_days > 0 && (
                            <Typography variant="body2">
                              Осталось дней: {userBanInfo.remaining_days}
                            </Typography>
                          )}
                        </Box>
                      } 
                      arrow 
                      placement="top"
                    >
                      <Typography 
                        variant="caption" 
                        sx={{
                          display: 'flex', 
                          alignItems: 'center',
                          color: '#fff',
                          fontWeight: 500,
                          background: 'rgba(211, 47, 47, 0.7)', 
                          px: 1,
                          py: 0.1,
                          borderRadius: 4,
                          border: '1px solid rgba(211, 47, 47, 0.8)',
                          boxShadow: '0 0 8px rgba(211, 47, 47, 0.5)',
                          '&:hover': {
                            background: 'rgba(211, 47, 47, 0.8)',
                          },
                          animation: 'pulse-red 2s infinite',
                          '@keyframes pulse-red': {
                            '0%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.4)' },
                            '70%': { boxShadow: '0 0 0 6px rgba(211, 47, 47, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)' }
                          }
                        }}
                      >
                        <BlockIcon sx={{ fontSize: 14, mr: 0.5, opacity: 0.9 }} />
                        <Box component="span">{t('profile.ban.banned')}</Box>
                      </Typography>
                    </Tooltip>
                  ) : null}

                  {user?.scam === 1 && (
                    <Tooltip 
                      title={t('profile.ban.scam')} 
                      arrow 
                      placement="top"
                    >
                      <Typography 
                        variant="caption" 
                        sx={{
                          display: 'flex', 
                          alignItems: 'center',
                          color: '#fff',
                          fontWeight: 500,
                          background: 'rgba(211, 47, 47, 0.6)',
                          px: 1,
                          py: 0.1,
                          borderRadius: 4,
                          border: '1px solid rgba(211, 47, 47, 0.8)',
                          boxShadow: '0 0 8px rgba(211, 47, 47, 0.5)',
                          '&:hover': {
                            background: 'rgba(211, 47, 47, 0.7)',
                          },
                          animation: 'pulse-red 2s infinite',
                          '@keyframes pulse-red': {
                            '0%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.4)' },
                            '70%': { boxShadow: '0 0 0 6px rgba(211, 47, 47, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)' }
                          }
                        }}
                      >
                        <WarningIcon sx={{ fontSize: 14, mr: 0.5, opacity: 0.9 }} />
                        <Box component="span">{t('profile.ban.scam')}</Box>
                      </Typography>
                    </Tooltip>
                  )}
                  
                  {user?.subscription && (
                    user.subscription.type === 'channel' ? (
                      <Chip
                        icon={<ChatIcon fontSize="small" />}
                        label={t('profile.subscription.channel')}
                        size="small"
                        sx={{
                          bgcolor: (user.status_color) 
                            ? `${user.status_color}26` 
                            : theme => theme.palette.mode === 'dark'
                              ? 'rgba(208, 188, 255, 0.15)' 
                              : 'rgba(124, 77, 255, 0.15)',
                          color: (user.status_color) 
                            ? user.status_color 
                            : theme => theme.palette.mode === 'dark'
                              ? '#d0bcff'
                              : '#7c4dff',
                          fontWeight: 'bold',
                          border: '1px solid',
                          borderColor: (user.status_color) 
                            ? `${user.status_color}4D` 
                            : theme => theme.palette.mode === 'dark'
                              ? 'rgba(208, 188, 255, 0.3)'
                              : 'rgba(124, 77, 255, 0.3)',
                          '& .MuiChip-icon': {
                            color: 'inherit'
                          },
                          py: 0.25, 
                          height: 'auto',
                          animation: 'pulse-light 2s infinite',
                          '@keyframes pulse-light': {
                            '0%': {
                              boxShadow: (user.status_color) ? 
                                `0 0 0 0 ${user.status_color}66` : 
                                '0 0 0 0 rgba(124, 77, 255, 0.4)'
                            },
                            '70%': {
                              boxShadow: (user.status_color) ? 
                                `0 0 0 6px ${user.status_color}00` : 
                                '0 0 0 6px rgba(124, 77, 255, 0)'
                            },
                            '100%': {
                              boxShadow: (user.status_color) ? 
                                `0 0 0 0 ${user.status_color}00` : 
                                '0 0 0 0 rgba(124, 77, 255, 0)'
                            }
                          }
                        }}
                      />
                    ) : (
                      <Tooltip title={t('profile.subscription.active', { type: user.subscription.type === 'pick-me' ? t('profile.subscription.pick_me') : user.subscription.type.charAt(0).toUpperCase() + user.subscription.type.slice(1) })}>
                        <Chip
                          icon={<DiamondIcon fontSize="small" />}
                          label={user.subscription.type === 'pick-me' ? t('profile.subscription.pick_me') : 
                                user.subscription.type.charAt(0).toUpperCase() + user.subscription.type.slice(1)}
                          size="small"
                          sx={{
                            bgcolor: user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.15)' : 
                                    user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.15)' :
                                    user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.15)' : 
                                    'rgba(66, 165, 245, 0.15)',
                            color: user.subscription.type === 'premium' ? '#ba68c8' : 
                                  user.subscription.type === 'ultimate' ? '#7c4dff' : 
                                  user.subscription.type === 'pick-me' ? 'rgb(208, 188, 255)' :
                                  '#42a5f5',
                            fontWeight: 'bold',
                            border: '1px solid',
                            borderColor: user.subscription.type === 'premium' ? 'rgba(186, 104, 200, 0.3)' : 
                                        user.subscription.type === 'ultimate' ? 'rgba(124, 77, 255, 0.3)' :
                                        user.subscription.type === 'pick-me' ? 'rgba(208, 188, 255, 0.3)' :
                                        'rgba(66, 165, 245, 0.3)',
                            '& .MuiChip-icon': {
                              color: 'inherit'
                            },
                            py: 0.25, 
                            height: 'auto',
                            animation: 'pulse-light 2s infinite',
                            '@keyframes pulse-light': {
                              '0%': {
                                boxShadow: (user.status_color && user.status_text) ? 
                                  `0 0 0 0 ${user.status_color}66` : 
                                  '0 0 0 0 rgba(124, 77, 255, 0.4)'
                              },
                              '70%': {
                                boxShadow: (user.status_color && user.status_text) ? 
                                  `0 0 0 6px ${user.status_color}00` : 
                                  '0 0 0 6px rgba(124, 77, 255, 0)'
                              },
                              '100%': {
                                boxShadow: (user.status_color && user.status_text) ? 
                                  `0 0 0 0 ${user.status_color}00` : 
                                  '0 0 0 0 rgba(124, 77, 255, 0)'
                              }
                            }
                          }}
                        />
                      </Tooltip>
                    )
                  )}
                  
                </Box>
                  
                {ownedUsernames.length > 0 && (
                  <Box sx={{ 
                    display: 'flex',
                    mt: 1,
                    width: '100%'
                  }}>
                    <Box 
                      sx={{ 
                        color: theme => theme.palette.text.secondary,
                        backgroundColor: (user.status_color && user.status_text && user.subscription) ? 
                          `${user.status_color}1A` : 
                          theme => theme.palette.mode === 'dark' ? 'rgba(208, 188, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                        px: 1.2,
                        py: 0.4,
                        borderRadius: 4,
                        border: (user.status_color && user.status_text && user.subscription) ? 
                          `1px solid ${user.status_color}33` : 
                          theme => theme.palette.mode === 'dark' ? '1px solid rgba(208, 188, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                        fontSize: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        maxWidth: '100%',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Typography variant="caption" sx={{ color: user?.status_color ? getLighterColor(user.status_color) : theme => theme.palette.text.secondary, mr: 0.5 }}>
                        {t('profile.also_follows', { count: ownedUsernames.length })}
                      </Typography>
                      {ownedUsernames.slice(0, 3).map((usernameItem, idx) => (
                        <React.Fragment key={usernameItem}>
                          <Typography 
                            variant="caption" 
                            component="span" 
                            sx={{ 
                              color: (user.status_color && user.status_text && user.subscription) ? 
                                user.status_color : 
                                theme => theme.palette.mode === 'dark' ? '#d0bcff' : '#7c4dff',
                              fontWeight: 500,
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                            onClick={(e) => handleUsernameClick(e, usernameItem)}
                          >
                            @{usernameItem}
                          </Typography>
                          {idx < Math.min(ownedUsernames.length, 3) - 1 && (
                            <Typography variant="caption" component="span" sx={{ mx: 0.5, color: theme => theme.palette.text.disabled }}>
                              ,
                            </Typography>
                          )}
                        </React.Fragment>
                      ))}
                      {ownedUsernames.length > 3 && (
                        <Typography variant="caption" component="span" sx={{ ml: 0.5, color: theme => theme.palette.text.disabled }}>
                          {t('profile.and_more', { count: ownedUsernames.length - 3 })}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                
                {userBanInfo && (isCurrentUserModerator || (currentUser && currentUser.id === 3)) && (
                  <Box sx={{ 
                    mt: 2,
                    p: 1.5,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(211, 47, 47, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(211, 47, 47, 0.8)',
                    boxShadow: '0 0 15px rgba(211, 47, 47, 0.4)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5
                  }}>
                    <WarningIcon sx={{ fontSize: 22, mt: 0.5, color: 'white' }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {t('profile.ban.banned')}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)' }}>
                        {t('profile.ban.reason', { reason: userBanInfo.reason })}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)' }}>
                        {t('profile.ban.ends', { endDate: userBanInfo.end_date })}
                        {userBanInfo.remaining_days > 0 && ` (${t('profile.ban.days_left', { days: userBanInfo.remaining_days })})`}
                      </Typography>
                      
                      {currentUser && currentUser.id === 3 && (
                        <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed rgba(255, 255, 255, 0.4)' }}>
                          <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>
                            {t('profile.ban.auto_ban', { admin: userBanInfo.admin ? `${userBanInfo.admin.name} (@${userBanInfo.admin.username})` : t('profile.ban.admin') })}
                          </Typography>
                          {userBanInfo.start_date && (
                            <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>
                              {t('profile.ban.start', { startDate: userBanInfo.start_date })}
                            </Typography>
                          )}
                          {userBanInfo.details && (
                            <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>
                              {t('profile.ban.details', { details: userBanInfo.details })}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
                
                {/* Блок с информацией о пользователе */}
                {user?.about && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1,
                      lineHeight: 1.5,
                      color: user?.status_color ? getLighterColor(user.status_color) : theme => theme.palette.text.secondary,
                      p: 1.5,
                      borderRadius: 1,
                      background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      backdropFilter: 'blur(10px)',
                      border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal'
                    }}
                  >
                    {user.about}
                  </Typography>

                )}
                
                
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: user?.subscription?.type === 'channel' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
                  gap: 1, 
                  mt: 1 
                }}>
                  
                  <Paper sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    textAlign: 'center',
                    background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                    backdropFilter: 'blur(5px)',
                    border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: (user.status_color && user.status_text && user.subscription) ? 
                          user.status_color : 
                          'primary.main'
                      }}
                    >
                      {postsCount || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: user?.status_color ? getLighterColor(user.status_color) : theme => theme.palette.text.secondary
                    }}>
                      {t('profile.stats.posts')}
                    </Typography>
                  </Paper>
                  
                  
                  <Paper 
                    component={Link}
                    to={`/profile/${user?.username}/followers`}
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      textAlign: 'center',
                      background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                      backdropFilter: 'blur(5px)',
                      border: (user.status_color && user.status_text && user.subscription) ? 
                        `1px solid ${user.status_color}33` : 
                        theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                        transform: 'translateY(-2px)',
                        boxShadow: (user.status_color && user.status_text && user.subscription) ? 
                          `0 4px 15px ${user.status_color}33` : 
                          '0 4px 15px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: (user.status_color && user.status_text && user.subscription) ? 
                          user.status_color : 
                          'primary.main'
                      }}
                    >
                      {followersCount || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: user?.status_color ? getLighterColor(user.status_color) : theme => theme.palette.text.secondary
                    }}>
                      {t('profile.stats.followers')}
                    </Typography>
                  </Paper>
                  
                  
                  {(!user?.subscription || user.subscription.type !== 'channel') && (
                    <Paper 
                      component={Link}
                      to={`/profile/${user?.username}/following`}
                      sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        textAlign: 'center',
                        background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        backdropFilter: 'blur(5px)',
                        border: (user.status_color && user.status_text && user.subscription) ? 
                          `1px solid ${user.status_color}33` : 
                          theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                          transform: 'translateY(-2px)',
                          boxShadow: (user.status_color && user.status_text && user.subscription) ? 
                            `0 4px 15px ${user.status_color}33` : 
                            '0 4px 15px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: (user.status_color && user.status_text && user.subscription) ? 
                            user.status_color : 
                            'primary.main'
                        }}
                      >
                        {followingCount || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: user?.status_color ? getLighterColor(user.status_color) : theme => theme.palette.text.secondary
                      }}>
                        {t('profile.stats.following')}
                      </Typography>
                    </Paper>
                  )}
                </Box>
                
                
                {(!user?.subscription || user.subscription.type !== 'channel') && (
                  <Grid container spacing={1} sx={{ mt: 1 }}> 
                    
                    
                    {(!user?.subscription || user.subscription.type !== 'channel') ? (
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {t('profile.followers')}
                          </Typography>
                          
                          
                          {loadingFriends ? (
                            <CircularProgress size={20} />
                          ) : friends && friends.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {friends.slice(0, 3).map(friend => (
                                <Tooltip key={friend.id} title={friend.name} arrow>
                                  <Avatar 
                                    src={friend.avatar_url} 
                                    alt={friend.name}
                                    component={Link}
                                    to={`/profile/${friend.username}`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      border: (user.status_color && user.status_text && user.subscription) ? 
                                        `1px solid ${user.status_color}` : 
                                        '1px solid #D0BCFF', 
                                      flexShrink: 0 
                                    }}
                                    onError={(e) => {
                                      console.error(`Failed to load friend avatar for ${friend.username}`);
                                      if (friend.id) {
                                        e.target.src = `/static/uploads/avatar/${friend.id}/${friend.photo || 'avatar.png'}`;
                                      }
                                    }}
                                  />
                                </Tooltip>
                              ))}
                              {user?.friends_count > 3 && (
                                <Tooltip title={t('profile.show_all_followers')}>
                                  <Avatar 
                                    component={Link}
                                    to={`/profile/${user?.username}/followers`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      bgcolor: (user.status_color && user.status_text && user.subscription) ? 
                                        `${user.status_color}26` : 
                                        'rgba(208, 188, 255, 0.15)', 
                                      fontSize: '0.75rem',
                                      color: (user.status_color && user.status_text && user.subscription) ? 
                                        user.status_color : 
                                        '#D0BCFF',
                                      flexShrink: 0 
                                    }}
                                  >
                                    +{user?.friends_count - 3}
                                  </Avatar>
                                </Tooltip>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              {t('profile.no_followers')}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    ) : (
                      
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {t('profile.followers')}
                          </Typography>
                          <Typography variant="body2">
                            {followersCount || 0}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    
                    
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                          {t('profile.subscriptions')}
                        </Typography>
                        
                        
                        {user?.subscription && user.subscription.type === 'channel' ? (
                          <Typography variant="body2">
                            {followingCount || 0}
                          </Typography>
                        ) : (
                          loadingFollowing ? (
                            <CircularProgress size={20} />
                          ) : followingList.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {followingList.slice(0, 3).map(following => (
                                <Tooltip key={following.id} title={following.name} arrow>
                                  <Avatar 
                                    src={following.avatar_url} 
                                    alt={following.name}
                                    component={Link}
                                    to={`/profile/${following.username}`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      border: (user.status_color && user.status_text && user.subscription) ? 
                                        `1px solid ${user.status_color}` : 
                                        '1px solid #D0BCFF', 
                                      flexShrink: 0 
                                    }}
                                    onError={(e) => {
                                      console.error(`Failed to load following avatar for ${following.username}`);
                                      if (following.id) {
                                        e.target.src = `/static/uploads/avatar/${following.id}/${following.photo || 'avatar.png'}`;
                                      }
                                    }}
                                  />
                                </Tooltip>
                              ))}
                              {followingCount > 3 && (
                                <Tooltip title={t('profile.show_all_following')}>
                                  <Avatar 
                                    component={Link}
                                    to={`/profile/${user?.username}/following`}
                                    sx={{ 
                                      width: 32, 
                                      height: 32, 
                                      bgcolor: (user.status_color && user.status_text && user.subscription) ? 
                                        `${user.status_color}26` : 
                                        'rgba(208, 188, 255, 0.15)', 
                                      fontSize: '0.75rem',
                                      color: (user.status_color && user.status_text && user.subscription) ? 
                                        user.status_color : 
                                        '#D0BCFF',
                                      flexShrink: 0 
                                    }}
                                  >
                                    +{followingCount - 3}
                                  </Avatar>
                                </Tooltip>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              {t('profile.no_following')}
                            </Typography>
                          )
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                )}
                
                
                {socials && socials.length > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    {socials.map((social, index) => (
                      <Tooltip key={index} title={social.title || social.name} arrow>
                        <IconButton 
                          component="a" 
                          href={social.url || social.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          size="small"
                          sx={{ 
                            color: (user.status_color && user.status_text && user.subscription) ? 
                              user.status_color :
                              social.color || 'primary.main',
                            padding: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.07)',
                            '&:hover': {
                              bgcolor: (user.status_color && user.status_text && user.subscription) ? 
                                `${user.status_color}15` : 
                                'rgba(255, 255, 255, 0.12)',
                              transform: 'translateY(-2px)',
                              transition: 'transform 0.2s'
                            }
                          }}
                        >
                          {social.icon ? (
                            <Box component="img" src={social.icon} alt={social.title || social.name} sx={{ width: 20, height: 20 }} />
                          ) : (
                            <Box component="div" sx={{ width: 20, height: 20, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {social.name?.toLowerCase().includes('instagram') ? 
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                              : social.name?.toLowerCase().includes('facebook') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5 1.583-5 4.615v3.385z"/></svg>
                              : social.name?.toLowerCase().includes('twitter') || social.name?.toLowerCase().includes('x') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                              : social.name?.toLowerCase().includes('vk') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"/></svg>
                              : social.name?.toLowerCase().includes('youtube') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                              : social.name?.toLowerCase().includes('telegram') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19l-9.5 5.97-4.1-1.34c-.88-.28-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
                              : social.name?.toLowerCase().includes('element') ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 12.7 12.7" fill="currentColor">
                                  <path d="M 4.9717204,2.3834823 A 5.0230292,5.0230292 0 0 0 0.59994682,7.3615548 5.0230292,5.0230292 0 0 0 5.6228197,12.384429 5.0230292,5.0230292 0 0 0 10.645693,7.3615548 5.0230292,5.0230292 0 0 0 10.630013,6.9628311 3.8648402,3.8648402 0 0 1 8.6139939,7.532543 3.8648402,3.8648402 0 0 1 4.7492118,3.6677608 3.8648402,3.8648402 0 0 1 4.9717204,2.3834823 Z" />
                                  <circle cx="8.6142359" cy="3.6677198" r="3.5209935" />
                                </svg>
                              : 
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z"/></svg>
                              }
                            </Box>
                          )}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Box>
                )}
                
                
                {!isCurrentUser && (!currentUser?.account_type || currentUser.account_type !== 'channel') && (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    mt: 2,
                    justifyContent: 'center'
                  }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={following ? <PersonRemoveIcon /> : <PersonAddIcon />}
                      onClick={handleFollow}
                      fullWidth
                      sx={{ 
                        borderRadius: 6,
                        py: 0.7,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: (user.status_color && user.status_text && user.subscription) ?
                          `0 2px 8px ${user.status_color}40` : 
                          '0 2px 8px rgba(208, 188, 255, 0.25)',
                        backgroundColor: following ? 
                          'rgba(255, 255, 255, 0.1)' : 
                          (user.status_color && user.status_text && user.subscription) ?
                            user.status_color :
                            'primary.main',
                        color: following ? 'text.primary' : '#fff',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: following ? 
                            'rgba(255, 255, 255, 0.15)' : 
                            (user.status_color && user.status_text && user.subscription) ?
                              `${user.status_color}E6` : 
                              'primary.dark',
                          transform: 'translateY(-2px)',
                          boxShadow: (user.status_color && user.status_text && user.subscription) ?
                            `0 4px 12px ${user.status_color}66` : 
                            '0 4px 12px rgba(208, 188, 255, 0.4)'
                        },
                        '&:active': {
                          transform: 'translateY(0)'
                        }
                      }}
                    >
                      {following ? t('profile.actions.unfollow') : t('profile.actions.follow')}
                    </Button>
                  </Box>
                )}
                
                
              </Box>

            </Box>
          </Paper>
          {user && user.account_type !== 'channel' && (
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Stories userIdentifier={user.id} />
            </Box>
          )}

        </Grid>
        
        
        <Grid item xs={12} md={7} sx={{ pt: 0, ml: { xs: 0, md: '5px' }, mb: '100px' }}>
        
          <Paper sx={{ 
            borderRadius: '12px', 
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            mb: '5px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  '&.Mui-selected': {
                    color: theme => theme.palette.primary.main,
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                }
              }}
            >
              <Tab label={t('profile.tabs.posts')} />
              <Tab label={t('profile.tabs.wall')} />
              <Tab label={t('profile.tabs.about')} />
            </Tabs>
          </Paper>
          
          
          <TabPanel value={tabValue} index={0} sx={{ p: 0, mt: 1 }}>
            {isCurrentUser && (
              <CreatePost onPostCreated={handlePostCreated} />
            )}
            
            <PostsTab />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1} sx={{ p: 0, mt: 1 }}>
            {currentUser && (!currentUser.subscription || currentUser.subscription.type !== 'channel') && (
              <CreatePost 
                onPostCreated={handlePostCreated} 
                postType="stena" 
                recipientId={user.id} 
              />
            )}
            
            <WallPostsTab userId={user.id} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2} sx={{ p: 0, mt: 1 }}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>

              
              <Grid container spacing={3}>
                {/* Основная информация */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    {/* Коннект */}
                    {user?.connect_info && user.connect_info.length > 0 && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                        border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            component={Link} 
                            to={`/profile/${user.username}`}
                            sx={{ 
                              color: 'text.primary',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            @{user.username}
                          </Typography>
                          <Typography sx={{ mx: 1, color: 'text.secondary' }}>
                            •
                          </Typography>
                          <Typography sx={{ color: 'text.secondary' }}>
                            {user.connect_info[0].days} {t('profile.days')}
                          </Typography>
                          <Typography sx={{ mx: 1, color: 'text.secondary' }}>
                            •
                          </Typography>
                          <Typography 
                            component={Link} 
                            to={`/profile/${user.connect_info[0].username}`}
                            sx={{ 
                              color: 'text.primary',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            @{user.connect_info[0].username}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Остальная информация */}
                    {user?.about && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 1,
                          lineHeight: 1.5,
                          color: user?.status_color ? getLighterColor(user.status_color) : theme => theme.palette.text.secondary,
                          p: 1.5,
                          borderRadius: 2,
                          background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                          backdropFilter: 'blur(10px)',
                          border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                          whiteSpace: 'normal'
                        }}
                      >
                        {user.about}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                {user?.location && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <LocationOnIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {t('profile.location')}
                        </Typography>
                        <Typography variant="body2">
                          {user.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                
                {user?.website && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <LinkIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {t('profile.website')}
                        </Typography>
                        <Typography variant="body2">
                          <Link href={user.website} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main' }}>
                            {user.website.replace(/^https?:\/\//, '')}
                          </Link>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                
                {user?.birthday && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <CakeIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {t('profile.birthday')}
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(user.birthday)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <TodayIcon color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {t('profile.registration_date')}
                      </Typography>
                      <Typography variant="body2">
                        {user?.registration_date ? new Date(user.registration_date).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : t('profile.not_available')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {user?.purchased_usernames && user.purchased_usernames.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <AlternateEmailIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {t('profile.usernames')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          
                          {user.purchased_usernames.map((usernameObj, idx) => (
                            <Chip 
                              key={idx}
                              label={usernameObj.username}
                              size="small"
                              variant={usernameObj.is_active ? "filled" : "outlined"}
                              color={usernameObj.is_active ? "primary" : "default"}
                              onClick={(e) => handleUsernameClick(e, usernameObj.username)}
                              sx={{ 
                                '& .MuiChip-label': {
                                  px: 1
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {/* Medals section */}
                {medals && medals.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 1.5,
                      pb: 2,
                      borderBottom: '1px solid rgba(255,255,255,0.07)'
                    }}>
                      <EmojiEventsIcon color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {t('profile.medals.title')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                          {medals.map((medal) => (
                            <Tooltip
                              key={medal.id}
                              title={
                                <Box>
                                  {medal.description && (
                                    <Typography variant="caption">{medal.description}</Typography>
                                  )}
                                  <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>
                                    {t('profile.awarded_on', { date: new Date(medal.awarded_at).toLocaleDateString() })}
                                  </Typography>
                                  <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                                    {t('profile.awarded_by', { by: `@${medal.awarded_by}` })}
                                  </Typography>
                                </Box>
                              }
                              arrow
                            >
                              <img
                                src={medal.image_path}
                                alt={medal.name}
                                style={{ 
                                  width: 150,
                                  height: 150,
                                  cursor: 'pointer',
                                  transition: 'transform 0.2s',
                                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
                                }}
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </TabPanel>
        </Grid>
      </Grid>
      
      
      {lightboxIsOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={closeLightbox}
        >
          <img 
            src={currentImage} 
            alt="Full size" 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90%', 
              objectFit: 'contain' 
            }} 
            onClick={(e) => e.stopPropagation()}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
            onClick={closeLightbox}
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message || t('profile.errors.load_failed')}
        </Alert>
      </Snackbar>
      <AnimatePresence>
        {selectedUsername && (
          <UsernameCard 
            username={selectedUsername}
            onClose={handleCloseUsernameCard}
            open={usernameCardOpen}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ProfilePage; 