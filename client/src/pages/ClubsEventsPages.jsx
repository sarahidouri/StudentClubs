import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Loading, EmptyState } from '../components/UI';
import { clubService, eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, Mail, Tag, Users, MapPin, MessageSquare, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ClubsPage = () => {
  const { user, setAuthenticatedUser, refreshUser } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningClubId, setJoiningClubId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const isUserMember = (club) => {
    if (!user || !club?.members) return false;
    const userId = user._id || user.id;

    return club.members.some((member) => {
      const memberId = member.user?._id || member.user;
      return String(memberId) === String(userId);
    });
  };

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const response = await clubService.getClubs();
        if (response.success) {
          const nextClubs = Array.isArray(response.data)
            ? response.data
            : response.data?.clubs || [];
          setClubs(nextClubs);
        }
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [selectedCategory]);

  const handleJoin = async (clubId) => {
    if (!user) {
      toast.error('Please log in to join a club');
      return;
    }

    try {
      setJoiningClubId(clubId);
      const response = await clubService.joinClub(clubId);
      if (response.success) {
        const updatedClub = response.data?.club;
        const updatedUser = response.data?.user;

        if (updatedClub) {
          setClubs((prev) =>
            prev.map((club) => (club._id === updatedClub._id ? updatedClub : club))
          );
        }

        if (updatedUser) {
          setAuthenticatedUser(updatedUser);
        } else {
          await refreshUser?.();
        }

        toast.success('Joined club successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join club');
    } finally {
      setJoiningClubId(null);
    }
  };

  const categories = [
    'all',
    'sports',
    'cultural',
    'technical',
    'academic',
    'social',
    'hobby',
    'volunteer',
  ];

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Student Clubs</h1>
          <p className="text-gray-600">
            Discover and join clubs that match your interests
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full capitalize font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Clubs Grid */}
        {clubs.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No clubs found"
            message="No clubs in this category yet. Check back soon!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory === 'all' ? clubs : clubs.filter((club) => {
              const matchesCategory = selectedCategory === 'all' ||
                (club.category || '').toLowerCase() === selectedCategory.toLowerCase();
              return matchesCategory;
            })).map((club) => {
              const member = isUserMember(club);

              return (
                <Card key={club._id} className="flex flex-col">
                  {club.logo && (
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-2">{club.name}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {club.description.slice(0, 100)}...
                  </p>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    {club.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {club.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      {club.memberCount} members
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/clubs/${club._id}`} className="flex-grow">
                      <Button variant="outline" className="w-full">Details</Button>
                    </Link>
                    <Button
                      variant="primary"
                      onClick={() => handleJoin(club._id)}
                      disabled={joiningClubId === club._id || member}
                    >
                      {joiningClubId === club._id ? 'Joining...' : member ? 'Joined' : 'Join'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const ClubDetailsPage = () => {
  const { id } = useParams();
  const { user, setAuthenticatedUser, refreshUser } = useAuth();
  const [club, setClub] = useState(null);
  const [clubEvents, setClubEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  const userId = user?._id || user?.id;

  const isUserMember = (clubData) => {
    if (!user || !clubData?.members) return false;
    return clubData.members.some((member) => {
      const memberId = member.user?._id || member.user;
      return String(memberId) === String(userId);
    });
  };

  const isMember = isUserMember(club);

  useEffect(() => {
    const fetchClub = async () => {
      setLoading(true);
      setError(null);
      try {
        const [clubRes, eventsRes] = await Promise.all([
          clubService.getClubDetails(id),
          eventService.getEvents({ club: id })
        ]);

        if (clubRes.success) {
          setClub(clubRes.data?.club || clubRes.data);
        }
        if (eventsRes.success) {
          setClubEvents(eventsRes.data?.events || []);
        }
      } catch (error) {
        console.error('Error fetching club details:', error);
        const message = error.response?.data?.message || 'Failed to load club';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      toast.error('Please log in to join a club');
      return;
    }

    try {
      setJoining(true);
      const response = await clubService.joinClub(id);
      if (response.success) {
        setClub(response.data?.club || club);

        if (response.data?.user) {
          setAuthenticatedUser(response.data.user);
        } else {
          await refreshUser?.();
        }

        toast.success('Joined club successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join club');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-light py-12">
        <div className="container-custom">
          <EmptyState
            icon={MessageSquare}
            title="Unable to load club"
            message={error}
          />
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-light py-12">
        <div className="container-custom">
          <EmptyState
            icon={MessageSquare}
            title="Club not found"
            message="This club may have been removed or is no longer active."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-custom">
        <Link to="/clubs" className="inline-flex items-center gap-2 text-primary font-medium mb-6">
          <ArrowLeft size={18} />
          Back to clubs
        </Link>

        {club.coverImage && (
          <img
            src={club.coverImage}
            alt={club.name}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-3">{club.name}</h1>
            <p className="text-gray-600 mb-6">{club.description}</p>

            <Card>
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-700">{club.about || club.description}</p>
            </Card>

            {clubEvents.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {clubEvents.map(event => (
                    <Card key={event._id} className="flex gap-4 p-4 items-center hover:shadow-md transition-shadow">
                      {event.thumbnail && (
                        <img src={event.thumbnail} alt="" className="w-20 h-20 object-cover rounded-lg" />
                      )}
                      <div className="flex-grow">
                        <h4 className="font-bold text-lg">{event.title}</h4>
                        <p className="text-sm text-gray-500">{new Date(event.startDate).toLocaleDateString()}</p>
                      </div>
                      <Link to={`/events/${event._id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {club.members?.length > 0 && (
              <Card className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Members</h2>
                <div className="space-y-3">
                  {club.members.map((member) => (
                    <div key={member._id || member.user?._id || member.user} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                      <span className="font-medium">
                        {member.user?.firstName
                          ? `${member.user.firstName} ${member.user.lastName}`
                          : 'Club member'}
                      </span>
                      <span className="text-sm capitalize text-gray-500">{member.role}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <Card className="h-fit">
            {club.logo && (
              <img
                src={club.logo}
                alt={club.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-3 text-sm text-gray-700 mb-6">
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <span className="capitalize">{club.category}</span>
              </div>
              {club.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {club.location}
                </div>
              )}
              {(club.meetingDay || club.meetingTime) && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {[club.meetingDay, club.meetingTime].filter(Boolean).join(' at ')}
                </div>
              )}
              {club.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {club.contactEmail}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users size={16} />
                {club.memberCount || club.members?.length || 0} members
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleJoin}
              disabled={joining || isMember}
            >
              {joining ? 'Joining...' : isMember ? 'Already Joined' : 'Join Club'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const EventsPage = () => {
  const { user, refreshUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  const isUserRegistered = (event) => {
    if (!user || !event?.attendees) return false;
    const userId = user._id || user.id;

    return event.attendees.some((att) => {
      const attendeeId = att.user?._id || att.user?.id || att.user || att;
      return String(attendeeId) === String(userId);
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await eventService.getEvents();
        if (response.success) {
          setEvents(response.data.events || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    if (!user) {
      toast.error('Please log in to register for events');
      return;
    }

    try {
      setRegisteringId(eventId);
      const response = await eventService.registerEvent(eventId);
      if (response.success) {
        const updatedEvent = response.data?.event || response.data;
        setEvents((prev) =>
          prev.map((event) => (event._id === eventId ? updatedEvent : event))
        );
        await refreshUser?.();
        toast.success('Registered for event successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
          <p className="text-gray-600">
            Discover and register for exciting events happening on campus
          </p>
        </div>

        {events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No events scheduled"
            message="Check back soon for upcoming events!"
          />
        ) : (
          <div className="space-y-6">
            {events.map((event) => {
              const isRegistered = isUserRegistered(event);

              return (
                <Card key={event._id} className="flex flex-col sm:flex-row gap-6">
                  {event.thumbnail && (
                    <img
                      src={event.thumbnail}
                      alt={event.title}
                      className="w-full sm:w-48 h-48 sm:h-32 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                      {event.club && (
                        <span className="flex items-center gap-1">
                          <Shield size={16} className="text-primary" />
                          <Link to={`/clubs/${event.club._id || event.club}`} className="hover:text-primary hover:underline">
                            {event.club.name || 'Organizing Club'}
                          </Link>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={16} /> 
                        {new Date(event.startDate).toLocaleDateString()}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={16} /> 
                          {event.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users size={16} /> 
                        {event.attendees?.length || 0} registered
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Link to={`/events/${event._id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                      <Button 
                        variant="primary" 
                        onClick={() => handleRegister(event._id)}
                        disabled={registeringId === event._id || isRegistered}
                      >
                        {registeringId === event._id ? 'Registering...' : isRegistered ? 'Registered' : 'Register'}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const EventDetailsPage = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);

  const isUserRegistered = (eventData) => {
    if (!user || !eventData?.attendees) return false;
    const userId = user._id || user.id;
    return eventData.attendees.some(att => {
      const attendeeId = att.user?._id || att.user?.id || att.user || att;
      return String(attendeeId) === String(userId);
    });
  };

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventService.getEvent(id);
        if (response.success) {
          setEvent(response.data?.event || response.data);
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        const message = error.response?.data?.message || 'Failed to load event details';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please log in to register');
      return;
    }
    try {
      setRegistering(true);
      const response = await eventService.registerEvent(id);
      if (response.success) {
        setEvent(response.data?.event || response.data);
        await refreshUser?.();
        toast.success('Registered successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!user) {
      toast.error('Please log in to cancel registration');
      return;
    }
    try {
      setRegistering(true);
      const response = await eventService.cancelEvent(id);
      if (response.success) {
        setEvent(response.data?.event || response.data);
        await refreshUser?.();
        toast.success('Registration cancelled successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="min-h-screen bg-light py-12">
        <div className="container-custom">
          <EmptyState icon={Calendar} title="Unable to load event" message={error} />
        </div>
      </div>
    );
  }

  if (!event) return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-custom">
        <EmptyState icon={Calendar} title="Event not found" message="This event may have been cancelled or moved." />
      </div>
    </div>
  );

  const isRegistered = isUserRegistered(event);

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-custom">
        <Link to="/events" className="inline-flex items-center gap-2 text-primary font-medium mb-6">
          <ArrowLeft size={18} /> Back to events
        </Link>

        {event.thumbnail && (
          <img src={event.thumbnail} alt={event.title} className="w-full h-64 object-cover rounded-lg mb-8" />
        )}

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-3">{event.title}</h1>
            <p className="text-gray-600 mb-6">{event.description}</p>
            <Card>
              <h2 className="text-2xl font-bold mb-4">About the Event</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{event.details || event.description}</p>
            </Card>

            {event.attendees?.length > 0 && (
              <Card className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Who's Going</h2>
                <div className="flex flex-wrap gap-4">
                  {event.attendees.map((att) => {
                    const attendee = att.user;
                    if (!attendee) return null;
                    return (
                      <div key={attendee._id || attendee} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                          {attendee.firstName?.charAt(0)}{attendee.lastName?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{attendee.firstName} {attendee.lastName}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          <Card className="h-fit">
            <div className="space-y-4 mb-6">
              {event.club && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Shield size={18} className="text-primary" />
                  <div>
                    <p className="font-medium">Organized by</p>
                    <Link to={`/clubs/${event.club._id || event.club}`} className="text-sm text-primary hover:underline font-semibold">
                      {event.club.name || 'Campus Club'}
                    </Link>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={18} className="text-primary" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-sm">{new Date(event.startDate).toLocaleString()}</p>
                </div>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={18} className="text-primary" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={18} className="text-primary" />
                <div>
                  <p className="font-medium">Attendees</p>
                  <p className="text-sm">{event.attendees?.length || 0} registered</p>
                </div>
              </div>
            </div>

            {isRegistered ? (
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleCancelRegistration}
                disabled={registering}
              >
                {registering ? 'Processing...' : 'Cancel Registration'}
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? 'Processing...' : 'Register Now'}
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
