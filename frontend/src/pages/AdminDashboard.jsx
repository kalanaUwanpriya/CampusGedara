import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Settings, LogOut, Database, Users, MapPin, Search, Edit2, Trash2, Plus, Monitor, BookOpen, Library, Layout, Activity, Home, Building, Coffee, Bus, CheckCircle, XCircle, GraduationCap, Calendar, Trophy, ChevronDown, ChevronUp, Upload, Loader2, Play, ExternalLink, Mail, Phone, Clock, FileText, QrCode } from 'lucide-react';
import AdminQRScanner from '../components/AdminQRScanner';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';


const mockEvents = [
    { id: 1, name: 'Annual Tech Symposium', date: '2026-04-15', location: 'Main Auditorium', attendees: 350, status: 'Upcoming' },
    { id: 2, name: 'Career Fair 2026', date: '2026-05-10', location: 'Campus Grounds', attendees: 1200, status: 'Planning' },
    { id: 3, name: 'Freshers Welcome Party', date: '2026-06-01', location: 'Student Union', attendees: 500, status: 'Upcoming' },
];


const mockLiving = [
    { id: 1, name: 'North Campus Hostel', type: 'Accommodation', capacity: 300, currentOccupancy: 285, status: 'Active' },
    { id: 2, name: 'Main Cafeteria', type: 'Food', capacity: 500, currentOccupancy: 350, status: 'Active' },
    { id: 3, name: 'Campus Shuttle A', type: 'Transportation', capacity: 40, currentOccupancy: 15, status: 'In Transit' },
    { id: 4, name: 'South Wing Dorms', type: 'Accommodation', capacity: 200, currentOccupancy: 200, status: 'Full' },
];

