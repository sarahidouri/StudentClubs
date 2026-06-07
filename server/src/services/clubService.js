import Club from '../models/Club.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const populateClub = (query) =>
  query
    .populate('manager', 'firstName lastName email profileImage')
    .populate('members.user', 'firstName lastName email profileImage');

const populateUserClubs = (query) =>
  query
    .select('-password -verificationToken')
    .populate({ path: 'joinedClubs', select: 'name category logo isActive' })
    .populate({ path: 'managedClubs', select: 'name category logo isActive' });

export const clubService = {
  async createClub(clubData, managerId) {
    const club = new Club({
      ...clubData,
      manager: managerId,
      members: [
        {
          user: managerId,
          role: 'president',
        },
      ],
    });

    await club.save();
    await User.findByIdAndUpdate(managerId, {
      $push: { managedClubs: club._id },
    });

    return await club.populate('manager', 'firstName lastName email');
  },

  async getClubById(clubId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(clubId)) {
        const error = new Error('Invalid club id');
        error.status = 400;
        throw error;
      }

      const club = await Club.findOne({ _id: clubId, isActive: true });

      if (!club) {
        return null;
      }

      
      if (club.manager) {
        await club.populate('manager', 'firstName lastName email profileImage');
      }

      
      if (club.members && club.members.length > 0) {
        await club.populate('members.user', 'firstName lastName email profileImage');
        
        club.members = club.members.filter(m => m.user !== null);
      }

      return club;
    } catch (error) {
      
      console.error(`Error populating club ${clubId}:`, error.message);
      
      
      if (error.message.includes('populate')) {
        const basicClub = await Club.findOne({ _id: clubId, isActive: true });
        if (basicClub) {
          return basicClub;
        }
      }
      throw error;
    }
  },

  async updateClub(clubId, updateData) {
    const allowedUpdates = [
      'name',
      'description',
      'category',
      'logo',
      'coverImage',
      'location',
      'meetingDay',
      'meetingTime',
      'contactEmail',
      'website',
      'socialLinks',
      'rules',
      'tags',
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    return await Club.findByIdAndUpdate(clubId, updates, {
      new: true,
      runValidators: true,
    }).populate('manager', 'firstName lastName email');
  },

  async getAllClubs(filters = {}, pagination) {
    const query = {};
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.category) query.category = filters.category;
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const clubs = await Club.find(query)
      .populate('manager', 'firstName lastName email')
      .limit(pagination.limit)
      .skip(pagination.skip)
      .sort({ createdAt: -1 });

    const total = await Club.countDocuments(query);

    return {
      clubs,
      total,
      pages: Math.ceil(total / pagination.limit),
    };
  },

  async joinClub(clubId, userId) {
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      const error = new Error('Invalid club id');
      error.status = 400;
      throw error;
    }

    const club = await Club.findById(clubId);
    if (!club || !club.isActive) {
      const error = new Error('Club not found');
      error.status = 404;
      throw error;
    }

    const isMember = club.members.some((m) => {
      const memberId = m.user?._id || m.user;
      return String(memberId) === String(userId);
    });

    if (isMember) {
      const error = new Error('Already a member of this club');
      error.status = 409;
      throw error;
    }

    club.members.push({ user: userId, role: 'member' });
    await club.save();

    const user = await populateUserClubs(User.findByIdAndUpdate(userId, {
      $addToSet: { joinedClubs: club._id },
    }, {
      new: true,
      runValidators: true,
    }));

    const populatedClub = await populateClub(Club.findById(club._id));

    return {
      club: populatedClub,
      user,
    };
  },

  async leaveClub(clubId, userId) {
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      const error = new Error('Invalid club id');
      error.status = 400;
      throw error;
    }

    const club = await Club.findById(clubId);
    if (!club) {
      const error = new Error('Club not found');
      error.status = 404;
      throw error;
    }

    club.members = club.members.filter((m) => {
      const memberId = m.user?._id || m.user;
      return String(memberId) !== String(userId);
    });
    await club.save();

    await User.findByIdAndUpdate(userId, {
      $pull: { joinedClubs: clubId },
    });

    return club;
  },

  async updateMemberRole(clubId, userId, newRole) {
    const club = await Club.findById(clubId);
    if (!club) throw new Error('Club not found');

    const member = club.members.find((m) => m.user.toString() === userId);
    if (!member) throw new Error('Member not found');

    member.role = newRole;
    await club.save();

    return club;
  },
};
