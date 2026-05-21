const { MongoClient } = require("mongodb");
require("dotenv").config();

const doctors = [
  {
    name: "Dr. Ayesha Rahman",
    specialty: "Cardiologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600",
    experience: "10 years",
    availability: ["09:00 AM - 12:00 PM", "04:00 PM - 07:00 PM"],
    description: "Experienced cardiologist focused on preventive care.",
    hospital: "Labaid Cardiac Hospital",
    location: "Dhanmondi, Dhaka",
    fee: 800,
    rating: 4.9,
  },

  {
    name: "Dr. Sajid Hossain",
    specialty: "Dermatologist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600",
    experience: "8 years",
    availability: ["10:00 AM - 01:00 PM"],
    description: "Specialist in skin, hair, and cosmetic dermatology.",
    hospital: "Square Hospital",
    location: "Panthapath, Dhaka",
    fee: 1000,
    rating: 4.8,
  },

  {
    name: "Dr. Farhana Islam",
    specialty: "Neurologist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600",
    experience: "12 years",
    availability: ["11:00 AM - 02:00 PM"],
    description: "Expert in neurological disorders and stroke treatment.",
    hospital: "United Hospital",
    location: "Gulshan, Dhaka",
    fee: 1200,
    rating: 4.9,
  },

  {
    name: "Dr. Mahmud Karim",
    specialty: "Orthopedic Surgeon",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600",
    experience: "15 years",
    availability: ["09:00 AM - 11:00 AM", "05:00 PM - 08:00 PM"],
    description: "Specialized in bone, joint, and spine surgery.",
    hospital: "Apollo Hospital",
    location: "Bashundhara, Dhaka",
    fee: 1500,
    rating: 4.7,
  },

  {
    name: "Dr. Nusrat Jahan",
    specialty: "Pediatrician",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600",
    experience: "9 years",
    availability: ["10:00 AM - 01:00 PM", "03:00 PM - 06:00 PM"],
    description: "Dedicated child specialist with family-centered care.",
    hospital: "Popular Diagnostic Center",
    location: "Shyamoli, Dhaka",
    fee: 700,
    rating: 4.8,
  },

  {
    name: "Dr. Tanvir Ahmed",
    specialty: "ENT Specialist",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600",
    experience: "11 years",
    availability: ["02:00 PM - 06:00 PM"],
    description: "Treats ear, nose, and throat conditions effectively.",
    hospital: "Ibn Sina Hospital",
    location: "Mirpur, Dhaka",
    fee: 900,
    rating: 4.6,
  },

  {
    name: "Dr. Sharmeen Akter",
    specialty: "Gynecologist",
    image: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=600",
    experience: "14 years",
    availability: ["09:00 AM - 12:00 PM"],
    description: "Experienced in women's reproductive health care.",
    hospital: "Central Hospital",
    location: "Green Road, Dhaka",
    fee: 1100,
    rating: 4.9,
  },

  {
    name: "Dr. Rakib Hasan",
    specialty: "Psychiatrist",
    image: "https://images.unsplash.com/photo-1614436163996-25cee5f54290?w=600",
    experience: "7 years",
    availability: ["04:00 PM - 08:00 PM"],
    description: "Focused on mental health and behavioral therapy.",
    hospital: "Mind Care Clinic",
    location: "Banani, Dhaka",
    fee: 1300,
    rating: 4.7,
  },

  {
    name: "Dr. Mehedi Chowdhury",
    specialty: "General Physician",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600",
    experience: "6 years",
    availability: ["08:00 AM - 11:00 AM"],
    description: "Provides comprehensive general medical care.",
    hospital: "Medinova Medical Services",
    location: "Malibagh, Dhaka",
    fee: 600,
    rating: 4.5,
  },

  {
    name: "Dr. Sabrina Yeasmin",
    specialty: "Ophthalmologist",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600",
    experience: "13 years",
    availability: ["01:00 PM - 05:00 PM"],
    description: "Eye specialist skilled in cataract and retina care.",
    hospital: "National Eye Hospital",
    location: "Agargaon, Dhaka",
    fee: 1000,
    rating: 4.8,
  },
];

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db("docappoint").collection("doctors");
  await col.deleteMany({});
  await col.insertMany(doctors);
  console.log("Seeded", doctors.length, "doctors");
  process.exit(0);
})();

