import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GlassmorphicCard from '../components/GlassmorphicCard';

// Loading icons
const backIcon = require('../assets/icons/back.png');
const moreIcon = require('../assets/icons/more.png');
const sendIcon = require('../assets/icons/send.png');

// Sample data for the debate
const SAMPLE_DEBATE_DATA = {
  id: '1',
  title: 'GOAT of Cricket: Virat vs Dhoni?',
  groupName: 'Cricket Lovers',
  participants: [
    {
      id: 'virat',
      name: 'Virat Kohli',
      image: 'https://tinyurl.com/45erzeb4',
      votes: 54,
    },
    {
      id: 'dhoni',
      name: 'MS Dhoni',
      image: 'https://tinyurl.com/5n6v33te',
      votes: 44,
    },
  ],
  timeRemaining: '01:02:45',
  estimatedEarning: '$ 247.09',
  liveUsers: '12k',
  isTrending: true,
  leadingDiscussion: {
    name: 'Virat Fan',
    upvotes: '2.4k',
    downvotes: '234',
  },
  totalParticipants: '256k',
  totalComments: '1.2M',
};

// Define types for user and comment data
interface User {
  id: string;
  name: string;
  avatar: string;
  team: 'virat' | 'dhoni' | 'neutral';
}

interface CommentReply {
  id: string;
  user: User;
  timeAgo: string;
  content: string;
  upvotes: string;
  downvotes: string;
}

interface CommentData {
  id: string;
  user: User;
  timeAgo: string;
  content: string;
  upvotes: string;
  downvotes: string;
  replies: CommentReply[];
}

// Sample comments data with team affiliations and threaded structure
const SAMPLE_COMMENTS: CommentData[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Virat_Fan_123',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      team: 'virat',
    },
    timeAgo: '2h ago',
    content: 'Kohli\'s batting average and consistency is unmatched. 71 centuries speak for themselves! 🐐',
    upvotes: '2.4k',
    downvotes: '234',
    replies: [
      {
        id: '1-1',
        user: {
          id: 'user5',
          name: 'Dhoni_Believer_45',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
          team: 'dhoni',
        },
        timeAgo: '1.5h ago',
        content: 'Yes he has great stats, but Dhoni has won us 3 ICC trophies! Tournaments matter more than personal records.',
        upvotes: '1.2k',
        downvotes: '78',
      },
      {
        id: '1-2',
        user: {
          id: 'user6',
          name: 'KingKohli_Fan',
          avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
          team: 'virat',
        },
        timeAgo: '1h ago',
        content: 'And he\'s done it across all formats, all conditions. Averages 50+ in Tests, ODIs, and T20Is. No one else has ever done that!',
        upvotes: '1.8k',
        downvotes: '112',
      }
    ]
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'CaptainCool_07',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      team: 'dhoni',
    },
    timeAgo: '1h ago',
    content: '3 ICC trophies as captain! Dhoni\'s leadership and finishing abilities make him the ultimate GOAT 🏆',
    upvotes: '1.8k',
    downvotes: '156',
    replies: [
      {
        id: '2-1',
        user: {
          id: 'user7',
          name: 'ViratTheKing',
          avatar: 'https://randomuser.me/api/portraits/men/38.jpg',
          team: 'virat',
        },
        timeAgo: '45m ago',
        content: 'Dhoni had a great team. Kohli has broken records with much less support from the rest of the batting lineup.',
        upvotes: '954',
        downvotes: '210',
      }
    ]
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'CricketAnalyst',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      team: 'neutral',
    },
    timeAgo: '45m ago',
    content: 'Looking at career stats alone, Kohli dominates batting records, but Dhoni\'s impact as captain & wicketkeeper cannot be measured just by numbers.',
    upvotes: '3.1k',
    downvotes: '89',
    replies: [
      {
        id: '3-1',
        user: {
          id: 'user8',
          name: 'DhoniFinisher',
          avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
          team: 'dhoni',
        },
        timeAgo: '30m ago',
        content: 'Exactly! That helicopter shot in the World Cup final alone is worth more than a hundred centuries.',
        upvotes: '876',
        downvotes: '154',
      },
      {
        id: '3-2',
        user: {
          id: 'user9',
          name: 'KohliRules',
          avatar: 'https://randomuser.me/api/portraits/men/39.jpg',
          team: 'virat',
        },
        timeAgo: '25m ago',
        content: 'But consistency is what makes a player legendary. Anyone can have one or two good matches.',
        upvotes: '754',
        downvotes: '98',
      }
    ]
  },
  {
    id: '4',
    user: {
      id: 'user4',
      name: 'TeamIndia',
      avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
      team: 'neutral',
    },
    timeAgo: '30m ago',
    content: 'Both are legends in their own right. Kohli for his batting, Dhoni for his leadership. India is lucky to have had both! 🇮🇳',
    upvotes: '2.2k',
    downvotes: '45',
    replies: []
  },
];

