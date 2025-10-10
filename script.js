// MBTI Content Database
const mbtiContent = {
    // Career suggestions by type
    careers: {
        INTJ: ["Strategic Planner", "Software Architect", "Data Scientist", "Research Scientist", "Systems Engineer"],
        INTP: ["Theoretical Physicist", "Software Developer", "Mathematician", "Philosopher", "Technical Writer"],
        ENTJ: ["CEO", "Management Consultant", "Corporate Lawyer", "Investment Banker", "Operations Director"],
        ENTP: ["Entrepreneur", "Marketing Director", "Innovation Consultant", "Venture Capitalist", "Debater"],
        INFJ: ["Counselor", "Psychologist", "Writer", "HR Director", "Social Advocate"],
        INFP: ["Creative Writer", "Therapist", "Graphic Designer", "Social Worker", "Artist"],
        ENFJ: ["Teacher", "Public Relations Manager", "Life Coach", "Event Coordinator", "Motivational Speaker"],
        ENFP: ["Creative Director", "Journalist", "Actor", "Campaign Manager", "Brand Strategist"],
        ISTJ: ["Accountant", "Project Manager", "Quality Assurance", "Compliance Officer", "Logistics Coordinator"],
        ISFJ: ["Nurse", "Librarian", "Administrative Manager", "Customer Service Manager", "Interior Designer"],
        ESTJ: ["Business Manager", "Judge", "Military Officer", "Financial Officer", "Construction Manager"],
        ESFJ: ["Event Planner", "Sales Manager", "Restaurant Manager", "Teacher", "Healthcare Administrator"],
        ISTP: ["Mechanical Engineer", "Pilot", "Detective", "Software Tester", "Athletic Trainer"],
        ISFP: ["Chef", "Photographer", "Massage Therapist", "Veterinarian", "Fashion Designer"],
        ESTP: ["Sales Executive", "Paramedic", "Real Estate Agent", "Sports Coach", "Stock Broker"],
        ESFP: ["Entertainer", "Tour Guide", "Flight Attendant", "Personal Trainer", "Event Host"]
    },

    // Hobby recommendations
    hobbies: {
        INTJ: ["Strategic board games (Chess, Go)", "Reading philosophy & science", "Programming personal projects", "Learning new languages", "Studying complex systems"],
        INTP: ["Puzzle solving", "Building theoretical models", "Video game design", "Scientific experiments", "Coding for fun"],
        ENTJ: ["Leadership training", "Competitive sports", "Investment portfolio management", "Public speaking", "Strategic planning games"],
        ENTP: ["Debating clubs", "Entrepreneurial ventures", "Improvisation", "Travel & exploration", "Learning new skills rapidly"],
        INFJ: ["Journaling & reflection", "Meditation & yoga", "Volunteering", "Creative writing", "Deep conversations"],
        INFP: ["Poetry writing", "Sketching & painting", "Playing musical instruments", "Fantasy world-building", "Nature photography"],
        ENFJ: ["Community organizing", "Mentoring others", "Group fitness classes", "Drama & theater", "Hosting gatherings"],
        ENFP: ["Brainstorming sessions", "Traveling to new places", "Attending workshops", "Creative crafts", "Social activism"],
        ISTJ: ["Organizing collections", "Historical research", "Home improvement", "Traditional crafts", "Systematic cooking"],
        ISFJ: ["Scrapbooking", "Gardening", "Baking", "Caring for pets", "Family genealogy"],
        ESTJ: ["Managing community projects", "Team sports", "DIY projects", "Competitive gaming", "Efficient workflow optimization"],
        ESFJ: ["Party planning", "Cooking for others", "Social clubs", "Decorating spaces", "Group activities"],
        ISTP: ["Hands-on building projects", "Extreme sports", "Car mechanics", "Woodworking", "Problem-solving games"],
        ISFP: ["Art & crafts", "Dance", "Playing instruments", "Animal care", "Exploring nature"],
        ESTP: ["Adventure sports", "Entrepreneurial side hustles", "Networking events", "Physical challenges", "Live entertainment"],
        ESFP: ["Performing arts", "Social dancing", "Fashion & styling", "Party organizing", "Sports participation"]
    },

    // Learning styles
    learning: {
        INTJ: "You thrive with <strong>strategic frameworks</strong> and theoretical models. Prefer self-paced learning with deep dives into complex subjects. You excel when you can see the big picture and connect concepts into comprehensive systems.",
        INTP: "You learn best through <strong>logical analysis</strong> and exploration. You need to understand the 'why' behind everything. Theoretical discussions and independent research fuel your learning process.",
        ENTJ: "You prefer <strong>structured, goal-oriented</strong> learning with clear outcomes. You excel in competitive environments and appreciate practical applications of knowledge that can be immediately implemented.",
        ENTP: "You thrive on <strong>intellectual debates</strong> and exploring multiple perspectives. You learn by questioning assumptions and connecting disparate ideas in innovative ways.",
        INFJ: "You learn through <strong>meaningful connections</strong> and personal relevance. You need to understand how knowledge impacts people and prefer deep, focused study sessions with time for reflection.",
        INFP: "You absorb information best when it aligns with your <strong>values and interests</strong>. Creative expression and personalized learning paths help you retain and apply knowledge effectively.",
        ENFJ: "You excel in <strong>collaborative learning</strong> environments. Group discussions, teaching others, and connecting learning to human impact enhance your understanding and retention.",
        ENFP: "You thrive with <strong>variety and inspiration</strong>. Interactive learning, creative projects, and the freedom to explore tangents keep you engaged and help you synthesize new ideas.",
        ISTJ: "You prefer <strong>systematic, step-by-step</strong> approaches with clear instructions. You value proven methods and appreciate detailed examples and practical applications.",
        ISFJ: "You learn best with <strong>structured guidance</strong> and hands-on practice. You benefit from clear expectations and appreciate learning through service and helping others.",
        ESTJ: "You thrive with <strong>organized, efficient</strong> learning methods. You prefer clear objectives, measurable progress, and practical applications that can be implemented immediately.",
        ESFJ: "You excel in <strong>collaborative settings</strong> with supportive instructors. You learn well through teaching others and appreciate structured programs with social components.",
        ISTP: "You learn by <strong>doing and experimenting</strong>. Hands-on practice, troubleshooting real problems, and learning at your own pace maximize your comprehension.",
        ISFP: "You absorb knowledge through <strong>direct experience</strong> and creative expression. You need freedom to explore and learn best when you can apply skills artistically.",
        ESTP: "You thrive with <strong>active, experiential</strong> learning. You need immediate application, real-world scenarios, and the freedom to learn through trial and error.",
        ESFP: "You excel with <strong>interactive, social</strong> learning experiences. Group activities, hands-on practice, and learning that's fun and engaging help you retain information."
    },

    // Communication tips
    communication: {
        INTJ: "Be direct and efficient. Focus on logic and strategy. Avoid small talk and get to the point. Respect your need for alone time to process ideas.",
        INTP: "Engage in intellectual discussions. Allow time for deep analysis. Don't rush decisions. Appreciate precision and accuracy in communication.",
        ENTJ: "Be confident and assertive. Present organized thoughts with clear goals. Value efficiency and results-oriented conversations. Stand firm on logical positions.",
        ENTP: "Embrace debate and diverse perspectives. Share innovative ideas freely. Don't take disagreements personally. Keep conversations intellectually stimulating.",
        INFJ: "Communicate authentically and deeply. Share meaningful insights. Listen actively and empathetically. Create safe spaces for vulnerable conversations.",
        INFP: "Express yourself through creative means. Honor your values in discussions. Take time to process emotions before responding. Seek harmony in communications.",
        ENFJ: "Be warm and supportive in interactions. Focus on people's needs and feelings. Lead with empathy. Create positive, encouraging dialogue.",
        ENFP: "Share your enthusiasm openly. Connect through storytelling. Explore possibilities together. Maintain authentic, energetic conversations.",
        ISTJ: "Be clear and factual. Follow through on commitments. Stick to proven methods. Communicate with precision and reliability.",
        ISFJ: "Show care through actions. Be considerate and supportive. Maintain harmony in interactions. Express appreciation regularly.",
        ESTJ: "Be direct and organized. State expectations clearly. Focus on facts and results. Lead with confidence and decisiveness.",
        ESFJ: "Foster warm, friendly connections. Show appreciation for others. Maintain group harmony. Communicate with care and consideration.",
        ISTP: "Keep it practical and concise. Focus on problem-solving. Give space for independent thinking. Communicate when there's a clear purpose.",
        ISFP: "Express through actions and creativity. Be gentle and authentic. Respect personal space. Show rather than tell when possible.",
        ESTP: "Be energetic and spontaneous. Focus on action and results. Keep conversations dynamic. Adapt quickly to changing situations.",
        ESFP: "Bring energy and positivity. Connect through shared experiences. Keep it fun and engaging. Show enthusiasm in your interactions."
    },

    // Strengths
    strengths: {
        INTJ: ["Strategic thinking", "Independent problem-solving", "Long-term vision", "Analytical precision", "Decisive action"],
        INTP: ["Logical analysis", "Creative problem-solving", "Intellectual curiosity", "Pattern recognition", "Objective thinking"],
        ENTJ: ["Natural leadership", "Efficient execution", "Strategic planning", "Confident decision-making", "Organizational skills"],
        ENTP: ["Innovative thinking", "Adaptability", "Persuasive communication", "Quick learning", "Entrepreneurial spirit"],
        INFJ: ["Deep empathy", "Insightful intuition", "Visionary thinking", "Dedication to causes", "Understanding complexity"],
        INFP: ["Authentic values", "Creative expression", "Empathetic understanding", "Idealistic vision", "Adaptable approach"],
        ENFJ: ["Inspiring leadership", "Emotional intelligence", "People development", "Persuasive communication", "Organizational harmony"],
        ENFP: ["Creative enthusiasm", "People connection", "Adaptable thinking", "Inspirational ideas", "Authentic relationships"],
        ISTJ: ["Reliable consistency", "Detail orientation", "Practical efficiency", "Strong work ethic", "Organized systems"],
        ISFJ: ["Loyal dedication", "Careful attention", "Supportive nature", "Practical helping", "Strong memory"],
        ESTJ: ["Efficient management", "Clear structure", "Decisive action", "Practical solutions", "Strong leadership"],
        ESFJ: ["Social harmony", "Caring support", "Organized planning", "Team cooperation", "Practical service"],
        ISTP: ["Hands-on skills", "Calm problem-solving", "Adaptable approach", "Practical expertise", "Independent action"],
        ISFP: ["Artistic creativity", "Present awareness", "Gentle compassion", "Aesthetic sense", "Flexible adaptation"],
        ESTP: ["Quick action", "Practical solutions", "Energetic approach", "Risk-taking courage", "Resourceful thinking"],
        ESFP: ["Spontaneous energy", "Social connection", "Practical help", "Enthusiastic presence", "Adaptable spirit"]
    },

    // Growth areas
    growth: {
        INTJ: ["Practice emotional expression", "Be more patient with others' processes", "Appreciate small details", "Develop social spontaneity", "Consider feelings alongside logic"],
        INTP: ["Follow through on practical tasks", "Express emotions more openly", "Consider social dynamics", "Finish started projects", "Engage with the present moment"],
        ENTJ: ["Listen more, talk less", "Show empathy in decisions", "Appreciate others' feelings", "Slow down and reflect", "Value process over just results"],
        ENTP: ["Complete started projects", "Focus on practical implementation", "Be more sensitive to feelings", "Follow through consistently", "Maintain organized systems"],
        INFJ: ["Set healthy boundaries", "Express needs directly", "Accept imperfections", "Balance idealism with realism", "Take action without overthinking"],
        INFP: ["Make decisions more quickly", "Handle criticism constructively", "Focus on practical details", "Assert yourself confidently", "Follow through on commitments"],
        ENFJ: ["Prioritize your own needs", "Accept that not everyone wants help", "Set clear boundaries", "Handle conflict directly", "Avoid over-extending yourself"],
        ENFP: ["Follow through on commitments", "Organize your environment", "Focus on one thing at a time", "Handle mundane tasks", "Make decisions more quickly"],
        ISTJ: ["Embrace spontaneity", "Consider new perspectives", "Express feelings more openly", "Adapt to unexpected changes", "Appreciate abstract thinking"],
        ISFJ: ["Assert your own needs", "Embrace necessary change", "Handle conflict directly", "Say no when needed", "Take credit for achievements"],
        ESTJ: ["Consider others' emotions", "Be flexible with plans", "Listen to different viewpoints", "Show vulnerability", "Value process over efficiency"],
        ESFJ: ["Handle criticism less personally", "Assert your boundaries", "Accept conflict as natural", "Focus on your own needs", "Embrace independent thinking"],
        ISTP: ["Express emotions verbally", "Plan for the future", "Consider others' feelings", "Engage in long-term commitments", "Develop social connections"],
        ISFP: ["Address conflict directly", "Plan ahead more", "Make decisions quickly", "Assert your opinions", "Focus on long-term goals"],
        ESTP: ["Think before acting", "Consider long-term consequences", "Develop emotional awareness", "Plan and organize", "Practice patience and reflection"],
        ESFP: ["Plan for the future", "Handle criticism constructively", "Focus deeply on tasks", "Develop long-term discipline", "Embrace solitude for reflection"]
    },

    // Motivational quotes
    motivation: {
        INTJ: "\"The mind is not a vessel to be filled, but a fire to be kindled.\" - Your strategic vision shapes the future.",
        INTP: "\"Logic will get you from A to B. Imagination will take you everywhere.\" - Your analytical mind unlocks possibilities.",
        ENTJ: "\"The best way to predict the future is to create it.\" - Your leadership drives transformation.",
        ENTP: "\"Innovation distinguishes between a leader and a follower.\" - Your creativity challenges the status quo.",
        INFJ: "\"Be the change you wish to see in the world.\" - Your insight inspires authentic transformation.",
        INFP: "\"To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.\" - Your authenticity is your power.",
        ENFJ: "\"The greatest glory in living lies not in never falling, but in rising every time we fall.\" - Your empathy lifts others up.",
        ENFP: "\"Life is either a daring adventure or nothing at all.\" - Your enthusiasm creates magical moments.",
        ISTJ: "\"Success is the sum of small efforts repeated day in and day out.\" - Your consistency builds empires.",
        ISFJ: "\"The best way to find yourself is to lose yourself in the service of others.\" - Your dedication makes a difference.",
        ESTJ: "\"Do what you can, with what you have, where you are.\" - Your execution turns plans into reality.",
        ESFJ: "\"Alone we can do so little; together we can do so much.\" - Your harmony creates strong communities.",
        ISTP: "\"Knowledge comes, but wisdom lingers.\" - Your practical skills solve real problems.",
        ISFP: "\"The purpose of art is washing the dust of daily life off our souls.\" - Your creativity brings beauty to the world.",
        ESTP: "\"Life is 10% what happens to you and 90% how you react to it.\" - Your adaptability conquers challenges.",
        ESFP: "\"Happiness is not something ready made. It comes from your own actions.\" - Your energy brightens every room."
    },

    // Ideal environments
    environment: {
        INTJ: "Quiet, organized spaces with minimal distractions. You need autonomy and time for deep thinking. Prefer competent colleagues and intellectually challenging work.",
        INTP: "Flexible environments that allow exploration. You thrive with intellectual freedom, minimal bureaucracy, and the ability to work independently on complex problems.",
        ENTJ: "Fast-paced, goal-oriented settings with clear hierarchies. You excel in challenging environments where you can lead, make decisions, and see measurable results.",
        ENTP: "Dynamic, innovative spaces with variety and intellectual stimulation. You need freedom to explore ideas and work with diverse, intelligent people.",
        INFJ: "Calm, meaningful environments aligned with your values. You thrive in settings that allow deep work, authentic connections, and making a positive impact.",
        INFP: "Creative, flexible spaces that honor your values. You need autonomy, creative freedom, and work that feels personally meaningful and authentic.",
        ENFJ: "Collaborative, people-centered environments. You excel in supportive settings where you can mentor others, build teams, and create positive change.",
        ENFP: "Energetic, creative spaces with variety and social interaction. You thrive when you have freedom to explore, connect with people, and pursue passions.",
        ISTJ: "Structured, stable environments with clear expectations. You prefer organized systems, defined processes, and workplaces that value reliability and precision.",
        ISFJ: "Harmonious, stable settings with supportive colleagues. You thrive in organized environments where you can help others and follow established procedures.",
        ESTJ: "Efficient, well-organized environments with clear goals. You excel in structured settings where you can take charge, implement systems, and drive results.",
        ESFJ: "Warm, social environments with team collaboration. You thrive in organized settings with friendly colleagues and opportunities to help others.",
        ISTP: "Hands-on, flexible environments with practical challenges. You need autonomy, room to troubleshoot, and the freedom to work independently.",
        ISFP: "Creative, peaceful spaces with aesthetic appeal. You thrive in flexible environments that allow personal expression and hands-on work.",
        ESTP: "Active, fast-paced environments with immediate challenges. You excel in dynamic settings that allow quick decision-making and hands-on problem-solving.",
        ESFP: "Energetic, social environments with variety and fun. You thrive in dynamic settings with people interaction and opportunities for spontaneity."
    }
};

