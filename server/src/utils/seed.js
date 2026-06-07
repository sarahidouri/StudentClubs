import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import path from 'path';
import User from '../models/User.js';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Post from '../models/Post.js';
import Report from '../models/Report.js';
import ActivityLog from '../models/ActivityLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentclubs';

const clearCollections = async () => {
  
  try {
    await ActivityLog.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    await Post.deleteMany({});
    await Report.deleteMany({});
    await Event.deleteMany({});
    await Club.deleteMany({});
    await User.deleteMany({});
  } catch (err) {
    console.warn('Warning clearing collections:', err.message);
  }
};

const createManager = async () => {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const existing = await User.findOne({ email: 'manager@studentclubs.com' });
  if (existing) return existing;

  return await User.create({
    firstName: 'Amine',
    lastName: 'Manager',
    email: 'manager@studentclubs.com',
    password: hashedPassword,
    role: 'club_manager',
    isVerified: true,
    isActive: true,
  });
};

const createClubs = async (managerId) => {
  const clubs = await Club.create([
    {
      name: 'Academic Excellence Club',
      description: 'A community for students focused on academic growth, study groups, and scholarly events.',
      category: 'academic',
      createdBy: managerId,
      logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
      coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80',
      location: 'Library Hall',
      meetingDay: 'Tuesday',
      meetingTime: '18:00',
      contactEmail: 'academic@campusconnect.local',
      manager: managerId,
      members: [{ user: managerId, role: 'president' }],
      tags: ['study', 'research', 'seminars'],
      isActive: true,
    },
    {
      name: 'Sports & Adventure',
      description: 'A student club for team sports, fitness challenges, outdoor activities, and friendly campus competitions.',
      category: 'sports',
      createdBy: managerId,
      logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
      coverImage: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1600&q=80',
      location: 'Campus Field',
      meetingDay: 'Friday',
      meetingTime: '16:30',
      contactEmail: 'sports-adventure@campusconnect.local',
      manager: managerId,
      members: [{ user: managerId, role: 'president' }],
      tags: ['football', 'fitness', 'outdoors'],
      isActive: true,
    },
    {
      name: 'Social Connect Hub',
      description: 'Bringing students together for social events, mixers, and community-building activities.',
      category: 'social',
      createdBy: managerId,
      logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      coverImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
      location: 'Student Center',
      meetingDay: 'Thursday',
      meetingTime: '19:00',
      contactEmail: 'social@campusconnect.local',
      manager: managerId,
      members: [{ user: managerId, role: 'president' }],
      tags: ['events', 'networking'],
      isActive: true,
    },
    {
      name: 'IT Innovation Club',
      description: 'A campus home for developers, makers, and students exploring software, AI, cybersecurity, and product ideas.',
      category: 'technical',
      createdBy: managerId,
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',
      location: 'Innovation Lab',
      meetingDay: 'Wednesday',
      meetingTime: '17:00',
      contactEmail: 'it-innovation@campusconnect.local',
      manager: managerId,
      members: [{ user: managerId, role: 'president' }],
      tags: ['coding', 'ai', 'hackathons'],
      isActive: true,
    },
    {
      name: 'Cultural Heritage Society',
      description: 'Celebrating cultural diversity through performances, exhibitions, and cultural exchange events.',
      category: 'cultural',
      createdBy: managerId,
      logo: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=900&q=80',
      coverImage: 'https://images.unsplash.com/photo-1505765050026-1c7f45a3f2aa?auto=format&fit=crop&w=1600&q=80',
      location: 'Cultural Hall',
      meetingDay: 'Monday',
      meetingTime: '18:30',
      contactEmail: 'cultural@campusconnect.local',
      manager: managerId,
      members: [{ user: managerId, role: 'president' }],
      tags: ['heritage', 'performing-arts'],
      isActive: true,
    },
    {
      name: 'Creative Arts & Hobbies',
      description: 'A space for art lovers and hobbyists to share, learn, and create together.',
      category: 'hobby',
      createdBy: managerId,
      logo: 'https://images.unsplash.com/photo-1518977956815-1f32c8a66d0f?auto=format&fit=crop&w=900&q=80',
      coverImage: 'https://images.unsplash.com/photo-1504198266286-1659872e6590?auto=format&fit=crop&w=1600&q=80',
      location: 'Art Studio',
      meetingDay: 'Saturday',
      meetingTime: '14:00',
      contactEmail: 'hobby@campusconnect.local',
      manager: managerId,
      members: [{ user: managerId, role: 'president' }],
      tags: ['art', 'crafts', 'photography'],
      isActive: true,
    },
    {
      name: 'Community Volunteers',
      description: 'Organizing volunteer efforts, community service, and outreach programs.',
      category: 'volunteer',
      createdBy: managerId,
      logo: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80',
      coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=80',
      location: 'Community Office',
      meetingDay: 'Sunday',
      meetingTime: '10:00',
      contactEmail: 'volunteer@campusconnect.local',
      manager: managerId,
      members: [{ user: managerId, role: 'president' }],
      tags: ['service', 'outreach'],
      isActive: true,
    },
  ]);

  await User.findByIdAndUpdate(managerId, {
    managedClubs: clubs.map((club) => club._id),
    joinedClubs: clubs.map((club) => club._id),
  });

  return clubs;
};

