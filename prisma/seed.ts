import 'dotenv/config';
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

// Use DIRECT_URL for seeding (not pooled connection)
const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Comprehensive IIT Data with realistic details
const iitData = [
  {
    name: "Indian Institute of Technology Bombay",
    slug: "iit-bombay",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400076",
    established: 1958,
    nirfRanking: 3,
    website: "https://www.iitb.ac.in",
    email: "info@iitb.ac.in",
    phone: "+91-22-2572-2545",
    feesMin: 200000,
    feesMax: 250000,
    avgPackage: 2100000,
    highestPackage: 15000000,
    medianPackage: 1800000,
    placementRate: 98.5,
    rating: 4.7,
    overview: "IIT Bombay, established in 1958, is India's premier engineering institution located in Powai, Mumbai. Known for its world-class faculty, cutting-edge research facilities, and strong industry connections, IIT Bombay consistently ranks among the top engineering colleges globally. The institute offers undergraduate, postgraduate, and doctoral programs across various engineering and science disciplines. With a sprawling 550-acre campus, state-of-the-art laboratories, and a vibrant student community, IIT Bombay provides an unparalleled learning environment. The institute has produced numerous successful entrepreneurs, researchers, and industry leaders who have made significant contributions to technology and innovation worldwide.",
    highlights: [
      "Ranked #3 in NIRF Engineering Rankings",
      "98.5% placement rate with top recruiters",
      "550-acre green campus with modern facilities",
      "Strong alumni network across the globe",
      "Excellent research output and patents",
      "Active entrepreneurship cell and incubation center",
    ],
    facilities: [
      "Central Library with 4 lakh+ books",
      "24/7 High-speed Internet",
      "Modern Hostels with Wi-Fi",
      "Sports Complex with Olympic-size pool",
      "Advanced Research Labs",
      "Medical Center",
      "Cafeterias and Food Courts",
      "Auditoriums and Seminar Halls",
    ],
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/200px-Indian_Institute_of_Technology_Bombay_Logo.svg.png",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200",
  },
  {
    name: "Indian Institute of Technology Delhi",
    slug: "iit-delhi",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110016",
    established: 1961,
    nirfRanking: 2,
    website: "https://www.iitd.ac.in",
    email: "info@admin.iitd.ac.in",
    phone: "+91-11-2659-1749",
    feesMin: 200000,
    feesMax: 250000,
    avgPackage: 1800000,
    highestPackage: 18000000,
    medianPackage: 1600000,
    placementRate: 97.8,
    rating: 4.6,
    overview: "IIT Delhi, founded in 1961, stands as a symbol of academic excellence and innovation in the heart of India's capital. Spread across 320 acres in Hauz Khas, the institute is renowned for its rigorous academic programs, groundbreaking research, and strong industry partnerships. IIT Delhi has been at the forefront of technological advancement, producing graduates who have excelled in diverse fields from engineering to entrepreneurship. The campus boasts state-of-the-art infrastructure, including advanced laboratories, a comprehensive library, and excellent sports facilities. With a focus on holistic development, IIT Delhi nurtures not just technical skills but also leadership qualities and social responsibility.",
    highlights: [
      "Ranked #2 in NIRF Engineering Rankings",
      "Highest international package of ₹1.8 Cr",
      "320-acre campus in South Delhi",
      "Strong focus on research and innovation",
      "Excellent faculty-student ratio",
      "Active student clubs and societies",
    ],
    facilities: [
      "Central Library with digital resources",
      "High-speed Campus Network",
      "16 Hostels with modern amenities",
      "Sports Complex and Gymnasium",
      "Research Parks and Innovation Labs",
      "Health Center with 24/7 ambulance",
      "Multiple Dining Halls",
      "Auditorium and Convention Center",
    ],
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg/200px-Indian_Institute_of_Technology_Delhi_Logo.svg.png",
    bannerUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200",
  },
  {
    name: "Indian Institute of Technology Madras",
    slug: "iit-madras",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600036",
    established: 1959,
    nirfRanking: 1,
    website: "https://www.iitm.ac.in",
    email: "deanacad@iitm.ac.in",
    phone: "+91-44-2257-8000",
    feesMin: 200000,
    feesMax: 250000,
    avgPackage: 2000000,
    highestPackage: 19800000,
    medianPackage: 1750000,
    placementRate: 99.2,
    rating: 4.8,
    overview: "IIT Madras, established in 1959, consistently ranks as India's #1 engineering institution. Located in a sprawling 617-acre wooded campus in Chennai, IIT Madras is known for its academic rigor, research excellence, and innovation ecosystem. The institute has been a pioneer in interdisciplinary research and has established numerous centers of excellence in emerging technologies. With a strong emphasis on entrepreneurship, IIT Madras hosts one of India's most successful incubation centers. The campus features a unique blend of modern infrastructure and natural beauty, with deer roaming freely in the wooded areas. IIT Madras graduates are highly sought after by top companies worldwide and have founded numerous successful startups.",
    highlights: [
      "Ranked #1 in NIRF Overall Rankings",
      "99.2% placement rate consistently",
      "617-acre green campus with natural habitat",
      "Leading research institution in India",
      "Strong startup ecosystem and incubation",
      "International collaborations with top universities",
    ],
    facilities: [
      "Central Library with 5 lakh+ volumes",
      "High-Performance Computing facility",
      "18 Hostels with excellent amenities",
      "Olympic-standard Sports facilities",
      "Research Park and Innovation Center",
      "Hospital with specialist doctors",
      "Food Courts and Restaurants",
      "Open Air Theatre and Cultural spaces",
    ],
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/200px-IIT_Madras_Logo.svg.png",
    bannerUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200",
  },
  {
    name: "Indian Institute of Technology Kanpur",
    slug: "iit-kanpur",
    city: "Kanpur",
    state: "Uttar Pradesh",
    pincode: "208016",
    established: 1959,
    nirfRanking: 4,
    website: "https://www.iitk.ac.in",
    email: "info@iitk.ac.in",
    phone: "+91-512-259-7000",
    feesMin: 200000,
    feesMax: 250000,
    avgPackage: 1900000,
    highestPackage: 16000000,
    medianPackage: 1650000,
    placementRate: 96.5,
    rating: 4.6,
    overview: "IIT Kanpur, founded in 1959, is renowned for its academic excellence and pioneering research in engineering and sciences. Spread across 1055 acres on the Grand Trunk Road, it's one of the largest IIT campuses in India. IIT Kanpur was the first institute to offer Computer Science education in India and has been at the forefront of technological innovation. The institute is known for its strong emphasis on fundamental research, interdisciplinary programs, and industry collaboration. With world-class faculty, modern laboratories, and a vibrant campus life, IIT Kanpur provides an ideal environment for learning and innovation. The institute has produced numerous leaders in academia, industry, and entrepreneurship.",
    highlights: [
      "Ranked #4 in NIRF Engineering Rankings",
      "1055-acre sprawling campus",
      "Pioneer in Computer Science education in India",
      "Strong research focus with numerous patents",
      "Excellent placement record with top companies",
      "Active student technical and cultural societies",
    ],
    facilities: [
      "P.K. Kelkar Library with vast collection",
      "Advanced Computing facility",
      "Modern Hostels for all students",
      "Sports Complex with multiple grounds",
      "National Wind Tunnel Facility",
      "Health Center with specialists",
      "Multiple Dining Halls",
      "Auditoriums and Conference facilities",
    ],
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/IIT_Kanpur_Logo.svg/200px-IIT_Kanpur_Logo.svg.png",
    bannerUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200",
  },
  {
    name: "Indian Institute of Technology Kharagpur",
    slug: "iit-kharagpur",
    city: "Kharagpur",
    state: "West Bengal",
    pincode: "721302",
    established: 1951,
    nirfRanking: 5,
    website: "https://www.iitkgp.ac.in",
    email: "registrar@adm.iitkgp.ac.in",
    phone: "+91-3222-255-221",
    feesMin: 200000,
    feesMax: 250000,
    avgPackage: 1700000,
    highestPackage: 14000000,
    medianPackage: 1500000,
    placementRate: 95.8,
    rating: 4.5,
    overview: "IIT Kharagpur, established in 1951, holds the distinction of being the first IIT in India. With a massive 2100-acre campus, it's the largest among all IITs. The institute has been a pioneer in technical education and has contributed significantly to India's technological development. IIT Kharagpur offers the widest range of academic programs among all IITs, including unique courses in Architecture, Law, and Medical Science & Technology. The campus features a perfect blend of heritage buildings and modern infrastructure. Known for its strong alumni network and excellent placement record, IIT Kharagpur continues to be a preferred destination for aspiring engineers. The institute's Entrepreneurship Cell is one of the most active in the country.",
    highlights: [
      "First IIT established in India (1951)",
      "Largest IIT campus at 2100 acres",
      "Widest range of academic programs",
      "Strong heritage and tradition",
      "Excellent placement opportunities",
      "Active entrepreneurship ecosystem",
    ],
    facilities: [
      "Central Library with 4.5 lakh+ books",
      "Campus-wide Wi-Fi connectivity",
      "21 Halls of Residence",
      "Comprehensive Sports Complex",
      "Advanced Research Centers",
      "BC Roy Technology Hospital",
      "Multiple Food Courts and Canteens",
      "Auditoriums and Cultural venues",
    ],
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/IIT_Kharagpur_Logo.svg/200px-IIT_Kharagpur_Logo.svg.png",
    bannerUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200",
  },
  {
    name: "Indian Institute of Technology Roorkee",
    slug: "iit-roorkee",
    city: "Roorkee",
    state: "Uttarakhand",
    pincode: "247667",
    established: 1847,
    nirfRanking: 7,
    website: "https://www.iitr.ac.in",
    email: "info@iitr.ac.in",
    phone: "+91-1332-285-311",
    feesMin: 200000,
    feesMax: 250000,
    avgPackage: 1600000,
    highestPackage: 13000000,
    medianPackage: 1400000,
    placementRate: 94.5,
    rating: 4.4,
    overview: "IIT Roorkee, with its roots dating back to 1847 as the Thomason College of Civil Engineering, is one of the oldest technical institutions in Asia. Converted to an IIT in 2001, it combines rich heritage with modern excellence. The 365-acre campus in the foothills of the Himalayas provides a serene learning environment. IIT Roorkee is particularly renowned for its Civil Engineering, Architecture, and Earthquake Engineering programs. The institute has been instrumental in nation-building projects and continues to contribute significantly to infrastructure development. With state-of-the-art facilities, experienced faculty, and strong industry connections, IIT Roorkee offers excellent opportunities for academic and professional growth.",
    highlights: [
      "Oldest technical institution in Asia (1847)",
      "Ranked #7 in NIRF Engineering Rankings",
      "Renowned for Civil and Earthquake Engineering",
      "Beautiful campus in Himalayan foothills",
      "Strong industry partnerships",
      "Rich heritage and tradition",
    ],
    facilities: [
      "Central Library with heritage collection",
      "High-speed Internet across campus",
      "Modern Hostels and Bhawans",
      "Sports facilities and Gymnasium",
      "Earthquake Engineering Research Center",
      "Health Center with medical facilities",
      "Dining Halls and Cafeterias",
      "Hobbies Club and Cultural centers",
    ],
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Indian_Institute_of_Technology_Roorkee_logo.png/200px-Indian_Institute_of_Technology_Roorkee_logo.png",
    bannerUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200",
  },
];

