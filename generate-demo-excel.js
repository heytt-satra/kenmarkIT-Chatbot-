
const XLSX = require('xlsx');
const path = require('path');

const knowledgeData = [
    {
        Category: "General",
        Question: "What is Kenmark ITan Solutions?",
        Answer: "Kenmark ITan Solutions is a trusted partner in IT solutions, providing web hosting, development, design, branding, marketing, and consultancy services. We focus on customer success and helping businesses achieve their goals."
    },
    {
        Category: "Services",
        Question: "What services do you offer?",
        Answer: "We offer a comprehensive range of IT services including: 1. Web Hosting (24x7x365 support) 2. Development (Web & App) 3. Design (UI/UX & Graphics) 4. Branding (Identity solutions) 5. Marketing (SEO, SMM, Offline) 6. Consultancy (Technical advice)."
    },
    {
        Category: "Services",
        Question: "Do you offer web hosting?",
        Answer: "Yes, we providing web hosting services to host the pride and joy of your business, available 24 x 7 x 365."
    },
    {
        Category: "Services",
        Question: "What kind of development services do you provide?",
        Answer: "We provide development services to transform your imagination into an online reality, covering both web and application development."
    },
    {
        Category: "Services",
        Question: "Can you help with branding?",
        Answer: "Yes, we offer branding solutions tailored specifically to your brand identity."
    },
    {
        Category: "Why Choose Us",
        Question: "Why should I choose Kenmark ITan Solutions?",
        Answer: "You should choose us for our: 1. Exceptional Customer Service (24/7 support) 2. Experienced Team of professionals 3. Clear Communication of technical concepts 4. Reliable Support 5. Fast Turnaround Time 6. Strong focus on Customer Success."
    },
    {
        Category: "Support",
        Question: "What kind of support do you offer?",
        Answer: "We offer reliable, continuous maintenance and support to keep your systems running optimally, with a dedicated support team available round-the-clock."
    },
    {
        Category: "General",
        Question: "What is your service commitment?",
        Answer: "Our service commitment includes having a Dedicated Support Team, ensuring Transparent Communication with regular updates, and rigorous Quality Assurance testing."
    }
];

// Create worksheet
const ws = XLSX.utils.json_to_sheet(knowledgeData);

// Create workbook
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "KnowledgeBase");

// Write to file
const outputPath = path.join(__dirname, 'public', 'demo_knowledge.xlsx');
XLSX.writeFile(wb, outputPath);

console.log(`Successfully created demo Excel file at: ${outputPath}`);