const AdminDashboard = () => {
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Redirection removed as per user request to allow access without login



    // --- All States ---
    const [resources, setResources] = useState([]);
    const [livingItems, setLivingItems] = useState([]);
    const [resourceBookings, setResourceBookings] = useState([]);
    const [expandedResourceId, setExpandedResourceId] = useState(null);
    const [expandedEventId, setExpandedEventId] = useState(null);
    const [eventRegistrations, setEventRegistrations] = useState({});
    const [loadingRegistrations, setLoadingRegistrations] = useState(false);
    const [studyGroups, setStudyGroups] = useState([]);
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('resources');
    const [editModal, setEditModal] = useState({ show: false, mode: 'add', resource: null });
    const [studyModal, setStudyModal] = useState({ show: false, mode: 'add', group: null });
    const [eventModal, setEventModal] = useState({ show: false, mode: 'add', event: null });
    const [userModal, setUserModal] = useState({ show: false, mode: 'add', user: null });
    const [livingModal, setLivingModal] = useState({ show: false, mode: 'add', item: null, type: 'Accommodation' });
    const [materialModal, setMaterialModal] = useState({ show: false, groupId: null, groupName: '', materials: [] });
    const [loadingMaterials, setLoadingMaterials] = useState(false);
    const [livingTypeFilter, setLivingTypeFilter] = useState('All');
    const [livingFilterOpen, setLivingFilterOpen] = useState(false);
    const [livingServiceImages, setLivingServiceImages] = useState([]);
    const [livingDragOver, setLivingDragOver] = useState(false);
    const [contactEmailValue, setContactEmailValue] = useState('');
    const [emailError, setEmailError] = useState('');
    const [foodAvailableMeals, setFoodAvailableMeals] = useState([]);
    const [foodDiningOptions, setFoodDiningOptions] = useState([]);
    const [foodOperatingHours, setFoodOperatingHours] = useState('');
    const [foodMenuItems, setFoodMenuItems] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [showQRScanner, setShowQRScanner] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
    };

    // --- All Effects ---
    useEffect(() => {
        const fetchLivingItems = async () => {
            try {
                const [accRes, transRes, foodRes] = await Promise.all([
                    axios.get('/api/accommodations'),
                    axios.get('/api/transportation'),
                    axios.get('/api/food-services')
                ]);
                const formattedAcc = Array.isArray(accRes.data) ? accRes.data.map(item => ({
                    id: item._id, name: item.buildingName, type: 'Accommodation', accType: item.type,
                    capacity: item.bedrooms, currentOccupancy: 0, status: item.status || 'Available',
                    price: item.price, bathrooms: item.bathrooms, size: item.size, distance: item.distance,
                    description: item.description,
                    amenities: Array.isArray(item.amenities) ? item.amenities.join(', ') : (item.amenities || ''),
                    contactPhone: item.contactPhone, contactEmail: item.contactEmail, images: item.images || (item.image ? [item.image] : [])
                })) : [];
                const formattedTrans = Array.isArray(transRes.data) ? transRes.data.map(item => ({
                    id: item._id, name: item.vehicleName, type: 'Transportation', capacity: item.capacity,
                    currentOccupancy: item.currentPassengers || 0, status: item.status || 'Available',
                    startLocation: item.startLocation, endLocation: item.endLocation, startTime: item.startTime,
                    ticketPrice: item.ticketPrice, duration: item.duration, vehicleName: item.vehicleName
                })) : [];
                const formattedFood = Array.isArray(foodRes.data) ? foodRes.data.map(item => ({
                    id: item._id, name: item.restaurantName, type: 'Food', locationType: item.locationType,
                    availableMeals: item.availableMeals || [], diningOptions: item.diningOptions || [],
                    email: item.email, phone: item.phone, description: item.description, location: item.location,
                    images: item.images || [], menuItems: item.menuItems || [], status: 'Active'
                })) : [];
                setLivingItems([...formattedAcc, ...formattedTrans, ...formattedFood]);
            } catch (error) { 
                console.error("Error fetching living items:", error);
                setLivingItems([]);
            }
        };
        const fetchResourcesFromServer = async () => {
            try {
                console.log('Fetching resources from: http://localhost:5001/api/resources');
                const { data } = await axios.get('http://localhost:5001/api/resources');
                if (Array.isArray(data)) {
                    setResources(data.map(r => ({
                        id: r._id, name: r.name, category: r.category,
                        location: `${r.building}, Floor ${r.floor}`, availableSeats: r.availableSeats,
                        totalSeats: r.capacity, status: r.availableSeats === 0 ? 'Full' : r.availableSeats < (r.capacity * 0.2) ? 'Filling Fast' : 'Available',
                        locationId: r.locationId, building: r.building, floor: r.floor, operatingHours: r.operatingHours
                    })));
                } else {
                    setResources([]);
                }
            } catch (error) { console.error("Error fetching resources:", error); setResources([]); }
        };
        fetchLivingItems();
        if (activeTab === 'resources') {
            fetchResourcesFromServer();
        }
    }, [activeTab]);

    useEffect(() => {
        const fetchStudyGroups = async () => {
            try {
                const { data } = await axios.get('/api/study-groups');
                if (Array.isArray(data)) {
                    setStudyGroups(data.map(group => ({
                        id: group._id, name: group.groupName, subject: group.subjectCode + ' - ' + group.subjectName,
                        year: group.year, semester: group.semester, subjectName: group.subjectName,
                        subjectCode: group.subjectCode, groupName: group.groupName, description: group.description,
                        createdBy: group.createdBy, membersCount: group.members, image: group.image, status: 'Active'
                    })));
                } else {
                    setStudyGroups([]);
                }
            } catch (error) { 
                console.error("Error fetching study groups:", error); 
                setStudyGroups([]); 
            }
        };
        fetchStudyGroups();
        const intervalId = setInterval(fetchStudyGroups, 10000);
        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        if (!userInfo?.token) return;
        const fetchBookings = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('http://localhost:5001/api/resource-bookings', config);
                console.log('Admin: Fetched Bookings:', data);
                setResourceBookings(Array.isArray(data) ? data : []);
            } catch (error) { 
                console.error("Admin: Error fetching bookings:", error); 
                setResourceBookings([]); 
            }
        };
        if (activeTab === 'resources') {
            fetchBookings();
        }
    }, [userInfo, activeTab]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('/api/events');
                if (Array.isArray(data)) {
                    setEvents(data.map(e => ({
                        id: e._id, name: e.name, date: e.date, time: e.time, location: e.location,
                        category: e.category, description: e.description, eligibility: e.eligibility,
                        organizer: e.organizer, image: e.image, attendees: e.attendees || 0, status: 'Upcoming'
                    })));
                } else {
                    setEvents([]);
                }
            } catch (error) { console.error("Error fetching events:", error); setEvents([]); }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/api/users');
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) { 
                console.error("Error fetching users:", error); 
                setUsers([]);
            }
        };
        fetchUsers();
    }, []);



    useEffect(() => {
        if (livingModal.show && livingModal.mode === 'edit' && livingModal.item) {
            setLivingServiceImages(livingModal.item.images || (livingModal.item.image ? [livingModal.item.image] : []));
            setContactEmailValue(livingModal.item.contactEmail || livingModal.item.email || '');
            if (livingModal.item.type === 'Food') {
                setFoodAvailableMeals(livingModal.item.availableMeals || []);
                setFoodDiningOptions(livingModal.item.diningOptions || []);
                setFoodOperatingHours(livingModal.item.operatingHours || '');
                setFoodMenuItems(livingModal.item.menuItems || []);
            }
        } else if (!livingModal.show || livingModal.mode === 'add') {
            setLivingServiceImages([]); setContactEmailValue(''); setEmailError('');
            setFoodAvailableMeals([]); setFoodDiningOptions([]); setFoodOperatingHours(''); setFoodMenuItems([]);
        }
    }, [livingModal.show, livingModal.mode, livingModal.item]);

    const validateEmail = (value) => {
        if (!value) return 'Contact email is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address (e.g. user@example.com).';
        return '';
    };

    const handleLivingImageSelect = async (files) => {
        const _files = Array.from(files);
        if (_files.length === 0) return;
        
        let newImages = [...livingServiceImages];
        let oversized = false;

        for (const file of _files) {
            if (newImages.length >= 3) break;
            if (file.size > 5 * 1024 * 1024) {
                oversized = true;
                continue;
            }
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
            if (!newImages.includes(base64)) {
                newImages.push(base64);
            }
        }
        
        if (oversized) {
            alert('Some images were skipped because they exceed the 5MB limit.');
        }

        setLivingServiceImages(newImages);
    };

    const handleLivingImageDrop = (e) => {
        e.preventDefault();
        setLivingDragOver(false);
        if (e.dataTransfer.files) {
            handleLivingImageSelect(e.dataTransfer.files);
        }
    };
    
    const removeLivingImage = (index) => {
        setLivingServiceImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                if (!userInfo?.token) return;
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/resources/${id}`, config);
                setResources(resources.filter(r => r.id !== id));
            } catch (error) {
                console.error("Error deleting resource:", error);
                alert("Failed to delete resource.");
            }
        }
    };

    const [resourceImage, setResourceImage] = useState('');

    const handleSaveResource = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const file = e.target.imageFile?.files[0];
        let base64Image = resourceImage;

        if (file) {
            base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        }

        const resourceData = {
            name: formData.get('name'),
            category: formData.get('category'),
            locationId: formData.get('locationId'),
            building: formData.get('building'),
            floor: parseInt(formData.get('floor'), 10),
            operatingHours: `${formData.get('openTime')} - ${formData.get('closeTime')}`,
            capacity: parseInt(formData.get('totalSeats'), 10),
            image: base64Image
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo?.token}`
                }
            };
            
            if (editModal.mode === 'add') {
                console.log('Creating resource at: http://localhost:5001/api/resources', resourceData);
                const { data } = await axios.post('http://localhost:5001/api/resources', resourceData, config);
                const newDoc = {
                    id: data._id,
                    name: data.name,
                    category: data.category,
                    location: `${data.building}, Floor ${data.floor}`,
                    availableSeats: data.availableSeats,
                    totalSeats: data.capacity,
                    status: 'Available',
                    locationId: data.locationId,
                    building: data.building,
                    floor: data.floor,
                    operatingHours: data.operatingHours
                };
                setResources([newDoc, ...resources]);
                showToast('✅ Resource created successfully!');
            } else {
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                console.log('Updating resource at: http://localhost:5001/api/resources/' + editModal.resource.id, resourceData);
                const { data } = await axios.put(`http://localhost:5001/api/resources/${editModal.resource.id}`, resourceData, config);
                const updatedDoc = {
                    id: data._id,
                    name: data.name,
                    category: data.category,
                    location: `${data.building}, Floor ${data.floor}`,
                    availableSeats: data.availableSeats,
                    totalSeats: data.capacity,
                    status: data.availableSeats === 0 ? 'Full' : data.availableSeats < (data.capacity * 0.2) ? 'Filling Fast' : 'Available',
                    locationId: data.locationId,
                    building: data.building,
                    floor: data.floor,
                    operatingHours: data.operatingHours
                };
                setResources(resources.map(r => r.id === editModal.resource.id ? updatedDoc : r));
                showToast('✅ Resource updated successfully!');
            }
            setEditModal({ show: false, mode: 'add', resource: null });
        } catch (error) {
            console.error("Error saving resource:", error);
            const message = error.response?.data?.message || error.message;
            alert("Failed to save resource: " + message);
        }
    };

    const handleSaveStudyGroup = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        let imageBase64 = studyModal.group?.image || '';
        const imageFile = formData.get('imageFile');

        if (imageFile && imageFile.size > 0) {
            imageBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(imageFile);
            });
        }

        const studyData = {
            ...Object.fromEntries(formData.entries()),
            image: imageBase64
        };

        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        console.log('Sending study data:', studyData);
        console.log('Using config:', config);

        try {
            if (studyModal.mode === 'add') {
                const { data } = await axios.post('/api/study-groups', studyData, config);
                const newDoc = {
                    id: data._id,
                    name: data.groupName,
                    subject: data.subjectCode + ' - ' + data.subjectName,
                    year: data.year,
                    semester: data.semester,
                    subjectName: data.subjectName,
                    subjectCode: data.subjectCode,
                    groupName: data.groupName,
                    description: data.description,
                    createdBy: data.createdBy,
                    membersCount: data.members,
                    image: data.image,
                    status: 'Active'
                };
                setStudyGroups([newDoc, ...studyGroups]);
            } else {
                const { data } = await axios.put(`/api/study-groups/${studyModal.group.id}`, studyData, config);
                setStudyGroups(studyGroups.map(g => g.id === studyModal.group.id ? {
                    ...g,
                    ...studyData,
                    name: data.groupName,
                    subject: data.subjectCode + ' - ' + data.subjectName,
                    image: data.image
                } : g));
            }
            setStudyModal({ show: false, mode: 'add', group: null });
        } catch (error) {
            console.error('Error saving study group:', error);
            const message = error.response?.data?.message || error.message;
            alert('Failed to save study group: ' + message);
        }
    };

    const handleDeleteStudyGroup = async (id) => {
        if (window.confirm('Are you sure you want to delete this study group?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                await axios.delete(`/api/study-groups/${id}`, config);
                setStudyGroups(studyGroups.filter(g => g.id !== id));
            } catch (error) {
                console.error("Error deleting study group:", error);
                const message = error.response?.data?.message || error.message;
                alert('Failed to delete study group: ' + message);
            }
        }
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        let imageBase64 = eventModal.event?.image || '';
        const imageFile = formData.get('imageFile');

        // Convert image to Base64 if a new file is selected
        if (imageFile && imageFile.size > 0) {
            imageBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(imageFile);
            });
        }

        const eventData = {
            name: formData.get('name'),
            category: formData.get('category'),
            location: formData.get('location'),
            date: formData.get('date'),
            time: formData.get('time'),
            description: formData.get('description'),
            eligibility: formData.get('eligibility'),
            organizer: formData.get('organizer'),
            image: imageBase64,
        };

        try {
            const config = userInfo?.token ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : {};
            if (eventModal.mode === 'add') {
                const { data } = await axios.post('/api/events', eventData, config);
                const newDoc = {
                    id: data._id,
                    ...eventData,
                    attendees: 0,
                    status: 'Upcoming'
                };
                setEvents([newDoc, ...events]);
            } else {
                const { data } = await axios.put(`/api/events/${eventModal.event.id}`, eventData, config);
                const updatedDoc = {
                    id: data._id,
                    ...eventData,
                    attendees: eventModal.event.attendees,
                    status: 'Upcoming'
                };
                setEvents(events.map(ev => ev.id === eventModal.event.id ? updatedDoc : ev));
            }
            setEventModal({ show: false, mode: 'add', event: null });
        } catch (error) {
            console.error("Error saving event:", error);
            alert("Failed to save event.");
        }
    };


    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const config = userInfo?.token ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : {};
                await axios.delete(`/api/events/${id}`, config);
                setEvents(events.filter(ev => ev.id !== id));
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Failed to delete event.");
            }
        }
    };



    const handleSaveLiving = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const type = livingModal.type;

        if (emailError) {
            alert("Please fix the errors before submitting");
            return;
        }

        if (type === 'Accommodation') {
            try {
                const newDoc = {
                    buildingName: name,
                    price: Number(formData.get('price')),
                    type: formData.get('accType'),
                    bedrooms: Number(formData.get('bedrooms')),
                    bathrooms: Number(formData.get('bathrooms')),
                    size: Number(formData.get('size')),
                    distance: Number(formData.get('distance')),
                    description: formData.get('description'),
                    amenities: formData.get('amenities') || '',
                    contactPhone: formData.get('contactPhone'),
                    contactEmail: formData.get('contactEmail'),
                    status: formData.get('status'),
                    images: livingServiceImages
                };

                let data;
                if (livingModal.mode === 'add') {
                    const response = await axios.post('/api/accommodations', newDoc);
                    data = response.data;
                } else {
                    const response = await axios.put(`/api/accommodations/${livingModal.item.id}`, newDoc);
                    data = response.data;
                }

                const localAdminDoc = {
                    id: data._id,
                    name: data.buildingName,
                    type: 'Accommodation',
                    accType: data.type,
                    capacity: data.bedrooms,
                    currentOccupancy: 0,
                    price: data.price,
                    bathrooms: data.bathrooms,
                    size: data.size,
                    distance: data.distance,
                    description: data.description,
                    amenities: Array.isArray(data.amenities) ? data.amenities.join(', ') : (data.amenities || ''),
                    contactPhone: data.contactPhone,
                    contactEmail: data.contactEmail,
                    status: data.status,
                    images: data.images || []
                };

                if (livingModal.mode === 'add') {
                    setLivingItems([localAdminDoc, ...livingItems]);
                    showToast('✅ Accommodation added successfully!');
                } else {
                    setLivingItems(livingItems.map(l => l.id === livingModal.item.id ? localAdminDoc : l));
                    showToast('✅ Accommodation updated successfully!');
                }
                // Close modal only on success
                setLivingModal({ show: false, mode: 'add', item: null, type: 'Accommodation' });
            } catch (error) {
                console.error("Error saving accommodation:", error);
                const errMsg = error.response?.data?.errors
                    ? error.response.data.errors.join('\n')
                    : (error.response?.data?.message || error.message);
                alert("Failed to save accommodation:\n" + errMsg);
            }
        } else if (type === 'Transportation') {
            try {
                const transDoc = {
                    vehicleName: formData.get('vehicleName'),
                    startLocation: formData.get('startLocation'),
                    endLocation: formData.get('endLocation'),
                    startTime: `${formData.get('startHour')}:${formData.get('startMinute')} ${formData.get('startAmPm')}`,
                    ticketPrice: Number(formData.get('ticketPrice')),
                    duration: formData.get('duration'),
                    capacity: Number(formData.get('capacity')),
                    status: formData.get('status')
                };

                let data;
                if (livingModal.mode === 'add') {
                    const response = await axios.post('/api/transportation', transDoc);
                    data = response.data;
                } else {
                    const response = await axios.put(`/api/transportation/${livingModal.item.id}`, transDoc);
                    data = response.data;
                }

                const localAdminDoc = {
                    id: data._id,
                    name: data.vehicleName,
                    type: 'Transportation',
                    capacity: data.capacity,
                    currentOccupancy: data.currentPassengers || 0,
                    status: data.status,
                    startLocation: data.startLocation,
                    endLocation: data.endLocation,
                    startTime: data.startTime,
                    ticketPrice: data.ticketPrice,
                    duration: data.duration,
                    vehicleName: data.vehicleName
                };

                if (livingModal.mode === 'add') {
                    setLivingItems([localAdminDoc, ...livingItems]);
                    showToast('✅ Transportation route added successfully!');
                } else {
                    setLivingItems(livingItems.map(l => l.id === livingModal.item.id ? localAdminDoc : l));
                    showToast('✅ Transportation route updated successfully!');
                }
                setLivingModal({ show: false, mode: 'add', item: null, type: 'Accommodation' });
            } catch (error) {
                console.error("Error saving transportation:", error);
                alert("Failed to save transportation service.");
            }
        } else if (type === 'Food') {
            try {
                const foodDoc = {
                    restaurantName: name, // User input name mapped to restaurantName
                    locationType: formData.get('locationType'),
                    availableMeals: foodAvailableMeals,
                    diningOptions: foodDiningOptions,
                    operatingHours: foodOperatingHours,
                    email: contactEmailValue,
                    phone: formData.get('phone'),
                    description: formData.get('description'),
                    location: formData.get('location'),
                    images: livingServiceImages, // Base64
                    menuItems: foodMenuItems
                };

                let data;
                if (livingModal.mode === 'add') {
                    const response = await axios.post('/api/food-services', foodDoc);
                    data = response.data;
                } else {
                    const response = await axios.put(`/api/food-services/${livingModal.item.id}`, foodDoc);
                    data = response.data;
                }

                const localAdminDoc = {
                    id: data._id,
                    name: data.restaurantName,
                    type: 'Food',
                    locationType: data.locationType,
                    availableMeals: data.availableMeals || [],
                    diningOptions: data.diningOptions || [],
                    operatingHours: data.operatingHours || '',
                    email: data.email,
                    phone: data.phone,
                    description: data.description,
                    location: data.location,
                    images: data.images || [],
                    menuItems: data.menuItems || [],
                    status: 'Active'
                };

                if (livingModal.mode === 'add') {
                    setLivingItems([localAdminDoc, ...livingItems]);
                    showToast('✅ Food & Dining service added successfully!');
                } else {
                    setLivingItems(livingItems.map(l => l.id === livingModal.item.id ? localAdminDoc : l));
                    showToast('✅ Food & Dining service updated successfully!');
                }
                setLivingModal({ show: false, mode: 'add', item: null, type: 'Accommodation' });
                // Reset state
                setFoodAvailableMeals([]);
                setFoodDiningOptions([]);
                setFoodOperatingHours('');
                setFoodMenuItems([]);
                setContactEmailValue('');
                setEmailError('');
                setLivingServiceImages([]);
            } catch (error) {
                console.error("Error saving food service:", error);
                const errMsg = error.response?.data?.errors
                    ? error.response.data.errors.join('\n')
                    : (error.response?.data?.message || error.message);
                alert("Failed to save food service:\n" + errMsg);
            }
        }
    };

    const handleDeleteLiving = async (item) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            if (item.type === 'Accommodation') {
                try {
                    await axios.delete(`/api/accommodations/${item.id}`);
                    setLivingItems(livingItems.filter(l => l.id !== item.id));
                    showToast('🗑️ Accommodation deleted.');
                } catch (error) {
                    console.error("Error deleting accommodation:", error);
                    alert("Failed to delete accommodation.");
                }
            } else if (item.type === 'Transportation') {
                try {
                    await axios.delete(`/api/transportation/${item.id}`);
                    setLivingItems(livingItems.filter(l => l.id !== item.id));
                    showToast('🗑️ Transportation route deleted.');
                } catch (error) {
                    console.error("Error deleting transportation:", error);
                    alert("Failed to delete transportation service.");
                }
            } else if (item.type === 'Food') {
                try {
                    await axios.delete(`/api/food-services/${item.id}`);
                    setLivingItems(livingItems.filter(l => l.id !== item.id));
                    showToast('🗑️ Food service deleted.');
                } catch (error) {
                    console.error("Error deleting food service:", error);
                    alert("Failed to delete food service.");
                }
            } else {
                setLivingItems(livingItems.filter(l => l.id !== item.id));
            }
        }
    };



    const toggleLivingStatus = async (item) => {
        if (item.type !== 'Accommodation') return;

        const newStatus = item.status === 'Available' ? 'Booked' : 'Available';

        // Optimistic Update
        setLivingItems(livingItems.map(l => l.id === item.id ? { ...l, status: newStatus } : l));

        try {
            const config = userInfo?.token ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : {};
            await axios.put(`/api/accommodations/${item.id}`, { status: newStatus }, config);
        } catch (error) {
            console.error("Error toggling accommodation status:", error);
            // Revert on error
            setLivingItems(livingItems.map(l => l.id === item.id ? { ...l, status: item.status } : l));
            alert("Failed to update status. Please try again.");
        }
    };

    const filteredResources = resources.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredLiving = livingItems.filter(l => {
        const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = livingTypeFilter === 'All' || l.type === livingTypeFilter;
        return matchesSearch && matchesType;
    });
    const filteredStudyGroups = studyGroups.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredEvents = events.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleGenerateLivingReport = () => {
        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();

        // Header
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Student Living Summary Report", 14, 20);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text(`Generated on: ${timestamp}`, 14, 28);
        doc.text(`Filter Category: ${livingTypeFilter === 'All' ? 'All Types' : livingTypeFilter}`, 14, 33);
        if (searchQuery) doc.text(`Search Query: "${searchQuery}"`, 14, 38);

        // Prepare table data
        const tableBody = filteredLiving.map((item, index) => [
            index + 1,
            item.name,
            item.type,
            `${item.currentOccupancy} / ${item.capacity}`,
            item.status
        ]);

        autoTable(doc, {
            startY: searchQuery ? 45 : 40,
            head: [['#', 'Service Name', 'Type', 'Capacity', 'Status']],
            body: tableBody,
            headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' }, // indigo-600
            alternateRowStyles: { fillColor: [249, 250, 251] }, // bg-slate-50
            styles: { fontSize: 9, cellPadding: 4 },
            margin: { top: 40 },
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount} - Admin Portal`, 14, doc.internal.pageSize.height - 10);
        }

        const fileName = `Living_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/api/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());

        try {
            if (userModal.mode === 'add') {
                const { data } = await axios.post('/api/users', userData);
                setUsers([data, ...users]);
            } else {
                const { data } = await axios.put(`/api/users/${userModal.user._id}`, userData);
                setUsers(users.map(u => u._id === userModal.user._id ? { ...u, ...data } : u));
            }
            setUserModal({ show: false, mode: 'add', user: null });
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Failed to save user: " + (error.response?.data?.message || error.message));
        }
    };

    const handleToggleEventRegistrations = async (eventId) => {
        if (expandedEventId === eventId) {
            setExpandedEventId(null);
            return;
        }

        setExpandedEventId(eventId);
        
        // Fetch only if not already fetched inside the state
        if (!eventRegistrations[eventId]) {
            setLoadingRegistrations(true);
            try {
                if (!userInfo?.token) return;
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`/api/event-registrations/event/${eventId}`, config);
                setEventRegistrations(prev => ({
                    ...prev,
                    [eventId]: data
                }));
            } catch (error) {
                console.error("Error fetching event registrations:", error);
            } finally {
                setLoadingRegistrations(false);
            }
        }
    };

    const handleManageMaterials = async (groupId, groupName) => {
        // Open modal immediately to show responsiveness
        setMaterialModal({ show: true, groupId, groupName, materials: [] });
        setLoadingMaterials(true);
        try {
            // Attempt to fetch materials (public access)
            const config = userInfo?.token ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : {};
            const { data } = await axios.get(`/api/study-materials/${groupId}`, config);
            setMaterialModal(prev => ({ ...prev, materials: Array.isArray(data) ? data : [] }));
        } catch (error) {
            console.error("Error fetching materials:", error);
            setMaterialModal(prev => ({ ...prev, materials: [] }));
        } finally {
            setLoadingMaterials(false);
        }
    };

    const handleDeleteMaterial = async (materialId) => {
        if (window.confirm('Are you sure you want to permanently delete this material?')) {
            // Optimistic update: Remove from UI immediately
            setMaterialModal(prev => ({
                ...prev,
                materials: prev.materials.filter(m => m._id !== materialId)
            }));

            try {
                if (!userInfo?.token) return;
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/study-materials/${materialId}`, config);
                showToast('Material removed successfully', 'success');
            } catch (error) {
                console.error("Error deleting material:", error);
                alert("Failed to delete material. It might still exist.");
                // Optional: Re-fetch materials if delete fails to sync UI
                handleManageMaterials(materialModal.groupId, materialModal.groupName);
            }
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-white to-blue-50/80 flex">

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm animate-bounce-in transition-all ${
                    toast.type === 'success'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-rose-500 to-red-500 shadow-rose-500/30'
                }`}>
                    <span className="text-lg">{toast.type === 'success' ? '🎉' : '⚠️'}</span>
                    {toast.message}
                </div>
            )}



            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Settings className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-black tracking-tight">Admin Portal</h2>
                    </div>
                </div>

                <div className="flex-1 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'resources' ? 'bg-indigo-600 shadow-md shadow-indigo-500/20 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Database className="w-4 h-4" /> Facility Resources
                    </button>
                    <button
                        onClick={() => setActiveTab('study')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'study' ? 'bg-indigo-600 shadow-md shadow-indigo-500/20 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <GraduationCap className="w-4 h-4" /> Study Groups
                    </button>

                    <button
                        onClick={() => setActiveTab('events')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'events' ? 'bg-indigo-600 shadow-md shadow-indigo-500/20 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Calendar className="w-4 h-4" /> Campus Events
                    </button>

                    <button
                        onClick={() => setActiveTab('living')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'living' ? 'bg-indigo-600 shadow-md shadow-indigo-500/20 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Home className="w-4 h-4" /> Student Living
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'users' ? 'bg-indigo-600 shadow-md shadow-indigo-500/20 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Users className="w-4 h-4" /> Manage Users
                    </button>

                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 shadow-md shadow-indigo-500/20 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Activity className="w-4 h-4" /> System Analytics
                    </button>

                </div>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
                        <LogOut className="w-4 h-4" /> Log out
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-64 p-8 xl:p-12 bg-gradient-to-b from-blue-50/80 via-white to-blue-50/80 min-h-screen">
                <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">




                    {activeTab === 'resources' && (
                        <>
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">Manage Resources</h1>
                                    <p className="text-gray-500 font-medium mt-1">Add, edit, or remove campus facilities.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Search resources..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-64 shadow-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowQRScanner(!showQRScanner)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all ${
                                            showQRScanner 
                                            ? 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600' 
                                            : 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700'
                                        }`}
                                    >
                                        <QrCode className="w-4 h-4" /> {showQRScanner ? 'Close Scanner' : 'Scan QR'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditModal({ show: true, mode: 'add', resource: null });
                                            setResourceImage('');
                                        }}
                                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Add Resource
                                    </button>
                                </div>
                            </div>

                            {/* QR Scanner Section */}
                            {showQRScanner && (
                                <div className="mb-10 bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/40 shadow-xl animate-in slide-in-from-top-4 duration-500">
                                    <AdminQRScanner />
                                </div>
                            )}

                            {/* Resource Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Database className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 mb-0.5">Total Facilities</p>
                                        <h3 className="text-2xl font-black text-gray-900">{resources?.length || 0}</h3>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 mb-0.5">Available Now</p>
                                        <h3 className="text-2xl font-black text-gray-900">{resources?.filter(r => r.availableSeats > 0).length || 0}</h3>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 mb-0.5">Currently Full</p>
                                        <h3 className="text-2xl font-black text-gray-900">{resources?.filter(r => r.availableSeats === 0).length || 0}</h3>
                                    </div>
                                </div>
                            </div>


                            {/* Resources Table */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Resource Name</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Category</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Location</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Occupancy</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Bookings</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredResources?.map((resource) => (
                                                <React.Fragment key={resource.id}>
                                                    <tr className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                                    {resource.category === 'Libraries' ? <Library className="w-5 h-5" /> : resource.category === 'Computer Labs' ? <Monitor className="w-5 h-5" /> : <Layout className="w-5 h-5" />}
                                                                </div>
                                                                <span className="font-bold text-gray-900">{resource.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">{resource.category}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                                <MapPin className="w-4 h-4 text-slate-400" /> {resource.location}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                                                                <span className="text-xs font-black text-slate-700">
                                                                    {resource.totalSeats - resource.availableSeats} / {resource.totalSeats}
                                                                </span>
                                                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden ring-1 ring-slate-200">
                                                                    <div 
                                                                        className={`h-full rounded-full transition-all duration-700 ${
                                                                            resource.status === 'Available' ? 'bg-emerald-500' :
                                                                            resource.status === 'Filling Fast' ? 'bg-amber-500' : 'bg-rose-500'
                                                                        }`}
                                                                        style={{ width: `${Math.min(100, ((resource.totalSeats - resource.availableSeats) / resource.totalSeats) * 100)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${resource.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                                                                resource.status === 'Filling Fast' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-rose-100 text-rose-700'
                                                                }`}>
                                                                {resource.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                onClick={() => setExpandedResourceId(expandedResourceId === resource.id ? null : resource.id)}
                                                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                                                            >
                                                                {resourceBookings?.filter(b => (b.resourceId?._id || b.resourceId) === resource.id).length || 0} Bookings
                                                                {expandedResourceId === resource.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => {
                                                                        const [openTime, closeTime] = (resource.operatingHours || "08:00 - 18:00").split(' - ');
                                                                        setEditModal({
                                                                            show: true,
                                                                            mode: 'edit',
                                                                            resource: { ...resource, openTime, closeTime }
                                                                        });
                                                                        setResourceImage(resource.image || '');
                                                                    }}
                                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(resource.id)}
                                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Expanded Booking View */}
                                                    {expandedResourceId === resource.id && (
                                                        <tr className="bg-slate-50/30">
                                                            <td colSpan="7" className="px-8 py-6">
                                                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                                                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                                                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Current Reservations</h4>
                                                                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                                                            {resourceBookings?.filter(b => (b.resourceId?._id || b.resourceId) === resource.id).length || 0} Total
                                                                        </span>
                                                                    </div>
                                                                    <div className="overflow-x-auto">
                                                                        <table className="w-full text-left text-sm">
                                                                            <thead>
                                                                                <tr className="border-b border-slate-100">
                                                                                    <th className="px-6 py-3 font-bold text-slate-600">User Details</th>
                                                                                    <th className="px-6 py-3 font-bold text-slate-600 text-center">Contact</th>
                                                                                    <th className="px-6 py-3 font-bold text-slate-600 text-center">Seats</th>
                                                                                    <th className="px-6 py-3 font-bold text-slate-600 text-center">Status</th>
                                                                                    <th className="px-6 py-3 font-bold text-slate-600">Date</th>
                                                                                    <th className="px-6 py-3 font-bold text-slate-600 text-right">Time Slot</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-slate-50">
                                                                                {resourceBookings?.filter(b => (b.resourceId?._id || b.resourceId) === resource.id).map((booking) => (
                                                                                    <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                                                                        <td className="px-6 py-4">
                                                                                            <div className="flex items-center gap-3">
                                                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
                                                                                                    {String(booking.userName || 'U').charAt(0).toUpperCase()}
                                                                                                </div>
                                                                                                <div className="flex flex-col">
                                                                                                    <span className="font-black text-gray-900 leading-tight">{booking.userName}</span>
                                                                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-0.5">
                                                                                                        <Mail className="w-3 h-3" /> {booking.userEmail}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-center">
                                                                                            <div className="inline-flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 text-indigo-600">
                                                                                                <Phone className="w-3 h-3" />
                                                                                                <span className="text-xs font-black">{booking.contactNumber || 'N/A'}</span>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-center">
                                                                                            <span className="inline-block px-3 py-1 bg-white border border-slate-200 text-slate-900 font-black rounded-lg text-xs shadow-sm">
                                                                                                {booking.seats} Seats
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-center">
                                                                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                                                booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                                                                booking.status === 'Checked-in' ? 'bg-indigo-100 text-indigo-700' :
                                                                                                booking.status === 'Expired' ? 'bg-rose-100 text-rose-700' :
                                                                                                'bg-emerald-100 text-emerald-700'
                                                                                            }`}>
                                                                                                {booking.status === 'Confirmed' ? 'CONFIRMED' : booking.status === 'Checked-in' ? 'CHECKED-IN' : booking.status}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="px-6 py-4">
                                                                                            <div className="flex flex-col items-start gap-1">
                                                                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                                                                                    <Calendar className="w-3 h-3 text-slate-400" /> {booking.date}
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="px-6 py-4 text-right">
                                                                                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-emerald-700">
                                                                                                <Clock className="w-3.5 h-3.5" />
                                                                                                <span className="text-xs font-black tracking-tight">{booking.startTime} - {booking.endTime}</span>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                                {(!resourceBookings || resourceBookings.filter(b => (b.resourceId?._id || b.resourceId) === resource.id).length === 0) && (
                                                                                    <tr>
                                                                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400 italic">No data available</td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {filteredResources.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">No resources found matching "{searchQuery}"</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'study' && (
                        <>
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">Study Groups</h1>
                                    <p className="text-gray-500 font-medium mt-1">Manage and create academic study groups.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Search groups..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-64 shadow-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setStudyModal({ show: true, mode: 'add', group: null })}
                                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Create Group
                                    </button>
                                </div>
                            </div>

                            {/* Study Groups Table */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Group Name</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Subject</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Year</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Semester</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Created By</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Members</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredStudyGroups?.map((group) => (
                                                <tr key={group.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                                <GraduationCap className="w-5 h-5" />
                                                            </div>
                                                            <span className="font-bold text-gray-900">{group.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">{group.subject}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 font-black rounded-lg text-[10px] uppercase">
                                                            Year {group.year}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 font-black rounded-lg text-[10px] uppercase">
                                                            Sem {group.semester}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium text-center">{group.createdBy}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-xs">
                                                            {group.membersCount}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${group.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                                            'bg-rose-100 text-rose-700'
                                                            }`}>
                                                            {group.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleManageMaterials(group.id, group.name)}
                                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                                title="Manage Materials"
                                                            >
                                                                <Library className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setStudyModal({ show: true, mode: 'edit', group })}
                                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteStudyGroup(group.id)}
                                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredStudyGroups.length === 0 && (
                                                <tr>
                                                    <td colSpan="8" className="py-12 text-center text-slate-400 font-medium">No study groups available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'events' && (
                        <>
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">Campus Events</h1>
                                    <p className="text-gray-500 font-medium mt-1">Schedule and manage campus activities.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Search events..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-64 shadow-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setEventModal({ show: true, mode: 'add', event: null })}
                                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Create Event
                                    </button>
                                </div>
                            </div>

                            {/* Events Table */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Event Name</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Date</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Location</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Attendees</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredEvents?.map((evt) => (
                                                <React.Fragment key={evt.id}>
                                                    <tr className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                                    <Calendar className="w-5 h-5" />
                                                                </div>
                                                                <span className="font-bold text-gray-900">{evt.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-slate-600">{evt.date}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">{evt.location}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                onClick={() => handleToggleEventRegistrations(evt.id)}
                                                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg"
                                                            >
                                                                <Users className="w-3.5 h-3.5" />
                                                                {evt.attendees} Attendees
                                                                {expandedEventId === evt.id ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${evt.status === 'Upcoming' ? 'bg-emerald-100 text-emerald-700' :
                                                                'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                {evt.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => setEventModal({ show: true, mode: 'edit', event: evt })}
                                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteEvent(evt.id)}
                                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    
                                                    {/* Expanded Attendees List */}
                                                    {expandedEventId === evt.id && (
                                                        <tr className="bg-indigo-50/30">
                                                            <td colSpan="6" className="p-0 border-b border-indigo-100">
                                                                <div className="px-6 py-6 animate-fade-in-up">
                                                                    <h4 className="text-sm font-black text-indigo-900 mb-4 flex items-center gap-2">
                                                                        <Users className="w-4 h-4" /> 
                                                                        Registered Students
                                                                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-xs">
                                                                            {eventRegistrations[evt.id]?.length || 0}
                                                                        </span>
                                                                    </h4>
                                                                    
                                                                     {loadingRegistrations ? (
                                                                        <div className="text-sm font-medium text-indigo-500 py-4 flex items-center gap-2">
                                                                            <Loader2 className="w-4 h-4 animate-spin" /> Loading attendees...
                                                                        </div>
                                                                    ) : eventRegistrations[evt.id] && eventRegistrations[evt.id].length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                            {eventRegistrations[evt.id]?.map(reg => (
                                                                                <div key={reg._id} className="bg-white border border-indigo-100 p-4 rounded-xl shadow-sm flex items-start gap-4 hover:shadow-md hover:border-indigo-200 transition-all">
                                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
                                                                                        {(reg.studentName || reg.userProfile?.name || '?').charAt(0).toUpperCase()}
                                                                                    </div>
                                                                                    <div className="overflow-hidden">
                                                                                        <p className="text-sm font-bold text-gray-900 truncate">
                                                                                            {reg.studentName || reg.userProfile?.name || 'Unknown'}
                                                                                        </p>
                                                                                        <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
                                                                                            {reg.studentEmail || reg.userProfile?.email}
                                                                                        </p>
                                                                                        {reg.studentIdNumber && (
                                                                                            <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                                                                                                {reg.studentIdNumber}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-sm font-medium text-slate-500 py-4 bg-white rounded-xl border border-dashed border-indigo-200 text-center">
                                                                            No students have registered for this event yet.
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                            {filteredEvents?.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">No events found matching "{searchQuery}"</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'living' && (
                        <>
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">Student Living</h1>
                                    <p className="text-gray-500 font-medium mt-1">Manage accommodations, food services, and transport.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col gap-2">
                                        {/* Search Bar */}
                                        <div className="relative">
                                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Search living services..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-64 shadow-sm"
                                            />
                                        </div>
                                        {/* Type Filter Dropdown */}
                                        <div className="relative w-64">
                                            <button
                                                onClick={() => setLivingFilterOpen(prev => !prev)}
                                                className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all"
                                            >
                                                <span className="flex items-center gap-2">
                                                    {livingTypeFilter === 'All' && <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>}
                                                    {livingTypeFilter === 'Accommodation' && <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>}
                                                    {livingTypeFilter === 'Transportation' && <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>}
                                                    {livingTypeFilter === 'Food' && <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>}
                                                    {livingTypeFilter === 'All' ? 'All Types' : livingTypeFilter === 'Food' ? 'Food & Dining' : livingTypeFilter}
                                                </span>
                                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${livingFilterOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {livingFilterOpen && (
                                                <div className="absolute z-30 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                                                    {[
                                                        { value: 'All', label: 'All Types', color: 'bg-slate-400' },
                                                        { value: 'Accommodation', label: 'Accommodation', color: 'bg-orange-400' },
                                                        { value: 'Transportation', label: 'Transportation', color: 'bg-indigo-500' },
                                                        { value: 'Food', label: 'Food & Dining', color: 'bg-purple-500' },
                                                    ].map(opt => (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => { setLivingTypeFilter(opt.value); setLivingFilterOpen(false); }}
                                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors text-left ${
                                                                livingTypeFilter === opt.value ? 'text-indigo-600 bg-indigo-50/60' : 'text-slate-700'
                                                            }`}
                                                        >
                                                            <span className={`w-2 h-2 rounded-full ${opt.color} inline-block shrink-0`}></span>
                                                            {opt.label}
                                                            {livingTypeFilter === opt.value && <span className="ml-auto text-indigo-500 text-xs font-black">✓</span>}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => setLivingModal({ show: true, mode: 'add', item: null, type: 'Accommodation' })}
                                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all self-start whitespace-nowrap"
                                        >
                                            <Plus className="w-4 h-4" /> Add Service
                                        </button>
                                        <button
                                            onClick={handleGenerateLivingReport}
                                            className="flex items-center gap-2 bg-white text-indigo-600 border border-indigo-100 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-50 hover:-translate-y-0.5 transition-all self-start whitespace-nowrap"
                                        >
                                            <FileText className="w-4 h-4" /> Generate Report
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats — All 3 Categories */}
                            <div className="space-y-4 mb-8">

                                {/* Accommodation Stats */}
                                {(livingTypeFilter === 'All' || livingTypeFilter === 'Accommodation') && (
                                    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                                                <Building className="w-4 h-4" />
                                            </div>
                                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Accommodations</h4>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                                                    <Building className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Total</p>
                                                    <h3 className="text-2xl font-black text-gray-900">{livingItems.filter(l => l.type === 'Accommodation').length}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Available</p>
                                                    <h3 className="text-2xl font-black text-gray-900">{livingItems.filter(l => l.type === 'Accommodation' && l.status === 'Available').length}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                                                    <XCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Booked</p>
                                                    <h3 className="text-2xl font-black text-gray-900">{livingItems.filter(l => l.type === 'Accommodation' && l.status === 'Booked').length}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Transportation Stats */}
                                {(livingTypeFilter === 'All' || livingTypeFilter === 'Transportation') && (
                                    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                                <Bus className="w-4 h-4" />
                                            </div>
                                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Transportation</h4>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                                    <Bus className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Total Routes</p>
                                                    <h3 className="text-2xl font-black text-gray-900">{livingItems.filter(l => l.type === 'Transportation').length}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Available</p>
                                                    <h3 className="text-2xl font-black text-gray-900">{livingItems.filter(l => l.type === 'Transportation' && l.status === 'Available').length}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                                                    <XCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Delayed</p>
                                                    <h3 className="text-2xl font-black text-gray-900">{livingItems.filter(l => l.type === 'Transportation' && l.status === 'Delayed').length}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Food & Dining Stats */}
                                {(livingTypeFilter === 'All' || livingTypeFilter === 'Food') && (
                                    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                                                <Coffee className="w-4 h-4" />
                                            </div>
                                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Food &amp; Dining</h4>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                                                    <Coffee className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Total Venues</p>
                                                    <h3 className="text-2xl font-black text-gray-900">{livingItems.filter(l => l.type === 'Food').length}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Available</p>
                                                    <h3 className="text-2xl font-black text-gray-900">{livingItems.filter(l => l.type === 'Food' && l.status === 'Available').length}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                                                    <XCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Booked</p>
                                                    <h3 className="text-2xl font-black text-gray-900">{livingItems.filter(l => l.type === 'Food' && l.status === 'Booked').length}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Living Table */}
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Service Name</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Type</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Capacity</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredLiving?.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                                {item.type === 'Accommodation' ? <Building className="w-5 h-5" /> : item.type === 'Food' ? <Coffee className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                                                            </div>
                                                            <span className="font-bold text-gray-900">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">{item.type}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-xs">
                                                            {item.currentOccupancy} / {item.capacity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => toggleLivingStatus(item)}
                                                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${item.status === 'Available' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                                                item.status === 'Booked' ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' :
                                                                    'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                                }`}
                                                            title="Click to toggle status"
                                                        >
                                                            {item.status}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => setLivingModal({ show: true, mode: 'edit', item: item, type: item.type })}
                                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteLiving(item)}
                                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredLiving?.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">No services found matching "{searchQuery}"</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'users' && (
                        <>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">Manage Users</h1>
                                    <p className="text-gray-500 font-medium mt-1">View and manage all registered campus portal users.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm w-64 shadow-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setUserModal({ show: true, mode: 'add', user: null })}
                                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Add User
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 mb-0.5">Total Users</p>
                                        <h3 className="text-2xl font-black text-gray-900">{users.length}</h3>
                                    </div>
                                </div>
                                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 mb-0.5">With Contact Info</p>
                                        <h3 className="text-2xl font-black text-gray-900">{users.filter(u => u.mobile).length}</h3>
                                    </div>
                                </div>
                                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 mb-0.5">With Address</p>
                                        <h3 className="text-2xl font-black text-gray-900">{users.filter(u => u.address).length}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">User</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Email</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Mobile</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Address</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Joined</th>
                                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredUsers?.map((user) => {
                                                const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
                                                const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
                                                return (
                                                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                                                                    {initials}
                                                                </div>
                                                                <span className="font-bold text-gray-900">{user.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{user.mobile || <span className="text-slate-300 italic">Not set</span>}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-600 max-w-[160px] truncate">{user.address || <span className="text-slate-300 italic">Not set</span>}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-500">{joined}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                                                <button
                                                                    onClick={() => handleDeleteUser(user._id)}
                                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                                    title="Delete user"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="py-16 text-center">
                                                        <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                                        <p className="text-slate-400 font-medium">
                                                            {searchQuery ? `No users found matching "${searchQuery}"` : 'No users registered yet.'}
                                                        </p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'analytics' && (

                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">System Analytics</h1>
                                    <p className="text-gray-500 font-medium mt-1">Real-time platform performance and community growth.</p>
                                </div>
                                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    System Live
                                </div>
                            </div>

                            {/* Level 1: KPIs */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Platform Users', value: users.length, icon: Users, color: 'indigo', trend: '+12%' },
                                    { label: 'Campus Resources', value: resources.length, icon: Database, color: 'blue', trend: '+2' },
                                    { label: 'Total Services', value: livingItems.length, icon: Home, color: 'rose', trend: 'Active' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                                                stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                                                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
                                            }`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                                {stat.trend}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Level 2: Visual Charts & Deep Dives */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Resource Utilization */}
                                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-lg font-black text-gray-900">Platform Engagement</h3>
                                        <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg px-3 py-1 outline-none">
                                            <option>Last 30 Days</option>
                                            <option>Last 7 Days</option>
                                        </select>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'Facility Bookings', value: 78, color: 'bg-indigo-500' },
                                            { label: 'Event Registrations', value: 92, color: 'bg-emerald-500' },
                                            { label: 'Study Group Activity', value: 64, color: 'bg-amber-500' },
                                        ].map((bar, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                                                    <span>{bar.label}</span>
                                                    <span>{bar.value}%</span>
                                                </div>
                                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${bar.color} rounded-full transition-all duration-1000 ease-out`}
                                                        style={{ width: `${bar.value}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* System Health / Real-time */}
                                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-lg font-black">Server Status</h3>
                                            <Activity className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div className="flex flex-col items-center justify-center py-6">
                                            <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                                                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin duration-1000"></div>
                                                <div className="text-center">
                                                    <span className="text-3xl font-black block">99.9</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Uptime %</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4 mt-8">
                                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                    <span className="text-xs font-bold text-slate-300">API Gateway</span>
                                                </div>
                                                <span className="text-xs font-black text-emerald-400">24ms</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                    <span className="text-xs font-bold text-slate-300">Database</span>
                                                </div>
                                                <span className="text-xs font-black text-emerald-400">Stable</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Background Decor */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#5591f2]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Study Group Modal */}
            {studyModal.show && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-2xl font-black text-gray-900 mb-6">
                            {studyModal.mode === 'add' ? 'Create Study Group' : 'Edit Study Group'}
                        </h3>
                        <form onSubmit={handleSaveStudyGroup} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Year</label>
                                    <select
                                        name="year"
                                        defaultValue={studyModal.group?.year || 'y1'}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="y1">Year 1</option>
                                        <option value="y2">Year 2</option>
                                        <option value="y3">Year 3</option>
                                        <option value="y4">Year 4</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Semester</label>
                                    <select
                                        name="semester"
                                        defaultValue={studyModal.group?.semester || 's1'}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="s1">Semester 1</option>
                                        <option value="s2">Semester 2</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Subject Name</label>
                                    <input
                                        name="subjectName"
                                        defaultValue={studyModal.group?.subjectName || ''}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. Intro to Programming"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Subject Code</label>
                                    <input
                                        name="subjectCode"
                                        defaultValue={studyModal.group?.subjectCode || ''}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. CS101"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Group Nickname</label>
                                <input
                                    name="groupName"
                                    defaultValue={studyModal.group?.groupName || ''}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Code Masters"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={studyModal.group?.description || ''}
                                    rows="2"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Optional description..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Created By / Admin</label>
                                <input
                                    name="createdBy"
                                    defaultValue={studyModal.group?.createdBy || ''}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Dr. Jane Smith"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Group Image</label>
                                <div className="flex items-center gap-4">
                                    {(studyModal.group?.image) && (
                                        <div className="w-12 h-12 rounded-lg bg-cover bg-center border border-slate-200 shrink-0" style={{ backgroundImage: `url(${studyModal.group.image})` }} />
                                    )}
                                    <input
                                        type="file"
                                        name="imageFile"
                                        accept="image/*"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setStudyModal({ show: false, mode: 'add', group: null })} className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                                    {studyModal.mode === 'add' ? 'Create Group' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Event Modal */}
            {eventModal.show && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-2xl font-black text-gray-900 mb-6">
                            {eventModal.mode === 'add' ? 'Create Event' : 'Edit Event'}
                        </h3>
                        <form onSubmit={handleSaveEvent} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Event Name</label>
                                    <input
                                        name="name"
                                        defaultValue={eventModal.event?.name || ''}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. Science Fair"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                                    <select
                                        name="category"
                                        defaultValue={eventModal.event?.category || 'IT Tech Event'}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                    >
                                        <option value="IT Tech Event">IT Tech Event</option>
                                        <option value="Annual Event">Annual Event</option>
                                        <option value="Management Event">Management Event</option>
                                        <option value="Exhibition">Exhibition</option>
                                        <option value="Special Event">Special Event</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Event Date</label>
                                    <input
                                        name="date"
                                        type="date"
                                        defaultValue={eventModal.event?.date || ''}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Event Time</label>
                                    <input
                                        name="time"
                                        type="text"
                                        defaultValue={eventModal.event?.time || '09:00 AM - 04:00 PM'}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. 10:00 AM - 02:00 PM"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Venue Location</label>
                                <input
                                    name="location"
                                    defaultValue={eventModal.event?.location || ''}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Main Auditorium or Virtual"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Eligibility</label>
                                    <input
                                        name="eligibility"
                                        defaultValue={eventModal.event?.eligibility || 'All Students'}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. All Students"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Organizing By</label>
                                    <select
                                        name="organizer"
                                        defaultValue={eventModal.event?.organizer || 'Official'}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                    >
                                        <option value="Official">Official</option>
                                        <option value="Student">Student</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={eventModal.event?.description || ''}
                                    required
                                    rows="2"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Brief event description..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Upload Event Photo</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-indigo-500 transition-colors group">
                                    <div className="space-y-1 text-center">
                                        {eventModal.event?.image ? (
                                            <div className="mb-4">
                                                <img src={eventModal.event.image} alt="Preview" className="mx-auto h-24 w-auto rounded-lg shadow-sm" />
                                            </div>
                                        ) : (
                                            <Upload className="mx-auto h-12 w-12 text-slate-300 group-hover:text-indigo-500" />
                                        )}
                                        <div className="flex text-sm text-slate-600">
                                            <label className="relative cursor-pointer bg-white rounded-md font-bold text-indigo-600 hover:text-indigo-500">
                                                <span>{eventModal.event?.image ? 'Change photo' : 'Upload a photo'}</span>
                                                <input name="imageFile" type="file" accept="image/*" className="sr-only" onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setEventModal(prev => ({ ...prev, event: { ...prev.event, image: reader.result } }));
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-slate-400">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setEventModal({ show: false, mode: 'add', event: null })} className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                                    {eventModal.mode === 'add' ? 'Create Event' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



        {/* Living Modal */}
        {livingModal.show && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-[60]">
                <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <h3 className="text-2xl font-black text-gray-900 mb-6">
                            {livingModal.mode === 'add' ? 'Add Living Service' : 'Edit Living Service'}
                        </h3>

                        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                            {['Accommodation', 'Food', 'Transportation'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setLivingModal({ ...livingModal, type })}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${livingModal.type === type ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {type === 'Food' ? 'Food & Dining' : type}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSaveLiving} className="space-y-4">
                            {livingModal.type === 'Accommodation' ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Building Name</label>
                                            <input name="name" defaultValue={livingModal.item?.name || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. North Hostel" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Price (Rs/month)</label>
                                            <input name="price" type="number" defaultValue={livingModal.item?.price || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="850" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Type</label>
                                            <select name="accType" defaultValue={livingModal.item?.accType || 'Apartment'} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                                <option value="Apartment">Apartment</option>
                                                <option value="House">House</option>
                                                <option value="Shared">Shared</option>
                                                <option value="Dorm">Dorm</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Status</label>
                                            <select name="status" defaultValue={livingModal.item?.status || 'Available'} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                                <option value="Available">Available</option>
                                                <option value="Booked">Booked</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Distance (Km)</label>
                                            <input name="distance" type="number" step="0.1" defaultValue={livingModal.item?.distance || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.5" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Rooms</label>
                                            <input name="bedrooms" type="number" defaultValue={livingModal.item?.capacity || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="1" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Baths</label>
                                            <input name="bathrooms" type="number" step="0.5" defaultValue={livingModal.item?.bathrooms || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="1" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Sq Ft</label>
                                            <input name="size" type="number" defaultValue={livingModal.item?.size || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="450" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-400 mb-1">Amenities <span className="text-slate-300 font-normal normal-case">(optional)</span></label>
                                        <input name="amenities" defaultValue={livingModal.item?.amenities || ''} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="WiFi, Furnished, Laundry (comma separated)" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Contact Phone</label>
                                            <input 
                                                name="contactPhone" 
                                                type="text"
                                                defaultValue={livingModal.item?.contactPhone || ''} 
                                                required 
                                                maxLength="10"
                                                onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" 
                                                placeholder="e.g. 0771234567" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Contact Email</label>
                                            <div className="relative">
                                                <input
                                                    name="contactEmail"
                                                    type="text"
                                                    value={contactEmailValue}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setContactEmailValue(val);
                                                        setEmailError(validateEmail(val));
                                                    }}
                                                    onBlur={(e) => setEmailError(validateEmail(e.target.value))}
                                                    required
                                                    className={`w-full px-3 py-2 pr-8 bg-slate-50 border rounded-lg text-sm outline-none transition-colors ${
                                                        emailError
                                                            ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                                                            : contactEmailValue && !emailError
                                                            ? 'border-emerald-400 bg-emerald-50 focus:ring-2 focus:ring-emerald-300'
                                                            : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
                                                    }`}
                                                    placeholder="leasing@example.com"
                                                />
                                                {contactEmailValue && (
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">
                                                        {emailError ? '❌' : '✅'}
                                                    </span>
                                                )}
                                            </div>
                                            {emailError && (
                                                <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
                                                    <span>⚠</span> {emailError}
                                                </p>
                                            )}
                                            {contactEmailValue && !emailError && (
                                                <p className="mt-1 text-xs text-emerald-600 font-medium">
                                                    ✓ Valid email address
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-400 mb-1">Description</label>
                                        <textarea name="description" defaultValue={livingModal.item?.description || ''} required rows="2" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Property details..."></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-400 mb-1">Upload Photos ({livingServiceImages.length}/3)</label>
                                        <div 
                                            onDragOver={(e) => { e.preventDefault(); setLivingDragOver(true); }}
                                            onDragLeave={() => setLivingDragOver(false)}
                                            onDrop={handleLivingImageDrop}
                                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors group ${livingDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-500'}`}
                                        >
                                            <div className="space-y-1 text-center w-full">
                                                {livingServiceImages.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                                                        {livingServiceImages.map((img, idx) => (
                                                            <div key={idx} className="relative group/img">
                                                                <img src={img} alt={`Preview ${idx + 1}`} className="h-16 w-16 object-cover rounded-lg shadow-sm" />
                                                                <button type="button" onClick={() => removeLivingImage(idx)} className="absolute -top-2 -right-2 bg-red-50 text-red-500 rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-100 shadow-sm">
                                                                    <XCircle className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Upload className={`mx-auto h-12 w-12 ${livingDragOver ? 'text-indigo-400' : 'text-slate-300 group-hover:text-indigo-500'}`} />
                                                )}
                                                
                                                {livingServiceImages.length < 3 && (
                                                    <div className="flex text-sm text-slate-600 justify-center">
                                                        <label className="relative cursor-pointer bg-transparent rounded-md font-bold text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                            <span>Upload photos</span>
                                                            <input name="livingImagesInput" type="file" multiple accept="image/*" className="sr-only" onChange={(e) => handleLivingImageSelect(e.target.files)} />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                )}
                                                <p className="text-xs text-slate-400">PNG, JPG, GIF up to 5MB (Max 3)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : livingModal.type === 'Transportation' ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Vehicle / Route Name</label>
                                        <input name="vehicleName" defaultValue={livingModal.item?.vehicleName || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Express Bus 01" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">From (Start)</label>
                                            <input name="startLocation" defaultValue={livingModal.item?.startLocation || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="e.g. Main Gate" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">To (End)</label>
                                            <input name="endLocation" defaultValue={livingModal.item?.endLocation || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="e.g. City Center" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Start Time</label>
                                            <div className="flex gap-1">
                                                <select name="startHour" defaultValue={livingModal.item?.startTime?.split(':')[0] || '08'} required className="flex-1 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(h => (
                                                        <option key={h} value={h}>{h}</option>
                                                    ))}
                                                </select>
                                                <select name="startMinute" defaultValue={livingModal.item?.startTime?.split(':')[1]?.split(' ')[0] || '00'} required className="flex-1 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                                    {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                                <select name="startAmPm" defaultValue={livingModal.item?.startTime?.split(' ')[1] || 'AM'} required className="flex-1 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                                    <option value="AM">AM</option>
                                                    <option value="PM">PM</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Ticket Price</label>
                                            <input name="ticketPrice" type="number" step="0.01" defaultValue={livingModal.item?.ticketPrice || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="2.50" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Duration</label>
                                            <select name="duration" defaultValue={livingModal.item?.duration || '1 hour'} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                                {['15 mins', '30 mins', '45 mins', '1 hour', '1.5 hours', '2 hours', '2.5 hours', '3 hours', '4 hours', '5 hours', 'Full Day'].map(dur => (
                                                    <option key={dur} value={dur}>{dur}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Capacity</label>
                                            <input name="capacity" type="number" defaultValue={livingModal.item?.capacity || ''} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" placeholder="50" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-400 mb-1">Status</label>
                                        <select name="status" defaultValue={livingModal.item?.status || 'Available'} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option value="Available">Available</option>
                                            <option value="Full">Full</option>
                                            <option value="Delayed">Delayed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Restaurant Name</label>
                                        <input
                                            name="name"
                                            defaultValue={livingModal.item?.name || ''}
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g. North Hostel Cafeteria"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Located</label>
                                            <select 
                                                name="locationType" 
                                                defaultValue={livingModal.item?.locationType || 'On Campus'} 
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="On Campus">On Campus</option>
                                                <option value="Outside campus">Outside campus</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Available Meals</label>
                                            <div className="flex flex-col gap-2 mt-2">
                                                {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                                                    <label key={meal} className="flex items-center gap-2 cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={foodAvailableMeals.includes(meal)}
                                                            onChange={(e) => {
                                                                if(e.target.checked) setFoodAvailableMeals([...foodAvailableMeals, meal])
                                                                else setFoodAvailableMeals(foodAvailableMeals.filter(m => m !== meal))
                                                            }}
                                                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                        />
                                                        <span className="text-sm font-medium text-slate-700">{meal}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Operating Hours</label>
                                            <input 
                                                value={foodOperatingHours}
                                                onChange={(e) => setFoodOperatingHours(e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="e.g. 8:00 AM - 10:00 PM"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Dining Options</label>
                                            <div className="flex flex-col gap-2 mt-2">
                                                {['Dine-in', 'Takeaway', 'Hostel Delivery'].map(opt => (
                                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={foodDiningOptions.includes(opt)}
                                                            onChange={(e) => {
                                                                if(e.target.checked) setFoodDiningOptions([...foodDiningOptions, opt])
                                                                else setFoodDiningOptions(foodDiningOptions.filter(o => o !== opt))
                                                            }}
                                                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                        />
                                                        <span className="text-sm font-medium text-slate-700">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Contact Email</label>
                                                <input 
                                                    name="email"
                                                    value={contactEmailValue}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setContactEmailValue(val);
                                                        setEmailError(validateEmail(val));
                                                    }}
                                                    onBlur={(e) => setEmailError(validateEmail(e.target.value))}
                                                    required 
                                                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl font-medium focus:outline-none transition-colors ${emailError ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300' : 'border-slate-200 focus:ring-2 focus:ring-indigo-500'}`} 
                                                    placeholder="cafe@example.com" 
                                                />
                                                {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Phone</label>
                                                <input 
                                                    name="phone"
                                                    type="text"
                                                    defaultValue={livingModal.item?.phone || ''}
                                                    required 
                                                    maxLength="10"
                                                    onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                                    placeholder="0771234567" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description / About</label>
                                        <textarea
                                            name="description"
                                            defaultValue={livingModal.item?.description || ''}
                                            rows="2"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Tell us about the restaurant..."
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Location Address</label>
                                        <input
                                            name="location"
                                            defaultValue={livingModal.item?.location || ''}
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Building 3, First Floor"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-400 mb-1">Upload Restaurant Photos ({livingServiceImages.length}/3)</label>
                                        <div 
                                            onDragOver={(e) => { e.preventDefault(); setLivingDragOver(true); }}
                                            onDragLeave={() => setLivingDragOver(false)}
                                            onDrop={handleLivingImageDrop}
                                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors group ${livingDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-500'}`}
                                        >
                                            <div className="space-y-1 text-center w-full">
                                                {livingServiceImages.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                                                        {livingServiceImages.map((img, idx) => (
                                                            <div key={idx} className="relative group/img">
                                                                <img src={img} alt={`Preview ${idx + 1}`} className="h-16 w-16 object-cover rounded-lg shadow-sm" />
                                                                <button type="button" onClick={() => removeLivingImage(idx)} className="absolute -top-2 -right-2 bg-red-50 text-red-500 rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-100 shadow-sm">
                                                                    <XCircle className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Upload className={`mx-auto h-12 w-12 ${livingDragOver ? 'text-indigo-400' : 'text-slate-300 group-hover:text-indigo-500'}`} />
                                                )}
                                                
                                                {livingServiceImages.length < 3 && (
                                                    <div className="flex text-sm text-slate-600 justify-center">
                                                        <label className="relative cursor-pointer bg-transparent rounded-md font-bold text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                            <span>Upload photos</span>
                                                            <input name="livingImagesInput" type="file" multiple accept="image/*" className="sr-only" onChange={(e) => handleLivingImageSelect(e.target.files)} />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                )}
                                                <p className="text-xs text-slate-400">PNG, JPG, GIF up to 2MB (Max 3)</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items Section */}
                                    <div className="border-t border-slate-200 pt-4 mt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-lg text-slate-800">Menu / Meals</h4>
                                            <button 
                                                type="button" 
                                                onClick={() => setFoodMenuItems([...foodMenuItems, { mealName: '', price: '', description: '', mealType: 'Vegetarian', availability: 'Available', image: '' }])}
                                                className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-600 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" /> Add Meal
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {foodMenuItems.map((meal, idx) => (
                                                <div key={idx} className="bg-white border border-slate-100 shadow-sm p-4 rounded-xl space-y-3 relative">
                                                    <button type="button" onClick={() => setFoodMenuItems(foodMenuItems.filter((_, i) => i !== idx))} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <div className="grid grid-cols-2 gap-3 pr-8">
                                                        <div>
                                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Meal Name</label>
                                                            <input 
                                                                value={meal.mealName}
                                                                onChange={(e) => { const newM = [...foodMenuItems]; newM[idx].mealName = e.target.value; setFoodMenuItems(newM); }}
                                                                required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Rice & Curry" 
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-black uppercase text-slate-400 mb-1">Price</label>
                                                            <input 
                                                                type="number"
                                                                value={meal.price}
                                                                onChange={(e) => { const newM = [...foodMenuItems]; newM[idx].price = e.target.value; setFoodMenuItems(newM); }}
                                                                required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="150" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-black uppercase text-slate-400 mb-1">Description</label>
                                                        <input 
                                                            value={meal.description}
                                                            onChange={(e) => { const newM = [...foodMenuItems]; newM[idx].description = e.target.value; setFoodMenuItems(newM); }}
                                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Short description..." 
                                                        />
                                                    </div>
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Meal Type</label>
                                                            <div className="flex flex-wrap gap-3">
                                                                {['Vegetarian', 'Non-Vegetarian', 'Vegan'].map(t => (
                                                                    <label key={t} className="flex items-center gap-2 cursor-pointer group">
                                                                        <input type="radio" checked={meal.mealType === t} onChange={() => { const newM = [...foodMenuItems]; newM[idx].mealType = t; setFoodMenuItems(newM); }} className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                                                                        <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">{t}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Availability</label>
                                                            <div className="flex flex-wrap gap-3">
                                                                {['Available', 'Not Available'].map(a => (
                                                                    <label key={a} className="flex items-center gap-2 cursor-pointer group">
                                                                        <input type="radio" checked={meal.availability === a} onChange={() => { const newM = [...foodMenuItems]; newM[idx].availability = a; setFoodMenuItems(newM); }} className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                                                                        <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">{a}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-black uppercase text-slate-400 mb-1">Add Photo</label>
                                                        <div className="flex items-center gap-3">
                                                            {meal.image ? (
                                                                <div className="relative">
                                                                    <img src={meal.image} alt="Meal" className="h-12 w-12 object-cover rounded-md" />
                                                                    <button type="button" onClick={() => { const newM = [...foodMenuItems]; newM[idx].image = ''; setFoodMenuItems(newM); }} className="absolute -top-1 -right-1 bg-red-100 text-red-600 rounded-full p-0.5"><XCircle className="w-3 h-3" /></button>
                                                                </div>
                                                            ) : (
                                                                <label className="flex items-center justify-center w-full h-12 px-4 transition bg-slate-50 border-2 border-slate-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-indigo-400 focus:outline-none">
                                                                    <span className="flex items-center space-x-2 text-xs font-medium text-slate-500">
                                                                        <Upload className="w-4 h-4" />
                                                                        <span>Drop photo or click</span>
                                                                    </span>
                                                                    <input type="file" name="file_upload" className="hidden" accept="image/*" onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if(file) {
                                                                            if(file.size > 2 * 1024 * 1024) return alert('Max size 2MB');
                                                                            const reader = new FileReader();
                                                                            reader.onloadend = () => { const newM = [...foodMenuItems]; newM[idx].image = reader.result; setFoodMenuItems(newM); };
                                                                            reader.readAsDataURL(file);
                                                                        }
                                                                    }} />
                                                                </label>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {foodMenuItems.length === 0 && (
                                                <p className="text-sm text-slate-400 text-center italic py-4">No meals added yet.</p>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            )}
                            <div className="flex gap-4 pt-4 mt-2">
                                <button type="button" onClick={() => setLivingModal({ show: false, mode: 'add', item: null, type: 'Accommodation' })} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                                    {livingModal.mode === 'add' ? 'Create Service' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {editModal.show && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-2xl font-black text-gray-900 mb-6">
                            {editModal.mode === 'add' ? 'Add New Resource' : 'Edit Resource'}
                        </h3>
                        <form onSubmit={handleSaveResource} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Resource Name</label>
                                    <input
                                        name="name"
                                        defaultValue={editModal.resource?.name || ''}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. Science Lab 101"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
                                    <select
                                        name="category"
                                        defaultValue={editModal.resource?.category || 'Libraries'}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                    >
                                        <option value="Libraries">Libraries</option>
                                        <option value="Study Areas">Study Areas</option>
                                        <option value="Computer Labs">Computer Labs</option>
                                        <option value="Laboratory">Laboratory</option>
                                        <option value="Lecture Halls">Lecture Halls</option>
                                        <option value="Common Areas">Common Areas</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Location ID</label>
                                    <input
                                        name="locationId"
                                        defaultValue={editModal.resource?.locationId || ''}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. LOC-001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Building</label>
                                    <input
                                        name="building"
                                        defaultValue={editModal.resource?.building || ''}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g. Science Block"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Floor</label>
                                    <select
                                        name="floor"
                                        defaultValue={editModal.resource?.floor || 1}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(f => (
                                            <option key={f} value={f}>Floor {f}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Total Capacity</label>
                                    <input
                                        name="totalSeats"
                                        type="number"
                                        min="1"
                                        defaultValue={editModal.resource?.totalSeats || 50}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
                                    <input
                                        name="openTime"
                                        type="time"
                                        defaultValue={editModal.resource?.openTime || '08:00'}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Time</label>
                                    <input
                                        name="closeTime"
                                        type="time"
                                        defaultValue={editModal.resource?.closeTime || '18:00'}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Upload Resource Photo</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-indigo-500 transition-colors group">
                                    <div className="space-y-1 text-center">
                                        {resourceImage ? (
                                            <div className="mb-3">
                                                <img src={resourceImage} alt="Preview" className="mx-auto h-24 w-auto rounded-lg shadow-sm" />
                                            </div>
                                        ) : (
                                            <Upload className="mx-auto h-12 w-12 text-slate-300 group-hover:text-indigo-500" />
                                        )}
                                        <div className="flex text-sm text-slate-600 justify-center">
                                            <label className="relative cursor-pointer bg-white rounded-md font-bold text-indigo-600 hover:text-indigo-500">
                                                <span>{resourceImage ? 'Change photo' : 'Upload a photo'}</span>
                                                <input
                                                    name="imageFile"
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => setResourceImage(reader.result);
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setEditModal({ show: false, mode: 'add', resource: null })} className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                                    {editModal.mode === 'add' ? 'Create Resource' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Material Management Modal */}
            {materialModal.show && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-4xl w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Manage Materials</h3>
                                <p className="text-slate-500 font-bold text-sm tracking-tight">{materialModal.groupName}</p>
                            </div>
                            <button 
                                onClick={() => setMaterialModal({ ...materialModal, show: false })}
                                className="p-3 bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {loadingMaterials ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Fetching Study Materials...</p>
                                </div>
                            ) : (!materialModal.materials || !Array.isArray(materialModal.materials) || materialModal.materials.length === 0) ? (
                                <div className="py-20 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                        <Library className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No materials found for this group.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Categorized Material Lists */}
                                    {['notes', 'papers', 'videos'].map(type => {
                                        const items = Array.isArray(materialModal.materials) ? materialModal.materials.filter(m => m.type === type) : [];
                                        if (items.length === 0) return null;

                                        return (
                                            <div key={type} className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                        type === 'notes' ? 'bg-indigo-100 text-indigo-600' : 
                                                        type === 'papers' ? 'bg-purple-100 text-purple-600' : 'bg-rose-100 text-rose-600'
                                                    }`}>
                                                        {type === 'notes' ? <BookOpen className="w-4 h-4" /> : 
                                                         type === 'papers' ? <GraduationCap className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                    </div>
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                                        {type === 'notes' ? 'Study Notes' : type === 'papers' ? 'Pass Papers' : 'Video Lessons'}
                                                    </h4>
                                                    <div className="flex-1 h-px bg-slate-100" />
                                                    <span className="text-[10px] font-black text-slate-400">{items.length} Items</span>
                                                </div>

                                                <div className="grid grid-cols-1 gap-3">
                                                    {items.map(material => (
                                                        <div key={material._id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-3xl flex items-center justify-between hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/5 transition-all duration-300 group/item">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm transition-colors ${
                                                                    type === 'videos' ? 'text-rose-500 group-hover/item:bg-rose-50' : 
                                                                    type === 'notes' ? 'text-indigo-500 group-hover/item:bg-indigo-50' : 'text-purple-500 group-hover/item:bg-purple-50'
                                                                }`}>
                                                                    {type === 'videos' ? <Play className="w-5 h-5 fill-current" /> : 
                                                                     type === 'notes' ? <BookOpen className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-bold text-slate-900 leading-none mb-1">{material?.title || 'Untitled'}</h5>
                                                                    <div className="flex items-center gap-3">
                                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                                            Uploaded {material?.createdAt ? new Date(material.createdAt).toLocaleDateString() : 'N/A'}
                                                                        </p>
                                                                        {material?.author && (
                                                                            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded italic">
                                                                                By {material.author}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2">
                                                                <a 
                                                                    href={type === 'videos' ? material?.link : material?.fileData} 
                                                                    target="_blank" 
                                                                    rel="noreferrer"
                                                                    className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm flex items-center gap-2 group/btn"
                                                                    title="Open / View Content"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover/btn:inline">View</span>
                                                                </a>
                                                                <button 
                                                                    onClick={() => handleDeleteMaterial(material?._id)}
                                                                    className="p-2.5 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                                                                    title="Delete Material"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* User Modal */}
            {userModal.show && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-2xl font-black text-gray-900 mb-6">
                            {userModal.mode === 'add' ? 'Add New User' : 'Edit User'}
                        </h3>
                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                                <input
                                    name="name"
                                    defaultValue={userModal.user?.name || ''}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={userModal.user?.email || ''}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Mobile Number</label>
                                <input
                                    name="mobile"
                                    defaultValue={userModal.user?.mobile || ''}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. 0771234567"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Address</label>
                                <textarea
                                    name="address"
                                    defaultValue={userModal.user?.address || ''}
                                    rows="2"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Optional address..."
                                ></textarea>
                            </div>
                            {userModal.mode === 'add' && (
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Set initial password"
                                    />
                                </div>
                            )}
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setUserModal({ show: false, mode: 'add', user: null })} className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                                    {userModal.mode === 'add' ? 'Create User' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
