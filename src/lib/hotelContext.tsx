import { useState, useEffect } from 'react';
import { 
  HotelSettings, Room, BookingRequest, MenuItem, BanquetHall, 
  EventEnquiry, GalleryItem, NearbyPlace, ContactMessage, SpecialOffer 
} from '../types';
import { 
  initialHotelSettings, initialRooms, initialMenuItems, 
  initialBanquets, initialNearbyPlaces, initialGallery, initialOffers 
} from './mockData';
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const SETTINGS_DOC = 'hotel_settings_v1';
const ROOMS_DOC = 'hotel_rooms_v1';
const BOOKINGS_DOC = 'hotel_bookings_v1';
const MENU_DOC = 'hotel_menu_v1';
const BANQUETS_DOC = 'hotel_banquets_v1';
const EVENTS_DOC = 'hotel_events_v1';
const GALLERY_DOC = 'hotel_gallery_v1';
const PLACES_DOC = 'hotel_places_v1';
const MESSAGES_DOC = 'hotel_messages_v1';
const OFFERS_DOC = 'hotel_offers_v1';

export function useHotelData() {
  const [settings, setSettings] = useState<HotelSettings>(() => {
    const saved = localStorage.getItem('udika_settings');
    return saved ? JSON.parse(saved) : initialHotelSettings;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('udika_rooms');
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    const saved = localStorage.getItem('udika_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('udika_menu');
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  const [banquets, setBanquets] = useState<BanquetHall[]>(() => {
    const saved = localStorage.getItem('udika_banquets');
    return saved ? JSON.parse(saved) : initialBanquets;
  });

  const [eventEnquiries, setEventEnquiries] = useState<EventEnquiry[]>(() => {
    const saved = localStorage.getItem('udika_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('udika_gallery');
    return saved ? JSON.parse(saved) : initialGallery;
  });

  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>(() => {
    const saved = localStorage.getItem('udika_places');
    return saved ? JSON.parse(saved) : initialNearbyPlaces;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('udika_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [offers, setOffers] = useState<SpecialOffer[]>(() => {
    const saved = localStorage.getItem('udika_offers');
    return saved ? JSON.parse(saved) : initialOffers;
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Sync with Firestore on mount
  useEffect(() => {
    async function loadCloudData() {
      try {
        setIsSyncing(true);
        // Load Settings
        const settingsRef = doc(db, 'cms', SETTINGS_DOC);
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as HotelSettings);
        } else {
          await setDoc(settingsRef, initialHotelSettings);
        }

        // Load Rooms
        const roomsRef = doc(db, 'cms', ROOMS_DOC);
        const roomsSnap = await getDoc(roomsRef);
        if (roomsSnap.exists() && roomsSnap.data().items) {
          setRooms(roomsSnap.data().items as Room[]);
        } else {
          await setDoc(roomsRef, { items: initialRooms });
        }

        // Load Bookings
        const bookingsRef = doc(db, 'cms', BOOKINGS_DOC);
        const bookingsSnap = await getDoc(bookingsRef);
        if (bookingsSnap.exists() && bookingsSnap.data().items) {
          setBookings(bookingsSnap.data().items as BookingRequest[]);
        }

        // Load Menu
        const menuRef = doc(db, 'cms', MENU_DOC);
        const menuSnap = await getDoc(menuRef);
        if (menuSnap.exists() && menuSnap.data().items) {
          setMenuItems(menuSnap.data().items as MenuItem[]);
        } else {
          await setDoc(menuRef, { items: initialMenuItems });
        }

        // Load Banquets
        const banquetsRef = doc(db, 'cms', BANQUETS_DOC);
        const banquetsSnap = await getDoc(banquetsRef);
        if (banquetsSnap.exists() && banquetsSnap.data().items) {
          setBanquets(banquetsSnap.data().items as BanquetHall[]);
        } else {
          await setDoc(banquetsRef, { items: initialBanquets });
        }

        // Load Events
        const eventsRef = doc(db, 'cms', EVENTS_DOC);
        const eventsSnap = await getDoc(eventsRef);
        if (eventsSnap.exists() && eventsSnap.data().items) {
          setEventEnquiries(eventsSnap.data().items as EventEnquiry[]);
        }

        // Load Places
        const placesRef = doc(db, 'cms', PLACES_DOC);
        const placesSnap = await getDoc(placesRef);
        if (placesSnap.exists() && placesSnap.data().items) {
          setNearbyPlaces(placesSnap.data().items as NearbyPlace[]);
        } else {
          await setDoc(placesRef, { items: initialNearbyPlaces });
        }

        // Load Gallery
        const galleryRef = doc(db, 'cms', GALLERY_DOC);
        const gallerySnap = await getDoc(galleryRef);
        if (gallerySnap.exists() && gallerySnap.data().items) {
          setGallery(gallerySnap.data().items as GalleryItem[]);
        } else {
          await setDoc(galleryRef, { items: initialGallery });
        }

        // Load Messages
        const msgRef = doc(db, 'cms', MESSAGES_DOC);
        const msgSnap = await getDoc(msgRef);
        if (msgSnap.exists() && msgSnap.data().items) {
          setMessages(msgSnap.data().items as ContactMessage[]);
        }

        // Load Offers
        const offersRef = doc(db, 'cms', OFFERS_DOC);
        const offersSnap = await getDoc(offersRef);
        if (offersSnap.exists() && offersSnap.data().items) {
          setOffers(offersSnap.data().items as SpecialOffer[]);
        } else {
          await setDoc(offersRef, { items: initialOffers });
        }
      } catch (err) {
        console.warn('Firestore sync note: using cached local storage while cloud establishes', err);
      } finally {
        setIsSyncing(false);
      }
    }

    loadCloudData();
  }, []);

  // Save to local storage as fallback and cache
  useEffect(() => {
    localStorage.setItem('udika_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('udika_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('udika_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('udika_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('udika_banquets', JSON.stringify(banquets));
  }, [banquets]);

  useEffect(() => {
    localStorage.setItem('udika_events', JSON.stringify(eventEnquiries));
  }, [eventEnquiries]);

  useEffect(() => {
    localStorage.setItem('udika_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('udika_places', JSON.stringify(nearbyPlaces));
  }, [nearbyPlaces]);

  useEffect(() => {
    localStorage.setItem('udika_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('udika_offers', JSON.stringify(offers));
  }, [offers]);

  // Mutations with dual cloud & local persistence
  const updateSettings = async (newSettings: HotelSettings) => {
    setSettings(newSettings);
    try {
      await setDoc(doc(db, 'cms', SETTINGS_DOC), newSettings);
    } catch (e) {
      console.error('Failed to sync settings to Firestore:', e);
    }
  };

  const addBooking = async (booking: Omit<BookingRequest, 'id' | 'referenceId' | 'createdAt' | 'status'>) => {
    const referenceId = `UDK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: BookingRequest = {
      ...booking,
      id: `book-${Date.now()}`,
      referenceId,
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    try {
      await setDoc(doc(db, 'cms', BOOKINGS_DOC), { items: updated });
    } catch (e) {
      console.error('Failed to sync booking to Firestore:', e);
    }
    return newBooking;
  };

  const updateBookingStatus = async (id: string, status: BookingRequest['status'], adminNotes?: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status, adminNotes: adminNotes ?? b.adminNotes } : b);
    setBookings(updated);
    try {
      await setDoc(doc(db, 'cms', BOOKINGS_DOC), { items: updated });
    } catch (e) {
      console.error('Failed to sync booking status to Firestore:', e);
    }
  };

  const updateRooms = async (newRooms: Room[]) => {
    setRooms(newRooms);
    try {
      await setDoc(doc(db, 'cms', ROOMS_DOC), { items: newRooms });
    } catch (e) {
      console.error('Failed to sync rooms to Firestore:', e);
    }
  };

  const addEventEnquiry = async (enquiry: Omit<EventEnquiry, 'id' | 'referenceId' | 'createdAt' | 'status'>) => {
    const referenceId = `EVT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newEnquiry: EventEnquiry = {
      ...enquiry,
      id: `evt-${Date.now()}`,
      referenceId,
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };
    const updated = [newEnquiry, ...eventEnquiries];
    setEventEnquiries(updated);
    try {
      await setDoc(doc(db, 'cms', EVENTS_DOC), { items: updated });
    } catch (e) {
      console.error('Failed to sync event enquiry to Firestore:', e);
    }
    return newEnquiry;
  };

  const updateEnquiryStatus = async (id: string, status: EventEnquiry['status']) => {
    const updated = eventEnquiries.map(e => e.id === id ? { ...e, status } : e);
    setEventEnquiries(updated);
    try {
      await setDoc(doc(db, 'cms', EVENTS_DOC), { items: updated });
    } catch (e) {
      console.error('Failed to sync event enquiry status to Firestore:', e);
    }
  };

  const updateMenu = async (newItems: MenuItem[]) => {
    setMenuItems(newItems);
    try {
      await setDoc(doc(db, 'cms', MENU_DOC), { items: newItems });
    } catch (e) {
      console.error('Failed to sync menu to Firestore:', e);
    }
  };

  const updateBanquets = async (newHalls: BanquetHall[]) => {
    setBanquets(newHalls);
    try {
      await setDoc(doc(db, 'cms', BANQUETS_DOC), { items: newHalls });
    } catch (e) {
      console.error('Failed to sync banquets to Firestore:', e);
    }
  };

  const updateGallery = async (newGallery: GalleryItem[]) => {
    setGallery(newGallery);
    try {
      await setDoc(doc(db, 'cms', GALLERY_DOC), { items: newGallery });
    } catch (e) {
      console.error('Failed to sync gallery to Firestore:', e);
    }
  };

  const updateNearbyPlaces = async (newPlaces: NearbyPlace[]) => {
    setNearbyPlaces(newPlaces);
    try {
      await setDoc(doc(db, 'cms', PLACES_DOC), { items: newPlaces });
    } catch (e) {
      console.error('Failed to sync nearby places to Firestore:', e);
    }
  };

  const addContactMessage = async (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Unread',
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    try {
      await setDoc(doc(db, 'cms', MESSAGES_DOC), { items: updated });
    } catch (e) {
      console.error('Failed to sync contact message to Firestore:', e);
    }
    return newMsg;
  };

  const updateOffers = async (newOffers: SpecialOffer[]) => {
    setOffers(newOffers);
    try {
      await setDoc(doc(db, 'cms', OFFERS_DOC), { items: newOffers });
    } catch (e) {
      console.error('Failed to sync offers to Firestore:', e);
    }
  };

  return {
    settings,
    updateSettings,
    rooms,
    updateRooms,
    bookings,
    addBooking,
    updateBookingStatus,
    menuItems,
    updateMenu,
    banquets,
    updateBanquets,
    eventEnquiries,
    addEventEnquiry,
    updateEnquiryStatus,
    gallery,
    updateGallery,
    nearbyPlaces,
    updateNearbyPlaces,
    messages,
    addContactMessage,
    offers,
    updateOffers,
    isSyncing,
  };
}
