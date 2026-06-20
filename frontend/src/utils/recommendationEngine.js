// Core recommendation engine with scoring algorithms

/**
 * Calculate how well an accommodation matches the user's budget
 * @returns score from 0-100
 */
export const calculateBudgetScore = (price, targetBudget, flexibility) => {
    const ratio = price / targetBudget;

    if (flexibility === 'strict') {
        if (ratio <= 1.0) return 100;
        if (ratio <= 1.05) return 80;
        if (ratio <= 1.10) return 50;
        return 0;
    } else if (flexibility === 'flexible') {
        if (ratio <= 0.95) return 100;
        if (ratio <= 1.10) return 90;
        if (ratio <= 1.20) return 70;
        if (ratio <= 1.30) return 40;
        return 0;
    } else { // very-flexible
        if (ratio <= 0.90) return 100;
        if (ratio <= 1.15) return 95;
        if (ratio <= 1.30) return 80;
        if (ratio <= 1.50) return 50;
        return 20;
    }
};

/**
 * Calculate proximity score based on distance preference
 * @returns score from 0-100
 */
export const calculateProximityScore = (distance, preference) => {
    const distanceValue = parseFloat(distance);

    if (distance === 'On Campus') return 100;

    if (preference === 'on-campus') {
        return distance === 'On Campus' ? 100 : 30;
    } else if (preference === '<0.5mi') {
        if (distanceValue <= 0.5) return 100;
        if (distanceValue <= 0.8) return 70;
        if (distanceValue <= 1.0) return 40;
        return 20;
    } else if (preference === '<1mi') {
        if (distanceValue <= 1.0) return 100;
        if (distanceValue <= 1.5) return 80;
        return 50;
    } else if (preference === '<2mi') {
        if (distanceValue <= 2.0) return 100;
        return 70;
    } else { // any
        return 80; // slight preference for closer
    }
};

/**
 * Calculate dietary compatibility score
 * @returns score from 0-100
 */
export const calculateDietaryScore = (restaurantDietary, userRestrictions) => {
    if (userRestrictions.length === 0) return 100;

    const matches = userRestrictions.filter(restriction =>
        restaurantDietary.includes(restriction)
    );

    const matchRatio = matches.length / userRestrictions.length;
    return Math.round(matchRatio * 100);
};

/**
 * Score an accommodation based on user profile
 * @returns object with score and breakdown
 */
export const scoreAccommodation = (profile, accommodation) => {
    const scores = {};

    // Budget match (30 points)
    const accommodationBudget = profile.budget.monthly * 0.65; // Reserve 35% for food
    scores.budget = calculateBudgetScore(
        accommodation.price,
        accommodationBudget,
        profile.budget.flexibility
    ) * 0.30;

    // Location proximity (25 points)
    scores.proximity = calculateProximityScore(
        accommodation.location,
        profile.proximity.campusDistance
    ) * 0.25;

    // Amenities match (20 points)
    const desiredAmenities = getDesiredAmenities(profile.lifestyle);
    const amenityMatches = accommodation.amenities.filter(a =>
        desiredAmenities.includes(a)
    ).length;
    scores.amenities = (amenityMatches / Math.max(desiredAmenities.length, 1)) * 20;

    // Lifestyle compatibility (15 points)
    scores.lifestyle = calculateLifestyleScore(profile.lifestyle, accommodation) * 0.15;

    // Size/type suitability (10 points)
    scores.suitability = calculateSuitabilityScore(profile, accommodation) * 0.10;

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    return {
        totalScore: Math.round(totalScore),
        breakdown: scores,
        accommodation
    };
};

/**
 * Score food options based on user profile
 * @returns object with score and breakdown
 */
