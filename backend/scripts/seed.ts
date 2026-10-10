import 'dotenv/config';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import mongoose from 'mongoose';
import { User } from '../src/models/user';
import { Family } from '../src/models/family';
import { FamilyMember } from '../src/models/familyMember';
import { Event } from '../src/models/event';
import { EventMember } from '../src/models/eventMember';
import { Schedule } from '../src/models/schedule';
import { Task } from '../src/models/task';
import { Channel } from '../src/models/channel';
import { Message } from '../src/models/message';
import { Guest } from '../src/models/guest';
import { Album } from '../src/models/album';
import { Media } from '../src/models/media';
import { Expense } from '../src/models/expense';
import { Notification } from '../src/models/notification';
import { hashPassword } from '../src/lib/auth';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/familyconnect';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME || 'familyconnect' });
  console.log('Connected to MongoDB');

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Family.deleteMany({}),
    FamilyMember.deleteMany({}),
    Event.deleteMany({}),
    EventMember.deleteMany({}),
    Schedule.deleteMany({}),
    Task.deleteMany({}),
    Channel.deleteMany({}),
    Message.deleteMany({}),
    Guest.deleteMany({}),
    Album.deleteMany({}),
    Media.deleteMany({}),
    Expense.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  console.log('Creating demo data...');

  // Create users
  const passwordHash = await hashPassword('password123');
  const users = await User.create([
    { name: 'Annu Singh', email: 'annu@familyconnect.app', passwordHash, phone: '+91 98765 43210', relationship: 'Bride' },
    { name: 'Naveen Singh', email: 'naveen@familyconnect.app', passwordHash, phone: '+91 98765 43211', relationship: 'Groom' },
    { name: 'Rajesh Singh', email: 'rajesh@familyconnect.app', passwordHash, phone: '+91 98765 43212', relationship: 'Father' },
    { name: 'Sunita Singh', email: 'sunita@familyconnect.app', passwordHash, phone: '+91 98765 43213', relationship: 'Mother' },
    { name: 'Rohit Singh', email: 'rohit@familyconnect.app', passwordHash, phone: '+91 98765 43214', relationship: 'Brother' },
    { name: 'Neha Singh', email: 'neha@familyconnect.app', passwordHash, phone: '+91 98765 43215', relationship: 'Sister' },
    { name: 'Amit Singh', email: 'amit@familyconnect.app', passwordHash, phone: '+91 98765 43216', relationship: 'Uncle' },
    { name: 'Priya Singh', email: 'priya@familyconnect.app', passwordHash, phone: '+91 98765 43217', relationship: 'Aunt' },
    { name: 'Vikram Singh', email: 'vikram@familyconnect.app', passwordHash, phone: '+91 98765 43218', relationship: 'Cousin' },
    { name: 'Anita Singh', email: 'anita@familyconnect.app', passwordHash, phone: '+91 98765 43219', relationship: 'Grandmother' },
  ]);
  console.log(`Created ${users.length} users`);

  // Create family
  const family = await Family.create({
    name: 'Singh Family',
    slug: 'singh-family',
    description: 'The Singh Family - celebrating life together',
    createdBy: users[0]._id,
  });
  console.log(`Created family: ${family.name}`);

  // Create family members
  const familyMembers = await FamilyMember.create([
    { familyId: family._id, userId: users[0]._id, role: 'ADMIN', status: 'ACTIVE', joinedAt: new Date() },
    { familyId: family._id, userId: users[1]._id, role: 'ADMIN', status: 'ACTIVE', joinedAt: new Date() },
    { familyId: family._id, userId: users[2]._id, role: 'ORGANIZER', status: 'ACTIVE', joinedAt: new Date() },
    { familyId: family._id, userId: users[3]._id, role: 'ORGANIZER', status: 'ACTIVE', joinedAt: new Date() },
    { familyId: family._id, userId: users[4]._id, role: 'MEMBER', status: 'ACTIVE', joinedAt: new Date() },
    { familyId: family._id, userId: users[5]._id, role: 'MEMBER', status: 'ACTIVE', joinedAt: new Date() },
    { familyId: family._id, userId: users[6]._id, role: 'MEMBER', status: 'ACTIVE', joinedAt: new Date() },
    { familyId: family._id, userId: users[7]._id, role: 'MEMBER', status: 'ACTIVE', joinedAt: new Date() },
    { familyId: family._id, userId: users[8]._id, role: 'MEMBER', status: 'ACTIVE', joinedAt: new Date() },
    { familyId: family._id, userId: users[9]._id, role: 'MEMBER', status: 'ACTIVE', joinedAt: new Date() },
  ]);
  console.log(`Created ${familyMembers.length} family members`);

  // Create event
  const eventDate = new Date('2026-12-18T19:30:00');
  const event = await Event.create({
    familyId: family._id,
    name: 'Annu ❤️ Naveen Wedding',
    type: 'Wedding',
    startDate: eventDate,
    endDate: new Date('2026-12-20T23:59:00'),
    location: 'New Delhi',
    description: 'Join us for the wedding celebration of Annu and Naveen',
    createdBy: users[0]._id,
  });
  console.log(`Created event: ${event.name}`);

  // Create event members
  const eventMembers = await EventMember.create([
    { eventId: event._id, userId: users[0]._id, role: 'ORGANIZER' },
    { eventId: event._id, userId: users[1]._id, role: 'ORGANIZER' },
    { eventId: event._id, userId: users[2]._id, role: 'CO_HOST' },
    { eventId: event._id, userId: users[3]._id, role: 'CO_HOST' },
    { eventId: event._id, userId: users[4]._id, role: 'MEMBER' },
    { eventId: event._id, userId: users[5]._id, role: 'MEMBER' },
    { eventId: event._id, userId: users[6]._id, role: 'MEMBER' },
    { eventId: event._id, userId: users[7]._id, role: 'MEMBER' },
    { eventId: event._id, userId: users[8]._id, role: 'MEMBER' },
    { eventId: event._id, userId: users[9]._id, role: 'MEMBER' },
  ]);
  console.log(`Created ${eventMembers.length} event members`);

  // Create schedule
  const schedule = await Schedule.create([
    { eventId: event._id, name: 'Haldi', date: new Date('2026-12-15'), startTime: new Date('2026-12-15T10:00:00'), endTime: new Date('2026-12-15T12:00:00'), location: 'Sharma Residence', organizer: users[2]._id, participants: [users[0]._id, users[1]._id], reminder: 24 },
    { eventId: event._id, name: 'Mehndi', date: new Date('2026-12-16'), startTime: new Date('2026-12-16T19:00:00'), endTime: new Date('2026-12-16T22:00:00'), location: 'Community Hall', organizer: users[3]._id, participants: [users[0]._id, users[5]._id], reminder: 24 },
    { eventId: event._id, name: 'Sangeet', date: new Date('2026-12-17'), startTime: new Date('2026-12-17T20:00:00'), endTime: new Date('2026-12-17T23:00:00'), location: 'Grand Banquet Hall', organizer: users[2]._id, participants: users.map(u => u._id), reminder: 24 },
    { eventId: event._id, name: 'Wedding', date: new Date('2026-12-18'), startTime: new Date('2026-12-18T19:30:00'), endTime: new Date('2026-12-18T23:00:00'), location: 'New Delhi', organizer: users[0]._id, participants: users.map(u => u._id), reminder: 24 },
    { eventId: event._id, name: 'Reception', date: new Date('2026-12-19'), startTime: new Date('2026-12-19T19:00:00'), endTime: new Date('2026-12-19T23:00:00'), location: 'Hotel Taj', organizer: users[1]._id, participants: users.map(u => u._id), reminder: 24 },
  ]);
  console.log(`Created ${schedule.length} schedule items`);

  // Create tasks
  const tasks = await Task.create([
    { eventId: event._id, title: 'Confirm Photographer', description: 'Book the photographer for all events', assignedTo: users[4]._id, createdBy: users[0]._id, dueDate: new Date('2026-11-30'), priority: 'HIGH', status: 'IN_PROGRESS', attachments: [] },
    { eventId: event._id, title: 'Book Transportation', description: 'Arrange buses for guests', assignedTo: users[5]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-01'), priority: 'MEDIUM', status: 'TODO', attachments: [] },
    { eventId: event._id, title: 'Finalize Catering', description: 'Confirm menu with caterer', assignedTo: users[2]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-05'), priority: 'HIGH', status: 'TODO', attachments: [] },
    { eventId: event._id, title: 'Order Decorations', description: 'Order flowers and decorations', assignedTo: users[3]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-10'), priority: 'MEDIUM', status: 'TODO', attachments: [] },
    { eventId: event._id, title: 'Send Invitations', description: 'Send digital invitations to all guests', assignedTo: users[0]._id, createdBy: users[0]._id, dueDate: new Date('2026-11-25'), priority: 'URGENT', status: 'COMPLETED', attachments: [] },
    { eventId: event._id, title: 'Confirm Venue', description: 'Finalize venue booking', assignedTo: users[1]._id, createdBy: users[0]._id, dueDate: new Date('2026-11-20'), priority: 'URGENT', status: 'COMPLETED', attachments: [] },
    { eventId: event._id, title: 'Book Mehndi Artist', description: 'Book mehndi artist for bride', assignedTo: users[5]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-08'), priority: 'MEDIUM', status: 'TODO', attachments: [] },
    { eventId: event._id, title: 'Arrange Music', description: 'Book DJ for sangeet', assignedTo: users[4]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-12'), priority: 'HIGH', status: 'IN_PROGRESS', attachments: [] },
    { eventId: event._id, title: 'Order Wedding Cards', description: 'Print physical invitation cards', assignedTo: users[6]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-01'), priority: 'LOW', status: 'TODO', attachments: [] },
    { eventId: event._id, title: 'Confirm Cake', description: 'Order wedding cake', assignedTo: users[7]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-15'), priority: 'MEDIUM', status: 'TODO', attachments: [] },
    { eventId: event._id, title: 'Book Hotel Rooms', description: 'Reserve rooms for out-of-town guests', assignedTo: users[8]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-05'), priority: 'HIGH', status: 'BLOCKED', attachments: [] },
    { eventId: event._id, title: 'Arrange Security', description: 'Hire security for event', assignedTo: users[2]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-10'), priority: 'MEDIUM', status: 'TODO', attachments: [] },
    { eventId: event._id, title: 'Prepare Welcome Drinks', description: 'Plan welcome drinks menu', assignedTo: users[3]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-14'), priority: 'LOW', status: 'TODO', attachments: [] },
    { eventId: event._id, title: 'Confirm Pundit', description: 'Book pandit for wedding ceremony', assignedTo: users[6]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-08'), priority: 'HIGH', status: 'IN_PROGRESS', attachments: [] },
    { eventId: event._id, title: 'Order Sherwani', description: 'Order groom sherwani', assignedTo: users[1]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-01'), priority: 'HIGH', status: 'COMPLETED', attachments: [] },
    { eventId: event._id, title: 'Book Makeup Artist', description: 'Book makeup artist for bride', assignedTo: users[5]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-10'), priority: 'HIGH', status: 'TODO', attachments: [] },
    { eventId: event._id, title: 'Arrange Fireworks', description: 'Plan fireworks for reception', assignedTo: users[4]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-16'), priority: 'LOW', status: 'TODO', attachments: [] },
    { eventId: event._id, title: 'Confirm Guest List', description: 'Finalize guest list', assignedTo: users[0]._id, createdBy: users[0]._id, dueDate: new Date('2026-11-30'), priority: 'URGENT', status: 'IN_PROGRESS', attachments: [] },
    { eventId: event._id, title: 'Prepare Seating Plan', description: 'Create seating arrangement', assignedTo: users[7]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-15'), priority: 'MEDIUM', status: 'TODO', attachments: [] },
    { eventId: event._id, title: 'Book Photo Booth', description: 'Rent photo booth for reception', assignedTo: users[8]._id, createdBy: users[0]._id, dueDate: new Date('2026-12-12'), priority: 'LOW', status: 'TODO', attachments: [] },
  ]);
  console.log(`Created ${tasks.length} tasks`);

  // Create channels
  const channels = await Channel.create([
    { eventId: event._id, name: 'General', slug: 'general', description: 'General discussion', isPrivate: false, allowedRoles: [], createdBy: users[0]._id },
    { eventId: event._id, name: 'Bride Side', slug: 'bride-side', description: 'Bride side discussions', isPrivate: false, allowedRoles: [], createdBy: users[0]._id },
    { eventId: event._id, name: 'Groom Side', slug: 'groom-side', description: 'Groom side discussions', isPrivate: false, allowedRoles: [], createdBy: users[1]._id },
    { eventId: event._id, name: 'Decoration', slug: 'decoration', description: 'Decoration planning', isPrivate: false, allowedRoles: [], createdBy: users[2]._id },
    { eventId: event._id, name: 'Food', slug: 'food', description: 'Food and catering', isPrivate: false, allowedRoles: [], createdBy: users[3]._id },
    { eventId: event._id, name: 'Photography', slug: 'photography', description: 'Photography and videography', isPrivate: false, allowedRoles: [], createdBy: users[4]._id },
    { eventId: event._id, name: 'Travel', slug: 'travel', description: 'Travel arrangements', isPrivate: false, allowedRoles: [], createdBy: users[5]._id },
    { eventId: event._id, name: 'Guest Management', slug: 'guest-management', description: 'Guest coordination', isPrivate: false, allowedRoles: [], createdBy: users[0]._id },
  ]);
  console.log(`Created ${channels.length} channels`);

  // Create messages
  const messages = await Message.create([
    { eventId: event._id, channelId: channels[0]._id, userId: users[0]._id, content: 'Welcome everyone to our wedding planning chat! 🎉', type: 'TEXT', mentions: [], attachments: [], reactions: [{ emoji: '❤️', count: 5 }], isDeleted: false },
    { eventId: event._id, channelId: channels[0]._id, userId: users[1]._id, content: 'Excited for our big day! 💍', type: 'TEXT', mentions: [], attachments: [], reactions: [{ emoji: '🎉', count: 3 }], isDeleted: false },
    { eventId: event._id, channelId: channels[0]._id, userId: users[2]._id, content: 'Haldi is confirmed for Dec 15 at 10 AM', type: 'TEXT', mentions: [], attachments: [], reactions: [], isDeleted: false },
    { eventId: event._id, channelId: channels[0]._id, userId: users[3]._id, content: 'Mehndi venue booked! Community Hall, Dec 16, 7 PM', type: 'TEXT', mentions: [], attachments: [], reactions: [{ emoji: '👏', count: 2 }], isDeleted: false },
    { eventId: event._id, channelId: channels[0]._id, userId: users[4]._id, content: 'Photographer confirmed for all events', type: 'TEXT', mentions: [], attachments: [], reactions: [], isDeleted: false },
    { eventId: event._id, channelId: channels[1]._id, userId: users[0]._id, content: 'Bride side meeting this Sunday at 4 PM', type: 'TEXT', mentions: [], attachments: [], reactions: [], isDeleted: false },
    { eventId: event._id, channelId: channels[1]._id, userId: users[5]._id, content: 'I will bring the mehndi designs', type: 'TEXT', mentions: [], attachments: [], reactions: [{ emoji: '🙏', count: 1 }], isDeleted: false },
    { eventId: event._id, channelId: channels[2]._id, userId: users[1]._id, content: 'Groom side meeting tomorrow at 6 PM', type: 'TEXT', mentions: [], attachments: [], reactions: [], isDeleted: false },
    { eventId: event._id, channelId: channels[2]._id, userId: users[6]._id, content: 'I will handle the transportation', type: 'TEXT', mentions: [], attachments: [], reactions: [], isDeleted: false },
    { eventId: event._id, channelId: channels[3]._id, userId: users[2]._id, content: 'Decoration theme: traditional with modern touches', type: 'TEXT', mentions: [], attachments: [], reactions: [{ emoji: '✨', count: 4 }], isDeleted: false },
  ]);
  console.log(`Created ${messages.length} messages`);

  // Create guests
  const guests = await Guest.create([
    { eventId: event._id, name: 'Aarav Sharma', phone: '+91 98765 00001', email: 'aarav@example.com', plusOne: 1, side: 'BRIDE', rsvp: 'YES', accommodation: 'Hotel Taj', transportation: 'Bus 1', notes: 'VIP guest' },
    { eventId: event._id, name: 'Sneha Patel', phone: '+91 98765 00002', email: 'sneha@example.com', plusOne: 0, side: 'BRIDE', rsvp: 'YES', accommodation: 'Hotel Taj', transportation: 'Bus 1', notes: '' },
    { eventId: event._id, name: 'Rahul Verma', phone: '+91 98765 00003', email: 'rahul@example.com', plusOne: 2, side: 'GROOM', rsvp: 'YES', accommodation: 'Hotel Oberoi', transportation: 'Bus 2', notes: 'Child: 5 years' },
    { eventId: event._id, name: 'Priya Gupta', phone: '+91 98765 00004', email: 'priya@example.com', plusOne: 0, side: 'GROOM', rsvp: 'YES', accommodation: 'Hotel Oberoi', transportation: 'Bus 2', notes: '' },
    { eventId: event._id, name: 'Amit Shah', phone: '+91 98765 00005', email: 'amit@example.com', plusOne: 1, side: 'BOTH', rsvp: 'YES', accommodation: 'Hotel Taj', transportation: 'Bus 1', notes: '' },
    { eventId: event._id, name: 'Neha Agarwal', phone: '+91 98765 00006', email: 'neha@example.com', plusOne: 0, side: 'BOTH', rsvp: 'YES', accommodation: 'Hotel Taj', transportation: 'Bus 1', notes: '' },
    { eventId: event._id, name: 'Vikram Singh', phone: '+91 98765 00007', email: 'vikram@example.com', plusOne: 1, side: 'BRIDE', rsvp: 'MAYBE', accommodation: '', transportation: '', notes: 'Waiting for confirmation' },
    { eventId: event._id, name: 'Anita Desai', phone: '+91 98765 00008', email: 'anita@example.com', plusOne: 0, side: 'GROOM', rsvp: 'MAYBE', accommodation: '', transportation: '', notes: '' },
    { eventId: event._id, name: 'Karan Mehta', phone: '+91 98765 00009', email: 'karan@example.com', plusOne: 1, side: 'BRIDE', rsvp: 'PENDING', accommodation: '', transportation: '', notes: 'Invited 2 days ago' },
    { eventId: event._id, name: 'Pooja Nair', phone: '+91 98765 00010', email: 'pooja@example.com', plusOne: 0, side: 'GROOM', rsvp: 'PENDING', accommodation: '', transportation: '', notes: '' },
    { eventId: event._id, name: 'Sanjay Rao', phone: '+91 98765 00011', email: 'sanjay@example.com', plusOne: 1, side: 'BOTH', rsvp: 'PENDING', accommodation: '', transportation: '', notes: '' },
    { eventId: event._id, name: 'Meera Iyer', phone: '+91 98765 00012', email: 'meera@example.com', plusOne: 0, side: 'BRIDE', rsvp: 'PENDING', accommodation: '', transportation: '', notes: '' },
    { eventId: event._id, name: 'Deepak Kumar', phone: '+91 98765 00013', email: 'deepak@example.com', plusOne: 1, side: 'GROOM', rsvp: 'NO', accommodation: '', transportation: '', notes: 'Out of town' },
    { eventId: event._id, name: 'Kavita Reddy', phone: '+91 98765 00014', email: 'kavita@example.com', plusOne: 0, side: 'BOTH', rsvp: 'NO', accommodation: '', transportation: '', notes: 'Work commitment' },
    { eventId: event._id, name: 'Nikhil Joshi', phone: '+91 98765 00015', email: 'nikhil@example.com', plusOne: 1, side: 'BRIDE', rsvp: 'YES', accommodation: 'Hotel Taj', transportation: 'Bus 1', notes: '' },
    { eventId: event._id, name: 'Ritu Malhotra', phone: '+91 98765 00016', email: 'ritu@example.com', plusOne: 0, side: 'GROOM', rsvp: 'YES', accommodation: 'Hotel Oberoi', transportation: 'Bus 2', notes: '' },
    { eventId: event._id, name: 'Arjun Khanna', phone: '+91 98765 00017', email: 'arjun@example.com', plusOne: 2, side: 'BOTH', rsvp: 'YES', accommodation: 'Hotel Taj', transportation: 'Bus 1', notes: 'Kids: 3 and 7 years' },
    { eventId: event._id, name: 'Divya Rastogi', phone: '+91 98765 00018', email: 'divya@example.com', plusOne: 0, side: 'BRIDE', rsvp: 'YES', accommodation: 'Hotel Taj', transportation: 'Bus 1', notes: '' },
    { eventId: event._id, name: 'Manish Tiwari', phone: '+91 98765 00019', email: 'manish@example.com', plusOne: 1, side: 'GROOM', rsvp: 'YES', accommodation: 'Hotel Oberoi', transportation: 'Bus 2', notes: '' },
    { eventId: event._id, name: 'Shalini Bhat', phone: '+91 98765 00020', email: 'shalini@example.com', plusOne: 0, side: 'BOTH', rsvp: 'YES', accommodation: 'Hotel Taj', transportation: 'Bus 1', notes: '' },
  ]);
  console.log(`Created ${guests.length} guests`);

  // Create albums
  const albums = await Album.create([
    { eventId: event._id, name: 'Haldi', description: 'Haldi ceremony photos', createdBy: users[0]._id },
    { eventId: event._id, name: 'Mehndi', description: 'Mehndi ceremony photos', createdBy: users[0]._id },
    { eventId: event._id, name: 'Sangeet', description: 'Sangeet night photos', createdBy: users[0]._id },
    { eventId: event._id, name: 'Wedding', description: 'Wedding ceremony photos', createdBy: users[0]._id },
    { eventId: event._id, name: 'Reception', description: 'Reception photos', createdBy: users[0]._id },
    { eventId: event._id, name: 'Family', description: 'Family photos', createdBy: users[0]._id },
    { eventId: event._id, name: 'Bride', description: 'Bride photos', createdBy: users[0]._id },
    { eventId: event._id, name: 'Groom', description: 'Groom photos', createdBy: users[0]._id },
    { eventId: event._id, name: 'Kids', description: 'Kids photos', createdBy: users[0]._id },
    { eventId: event._id, name: 'Other', description: 'Other photos', createdBy: users[0]._id },
  ]);
  console.log(`Created ${albums.length} albums`);

  // Create media (placeholder URLs)
  const media = await Media.create([
    { eventId: event._id, albumId: albums[0]._id, userId: users[0]._id, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', originalUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', mimeType: 'image/jpeg', size: 102400, filename: 'haldi-1.jpg', caption: 'Haldi ceremony', isTransparent: false, storageProvider: 'cloudinary' },
    { eventId: event._id, albumId: albums[0]._id, userId: users[0]._id, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', originalUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', mimeType: 'image/jpeg', size: 102400, filename: 'haldi-2.jpg', caption: 'Haldi fun', isTransparent: false, storageProvider: 'cloudinary' },
    { eventId: event._id, albumId: albums[1]._id, userId: users[0]._id, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', originalUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', mimeType: 'image/jpeg', size: 102400, filename: 'mehndi-1.jpg', caption: 'Mehndi designs', isTransparent: false, storageProvider: 'cloudinary' },
    { eventId: event._id, albumId: albums[1]._id, userId: users[0]._id, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', originalUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', mimeType: 'image/jpeg', size: 102400, filename: 'mehndi-2.jpg', caption: 'Mehndi night', isTransparent: false, storageProvider: 'cloudinary' },
    { eventId: event._id, albumId: albums[2]._id, userId: users[0]._id, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', originalUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', mimeType: 'image/jpeg', size: 102400, filename: 'sangeet-1.jpg', caption: 'Sangeet night', isTransparent: false, storageProvider: 'cloudinary' },
    { eventId: event._id, albumId: albums[2]._id, userId: users[0]._id, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', originalUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', mimeType: 'image/jpeg', size: 102400, filename: 'sangeet-2.jpg', caption: 'Dance performance', isTransparent: false, storageProvider: 'cloudinary' },
    { eventId: event._id, albumId: albums[3]._id, userId: users[0]._id, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', originalUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', mimeType: 'image/jpeg', size: 102400, filename: 'wedding-1.jpg', caption: 'Wedding ceremony', isTransparent: false, storageProvider: 'cloudinary' },
    { eventId: event._id, albumId: albums[3]._id, userId: users[0]._id, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', originalUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', mimeType: 'image/jpeg', size: 102400, filename: 'wedding-2.jpg', caption: 'Wedding vows', isTransparent: false, storageProvider: 'cloudinary' },
    { eventId: event._id, albumId: albums[4]._id, userId: users[0]._id, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', originalUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', mimeType: 'image/jpeg', size: 102400, filename: 'reception-1.jpg', caption: 'Reception dinner', isTransparent: false, storageProvider: 'cloudinary' },
    { eventId: event._id, albumId: albums[4]._id, userId: users[0]._id, type: 'IMAGE', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', originalUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', mimeType: 'image/jpeg', size: 102400, filename: 'reception-2.jpg', caption: 'Reception cake', isTransparent: false, storageProvider: 'cloudinary' },
  ]);
  console.log(`Created ${media.length} media items`);

  // Create expenses
  const expenses = await Expense.create([
    { eventId: event._id, title: 'Venue Booking', amount: 150000, category: 'Venue', paidBy: users[0]._id, date: new Date('2026-10-01'), notes: 'Grand Banquet Hall', createdBy: users[0]._id },
    { eventId: event._id, title: 'Catering', amount: 80000, category: 'Food', paidBy: users[2]._id, date: new Date('2026-10-15'), notes: '500 guests', createdBy: users[0]._id },
    { eventId: event._id, title: 'Photography', amount: 45000, category: 'Photography', paidBy: users[4]._id, date: new Date('2026-10-20'), notes: 'All events', createdBy: users[0]._id },
    { eventId: event._id, title: 'Decoration', amount: 35000, category: 'Decoration', paidBy: users[3]._id, date: new Date('2026-11-01'), notes: 'Flowers and lights', createdBy: users[0]._id },
    { eventId: event._id, title: 'Transportation', amount: 25000, category: 'Transport', paidBy: users[5]._id, date: new Date('2026-11-05'), notes: '2 buses', createdBy: users[0]._id },
    { eventId: event._id, title: 'Bridal Wear', amount: 60000, category: 'Clothing', paidBy: users[0]._id, date: new Date('2026-11-10'), notes: 'Bride lehenga', createdBy: users[0]._id },
    { eventId: event._id, title: 'Groom Sherwani', amount: 25000, category: 'Clothing', paidBy: users[1]._id, date: new Date('2026-11-10'), notes: 'Groom outfit', createdBy: users[0]._id },
    { eventId: event._id, title: 'Cake', amount: 15000, category: 'Food', paidBy: users[7]._id, date: new Date('2026-11-15'), notes: '5-tier cake', createdBy: users[0]._id },
    { eventId: event._id, title: 'Music/DJ', amount: 20000, category: 'Other', paidBy: users[4]._id, date: new Date('2026-11-20'), notes: 'Sangeet night', createdBy: users[0]._id },
    { eventId: event._id, title: 'Mehndi Artist', amount: 12000, category: 'Other', paidBy: users[5]._id, date: new Date('2026-11-25'), notes: 'Bride mehndi', createdBy: users[0]._id },
  ]);
  console.log(`Created ${expenses.length} expenses`);

  // Create notifications
  const notifications = await Notification.create([
    { userId: users[0]._id, familyId: family._id, eventId: event._id, type: 'TASK_ASSIGNED', title: 'Task Assigned', body: 'You were assigned: Confirm Photographer', isRead: false },
    { userId: users[0]._id, familyId: family._id, eventId: event._id, type: 'TASK_COMPLETED', title: 'Task Completed', body: 'Neha completed: Confirm Photographer', isRead: false },
    { userId: users[0]._id, familyId: family._id, eventId: event._id, type: 'NEW_RSVP', title: 'New RSVP', body: 'Aarav Sharma RSVPed YES', isRead: false },
    { userId: users[0]._id, familyId: family._id, eventId: event._id, type: 'NEW_PHOTO', title: 'New Photos', body: 'Rohit uploaded 2 photos to Haldi album', isRead: false },
    { userId: users[0]._id, familyId: family._id, eventId: event._id, type: 'EVENT_REMINDER', title: 'Event Reminder', body: 'Wedding in 12 days', isRead: false },
    { userId: users[0]._id, familyId: family._id, eventId: event._id, type: 'SCHEDULE_REMINDER', title: 'Schedule Reminder', body: 'Haldi tomorrow at 10 AM', isRead: false },
    { userId: users[0]._id, familyId: family._id, eventId: event._id, type: 'MESSAGE', title: 'New Message', body: 'Rajesh: Haldi is confirmed for Dec 15', isRead: false },
    { userId: users[0]._id, familyId: family._id, eventId: event._id, type: 'MENTION', title: 'Mention', body: 'You were mentioned in General', isRead: false },
    { userId: users[0]._id, familyId: family._id, eventId: event._id, type: 'BACKGROUND_REMOVAL_COMPLETED', title: 'Background Removal', body: 'Your transparent image is ready', isRead: false },
    { userId: users[0]._id, familyId: family._id, eventId: event._id, type: 'INVITATION_CREATED', title: 'Invitation Created', body: 'Digital invitation created for wedding', isRead: false },
  ]);
  console.log(`Created ${notifications.length} notifications`);

  console.log('\n✅ Demo data seeded successfully!');
  console.log(`\nDemo credentials:`);
  console.log(`  Email: annu@familyconnect.app`);
  console.log(`  Password: password123`);
  console.log(`\nFamily: Singh Family`);
  console.log(`Event: Annu ❤️ Naveen Wedding`);
  console.log(`  - 10 members`);
  console.log(`  - 20 tasks`);
  console.log(`  - 5 schedule items`);
  console.log(`  - 20 guests`);
  console.log(`  - 10 messages`);
  console.log(`  - 10 albums`);
  console.log(`  - 10 media items`);
  console.log(`  - 10 expenses`);
  console.log(`  - 10 notifications`);

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
}

seed().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});