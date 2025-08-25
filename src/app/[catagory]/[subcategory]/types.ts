export const slugToSubcategory = (slug: string): string => {
  const mapping: { [key: string]: string } = {
    // News subcategories
    local: "local",
    health: "health",
    "auto-racing": "auto-racing",
    "fact-check-news": "fact-check-news",
    cebu: "cebu",
    negroes: "negroes",

    // Feature subcategories
    "health-wellness": "health-wellness",
    "medical-frontiers": "medical-frontiers",
    travel: "travel",
    destinations: "destinations",
    entertainment: "entertainment",
    film: "film",
    music: "music",
    "celebrity-news": "celebrity-news",
    lifestyle: "lifestyle",
    fashion: "fashion",
    food: "food",
    "franchise-living": "franchise-living",
    "arts-culture": "arts-culture",
    "therapeutic-arts-stories": "therapeutic-arts-stories",
    "cultural-events": "cultural-events",

    // Education subcategories
    education: "education",
    "academic-updates": "academic-updates",
    universities: "universities",
    "students-teachers": "students-teachers",

    // Environment subcategories
    environment: "environment",
    "climate-change": "climate-change",
    "environmental-awareness": "environmental-awareness",
    "green-lifestyles": "green-lifestyles",

    // Opinion subcategories
    editorial: "editorial",
    "current-events": "current-events",
    politics: "politics",
    "special-issues": "special-issues",
    "foreign-politics-trends": "foreign-politics-trends",

    // Industries subcategories
    "weekly-fashion-trends": "weekly-fashion-trends",
    "weekly-fashion-shopping": "weekly-fashion-shopping",
    exposer: "exposer",
    "entertainment-social-impact": "entertainment-social-impact",
    "community-building-advocacy-reporting":
      "community-building-advocacy-reporting",

    // Sports subcategories
    "sports-day": "sports-day",
    "farm-related-supplies-stories": "farm-related-supplies-stories",
    "local-news": "local-news",
    "all-sport-games": "all-sport-games",
    "national-news": "national-news",

    // Business subcategories
    business: "business",
    motoring: "motoring",
    vehicles: "vehicles",
    transportation: "transportation",
    techbark: "techbark",
    "innovations-gadgets": "innovations-gadgets",

    // Other Pages subcategories
    "about-us": "about-us",
    "news-members-staff": "news-members-staff",
    "contact-us": "contact-us",
    "company-details-social-platforms": "company-details-social-platforms",
    "pricing-terms-feedback-survey": "pricing-terms-feedback-survey",

    // Legacy mappings (backwards compatibility)
    localnews: "local-news",
    "fact-first": "fact-check-news",
  };

  return mapping[slug] || slug;
};

export const formatSubcategoryName = (subcategory: string): string => {
  const displayNames: { [key: string]: string } = {
    // News
    local: "Local News",
    health: "Health",
    "auto-racing": "Auto Racing",
    "fact-check-news": "Fact Check News",
    cebu: "Cebu News",
    negroes: "Negroes News",

    // Feature
    "health-wellness": "Health & Wellness",
    "medical-frontiers": "Medical Frontiers",
    travel: "Travel",
    destinations: "Destinations",
    entertainment: "Entertainment",
    film: "Film",
    music: "Music",
    "celebrity-news": "Celebrity News",
    lifestyle: "Lifestyle",
    fashion: "Fashion",
    food: "Food",
    "franchise-living": "Franchise Living",
    "arts-culture": "Arts & Culture",
    "therapeutic-arts-stories": "Therapeutic Arts & Stories",
    "cultural-events": "Cultural Events",

    // Education
    education: "Education",
    "academic-updates": "Academic Updates",
    universities: "Universities",
    "students-teachers": "Students & Teachers",

    // Environment
    environment: "Environment",
    "climate-change": "Climate Change",
    "environmental-awareness": "Environmental Awareness",
    "green-lifestyles": "Green Lifestyles",

    // Opinion
    editorial: "Editorial",
    "current-events": "Current Events",
    politics: "Politics",
    "special-issues": "Special Issues",
    "foreign-politics-trends": "Foreign Politics & Trends",

    // Industries
    "weekly-fashion-trends": "Weekly Fashion Trends",
    "weekly-fashion-shopping": "Weekly Fashion Shopping",
    exposer: "Exposé",
    "entertainment-social-impact": "Entertainment & Social Impact",
    "community-building-advocacy-reporting":
      "Community Building & Advocacy Reporting",

    // Sports
    "sports-day": "Sports Day",
    "farm-related-supplies-stories": "Farm Related Supplies & Stories",
    "local-news": "Local News",
    "all-sport-games": "All Sport Games",
    "national-news": "National News",

    // Business
    business: "Business",
    motoring: "Motoring",
    vehicles: "Vehicles",
    transportation: "Transportation",
    techbark: "TechBark",
    "innovations-gadgets": "Innovations & Gadgets",

    // Other Pages
    "about-us": "About Us",
    "news-members-staff": "News Members & Staff",
    "contact-us": "Contact Us",
    "company-details-social-platforms": "Company Details & Social Platforms",
    "pricing-terms-feedback-survey": "Pricing, Terms & Feedback Survey",

    // Legacy
    "fact-first": "Fact First",
  };

  return (
    displayNames[subcategory] ||
    subcategory.charAt(0).toUpperCase() +
      subcategory.slice(1).replace(/-/g, " ")
  );
};