// List of users in the live debate (shown as avatars)
const LIVE_USERS = [
  { id: '1', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '2', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '3', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' },
  { id: '4', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
];

// Create more sample comments to load
const MORE_DUMMY_COMMENTS: CommentData[] = [
  {
    id: '5',
    user: {
      id: 'user10',
      name: 'StatisticsFan',
      avatar: 'https://randomuser.me/api/portraits/men/28.jpg',
      team: 'virat',
    },
    timeAgo: '15m ago',
    content: 'Looking at pure stats: Kohli has 70+ international centuries. That\'s basically unheard of. His consistency is what makes him the GOAT.',
    upvotes: '1.2k',
    downvotes: '124',
    replies: []
  },
  {
    id: '6',
    user: {
      id: 'user11',
      name: 'MSDian4Ever',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      team: 'dhoni',
    },
    timeAgo: '12m ago',
    content: 'Cricket is about winning tournaments, not just scoring runs. Dhoni brought us 3 ICC trophies. End of discussion!',
    upvotes: '1.5k',
    downvotes: '310',
    replies: []
  },
  {
    id: '7',
    user: {
      id: 'user12',
      name: 'CricketAnalyst2',
      avatar: 'https://randomuser.me/api/portraits/men/59.jpg',
      team: 'neutral',
    },
    timeAgo: '10m ago',
    content: 'We shouldn\'t forget that Dhoni had a much stronger team during his captaincy. The bowling unit under Kohli hasn\'t been as strong, which makes his achievements even more remarkable.',
    upvotes: '876',
    downvotes: '245',
    replies: []
  },
  {
    id: '8',
    user: {
      id: 'user13',
      name: 'CricketHistory',
      avatar: 'https://randomuser.me/api/portraits/men/63.jpg',
      team: 'neutral',
    },
    timeAgo: '8m ago',
    content: 'Both are legends but in different eras. The game has evolved. Dhoni was perfect for his time, and Kohli is redefining batting in the modern era.',
    upvotes: '567',
    downvotes: '78',
    replies: []
  },
  {
    id: '9',
    user: {
      id: 'user14',
      name: 'IPLfanatic',
      avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
      team: 'virat',
    },
    timeAgo: '6m ago',
    content: 'In terms of IPL, Virat has been more consistent for RCB while Dhoni has better leadership for CSK. That\'s the difference!',
    upvotes: '789',
    downvotes: '102',
    replies: []
  },
  {
    id: '10',
    user: {
      id: 'user15',
      name: 'MumbaiIndians',
      avatar: 'https://randomuser.me/api/portraits/men/71.jpg',
      team: 'dhoni',
    },
    timeAgo: '5m ago',
    content: 'Pressure handling! Remember 2011 World Cup final? Dhoni promoted himself up the order and finished with a six. That\'s leadership under pressure.',
    upvotes: '921',
    downvotes: '156',
    replies: []
  }
];

const DynamicGroupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  // State
  const [debateData, setDebateData] = useState(SAMPLE_DEBATE_DATA);
  const [comments, setComments] = useState<CommentData[]>(SAMPLE_COMMENTS);
  const [comment, setComment] = useState('');
  const [timeLeft, setTimeLeft] = useState(debateData.timeRemaining);
  const [showOptions, setShowOptions] = useState(false);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [liveUsers] = useState(LIVE_USERS);
  
  // Refs
  const scrollRef = useRef<ScrollView>(null);
  const commentInputRef = useRef<TextInput>(null);
  
  // Add animation values
  const [animateViratScore] = useState(new Animated.Value(0));
  const [animateDhoniScore] = useState(new Animated.Value(0));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Add filter state
  const [activeFilter, setActiveFilter] = useState('most_upvoted');
  
  // Add states for dropdown
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filteredComments, setFilteredComments] = useState<CommentData[]>(comments);
  
  // Add state for loading and extra comments
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  
  // Add state for scroll loading
  const [isLoadingMoreScroll, setIsLoadingMoreScroll] = useState(false);
  
  // Add dot animations
  const [dot1Anim] = useState(new Animated.Value(0));
  const [dot2Anim] = useState(new Animated.Value(0));
  const [dot3Anim] = useState(new Animated.Value(0));
  
  // Run fade-in animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, translateY]);
  
  // Run pulsing animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [pulseAnim]);
  
  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      // This is a simple countdown simulation
      setTimeLeft(prev => {
        const [hours, minutes, seconds] = prev.split(':').map(Number);
        let totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        if (totalSeconds <= 0) {
          clearInterval(timer);
          return '00:00:00';
        }
        
        totalSeconds -= 1;
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        
        return `${h}:${m}:${s}`;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Animate score when voting
  useEffect(() => {
    if (userVote) {
      Animated.sequence([
        Animated.timing(userVote === 'virat' ? animateViratScore : animateDhoniScore, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(userVote === 'virat' ? animateViratScore : animateDhoniScore, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [userVote, animateViratScore, animateDhoniScore]);

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle options menu press
  const handleOptionsPress = () => {
    setShowOptions(!showOptions);
  };

  // Handle voting for a participant
  const handleVote = (participantId: string) => {
    if (userVote === participantId) {
      return; // User already voted for this participant
    }

    setUserVote(participantId);
    
    // Update vote count (a simple implementation for demo)
    setDebateData(prev => {
      const updatedParticipants = prev.participants.map(p => {
        if (p.id === participantId) {
          return { ...p, votes: p.votes + 1 };
        }
        return p;
      });
      
      return { ...prev, participants: updatedParticipants };
    });
  };

  // Handle join stream button press
  const handleJoinStream = () => {
    // Navigate to the UnifiedReelsStream screen with fixed typing
    // @ts-ignore - Ignoring type error since we know the screen exists
    navigation.navigate('UnifiedReelsStream');
  };

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    
    // Create a new comment object
    const newComment: CommentData = {
      id: `comment-${Date.now()}`,
      user: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        team: 'neutral', // Default team for new comments
      },
      timeAgo: 'Just now',
      content: comment.trim(),
      upvotes: '0',
      downvotes: '0',
      replies: [],
    };
    
    // Add the new comment to the comments list
    setComments([newComment, ...comments]);
    
    // Clear the comment input
    setComment('');
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setShowFilterDropdown(false);
    
    // Actually filter the comments based on selection
    let sortedComments = [...comments];
    
    switch(filter) {
      case 'most_upvoted':
        sortedComments.sort((a, b) => parseInt(b.upvotes.replace(/[^\d]/g, '')) - parseInt(a.upvotes.replace(/[^\d]/g, '')));
        break;
      case 'most_downvoted':
        sortedComments.sort((a, b) => parseInt(b.downvotes.replace(/[^\d]/g, '')) - parseInt(a.downvotes.replace(/[^\d]/g, '')));
        break;
      case 'trending':
        // For trending, we'll use a combination of votes and recency
        sortedComments.sort((a, b) => {
          const aScore = parseInt(a.upvotes.replace(/[^\d]/g, '')) - parseInt(a.downvotes.replace(/[^\d]/g, ''));
          const bScore = parseInt(b.upvotes.replace(/[^\d]/g, '')) - parseInt(b.downvotes.replace(/[^\d]/g, ''));
          return bScore - aScore;
        });
        break;
      case 'newest':
        // Assuming timeAgo can be converted to a sortable value
        // For demo purposes, we'll just reverse the array
        sortedComments.reverse();
        break;
      default:
        break;
    }
    
    setFilteredComments(sortedComments);
  };

  // Toggle filter dropdown
  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  // Get filter display name
  const getFilterDisplayName = () => {
    switch(activeFilter) {
      case 'most_upvoted':
        return 'Most Upvoted';
      case 'most_downvoted':
        return 'Most Downvoted';
      case 'trending':
        return 'Trending';
      case 'newest':
        return 'Newest';
      default:
        return 'Filter';
    }
  };

  // Header component
  const renderHeader = () => (
    <Animated.View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Image source={backIcon} style={styles.backIcon} />
      </TouchableOpacity>
      
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {debateData.groupName}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.optionsButton} 
        onPress={handleOptionsPress}
        activeOpacity={0.7}
      >
        <Image source={moreIcon} style={styles.optionsIcon} />
      </TouchableOpacity>
    </Animated.View>
  );

  // Options menu rendered separately to ensure proper z-index
  const renderOptionsMenu = () => (
    showOptions && (
      <View style={styles.optionsMenuOverlay}>
        <View style={styles.optionsMenu}>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Report Group</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Mute Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Text style={styles.optionText}>Leave Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  );

  // Debate title section
  const renderDebateTitle = () => (
    <View style={styles.debateTitleContainer}>
      <Text style={styles.debateTitle} numberOfLines={1} ellipsizeMode="tail">
        {debateData.title}
      </Text>
    </View>
  );

  // Debate poll section with VS card
  const renderDebatePoll = () => (
    <View style={styles.debatePollContainer}>
      <View style={styles.vsCardContainer}>
        {/* Participants images and names */}
        <View style={styles.vsCardContent}>
          {debateData.participants.map((participant, index) => (
            <View 
              key={participant.id} 
              style={[
                styles.participantContainer,
                index === 0 ? styles.leftParticipant : styles.rightParticipant
              ]}
            >
              <Image 
                source={{ uri: participant.image }} 
                style={styles.participantImage} 
                resizeMode="cover"
              />
              <Text style={styles.participantName}>
                {participant.name.toUpperCase()}
              </Text>
            </View>
          ))}
          
          {/* VS badge in the middle */}
          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>
        </View>
      </View>
      
      {/* Voting buttons */}
      <View style={styles.votingButtonsContainer}>
        {debateData.participants.map(participant => (
          <TouchableOpacity
            key={participant.id}
            style={[
              styles.votingButton,
              userVote === participant.id && styles.votedButton,
              participant.id === 'virat' ? styles.participant1Button : styles.participant2Button
            ]}
            onPress={() => handleVote(participant.id)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.votingButtonText,
              userVote === participant.id && styles.votedButtonText
            ]}>
              {participant.name}
            </Text>
            <Text style={[
              styles.votingPercentage,
              userVote === participant.id && styles.votedPercentage
            ]}>
              {participant.votes}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Timer and earnings */}
      <View style={styles.timerContainer}>
        <View style={styles.timerSection}>
          <View style={styles.timerIconContainer}>
            <Text style={styles.timerIcon}>⏱</Text>
          </View>
          <View style={styles.timerTextContainer}>
            <Text style={styles.timerLabel}>Time left</Text>
            <Text style={styles.timerValue}>{timeLeft}</Text>
          </View>
        </View>
        
        <View style={styles.earningsSection}>
          <View style={styles.earningsIconContainer}>
            <Text style={styles.earningsIcon}>💰</Text>
          </View>
          <View style={styles.earningsTextContainer}>
            <Text style={styles.earningsLabel}>Est. earning</Text>
            <Text style={styles.earningsValue}>{debateData.estimatedEarning}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Update the renderTopComment function
  const renderTopComment = () => {
    const topComment = comments[0];
    const isViratFan = topComment.user.team === 'virat';
    const isDhoniFan = topComment.user.team === 'dhoni';
    
    return (
      <View style={styles.topCommentWrapper}>
        <View style={styles.topCommentCard}>
          <View style={styles.topCommentLabelContainer}>
            <Text style={styles.topCommentLabelText}>Top Comment</Text>
          </View>
          
          <View style={styles.commentHeader}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: topComment.user.avatar }}
                style={styles.commentUserAvatar}
              />
              <View style={[
                styles.teamIndicatorDot,
                isViratFan ? styles.viratTeamDot : 
                isDhoniFan ? styles.dhoniTeamDot : 
                styles.neutralTeamDot
              ]} />
            </View>
            
            <View style={styles.commentUserInfo}>
              <Text style={[
                styles.commentUserName,
                isViratFan ? styles.viratUserName : 
                isDhoniFan ? styles.dhoniUserName : null
              ]}>
                {topComment.user.name}
              </Text>
              <Text style={styles.commentTimeAgo}>{topComment.timeAgo}</Text>
            </View>
          </View>
          
          <Text style={styles.topCommentContent}>{topComment.content}</Text>
          
          <View style={styles.commentActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>👍 {topComment.upvotes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>👎 {topComment.downvotes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>💬 Reply</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>↗️ Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Update the renderLiveDebate function
  const renderLiveDebate = () => {
    // Create badge components to pass to the GlassmorphicCard
    const badgeComponents = (
      <View style={styles.badgeRow}>
        <View style={styles.liveIndicatorContainer}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
          <Text style={styles.liveUsersCount}>{debateData.liveUsers} users</Text>
        </View>

        {debateData.isTrending && (
          <View style={styles.trendingContainer}>
            <Text style={styles.trendingIcon}>🔥</Text>
            <Text style={styles.trendingText}>Trending</Text>
          </View>
        )}
      </View>
    );
    
    // Create participants section to pass as children
    const participantsSection = (
      <View style={styles.debateParticipantsContainer}>
        <View style={styles.avatarGroup}>
          {liveUsers.map((user, index) => (
            <Image 
              key={user.id}
              source={{ uri: user.avatar }}
              style={[
                styles.participantAvatar, 
                { zIndex: liveUsers.length - index }
              ]}
            />
          ))}
        </View>
        <Text style={styles.debateParticipantsCount}>+9.9k</Text>
      </View>
    );
    
    return (
      <GlassmorphicCard
        title="GOAT Debate"
        description="Live cricket debate: Stats, achievements, and leadership comparison"
        badges={badgeComponents}
        buttonText="Join Stream"
        onButtonPress={handleJoinStream}
        containerStyle={styles.glassCardContainer}
        titleStyle={styles.glassCardTitle}
        descriptionStyle={styles.glassCardDescription}
        buttonStyle={styles.joinStreamButton}
      >
        {participantsSection}
      </GlassmorphicCard>
    );
  };

  // Render a single comment with replies
  const renderCommentItem = (comment: CommentData | CommentReply, depth = 0) => {
    const isViratFan = comment.user.team === 'virat';
    const isDhoniFan = comment.user.team === 'dhoni';
    
    // Simple reply handler
    const handleReplyPress = () => {
      // Focus the comment input and update it to mention the user
      commentInputRef.current?.focus();
      // Optionally, you could add a @username prefix to the comment input
      setComment(`@${comment.user.name} `);
    };
    
    return (
      <Animated.View 
        key={comment.id} 
        style={[
          styles.commentContainer,
          depth > 0 && styles.replyContainer,
          { opacity: fadeAnim, transform: [{ translateY }] }
        ]}
      >
        {/* User info section with avatar and team indicator */}
        <View style={styles.commentHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: comment.user.avatar }} 
              style={styles.commentUserAvatar} 
            />
            <View style={[
              styles.teamIndicatorDot,
              isViratFan ? styles.viratTeamDot : 
              isDhoniFan ? styles.dhoniTeamDot : 
              styles.neutralTeamDot
            ]} />
          </View>
          
          <View style={styles.commentUserInfo}>
            <Text style={[
              styles.commentUserName,
              isViratFan ? styles.viratUserName : 
              isDhoniFan ? styles.dhoniUserName : null
            ]}>
              {comment.user.name}
            </Text>
            <Text style={styles.commentTimeAgo}>{comment.timeAgo}</Text>
          </View>
        </View>
        
        {/* Comment content */}
        <Text style={styles.commentContent}>{comment.content}</Text>
        
        {/* Comment actions */}
        <View style={styles.commentActions}>
          {/* Voting UI */}
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>👍 {comment.upvotes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>👎 {comment.downvotes}</Text>
          </TouchableOpacity>
          
          {/* Reply button */}
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleReplyPress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>💬 Reply</Text>
          </TouchableOpacity>
          
          {/* Share button */}
          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>↗️ Share</Text>
          </TouchableOpacity>
        </View>
        
        {'replies' in comment && comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {depth === 0 && (
              <View style={[
                styles.replyConnector,
                isViratFan ? styles.viratReplyConnector : 
                isDhoniFan ? styles.dhoniReplyConnector : 
                styles.neutralReplyConnector
              ]} />
            )}
            
            {comment.replies.map(reply => (
              <React.Fragment key={reply.id}>
                {renderCommentItem(reply, depth + 1)}
              </React.Fragment>
            ))}
          </View>
        )}
      </Animated.View>
    );
  };

  // Function to handle loading more comments on scroll
  const handleLoadMoreOnScroll = () => {
    if (isLoadingMoreScroll || !hasMoreComments) return;
    
    setIsLoadingMoreScroll(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setFilteredComments(prevComments => [...prevComments, ...MORE_DUMMY_COMMENTS]);
      setComments(prevComments => [...prevComments, ...MORE_DUMMY_COMMENTS]);
      setIsLoadingMoreScroll(false);
      setHasMoreComments(false); // After loading once, set hasMoreComments to false for demo
    }, 1500);
  };

  // Handle scroll event to load more comments
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    
    // When user scrolls to bottom (with some threshold), load more comments
    if (offsetY + scrollViewHeight >= contentHeight - 200) {
      if (!isLoadingMoreScroll && hasMoreComments) {
        handleLoadMoreOnScroll();
      }
    }
  };

  // Update the renderComments function to provide proper keys to the comments
  const renderComments = () => (
    <View style={styles.commentsContainer}>
      {/* Debate header with dropdown filter */}
      <View style={styles.debateHeader}>
        <View style={styles.debateHeaderContent}>
          <Text style={styles.debateHeaderTitle}>Debate</Text>
          
          {/* Filter dropdown button */}
          <TouchableOpacity 
            style={styles.filterDropdownButton}
            onPress={toggleFilterDropdown}
          >
            <Text style={styles.filterDropdownText}>{getFilterDisplayName()}</Text>
            <Text style={styles.filterDropdownIcon}>{showFilterDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Filter dropdown menu */}
        {showFilterDropdown && (
          <View style={styles.filterDropdownMenu}>
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'most_upvoted' && styles.activeFilterOption]}
              onPress={() => handleFilterChange('most_upvoted')}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'most_upvoted' && styles.activeFilterText]}>Most Upvoted</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'most_downvoted' && styles.activeFilterOption]}
              onPress={() => handleFilterChange('most_downvoted')}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'most_downvoted' && styles.activeFilterText]}>Most Downvoted</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'trending' && styles.activeFilterOption]}
              onPress={() => handleFilterChange('trending')}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'trending' && styles.activeFilterText]}>Trending</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'newest' && styles.activeFilterOption]}
              onPress={() => handleFilterChange('newest')}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'newest' && styles.activeFilterText]}>Newest</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Comments list - use filteredComments instead of comments */}
      {filteredComments.map(comment => (
        <React.Fragment key={comment.id}>
          {renderCommentItem(comment)}
        </React.Fragment>
      ))}
    </View>
  );

  // Initialize filteredComments with comments
  useEffect(() => {
    // When comments change, apply the current filter
    let sortedComments = [...comments];
    
    switch(activeFilter) {
      case 'most_upvoted':
        sortedComments.sort((a, b) => parseInt(b.upvotes.replace(/[^\d]/g, '')) - parseInt(a.upvotes.replace(/[^\d]/g, '')));
        break;
      case 'most_downvoted':
        sortedComments.sort((a, b) => parseInt(b.downvotes.replace(/[^\d]/g, '')) - parseInt(a.downvotes.replace(/[^\d]/g, '')));
        break;
      case 'trending':
        sortedComments.sort((a, b) => {
          const aScore = parseInt(a.upvotes.replace(/[^\d]/g, '')) - parseInt(a.downvotes.replace(/[^\d]/g, ''));
          const bScore = parseInt(b.upvotes.replace(/[^\d]/g, '')) - parseInt(b.downvotes.replace(/[^\d]/g, ''));
          return bScore - aScore;
        });
        break;
      case 'newest':
        sortedComments.reverse();
        break;
    }
    
    setFilteredComments(sortedComments);
  }, [comments, activeFilter]);

  // Run loading dots animation
  useEffect(() => {
    if (isLoadingMoreScroll) {
      Animated.loop(
        Animated.sequence([
          // Animate dot 1
          Animated.timing(dot1Anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }),
          // Animate dot 2
          Animated.timing(dot2Anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }),
          // Animate dot 3
          Animated.timing(dot3Anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }),
          // Reset all dots
          Animated.parallel([
            Animated.timing(dot1Anim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true
            }),
            Animated.timing(dot2Anim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true
            }),
            Animated.timing(dot3Anim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true
            })
          ])
        ])
      ).start();
    }
  }, [isLoadingMoreScroll, dot1Anim, dot2Anim, dot3Anim]);

  // Update return statement to include onScroll event handler
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B1464" />
      
      {renderHeader()}
      {renderOptionsMenu()}
      
      <ScrollView
        ref={scrollRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {renderDebateTitle()}
        {renderDebatePoll()}
        {renderTopComment()}
        {renderLiveDebate()}
        
        {/* Comments section */}
        {renderComments()}
        
        {/* Show loading indicator at bottom when loading more */}
        {isLoadingMoreScroll && (
          <View style={styles.loadingIndicator}>
            <Text style={styles.loadingText}>Loading more comments...</Text>
            <View style={styles.loadingDots}>
              <Animated.View 
                style={[
                  styles.loadingDot, 
                  styles.loadingDot1,
                  {
                    opacity: dot1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 1]
                    }),
                    transform: [{
                      scale: dot1Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.5]
                      })
                    }]
                  }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.loadingDot, 
                  styles.loadingDot2,
                  {
                    opacity: dot2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 1]
                    }),
                    transform: [{
                      scale: dot2Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.5]
                      })
                    }]
                  }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.loadingDot, 
                  styles.loadingDot3,
                  {
                    opacity: dot3Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 1]
                    }),
                    transform: [{
                      scale: dot3Anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.5]
                      })
                    }]
                  }
                ]} 
              />
            </View>
          </View>
        )}
        
        {/* Add some spacing at the bottom */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      {/* Bottom section - Comment input & LIVE button */}
      <View style={styles.commentInputContainer}>
        <TextInput
          ref={commentInputRef}
          style={styles.commentInput}
          placeholder="Add to the discussion..."
          placeholderTextColor="#888888"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        
        <View style={styles.commentInputActions}>
          <TouchableOpacity 
            style={[
              styles.commentSubmitButton,
              !comment.trim() && styles.commentSubmitButtonDisabled
            ]}
            onPress={handleCommentSubmit}
            disabled={!comment.trim()}
          >
            <Image source={sendIcon} style={styles.commentSubmitIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.liveCommentButton}
            onPress={handleJoinStream}
          >
            <Text style={styles.liveCommentButtonText}>LIVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1B1464',
    marginTop: 15,
    height: 54,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  optionsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  optionsIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  optionsMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  optionsMenu: {
    position: 'absolute',
    top: 93, // Position below header
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: 180,
    paddingVertical: 8,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  debateTitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#F9F9F9',
  },
  debateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  debatePollContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  vsCardContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  vsCardContent: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  participantContainer: {
    flex: 1,
    position: 'relative',
  },
  leftParticipant: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  rightParticipant: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  participantImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  participantName: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  vsBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  vsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  votingButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  votingButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    position: 'relative',
  },
  participant1Button: {
    backgroundColor: '#FF5252',
  },
  participant2Button: {
    backgroundColor: '#2979FF',
  },
  votedButton: {
    borderWidth: 2,
    borderColor: '#FFD700',
    transform: [{ scale: 1.02 }],
  },
  votingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  votedButtonText: {
    fontWeight: '800',
  },
  votingPercentage: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  votedPercentage: {
    fontWeight: '800',
    transform: [{ scale: 1.1 }],
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 8,
    height: 64,
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#EEEEEE',
    paddingRight: 16,
  },
  timerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timerIcon: {
    fontSize: 20,
  },
  timerTextContainer: {
    flex: 1,
  },
  timerLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  timerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  earningsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 16,
  },
  earningsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  earningsIcon: {
    fontSize: 20,
  },
  earningsTextContainer: {
    flex: 1,
  },
  earningsLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  liveDebateContainer: {},
  liveHeaderContainer: {},
  liveIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginRight: 4,
  },
  liveText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 12,
    marginRight: 4,
  },
  liveUsersCount: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
  },
  trendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingIcon: {
    marginRight: 4,
    fontSize: 12,
  },
  trendingText: {
    color: '#FF9500',
    fontWeight: '600',
    fontSize: 12,
  },
  leaderBoxContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  leaderIdentityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  leaderInfoContainer: {
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  commentUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f9f9f9',
  },
  teamIndicatorDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  viratTeamDot: {
    backgroundColor: '#FF5252',
  },
  dhoniTeamDot: {
    backgroundColor: '#2979FF',
  },
  neutralTeamDot: {
    backgroundColor: '#9E9E9E',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentUserInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  commentUserName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  commentTimeAgo: {
    fontSize: 12,
    color: '#888',
  },
  commentContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 16,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    flexWrap: 'wrap',
  },
  actionButton: {
    marginRight: 20,
    paddingVertical: 6,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  repliesContainer: {
    marginTop: 4,
    position: 'relative',
  },
  replyConnector: {
    position: 'absolute',
    left: 18,
    top: 0,
    bottom: 0,
    width: 2,
  },
  viratReplyConnector: {
    backgroundColor: '#FF5252',
  },
  dhoniReplyConnector: {
    backgroundColor: '#2979FF',
  },
  neutralReplyConnector: {
    backgroundColor: '#CCCCCC',
  },
  commentContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  replyContainer: {
    paddingLeft: 36,
    backgroundColor: '#FCFCFC',
    borderLeftWidth: 2,
    borderLeftColor: '#EEEEEE',
    marginBottom: 0,
    paddingRight: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  debateHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingTop: 14,
    paddingBottom: 14,
    position: 'relative',
  },
  debateHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  debateHeaderLeft: {
    flex: 1,
  },
  debateHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222222',
  },
  filterDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  filterDropdownText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    marginRight: 6,
  },
  filterDropdownIcon: {
    fontSize: 10,
    color: '#666666',
  },
  filterDropdownMenu: {
    position: 'absolute',
    top: 62,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 9999,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    width: 180,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activeFilterOption: {
    backgroundColor: '#E3F2FD',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333333',
  },
  activeFilterText: {
    color: '#2979FF',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 80,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  commentInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    color: '#333333',
    maxHeight: 80,
  },
  commentInputActions: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  commentSubmitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2979FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  commentSubmitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  commentSubmitIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  liveCommentButton: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveCommentButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  debateCommentsHeaderContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  debateCommentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 4,
  },
  debateCommentsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debateCommentsStatsText: {
    fontSize: 14,
    color: '#666666',
  },
  commentsContainer: {
    backgroundColor: '#F9F9F9',
    width: '100%',
    marginTop: 16,
  },
  viratCommentContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#1E88E5',
  },
  dhoniCommentContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#E53935',
  },
  topCommentWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  topCommentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingTop: 24,
    position: 'relative',
  },
  topCommentLabelContainer: {
    position: 'absolute',
    top: -10,
    left: 16,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  topCommentLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  topCommentContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
  topCommentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  topCommentVotes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topCommentVoteCount: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  glassCardContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 16,
    minHeight: 180,
  },
  glassCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    textAlign: 'left',
    marginBottom: 4,
  },
  glassCardDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'left',
    marginBottom: 16,
    lineHeight: 18,
  },
  debateParticipantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: -10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  debateParticipantsCount: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '600',
    marginLeft: 18,
  },
  joinStreamButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  compactDebateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    height: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 1,
  },
  compactDebateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  compactDebateStats: {
    fontSize: 14,
    color: '#666666',
  },
  commentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  replyItem: {
    marginLeft: 24,
    marginHorizontal: 0,
    backgroundColor: '#F9F9F9',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  commentUserInfo: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#888888',
    marginTop: 1,
  },
  commentText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  repliesContainer: {
    marginTop: 8,
    paddingLeft: 12,
    position: 'relative',
  },
  replyConnector: {
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: 6,
    width: 2,
  },
  debateHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingTop: 14,
    paddingBottom: 14,
    position: 'relative',
  },
  debateHeaderLeft: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  debateHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },
  filterOptions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterButton: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2979FF',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#2979FF',
    fontWeight: '600',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  teamIndicatorDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  viratTeamDot: {
    backgroundColor: '#FF5252',
  },
  dhoniTeamDot: {
    backgroundColor: '#2979FF',
  },
  neutralTeamDot: {
    backgroundColor: '#9E9E9E',
  },
  viratUserName: {
    color: '#FF5252',
  },
  dhoniUserName: {
    color: '#2979FF',
  },
  viratReplyConnector: {
    backgroundColor: '#FF5252',
  },
  dhoniReplyConnector: {
    backgroundColor: '#2979FF',
  },
  neutralReplyConnector: {
    backgroundColor: '#CCCCCC',
  },
  loadMoreButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  loadMoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2979FF',
  },
  loadingIndicator: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  loadingDot1: {
    backgroundColor: '#FF5252',
  },
  loadingDot2: {
    backgroundColor: '#2979FF',
  },
  loadingDot3: {
    backgroundColor: '#9E9E9E',
  },
});

export default DynamicGroupScreen; 