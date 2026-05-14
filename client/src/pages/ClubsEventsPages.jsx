import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Loading, EmptyState } from '../components/UI';
import { clubService, eventService } from '../services/api';
import { Users, MapPin, MessageSquare } from 'lucide-react';

export const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const filters = selectedCategory !== 'all' ? { category: selectedCategory } : {};
        const response = await clubService.getClubs(filters);
        if (response.success) {
          setClubs(response.data.clubs);
        }
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [selectedCategory]);

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
            {clubs.map((club) => (
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

                <Link
                  to={`/clubs/${club._id}`}
                  className="w-full"
                >
                  <Button variant="primary" className="w-full">
                    View Club
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getEvents({ status: 'upcoming' });
        if (response.success) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
            icon={MessageSquare}
            title="No events scheduled"
            message="Check back soon for upcoming events!"
          />
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <Card key={event._id} className="flex gap-6">
                {event.thumbnail && (
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  {event.location && (
                    <p className="text-sm text-gray-600 mb-4">📍 {event.location}</p>
                  )}
                  <Link to={`/events/${event._id}`}>
                    <Button variant="primary">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
