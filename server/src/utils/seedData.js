import '../config/env.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import Post from '../models/Post.js';

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentclubs';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    
    await User.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});
    await Post.deleteMany({});

    console.log('Clearing existing data...');

    
    const hashedPassword = await bcrypt.hash('123456', 10);

    
    const users = await User.insertMany([
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@studentclubs.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      },
      {
        firstName: 'Amine',
        lastName: 'Manager',
        email: 'manager@studentclubs.com',
        password: hashedPassword,
        role: 'club_manager',
        isVerified: true
      },
      {
        firstName: 'Sara',
        lastName: 'Student',
        email: 'sara@studentclubs.com',
        password: hashedPassword,
        role: 'student',
        isVerified: true
      }
    ]);

    const managerId = users[1]._id;
    const studentId = users[2]._id;

    
    const clubs = await Club.insertMany([
      {
        name: 'IT Innovation Club',
        description: 'A club for technology enthusiasts and developers.',
        category: 'technical',
        manager: managerId,
        members: [{ user: managerId, role: 'president' }, { user: studentId, role: 'member' }],
        memberCount: 2
      },
      {
        name: 'Sports & Adventure',
        description: 'Promoting physical health and campus sports events.',
        category: 'sports',
        manager: managerId,
        members: [{ user: managerId, role: 'president' }],
        memberCount: 1
      },
      {
        name: 'Art & Culture Society',
        description: 'Exploring creativity through painting, music, and theater.',
        category: 'cultural',
        manager: managerId,
        members: [{ user: managerId, role: 'president' }],
        memberCount: 1
      }
    ]);

    const clubId = clubs[0]._id;

    
    await User.findByIdAndUpdate(managerId, { 
      $push: { joinedClubs: clubId, managedClubs: [clubs[0]._id, clubs[1]._id, clubs[2]._id] } 
    });
    await User.findByIdAndUpdate(studentId, { 
      $push: { joinedClubs: clubId } 
    });

    const adminId = users[0]._id;
    
    
    for (const club of clubs) {
      await Club.findByIdAndUpdate(club._id, { $push: { members: { user: adminId, role: 'member' } } });
    }

    
    await User.findByIdAndUpdate(adminId, { 
      $set: { 
        joinedClubs: clubs.map(c => c._id),
        managedClubs: [clubs[0]._id]
      }
    });

    
    const events = await Event.insertMany([
      {
        title: 'Hackathon 2024',
        description: '24 hours of coding and innovation.',
        club: clubId,
        createdBy: managerId,
        startDate: new Date(Date.now() + 86400000 * 2), 
        endDate: new Date(Date.now() + 86400000 * 3),
        location: 'Main Lab',
        attendees: [{ user: studentId, status: 'going' }, { user: adminId, status: 'going' }], 
        status: 'upcoming'
      },
      {
        title: 'Design Workshop',
        description: 'Learn the basics of UI/UX design.',
        club: clubId,
        createdBy: managerId,
        startDate: new Date(Date.now() + 86400000 * 7), 
        endDate: new Date(Date.now() + 86400000 * 7 + 3600000), 
        location: 'Room 102',
        attendees: [{ user: adminId, status: 'going' }],
        status: 'upcoming'
      },
      {
        title: 'Football Tournament',
        description: 'Annual campus sports meet.',
        club: clubs[1]._id,
        createdBy: managerId,
        startDate: new Date(Date.now() + 86400000 * 10),
        endDate: new Date(Date.now() + 86400000 * 10 + 7200000),
        location: 'Campus Field',
        attendees: [{ user: adminId, status: 'going' }],
        status: 'upcoming'
      }
    ]);

    
    await Post.insertMany([
      {
        content: 'Welcome to our new club! Happy to have you all here.',
        author: managerId,
        club: clubId,
        visibility: 'public'
      },
      {
        content: 'Don’t forget the Hackathon registration deadline is tomorrow!',
        author: managerId,
        club: clubId,
        visibility: 'members_only'
      },
      {
        content: 'I just joined the IT Innovation Club! Looking forward to the Hackathon.',
        author: adminId,
        club: clubId,
        visibility: 'public'
      },
      {
        content: 'New sports equipment is arriving next week! 🏀',
        author: managerId,
        club: clubs[1]._id,
        visibility: 'public'
      }
    ]);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