// State management
let currentMBTI = {
    energy: 'E',
    information: 'S',
    decision: 'T',
    structure: 'J'
};

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeButtons();
    document.getElementById('generateBtn').addEventListener('click', generateContent);
});

function initializeButtons() {
    const buttons = document.querySelectorAll('.dimension-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const dimension = e.target.dataset.dimension;
            const value = e.target.dataset.value;
            
            // Update active state
            const siblings = e.target.parentElement.querySelectorAll('.dimension-btn');
            siblings.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update MBTI state
            currentMBTI[dimension] = value;
            updateTypeDisplay();
        });
    });
}

function updateTypeDisplay() {
    const type = getCurrentType();
    document.getElementById('currentType').textContent = type;
}

function getCurrentType() {
    return currentMBTI.energy + currentMBTI.information + currentMBTI.decision + currentMBTI.structure;
}

function generateContent() {
    const type = getCurrentType();
    
    // Populate all content areas
    document.getElementById('careerContent').innerHTML = formatList(mbtiContent.careers[type]);
    document.getElementById('hobbyContent').innerHTML = formatList(mbtiContent.hobbies[type]);
    document.getElementById('learningContent').innerHTML = `<p>${mbtiContent.learning[type]}</p>`;
    document.getElementById('communicationContent').innerHTML = `<p>${mbtiContent.communication[type]}</p>`;
    document.getElementById('strengthsContent').innerHTML = formatList(mbtiContent.strengths[type]);
    document.getElementById('growthContent').innerHTML = formatList(mbtiContent.growth[type]);
    document.getElementById('motivationContent').innerHTML = `<p>${mbtiContent.motivation[type]}</p>`;
    document.getElementById('environmentContent').innerHTML = `<p>${mbtiContent.environment[type]}</p>`;
    
    // Show results section with smooth scroll
    const resultsSection = document.getElementById('results');
    resultsSection.classList.remove('hidden');
    
    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function formatList(items) {
    if (!items || items.length === 0) return '<p>Content not available</p>';
    
    return '<ul>' + items.map(item => `<li>${item}</li>`).join('') + '</ul>';
}

