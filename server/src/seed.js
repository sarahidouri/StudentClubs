import './config/env.js';

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Club from './models/Club.js';

const starterClubs = [
  {
    name: 'IT Innovation Club',
    description:
      'A campus home for developers, makers, and students exploring software, AI, cybersecurity, and product ideas.',
    category: 'technical',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80',
    location: 'Innovation Lab',
    meetingDay: 'Wednesday',
    meetingTime: '17:00',
    contactEmail: 'it-innovation@campusconnect.local',
    tags: ['coding', 'ai', 'hackathons'],
  },
  {
    name: 'Sports & Adventure',
    description:
      'A student club for team sports, fitness challenges, outdoor activities, and friendly campus competitions.',
    category: 'sports',
    logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1600&q=80',
    location: 'Campus Field',
    meetingDay: 'Friday',
    meetingTime: '16:30',
    contactEmail: 'sports-adventure@campusconnect.local',
    tags: ['football', 'fitness', 'outdoors'],
  },
  {
    name: 'Art & Culture Society',
    description:
      'A creative society for students interested in visual arts, music, theater, cultural exchange, and exhibitions.',
    category: 'cultural',
    logo: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
    coverImage:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
    location: 'Arts Studio',
    meetingDay: 'Tuesday',
    meetingTime: '15:30',
    contactEmail: 'art-culture@campusconnect.local',
    tags: ['painting', 'music', 'theater'],
  },
];

const ensureUser = async ({ email, firstName, lastName, role }) => {
  const rawPassword = '123456';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      email,
      firstName,
      lastName,
      role,
      password: hashedPassword,
      isVerified: true,
    });
    await user.save();
    return user;
  }

  const needsPasswordHash =
    !user.password || typeof user.password !== 'string' || !user.password.startsWith('$2');

  if (needsPasswordHash) {
    user.password = hashedPassword;
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.role = role;
  user.isVerified = true;

  if (needsPasswordHash || user.isModified('firstName') || user.isModified('lastName') || user.isModified('role') || user.isModified('isVerified')) {
    await user.save();
  }

  return user;
};

const DEFAULT_MONGODB_URI = 'mongodb://localhost:27017/studentclubs';

const seed = async () => {
  let connectionCreated = false;

  try {
    const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

    
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
      connectionCreated = true;
      console.log('Connected to MongoDB.');
    } else {
      console.log('Using existing MongoDB connection.');
    }

    const manager = await ensureUser({
      email: 'manager@studentclubs.com',
      firstName: 'Amine',
      lastName: 'Manager',
      role: 'club_manager',
    });

    const student = await ensureUser({
      email: 'sara@studentclubs.com',
      firstName: 'Sara',
      lastName: 'Student',
      role: 'student',
    });

    const clubs = [];

    for (const clubData of starterClubs) {
      const club = await Club.findOneAndUpdate(
        { name: clubData.name },
        {
          $set: {
            ...clubData,
            manager: manager._id,
            isActive: true,
          },
          $addToSet: {
            members: {
              user: manager._id,
              role: 'president',
            },
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      clubs.push(club);
    }

    const firstClub = clubs[0];
    await Club.findByIdAndUpdate(firstClub._id, {
      $addToSet: {
        members: {
          user: student._id,
          role: 'member',
        },
      },
    });

    await User.findByIdAndUpdate(manager._id, {
      $addToSet: {
        managedClubs: { $each: clubs.map((club) => club._id) },
        joinedClubs: { $each: clubs.map((club) => club._id) },
      },
    });

    await User.findByIdAndUpdate(student._id, {
      $addToSet: {
        joinedClubs: firstClub._id,
      },
    });

    for (const club of clubs) {
      const hydratedClub = await Club.findById(club._id);
      hydratedClub.memberCount = hydratedClub.members.length;
      await hydratedClub.save();
    }

    console.log(`Seeded ${clubs.length} clubs successfully.`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    
    if (connectionCreated) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
    }
  }
};

export default seed;
