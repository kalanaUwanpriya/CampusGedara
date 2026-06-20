// Mock data for demonstration purposes

export const accommodations = [
    {
        id: 1,
        title: 'Modern Studio Apartment',
        type: 'Apartment',
        price: 850,
        location: '0.5 miles from campus',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
        rating: 4.8,
        reviews: 124,
        amenities: ['WiFi', 'Furnished', 'Laundry', 'Parking'],
        bedrooms: 1,
        bathrooms: 1,
        size: '450 sq ft',
        available: true,
        description: 'Cozy studio apartment perfect for students. Recently renovated with modern amenities and excellent natural lighting.',
    },
    {
        id: 2,
        title: 'Campus Dormitory - Single',
        type: 'Dorm',
        price: 650,
        location: 'On Campus',
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop',
        rating: 4.5,
        reviews: 89,
        amenities: ['WiFi', 'Meal Plan', 'Study Room', '24/7 Security'],
        bedrooms: 1,
        bathrooms: 1,
        size: '200 sq ft',
        available: true,
        description: 'Single occupancy dorm room with access to all campus facilities. Meal plan included.',
    },
    {
        id: 3,
        title: 'Shared 3BR House',
        type: 'Shared',
        price: 450,
        location: '1.2 miles from campus',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
        rating: 4.6,
        reviews: 56,
        amenities: ['WiFi', 'Kitchen', 'Backyard', 'Parking'],
        bedrooms: 3,
        bathrooms: 2,
        size: '1200 sq ft',
        available: true,
        description: 'Spacious shared house with private bedrooms. Great for students looking for a community environment.',
    },
    {
        id: 4,
        title: 'Luxury 2BR Apartment',
        type: 'Apartment',
        price: 1200,
        location: '0.8 miles from campus',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
        rating: 4.9,
        reviews: 203,
        amenities: ['WiFi', 'Gym', 'Pool', 'Concierge', 'Parking'],
        bedrooms: 2,
        bathrooms: 2,
        size: '900 sq ft',
        available: true,
        description: 'Premium apartment with top-tier amenities. Perfect for graduate students or those seeking luxury living.',
    },
]

export const restaurants = [
    {
        id: 1,
        name: 'Campus Café',
        cuisine: 'American',
        type: 'Café',
        price: '$$',
        rating: 4.7,
        reviews: 342,
        distance: 'On Campus',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop',
        hours: 'Mon-Fri: 7am-8pm, Sat-Sun: 8am-6pm',
        dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'],
        menu: [
            { category: 'Breakfast', items: ['Pancakes - $8', 'Avocado Toast - $10', 'Breakfast Burrito - $9'] },
            { category: 'Lunch', items: ['Grilled Chicken Sandwich - $12', 'Caesar Salad - $11', 'Veggie Bowl - $10'] },
            { category: 'Beverages', items: ['Latte - $4', 'Fresh Juice - $5', 'Smoothie - $6'] },
        ],
    },
    {
        id: 2,
        name: 'Spice Street',
        cuisine: 'Indian',
        type: 'Restaurant',
        price: '$$',
        rating: 4.6,
        reviews: 187,
        distance: '0.3 miles',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
        hours: 'Mon-Sun: 11am-10pm',
        dietary: ['Vegetarian', 'Vegan', 'Halal'],
        menu: [
            { category: 'Appetizers', items: ['Samosa - $6', 'Pakora - $7', 'Spring Rolls - $6'] },
            { category: 'Main Course', items: ['Butter Chicken - $14', 'Paneer Tikka Masala - $13', 'Biryani - $12'] },
            { category: 'Breads', items: ['Naan - $3', 'Garlic Naan - $4', 'Roti - $2'] },
        ],
    },
    {
        id: 3,
        name: 'Green Bowl',
        cuisine: 'Healthy',
        type: 'Fast Casual',
        price: '$',
        rating: 4.8,
        reviews: 421,
        distance: '0.2 miles',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop',
        hours: 'Mon-Sun: 10am-9pm',
        dietary: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Organic'],
        menu: [
            { category: 'Bowls', items: ['Buddha Bowl - $11', 'Quinoa Power Bowl - $12', 'Mediterranean Bowl - $13'] },
            { category: 'Salads', items: ['Kale Caesar - $10', 'Greek Salad - $9', 'Asian Crunch - $11'] },
            { category: 'Smoothies', items: ['Green Machine - $7', 'Berry Blast - $7', 'Tropical Paradise - $8'] },
        ],
    },
    {
        id: 4,
        name: 'Pizza Paradise',
        cuisine: 'Italian',
        type: 'Pizzeria',
        price: '$$',
        rating: 4.5,
        reviews: 298,
        distance: '0.5 miles',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop',
        hours: 'Mon-Sun: 11am-11pm',
        dietary: ['Vegetarian', 'Gluten-Free Available'],
        menu: [
            { category: 'Pizza', items: ['Margherita - $12', 'Pepperoni - $14', 'Veggie Supreme - $15'] },
            { category: 'Pasta', items: ['Spaghetti Carbonara - $13', 'Penne Arrabiata - $12', 'Fettuccine Alfredo - $14'] },
            { category: 'Sides', items: ['Garlic Bread - $5', 'Mozzarella Sticks - $7', 'Caesar Salad - $6'] },
        ],
    },
]