// Branch mapping for normalization
const branchMapping: Record<string, string> = {
  "Computer Science and Engineering": "COMPUTER_SCIENCE",
  "Civil Engineering": "CIVIL",
  "Mechanical Engineering": "MECHANICAL",
  "Electrical Engineering": "ELECTRICAL",
  "Electronics and Communication Engineering": "ELECTRONICS",
  "Chemical Engineering": "CHEMICAL",
  "Aerospace Engineering": "AEROSPACE",
  "Metallurgical and Materials Engineering": "METALLURGY",
  "Biotechnology and Biochemical Engineering": "BIOTECHNOLOGY",
  "Engineering Physics": "OTHER",
  "Bio Engineering": "BIOTECHNOLOGY",
  "Data Science and Engineering": "DATA_SCIENCE",
  "Artificial Intelligence": "ARTIFICIAL_INTELLIGENCE",
  "Mathematics and Computing": "COMPUTER_SCIENCE",
  "Materials Engineering": "METALLURGY",
  "Metallurgical Engineering and Materials Science": "METALLURGY",
};

// Category mapping
const categoryMapping: Record<string, string> = {
  OPEN: "GENERAL",
  EWS: "EWS",
  "OBC-NCL": "OBC_NCL",
  SC: "SC",
  ST: "ST",
};