export const scoreFoodOption = (profile, restaurant) => {
    const scores = {};

    // Dietary compatibility (35 points)
    scores.dietary = calculateDietaryScore(
        restaurant.dietary,
        profile.dietary.restrictions
    ) * 0.35;

    // Budget alignment (25 points)
    const priceValue = restaurant.price.length; // $ = 1, $$ = 2, $$$ = 3
    const budgetPreference = profile.budget.monthly < 1000 ? 1 : profile.budget.monthly < 1500 ? 2 : 3;
    scores.budget = (1 - Math.abs(priceValue - budgetPreference) / 3) * 25;

    // Cuisine preference match (20 points)
    const cuisineMatch = profile.dietary.cuisinePreferences?.includes(restaurant.cuisine) ? 1 : 0.5;
    scores.cuisine = cuisineMatch * 20;

    // Rating quality (20 points)
    scores.quality = (restaurant.rating / 5) * 20;

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    return {
        totalScore: Math.round(totalScore),
        breakdown: scores,
        restaurant
    };
};

/**
 * Generate personalized package recommendations
 */
export const generatePackages = (profile, accommodations, restaurants) => {
    const packages = [];

    // Score all accommodations
    const scoredAccommodations = accommodations
        .map(acc => scoreAccommodation(profile, acc))
        .filter(scored => scored.totalScore >= 50) // Minimum threshold
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10); // Top 10 accommodations

    // For each accommodation, create food package
    scoredAccommodations.forEach(scoredAcc => {
        const accommodation = scoredAcc.accommodation;
        const accommodationCost = accommodation.price;
        const remainingBudget = profile.budget.monthly - accommodationCost;

        // Score restaurants
        const scoredRestaurants = restaurants
            .map(rest => scoreFoodOption(profile, rest))
            .filter(scored => scored.totalScore >= 60)
            .sort((a, b) => b.totalScore - a.totalScore);

        // Select 2-3 restaurants for variety
        const selectedRestaurants = scoredRestaurants.slice(0, 3);

        // Estimate monthly food cost (based on meal frequency)
        const estimatedMealCost = calculateMonthlyFoodCost(
            selectedRestaurants.map(sr => sr.restaurant),
            profile.dietary.mealFrequency
        );

        const totalCost = accommodationCost + estimatedMealCost;

        // Calculate overall package score
        const packageScore = calculatePackageScore(
            scoredAcc,
            selectedRestaurants,
            totalCost,
            profile
        );

        packages.push({
            id: `pkg-${accommodation.id}-${Date.now()}`,
            accommodation: {
                ...accommodation,
                score: scoredAcc.totalScore,
                scoreBreakdown: scoredAcc.breakdown
            },
            foodPackage: {
                restaurants: selectedRestaurants.map(sr => ({
                    ...sr.restaurant,
                    score: sr.totalScore,
                    scoreBreakdown: sr.breakdown
                })),
                estimatedMonthlyCost: estimatedMealCost
            },
            totalCost,
            score: packageScore.total,
            scoreBreakdown: packageScore.breakdown,
            savings: calculateSavings(totalCost, profile.budget.monthly),
            explanations: generateExplanations(scoredAcc, selectedRestaurants, profile, totalCost)
        });
    });

    // Sort by score and return top 5
    return packages
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
};

/**
 * Helper: Get desired amenities based on lifestyle
 */
const getDesiredAmenities = (lifestyle) => {
    const amenities = ['WiFi']; // Always desired

    if (lifestyle.cookingFrequency === 'often' || lifestyle.cookingFrequency === 'always') {
        amenities.push('Kitchen');
    }
    if (lifestyle.socialPreference === 'social') {
        amenities.push('Common Area', 'Study Room');
    }
    amenities.push('Laundry', 'Parking');

    return amenities;
};

/**
 * Helper: Calculate lifestyle compatibility
 */