export const transportRoutes = [
    {
        id: 1,
        vehicleName: 'Campus Shuttle A',
        startLocation: 'Main Campus Gate',
        endLocation: 'Science Building',
        startTime: '07:30 AM',
        ticketPrice: 20,
        duration: '15 mins',
        status: 'Available',
        type: 'Shuttle'
    },
    {
        id: 2,
        vehicleName: 'City Connection B',
        startLocation: 'Campus South Gate',
        endLocation: 'Downtown Station',
        startTime: '08:00 AM',
        ticketPrice: 50,
        duration: '30 mins',
        status: 'Available',
        type: 'Bus'
    },
    {
        id: 3,
        vehicleName: 'Residence Express',
        startLocation: 'Main Campus',
        endLocation: 'North Residence',
        startTime: '07:00 AM',
        ticketPrice: 15,
        duration: '10 mins',
        status: 'Delayed',
        type: 'Shuttle'
    },
    {
        id: 4,
        vehicleName: 'Weekend Special',
        startLocation: 'Campus Center',
        endLocation: 'Beach Area',
        startTime: '09:00 AM',
        ticketPrice: 100,
        duration: '45 mins',
        status: 'Full',
        type: 'Bus'
    }
];

export const studyData = {
    years: [
        {
            id: 'y1',
            label: 'Year 1',
            semesters: [
                {
                    id: 'y1s1',
                    label: 'Semester 1',
                    subjects: [
                        { id: 'cs101', name: 'Intro to Programming', code: 'CS101', microGroups: [{ id: 'mg1', name: 'Code Masters', members: 15 }] },
                        { id: 'ma101', name: 'Computational Math I', code: 'MA101', microGroups: [{ id: 'mg2', name: 'Math Wizards', members: 10 }] }
                    ]
                },
                {
                    id: 'y1s2',
                    label: 'Semester 2',
                    subjects: [
                        { id: 'cs102', name: 'Data Structures', code: 'CS102', microGroups: [{ id: 'mg3', name: 'Algo Squad', members: 20 }] },
                        { id: 'st101', name: 'Statistics', code: 'ST101', microGroups: [{ id: 'mg4', name: 'Data Analysts', members: 12 }] }
                    ]
                }
            ]
        },
        {
            id: 'y2',
            label: 'Year 2',
            semesters: [
                {
                    id: 'y2s1',
                    label: 'Semester 1',
                    subjects: [
                        { id: 'cs201', name: 'Database Systems', code: 'CS201', microGroups: [{ id: 'mg5', name: 'SQL Ninjas', members: 18 }] },
                        { id: 'cs202', name: 'Computer Networks', code: 'CS202', microGroups: [{ id: 'mg6', name: 'Net Admins', members: 14 }] }
                    ]
                },
                {
                    id: 'y2s2',
                    label: 'Semester 2',
                    subjects: [
                        { id: 'cs203', name: 'Operating Systems', code: 'CS203', microGroups: [{ id: 'mg7', name: 'Kernel Crew', members: 22 }] },
                        { id: 'cs204', name: 'Software Engineering I', code: 'CS204', microGroups: [{ id: 'mg8', name: 'Agile Team', members: 16 }] }
                    ]
                }
            ]
        },
        {
            id: 'y3',
            label: 'Year 3',
            semesters: [
                {
                    id: 'y3s1',
                    label: 'Semester 1',
                    subjects: [
                        { id: 'cs301', name: 'Web Development', code: 'CS301', microGroups: [{ id: 'mg9', name: 'Fullstack Devs', members: 25 }] },
                        { id: 'cs302', name: 'Cyber Security', code: 'CS302', microGroups: [{ id: 'mg10', name: 'White Hats', members: 19 }] }
                    ]
                },
                {
                    id: 'y3s2',
                    label: 'Semester 2',
                    subjects: [
                        { id: 'cs303', name: 'Cloud Computing', code: 'CS303', microGroups: [{ id: 'mg11', name: 'Cloud Architects', members: 21 }] },
                        { id: 'cs304', name: 'Mobile App Dev', code: 'CS304', microGroups: [{ id: 'mg12', name: 'App Crafters', members: 17 }] }
                    ]
                }
            ]
        },
        {
            id: 'y4',
            label: 'Year 4',
            semesters: [
                {
                    id: 'y4s1',
                    label: 'Semester 1',
                    subjects: [
                        { id: 'cs401', name: 'Artificial Intelligence', code: 'CS401', microGroups: [{ id: 'mg13', name: 'AI Research', members: 28 }] },
                        { id: 'cs402', name: 'Machine Learning', code: 'CS402', microGroups: [{ id: 'mg14', name: 'ML Engineers', members: 24 }] }
                    ]
                },
                {
                    id: 'y4s2',
                    label: 'Semester 2',
                    subjects: [
                        { id: 'cs403', name: 'Big Data Analytics', code: 'CS403', microGroups: [{ id: 'mg15', name: 'Big Data Pro', members: 20 }] },
                        { id: 'cs404', name: 'Final Year Project', code: 'CS404', microGroups: [{ id: 'mg16', name: 'FYP Elite', members: 35 }] }
                    ]
                }
            ]
        }
    ]
}