interface CSVRow {
  Institute: string;
  "Academic Program Name": string;
  Quota: string;
  "Seat Type": string;
  Gender: string;
  "Opening Rank": string;
  "Closing Rank": string;
}

async function main() {
  console.log("🌱 Starting seed...");

  // Read and parse CSV files early to extract all IIT names
  console.log("📊 Reading JOSAA data...");
  const csvPath = path.join(process.cwd(), "data", "Josaa data - round 5 data.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const records: CSVRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });
  console.log(`📈 Found ${records.length} course entries`);

  const uniqueInstituteNames = Array.from(new Set(records.map((r) => r.Institute).filter((i) => i.includes("Indian Institute of Technology"))));

  // Clean existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  // Create colleges
  console.log(`🏫 Creating ${uniqueInstituteNames.length} colleges...`);
  const collegesToCreate = uniqueInstituteNames.map(name => {
    const richData = iitData.find(iit => iit.name === name);
    if (richData) {
      return {
        name: richData.name,
        slug: richData.slug,
        type: "IIT",
        city: richData.city,
        state: richData.state,
        country: "India",
        established: richData.established,
        website: richData.website,
        nirfRanking: richData.nirfRanking,
        rating: 4.5,
        avgPackage: richData.avgPackage,
        highestPackage: richData.highestPackage,
        medianPackage: Math.floor(richData.avgPackage * 0.9),
        placementRate: 95.0,
        overview: richData.overview || `${richData.name} is one of India's premier engineering institutions, known for excellence in technical education and research.`,
        highlights: richData.highlights || [
          "Top-tier faculty",
          "World-class infrastructure",
          "Strong industry connections",
          "Excellent placement record",
        ],
        facilities: richData.facilities || [
          "Library",
          "Hostels",
          "Sports Complex",
          "Research Labs",
          "Cafeteria",
        ],
        imageUrl: richData.imageUrl,
        logoUrl: richData.logoUrl,
        bannerUrl: richData.bannerUrl,
        isActive: true,
        isFeatured: richData.nirfRanking <= 10,
      };
    } else {
      const cityMatch = name.split("Technology ")[1];
      const city = cityMatch ? cityMatch.replace("(BHU) ", "").replace("(ISM) ", "") : "Unknown";
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return {
        name,
        slug,
        type: "IIT",
        city,
        state: "India", // Placeholder
        country: "India",
        established: 2008, // Generic
        website: `https://${slug}.ac.in`, 
        nirfRanking: 50,
        rating: 4.0,
        avgPackage: 1200000,
        highestPackage: 4000000,
        medianPackage: 1000000,
        placementRate: 85.0,
        overview: `${name} is a premier engineering institution in India.`,
        highlights: ["Premier Institute", "Institute of National Importance"],
        facilities: ["Library", "Hostels", "Sports Complex", "Research Labs"],
        isActive: true,
        isFeatured: false,
      };
    }
  });

  const colleges = await Promise.all(
    collegesToCreate.map((data : any) => prisma.college.create({ data }))
  );

  // Fetch colleges from DB just to be absolutely sure we have the committed IDs
  const dbColleges = await prisma.college.findMany();

  console.log(`📈 Found ${records.length} course entries`);

  // Create courses from CSV
  console.log("📚 Creating courses...");
  let courseCount = 0;
  const courseMap = new Map<string, any>();

  for (const record of records) {
    // Find matching college
    const college = dbColleges.find((c) => c.name === record.Institute);
    if (!college) continue;

    // Extract branch name
    const programName = record["Academic Program Name"];
    let branchName = programName.split("(")[0].trim();
    
    // Map to enum
    let branchEnum = "OTHER";
    for (const [key, value] of Object.entries(branchMapping)) {
      if (branchName.includes(key)) {
        branchEnum = value;
        branchName = key;
        break;
      }
    }

    // Map category
    const seatType = record["Seat Type"];
    const category = categoryMapping[seatType] || "GENERAL";

    // Skip PwD and other special categories for now
    if (seatType.includes("PwD")) continue;

    // Create unique key
    const key = `${college.id}-${branchEnum}-${category}`;
    
    // Only create if not exists or update with better ranks
    const openingRank = parseInt(record["Opening Rank"]);
    const closingRank = parseInt(record["Closing Rank"]);

    if (!courseMap.has(key)) {
      courseMap.set(key, {
        collegeId: college.id,
        branch: branchEnum,
        branchName: branchName,
        category: category,
        openingRank: openingRank,
        closingRank: closingRank,
        duration: 4,
        degree: "B.Tech",
        tuitionFee: 200000,
        hostelFee: 50000,
        otherFees: 20000,
        isActive: true,
      });
    }
  }

  // Bulk create courses
  const coursesToCreateList = Array.from(courseMap.values());
  console.log(`📝 Creating ${coursesToCreateList.length} unique courses...`);
  
  try {
    // Split into chunks to avoid hitting query size limits
    const chunkSize = 200;
    for (let i = 0; i < coursesToCreateList.length; i += chunkSize) {
      const chunk = coursesToCreateList.slice(i, i + chunkSize);
      const result = await prisma.course.createMany({ data: chunk });
      courseCount += result.count;
    }
  } catch (error) {
    console.error(`Error creating courses: ${error}`);
  }

  console.log(`✅ Created ${courseCount} courses`);

  // Create sample users
  console.log("👥 Creating sample users...");
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@iitpredictor.com" },
      update: {},
      create: {
        email: "admin@iitpredictor.com",
        name: "Admin User",
        role: "ADMIN",
      },
    }),
    prisma.user.upsert({
      where: { email: "student@example.com" },
      update: {},
      create: {
        email: "student@example.com",
        name: "Sample Student",
        role: "USER",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample reviews
  console.log("⭐ Creating sample reviews...");
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        collegeId: dbColleges[0].id,
        userId: users[1].id,
        title: "Excellent Infrastructure and Faculty",
        content:
          "The campus infrastructure is world-class with state-of-the-art labs and facilities. Faculty members are highly qualified and supportive.",
        rating: 4.5,
        academicsRating: 5.0,
        placementRating: 4.5,
        infrastructureRating: 5.0,
        facultyRating: 4.5,
        campusLifeRating: 4.0,
        batch: 2024,
        course: "Computer Science and Engineering",
        status: "APPROVED",
      },
    }),
    prisma.review.create({
      data: {
        collegeId: dbColleges[1].id,
        userId: users[1].id,
        title: "Great Learning Experience",
        content:
          "Amazing peer group and learning environment. The placement opportunities are excellent with top companies visiting campus.",
        rating: 4.8,
        academicsRating: 4.5,
        placementRating: 5.0,
        infrastructureRating: 4.5,
        facultyRating: 4.5,
        campusLifeRating: 5.0,
        batch: 2023,
        course: "Electrical Engineering",
        status: "APPROVED",
      },
    }),
  ]);

  console.log(`✅ Created ${reviews.length} reviews`);

  console.log("✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
