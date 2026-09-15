export interface HotelSettings {
  name: string;
  tagline: string;
  supportingText: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  bookingEmail: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  checkInTime: string;
  checkOutTime: string;
  restaurantName: string;
  heroImageUrl: string;
  heroVideoUrl?: string;
  whatsappMessageTemplate: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    googleBusiness?: string;
  };

  // Hero Section Customization
  heroLocationTag?: string;
  heroCtaBookText?: string;
  heroCtaExploreText?: string;
  heroBadges?: string[];

  // Introduction / About Section Customization
  introEyebrow?: string;
  introHeading?: string;
  introParagraph1?: string;
  introParagraph2?: string;
  introImageUrl?: string;
  introBadgeTitle?: string;
  introBadgeSubtitle?: string;
  introPillars?: {
    title: string;
    description: string;
  }[];

  // Accommodation / Rooms Section Customization
  roomsEyebrow?: string;
  roomsHeading?: string;
  roomsDescription?: string;

  // Restaurant Section Customization
  restaurantEyebrow?: string;
  restaurantHeading?: string;
  restaurantDescription?: string;
  restaurantImage1Url?: string;
  restaurantImage2Url?: string;
  restaurantTimings?: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  restaurantRoomServiceNotice?: string;

  // Banquets Section Customization
  banquetsEyebrow?: string;
  banquetsHeading?: string;
  banquetsDescription?: string;

  // Gallery Section Customization
  galleryEyebrow?: string;
  galleryHeading?: string;
  galleryDescription?: string;

  // Nearby Attractions Section Customization
  placesEyebrow?: string;
  placesHeading?: string;
  placesDescription?: string;

  // Contact Section Customization
  contactEyebrow?: string;
  contactHeading?: string;
  contactDescription?: string;
}

export interface Room {
  id: string;
  name: string;
  category: 'Standard' | 'Deluxe' | 'Super Deluxe' | 'Executive';
  ac: boolean;
  shortDescription: string;
  detailedDescription: string;
  bedType: string;
  maxAdults: number;
  maxChildren: number;
  roomSizeSqFt?: number;
  baseRatePerNight?: number;
  showPrice: boolean;
  images: string[];
  featuredImage: string;
  amenities: string[];
  policies: string[];
  totalInventory?: number;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

export interface BookingRequest {
  id: string;
  referenceId: string;
  createdAt: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  roomId?: string;
  roomName?: string;
  roomCategory?: string;
  numberOfRooms: number;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled' | 'Checked In' | 'Checked Out';
  adminNotes?: string;
  estimatedTotal?: number;
  source: 'website_direct' | 'whatsapp_intent' | 'quick_bar';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'Soups & Starters' | 'Main Course' | 'Biryani & Rice' | 'Breads' | 'Chinese & Tandoor' | 'Desserts & Beverages';
  cuisine: 'Indian' | 'Chinese' | 'Continental' | 'Beverages';
  price: number;
  isVeg: boolean;
  isChefSpecial: boolean;
  isAvailable: boolean;
  imageUrl?: string;
  spicyLevel?: 'Mild' | 'Medium' | 'Spicy';
}

export interface BanquetHall {
  id: string;
  name: string;
  tagline: string;
  description: string;
  seatingCapacity?: string;
  floatingCapacity?: string;
  parkingCapacity?: string;
  cateringInfo: string;
  features: string[];
  images: string[];
  suitableFor: string[];
  isActive: boolean;
}

export interface EventEnquiry {
  id: string;
  referenceId: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  eventType: 'Wedding' | 'Family Celebration' | 'Corporate Gathering' | 'Private Event' | 'Birthday / Anniversary';
  eventDate: string;
  guestCount: string;
  message?: string;
  status: 'Pending' | 'Contacted' | 'Confirmed' | 'Archived';
  adminNotes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Hotel' | 'Rooms' | 'Restaurant' | 'Food' | 'Banquet' | 'Exterior' | 'Interior' | 'Events';
  imageUrl: string;
  caption?: string;
  isFeatured: boolean;
  order: number;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: 'Nature & Parks' | 'Waterfalls & Lakes' | 'Industrial Heritage' | 'Temples & Culture' | 'Entertainment';
  shortDescription: string;
  heroImage: string;
  lat: number;
  lng: number;
  approxDistanceKm: number;
  approxDriveMinutes: number;
  address?: string;
  openingHours?: string;
  travelTips?: string;
  googleMapsQuery?: string;
  isFeatured: boolean;
}

export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Responded';
}

export interface ReviewTestimonial {
  id: string;
  guestName: string;
  location?: string;
  rating: number;
  reviewDate: string;
  comment: string;
  stayType?: string;
  isApproved: boolean;
  isFeatured: boolean;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  badge: string;
  discountText: string;
  validUntil: string;
  terms: string;
  ctaText: string;
  isActive: boolean;
}