const calculateLifestyleScore = (lifestyle, accommodation) => {
    let score = 50; // Base score

    // Check for kitchen if needed
    if (lifestyle.cookingFrequency === 'always' || lifestyle.cookingFrequency === 'often') {
        if (accommodation.amenities.includes('Kitchen')) score += 30;
        else score -= 20;
    }

    // Social vs quiet
    if (lifestyle.socialPreference === 'quiet' && accommodation.type === 'Shared') {
        score -= 15;
    }
    if (lifestyle.socialPreference === 'social' && accommodation.type === 'Shared') {
        score += 20;
    }

    return Math.max(0, Math.min(100, score));
};

/**
 * Helper: Calculate suitability score
 */
const calculateSuitabilityScore = (profile, accommodation) => {
    let score = 70; // Base score

    // Size appropriateness
    if (accommodation.bedrooms === 1) score += 30; // Studio/1BR good for students

    return Math.min(100, score);
};

/**
 * Helper: Estimate monthly food cost
 */
const calculateMonthlyFoodCost = (restaurants, mealFrequency) => {
    const avgCostPerMeal = restaurants.reduce((sum, r) => {
        const cost = r.price === '$' ? 8 : r.price === '$$' ? 12 : 18;
        return sum + cost;
    }, 0) / restaurants.length;

    let mealsPerMonth;
    if (mealFrequency === 'daily') mealsPerMonth = 60; // 2 meals/day
    else if (mealFrequency === 'weekdays') mealsPerMonth = 40;
    else mealsPerMonth = 20; // occasional

    return Math.round(avgCostPerMeal * mealsPerMonth);
};

/**
 * Calculate overall package score
 */
const calculatePackageScore = (scoredAcc, scoredRestaurants, totalCost, profile) => {
    const breakdown = {};

    // Budget fit (30 points)
    breakdown.budgetFit = calculateBudgetScore(
        totalCost,
        profile.budget.monthly,
        profile.budget.flexibility
    ) * 0.30;

    // Accommodation quality (30 points)
    breakdown.accommodation = (scoredAcc.totalScore / 100) * 30;

    // Food quality (25 points)
    const avgFoodScore = scoredRestaurants.reduce((sum, sr) => sum + sr.totalScore, 0) / scoredRestaurants.length;
    breakdown.food = (avgFoodScore / 100) * 25;

    // Convenience (15 points)
    breakdown.convenience = 12; // Simplified for now

    const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

    return {
        total: Math.round(total),
        breakdown
    };
};

/**
 * Calculate savings compared to budget
 */
const calculateSavings = (totalCost, budget) => {
    return Math.max(0, budget - totalCost);
};

/**
 * Generate explanation text for package
 */
const generateExplanations = (scoredAcc, scoredRestaurants, profile, totalCost) => {
    const explanations = [];
    const accommodation = scoredAcc.accommodation;

    // Budget explanation
    const budgetDiff = ((totalCost / profile.budget.monthly) * 100 - 100).toFixed(0);
    if (budgetDiff <= 0) {
        explanations.push(`Perfect budget match - ${Math.abs(budgetDiff)}% under your target`);
    } else if (budgetDiff <= 5) {
        explanations.push(`Excellent budget fit - within ${budgetDiff}% of target`);
    }

    // Dietary explanation
    if (profile.dietary.restrictions.length > 0) {
        const allMatch = scoredRestaurants.every(sr =>
            profile.dietary.restrictions.every(r => sr.restaurant.dietary.includes(r))
        );
        if (allMatch) {
            explanations.push(`All dietary preferences met (${profile.dietary.restrictions.join(', ')})`);
        }
    }

    // Location explanation
    if (accommodation.location.includes('On Campus') || accommodation.location.includes('0.')) {
        explanations.push(`Walking distance - ${accommodation.location.toLowerCase()}`);
    }

    // Lifestyle explanation
    if (profile.lifestyle.cookingFrequency === 'never' || profile.lifestyle.cookingFrequency === 'sometimes') {
        explanations.push('Matches your lifestyle - convenient dining options nearby');
    }

    return explanations;
};
