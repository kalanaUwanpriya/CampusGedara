/**
 * Budget optimization utilities
 */

/**
 * Calculate optimal budget allocation between accommodation and food
 */
export const calculateOptimalAllocation = (totalBudget, lifestyle, dietary) => {
    let accommodationPercent = 0.65; // Default 65% accommodation, 35% food

    // Adjust based on cooking frequency
    if (lifestyle.cookingFrequency === 'always') {
        accommodationPercent = 0.70; // Save on food, spend more on better kitchen
    } else if (lifestyle.cookingFrequency === 'never') {
        accommodationPercent = 0.60; // More budget for eating out
    }

    // Adjust for meal frequency
    if (dietary.mealFrequency === 'daily') {
        accommodationPercent = 0.55; // Heavy dining out needs more food budget
    }

    return {
        accommodation: Math.round(totalBudget * accommodationPercent),
        food: Math.round(totalBudget * (1 - accommodationPercent)),
        percentages: {
            accommodation: Math.round(accommodationPercent * 100),
            food: Math.round((1 - accommodationPercent) * 100)
        }
    };
};

/**
 * Identify potential savings in a package
 */
export const identifySavings = (packageData, profile) => {
    const savings = [];

    // Check if over-budgeting on accommodation
    const optimalAllocation = calculateOptimalAllocation(
        profile.budget.monthly,
        profile.lifestyle,
        profile.dietary
    );

    if (packageData.accommodation.price > optimalAllocation.accommodation) {
        const potentialSaving = packageData.accommodation.price - optimalAllocation.accommodation;
        savings.push({
            category: 'accommodation',
            amount: potentialSaving,
            suggestion: 'Consider a more budget-friendly accommodation to save on rent'
        });
    }

    // Check food budget
    if (packageData.foodPackage.estimatedMonthlyCost > optimalAllocation.food) {
        const potentialSaving = packageData.foodPackage.estimatedMonthlyCost - optimalAllocation.food;
        savings.push({
            category: 'food',
            amount: potentialSaving,
            suggestion: 'Cook more meals at home to reduce dining costs'
        });
    }

    return savings;
};

/**
 * Calculate semester and yearly projections
 */
export const calculateProjections = (monthlyCost) => {
    return {
        monthly: monthlyCost,
        semester: monthlyCost * 4, // 4-month semester
        yearly: monthlyCost * 9, // 9-month academic year
        fullYear: monthlyCost * 12
    };
};

/**
 * Compare value proposition of packages
 */
export const compareValueProposition = (package1, package2) => {
    const comparison = {
        costDifference: package1.totalCost - package2.totalCost,
        scoreDifference: package1.score - package2.score,
        valueRatio: package1.score / package1.totalCost,
        betterValue: null
    };

    const package1Ratio = package1.score / package1.totalCost;
    const package2Ratio = package2.score / package2.totalCost;

    comparison.betterValue = package1Ratio > package2Ratio ? 'package1' : 'package2';

    return comparison;
};

/**
 * Suggest budget optimizations
 */
export const suggestOptimizations = (packageData, profile) => {
    const suggestions = [];

    const totalCost = packageData.totalCost;
    const budget = profile.budget.monthly;
    const overspend = totalCost - budget;

    if (overspend > 0) {
        // Over budget - suggest cuts
        suggestions.push({
            type: 'reduce',
            priority: 'high',
            message: `You're $${overspend} over budget. Consider these options:`,
            options: [
                'Look for accommodation $50-100 cheaper',
                'Reduce dining out frequency',
                'Choose budget-friendly restaurants'
            ]
        });
    } else if (overspend < -200) {
        // Well under budget - suggest upgrades
        const surplus = Math.abs(overspend);
        suggestions.push({
            type: 'upgrade',
            priority: 'low',
            message: `You have $${surplus} budget surplus. You could:`,
            options: [
                'Upgrade to better accommodation',
                'Add more dining variety',
                'Choose higher-quality food options'
            ]
        });
    } else {
        // Perfect fit
        suggestions.push({
            type: 'optimal',
            priority: 'info',
            message: 'Your package is well-optimized for your budget!',
            options: []
        });
    }

    return suggestions;
};

/**
 * Calculate cost breakdown
 */
export const calculateCostBreakdown = (packageData) => {
    const total = packageData.totalCost;

    return {
        accommodation: {
            amount: packageData.accommodation.price,
            percentage: Math.round((packageData.accommodation.price / total) * 100)
        },
        food: {
            amount: packageData.foodPackage.estimatedMonthlyCost,
            percentage: Math.round((packageData.foodPackage.estimatedMonthlyCost / total) * 100)
        },
        total
    };
};
