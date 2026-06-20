import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema({
    mealName: { type: String },
    price: { type: String },
    description: { type: String },
    mealType: { type: String },
    availability: { type: String, default: 'Available' },
    image: { type: String },
});

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const foodServiceSchema = mongoose.Schema(
    {
        restaurantName: { type: String, required: true },
        locationType: { type: String, default: 'On Campus' }, // On Campus, Outside campus
        availableMeals: [{ type: String }], // Breakfast, Lunch, Dinner
        diningOptions: [{ type: String }],  // Dine-in, Takeaway, Hostel Delivery
        operatingHours: { type: String },
        email: { type: String },
        phone: { type: String },
        description: { type: String },
        location: { type: String },
        images: [{ type: String }],
        menuItems: [menuItemSchema],
        reviews: [reviewSchema],
        rating: { type: Number, required: true, default: 0 },
        numReviews: { type: Number, required: true, default: 0 },
        status: { type: String, default: 'Active' },
    },
    { timestamps: true }
);

const FoodService = mongoose.model('FoodService', foodServiceSchema);
export default FoodService;
