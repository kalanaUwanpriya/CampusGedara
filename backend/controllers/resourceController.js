import Resource from '../models/resourceModel.js';
import { checkAndExpireBookings } from '../utils/expirationCheck.js';

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
    try {
        const resources = await Resource.find({});
        res.json(resources);

        // Run cleanup in the background so the public list returns quickly.
        void checkAndExpireBookings();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
    try {
        const { name, category, locationId, building, floor, operatingHours, capacity, image } = req.body;

        const resource = new Resource({
            name,
            category,
            locationId,
            building,
            floor,
            operatingHours,
            capacity,
            availableSeats: capacity, // Initially all seats are available
            image
        });

        const createdResource = await resource.save();
        res.status(201).json(createdResource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private/Admin
const updateResource = async (req, res) => {
    try {
        const { name, category, locationId, building, floor, operatingHours, capacity, image } = req.body;

        const resource = await Resource.findById(req.params.id);

        if (resource) {
            resource.name = name || resource.name;
            resource.category = category || resource.category;
            resource.locationId = locationId || resource.locationId;
            resource.building = building || resource.building;
            resource.floor = floor !== undefined ? floor : resource.floor;
            resource.operatingHours = operatingHours || resource.operatingHours;
            
            // If capacity changes, we might need to adjust availableSeats. 
            // Simple logic: if new capacity is set, reset available seats to new capacity or keep current?
            // Usually, if we edit a resource, we might want to preserve current occupancy.
            // For now, let's just update capacity and adjust availableSeats if they exceed new capacity.
            if (capacity !== undefined) {
                const diff = capacity - resource.capacity;
                resource.capacity = capacity;
                resource.availableSeats = Math.max(0, resource.availableSeats + diff);
            }

            if (image) {
                resource.image = image;
            }

            const updatedResource = await resource.save();
            res.json(updatedResource);
        } else {
            res.status(404).json({ message: 'Resource not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (resource) {
            await Resource.deleteOne({ _id: resource._id });
            res.json({ message: 'Resource removed' });
        } else {
            res.status(404).json({ message: 'Resource not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getResources,
    createResource,
    updateResource,
    deleteResource
};