const commonResources = {
    notes: [
        { id: 'n1', title: 'Chapter 1: Fundamentals', author: 'Dr. Smith', reviews: 150, rating: 4.9, content: 'Basic concepts and definitions...' },
        { id: 'n2', title: 'Weekly Summary', author: 'Alex Johnson', reviews: 45, rating: 4.5, content: 'Detailed summary of week 4 lectures...' }
    ],
    papers: [
        { id: 'p1', title: 'Mid-semester 2023', year: 2023, reviews: 320, rating: 5.0 },
        { id: 'p2', title: 'Final Exam Preparation', year: 2024, reviews: 88, rating: 4.7 }
    ],
    videos: [
        { id: 'v1', title: 'YouTube: Core Tutorials', platform: 'YouTube', reviews: 1200, rating: 5.0, link: 'https://youtube.com' },
        { id: 'v2', title: 'LMS Video Tutorial', platform: 'Local', reviews: 67, rating: 4.8, link: '#' }
    ]
}

export const groupMaterials = {
    'mg1': commonResources, 'mg2': commonResources, 'mg3': commonResources, 'mg4': commonResources,
    'mg5': commonResources, 'mg6': commonResources, 'mg7': commonResources, 'mg8': commonResources,
    'mg9': commonResources, 'mg10': commonResources, 'mg11': commonResources, 'mg12': commonResources,
    'mg13': commonResources, 'mg14': commonResources, 'mg15': commonResources, 'mg16': commonResources
}

export const upcomingDeadlines = [
    { id: 1, title: 'OOP Assignment 1', subject: 'CS102', dueDate: '2024-03-25', priority: 'High' },
    { id: 2, title: 'DSA Quiz 2', subject: 'CS201', dueDate: '2024-03-28', priority: 'Medium' }
]


export const mockProfileActivities = {
    groups: [
        { _id: 'mg1', groupName: 'Code Masters', subjectCode: 'CS101', members: 15 },
        { _id: 'mg3', groupName: 'Algo Squad', subjectCode: 'CS102', members: 20 }
    ],
    materials: [
        { _id: 'm1', title: 'Lecture Notes - Week 1', description: 'Introductory concepts for CS101.', type: 'PDF', coverImage: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=400' },
        { _id: 'm2', title: 'Data Structures Cheat Sheet', description: 'Important algorithms summarized.', type: 'Doc', coverImage: null }
    ],
    events: [
        { _id: 'e1', eventName: 'Tech Summit 2024', eventDate: '2024-05-10', status: 'Upcoming' },
        { _id: 'e2', eventName: 'Programming Contest', eventDate: '2024-04-20', status: 'Registered' }
    ],
    bookings: [
        { _id: 'b1', resourceName: 'Conference Room A', date: '2024-04-18', startTime: '10:00 AM', endTime: '12:00 PM', seats: 5, purpose: 'Group Study', contactNumber: '0712345678' },
        { _id: 'b2', resourceName: 'Study Pod 4', date: '2024-04-19', startTime: '02:00 PM', endTime: '04:00 PM', seats: 1, purpose: 'Individual Work', contactNumber: '0712345678' }
    ]
};
