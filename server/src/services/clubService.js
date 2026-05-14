import Club from '../models/Club.js';
import User from '../models/User.js';

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
    return await Club.findById(clubId)
      .populate('manager', 'firstName lastName email profileImage')
      .populate('members.user', 'firstName lastName email profileImage');
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
    if (filters.category) query.category = filters.category;
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

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
    const club = await Club.findById(clubId);
    if (!club) throw new Error('Club not found');

    const isMember = club.members.some((m) => m.user.toString() === userId);
    if (isMember) throw new Error('Already a member of this club');

    club.members.push({ user: userId, role: 'member' });
    await club.save();

    await User.findByIdAndUpdate(userId, {
      $push: { joinedClubs: clubId },
    });

    return club;
  },

  async leaveClub(clubId, userId) {
    const club = await Club.findById(clubId);
    if (!club) throw new Error('Club not found');

    club.members = club.members.filter((m) => m.user.toString() !== userId);
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