const createEvents = async (clubs, managerId) => {
  
  await Event.deleteMany({});

  const dayOffsets = [7, 10, 14, 17, 21, 24, 28];

  const eventsPayload = clubs.map((club, idx) => {
    const offset = dayOffsets[idx % dayOffsets.length];
    const startDate = new Date(Date.now() + offset * 24 * 60 * 60 * 1000);

    
    const categoryTitleMap = {
      academic: 'Academic Seminar',
      sports: 'Campus Sports Tournament',
      social: 'Campus Mixer & Social Night',
      technical: 'Web Dev Hackathon',
      cultural: 'Cultural Night Showcase',
      hobby: 'Creative Arts Workshop',
      volunteer: 'Charity Food Drive',
    };

    const titleBase = categoryTitleMap[club.category] || 'Campus Event';

    return {
      title: `${titleBase} - ${club.name}`,
      description: `Join ${club.name} for ${titleBase.toLowerCase()} — an engaging event featuring members, activities, and opportunities to get involved. Open to all students.`,
      startDate,
      location: club.location || 'Main Auditorium',
      club: club._id,
      createdBy: managerId,
      category: club.category,
      thumbnail: club.logo,
      isActive: true,
      capacity: 100,
    };
  });

  const createdEvents = await Event.create(eventsPayload);
  return createdEvents;
};

const createMessages = async (clubs, managerId) => {
  
  await Message.deleteMany({});

  const messagesPayload = [];

  const welcomeMap = {
    academic: [
      'Welcome to the Academic Excellence Club! Share resources and study tips here.',
      'Don\'t miss our weekly study group on Tuesday evenings.'
    ],
    sports: [
      'Welcome to Sports & Adventure! Discuss upcoming matches and training here.',
      'Sign up for the weekend football tournament in the #announcements channel.'
    ],
    social: [
      'Welcome to Social Connect Hub! Introduce yourself and join our mixers.',
      'We host weekly socials — bring a friend!'
    ],
    technical: [
      'Welcome to IT Innovation Club! Let\'s build cool projects together.',
      'Share your project ideas and join hackathon teams here.'
    ],
    cultural: [
      'Welcome to Cultural Heritage Society — celebrate and share cultural events.',
      'Auditions for the cultural night are open next week.'
    ],
    hobby: [
      'Welcome to Creative Arts & Hobbies! Show off your latest creations.',
      'Join our Saturday workshop to learn new techniques.'
    ],
    volunteer: [
      'Welcome to Community Volunteers — let\'s make a difference together.',
      'Sign up for the charity food drive happening soon.'
    ],
  };

  clubs.forEach((club, clubIdx) => {
    const texts = welcomeMap[club.category] || ['Welcome to the club!'];
    texts.forEach((text, msgIdx) => {
      
      const createdAt = new Date(Date.now() - (clubIdx * 60 + msgIdx) * 60 * 1000);
      messagesPayload.push({
        club: club._id,
        sender: managerId,
        content: text,
        messageType: 'group',
        createdAt,
      });
    });
  });

  const createdMessages = await Message.create(messagesPayload);
  return createdMessages;
};

const seedDatabase = async () => {
  let connectionCreated = false;

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      connectionCreated = true;
      console.log('Connected to MongoDB.');
    } else {
      console.log('Using existing MongoDB connection.');
    }

    await clearCollections();
    console.log('Cleared existing collections.');

    const manager = await createManager();
    console.log('Created default manager:', manager.email);

    const clubs = await createClubs(manager._id);
    console.log(`Created ${clubs.length} default clubs.`);

    const messages = await createMessages(clubs, manager._id);
    console.log(`Created ${messages.length} default messages.`);

    const events = await createEvents(clubs, manager._id);
    console.log(`Created ${events.length} default events.`);

    console.log('Database seeded successfully!');

    if (process.argv[1] === __filename) {
      if (connectionCreated) {
        await mongoose.disconnect();
      }
      process.exit(0);
    }

    return { success: true };
  } catch (error) {
    console.error('Database seeding failed:', error);
    if (connectionCreated) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

export default seedDatabase;


seedDatabase();
