/**
 * EduGenie Frontend Application Engine
 * Handles Authentication, Top Welcome Banner, Study Notes Library,
 * IndiaBix Practice Drills, and AI Modules.
 */

// Determine API base URL dynamically (supports FastAPI port 8000 & VS Code Live Server port 5500)
const API_BASE = (window.location.port === "8000" || window.location.port === "") 
    ? "" 
    : "http://127.0.0.1:8000";

// App State
let currentUser = null;
let currentPracticeTopic = "java";
let practiceQuestions = [];
let currentPracticeIndex = 0;
let userAnswers = {}; // { questionId: selectedIndex }
let practiceScore = 0;

// Curated Offline Fallback Notes (Ensures instant loading even if offline)
const LOCAL_NOTES = {
    java: {
        title: "Java Programming",
        tagline: "Object-Oriented, Platform-Independent, Enterprise-Grade Language",
        badge: "Core CS",
        icon: "☕",
        overview: "Java is a class-based, object-oriented programming language designed by James Gosling at Sun Microsystems in 1995. Its core design philosophy is 'Write Once, Run Anywhere' (WORA) via bytecode running on the Java Virtual Machine (JVM).",
        key_concepts: [
            { title: "JVM, JRE & JDK", desc: "JDK contains development tools + JRE. JRE provides libraries + JVM. JVM executes compiled bytecode (.class files)." },
            { title: "OOPs 4 Pillars", desc: "Encapsulation (data hiding), Inheritance (extends keyword), Polymorphism (Overloading & Overriding), and Abstraction (interfaces)." },
            { title: "Memory Architecture", desc: "Stack memory stores local primitive values and references. Heap memory stores all allocated objects. Garbage Collector cleans unreferenced memory." },
            { title: "Collections Framework", desc: "List (ArrayList, LinkedList), Set (HashSet, TreeSet), and Map (HashMap, TreeMap). HashMap delivers O(1) average lookup." },
            { title: "Exception Handling", desc: "Handled using try, catch, finally, throw, and throws. Checked (compile-time) vs Unchecked (runtime) exceptions." }
        ],
        code_example: {
            title: "Java OOP Class Example",
            code: `public class EduGenieStudent {
    private String name;

    public EduGenieStudent(String name) {
        this.name = name;
    }

    public void study() {
        System.out.println(name + " is learning Java with EduGenie! 🚀");
    }

    public static void main(String[] args) {
        EduGenieStudent s = new EduGenieStudent("Poornima");
        s.study();
    }
}`
        },
        cheat_sheet: [
            "Entry Point: public static void main(String[] args)",
            "String is immutable in Java; use StringBuilder for modifications.",
            "Default values: int is 0, boolean is false, object references are null.",
            "Common Uses: Android Apps, Enterprise Spring Boot backends, Big Data."
        ]
    },
    python: {
        title: "Python Programming",
        tagline: "Simple, Expressive, High-Level Interpreted Language",
        badge: "AI & Web",
        icon: "🐍",
        overview: "Python is an interpreted, high-level language created by Guido van Rossum. Known for readability and clean syntax, it is the worldwide standard for AI, ML, Data Science, and rapid web prototyping.",
        key_concepts: [
            { title: "Dynamic Typing", desc: "Variables do not require explicit type declarations. Code is executed line-by-line via interpreter." },
            { title: "Built-in Data Structures", desc: "Lists (mutable []), Tuples (immutable ()), Sets (unique {}), and Dictionaries (key-value {})." },
            { title: "Functions & Lambdas", desc: "Defined using 'def'. Supports default args, *args, **kwargs, and inline lambda functions." },
            { title: "List Comprehension", desc: "Expressive syntax for data transformation: [x**2 for x in nums if x > 0]." }
        ],
        code_example: {
            title: "Python Syntax & Functions",
            code: `# Python Dictionary & List Comprehension
student = {"name": "Poornima", "skills": ["Python", "FastAPI"]}

def greet(name: str):
    return f"Welcome {name}! Ready to master AI? 🚀"

print(greet(student["name"]))`
        },
        cheat_sheet: [
            "Functions defined with: def function_name():",
            "Indentation (4 spaces) defines code blocks instead of {}",
            "Lists are zero-indexed; use -1 to access the last element.",
            "Libraries: NumPy, Pandas, FastAPI, PyTorch, TensorFlow."
        ]
    },
    dbms: {
        title: "Database Management Systems (DBMS)",
        tagline: "Relational Models, SQL Queries, ACID Properties & Indexing",
        badge: "Core CS",
        icon: "🗄️",
        overview: "A DBMS is software used to define, store, manage, and query structured data safely. Relational DBMS (RDBMS) organizes data into tables with rows (tuples) and columns (attributes).",
        key_concepts: [
            { title: "SQL Sub-Languages", desc: "DDL (CREATE, ALTER), DML (INSERT, UPDATE), DQL (SELECT), and TCL (COMMIT, ROLLBACK)." },
            { title: "ACID Properties", desc: "Atomicity (all or nothing), Consistency (valid rules), Isolation (independent transactions), Durability (persists after crash)." },
            { title: "Database Keys", desc: "Primary Key (unique + not null), Foreign Key (referential integrity), Candidate Key (minimal super key)." },
            { title: "Joins", desc: "INNER (matches only), LEFT (all left + matches), RIGHT, and FULL OUTER." }
        ],
        code_example: {
            title: "SQL Query Example",
            code: `-- Table creation with Primary Key
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    grade VARCHAR(5)
);

-- Selecting with Filter and Order
SELECT username, grade FROM students
WHERE grade = 'A'
ORDER BY username ASC;`
        },
        cheat_sheet: [
            "Primary Key = UNIQUE + NOT NULL",
            "WHERE filters rows before GROUP BY; HAVING filters groups after GROUP BY.",
            "B-Tree Indexes speed up search queries significantly."
        ]
    },
    os: {
        title: "Operating Systems (OS)",
        tagline: "Process Management, Memory Hierarchy, CPU Scheduling & Deadlocks",
        badge: "Systems",
        icon: "💻",
        overview: "An Operating System manages computer hardware resources and provides common services for software execution.",
        key_concepts: [
            { title: "Process vs Thread", desc: "A process has isolated address space. Threads inside a process share memory and heap but have separate stacks." },
            { title: "CPU Scheduling", desc: "FCFS, SJF (optimal average wait time), Round Robin (time quantum based), Priority." },
            { title: "Deadlock Conditions", desc: "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait." },
            { title: "Virtual Memory", desc: "Paging maps virtual addresses to physical RAM frames. Page Fault occurs when page is on disk." }
        ],
        code_example: {
            title: "Process States Life Cycle",
            code: `[NEW] -> [READY] <-> [RUNNING] -> [TERMINATED]
                    ^           |
                    |           v
                    +--- [WAITING] (I/O complete)`
        },
        cheat_sheet: [
            "Round Robin scheduling completely avoids starvation.",
            "Banker's Algorithm is used for Deadlock Avoidance.",
            "Thrashing occurs when the OS spends more time swapping pages than executing."
        ]
    },
    cn: {
        title: "Computer Networks (CN)",
        tagline: "OSI 7 Layers, TCP/IP, Routing Protocols, IP Addressing & Sockets",
        badge: "Networking",
        icon: "🌐",
        overview: "Computer Networking connects autonomous computing devices to enable reliable data transmission and communication.",
        key_concepts: [
            { title: "OSI 7 Layers", desc: "Physical -> Data Link -> Network -> Transport -> Session -> Presentation -> Application." },
            { title: "TCP vs UDP", desc: "TCP is connection-oriented with 3-way handshake (SYN, SYN-ACK, ACK). UDP is connectionless and fast." },
            { title: "IP Addressing", desc: "IPv4 is 32-bit (dotted decimal). IPv6 is 128-bit (hexadecimal)." },
            { title: "Standard Ports", desc: "Port 80 (HTTP), Port 443 (HTTPS), Port 22 (SSH), Port 53 (DNS)." }
        ],
        code_example: {
            title: "TCP 3-Way Handshake",
            code: `Client                    Server
  |                         |
  |--- 1. SYN ------------->|  (Initiate)
  |                         |
  |<-- 2. SYN-ACK ----------|  (Acknowledge)
  |                         |
  |--- 3. ACK ------------->|  (Connected!)`
        },
        cheat_sheet: [
            "Routers operate at Layer 3 (Network); Switches operate at Layer 2 (Data Link).",
            "Ping uses ICMP (Internet Control Message Protocol).",
            "HTTPS uses TLS/SSL encryption over TCP port 443."
        ]
    }
};

// Curated Offline Fallback IndiaBix Questions
const LOCAL_PRACTICE_QUESTIONS = {
    java: [
        {
            id: 1,
            question: "Which of the following is NOT a Java primitive data type?",
            options: ["int", "boolean", "String", "float"],
            correct: 2,
            explanation: "In Java, 'String' is a class (an Object reference type in java.lang), not a primitive. The 8 primitive types in Java are: byte, short, int, long, float, double, char, and boolean."
        },
        {
            id: 2,
            question: "What is the size of an int variable in Java?",
            options: ["16 bits (2 bytes)", "32 bits (4 bytes)", "64 bits (8 bytes)", "Platform dependent"],
            correct: 1,
            explanation: "In Java, an 'int' is strictly 32 bits (4 bytes) signed two's complement integer across ALL operating systems and platforms."
        },
        {
            id: 3,
            question: "Which keyword is used to inherit a class in Java?",
            options: ["implement", "extends", "inherits", "instanceof"],
            correct: 1,
            explanation: "The 'extends' keyword is used to inherit a class in Java (e.g., class Dog extends Animal). The 'implements' keyword is used for interfaces."
        },
        {
            id: 4,
            question: "Where are objects stored in Java memory?",
            options: ["Stack memory", "Heap memory", "Code segment", "CPU registers"],
            correct: 1,
            explanation: "In Java, all objects and instance variables are allocated in Heap memory. Local primitive variables and references live in Stack memory."
        },
        {
            id: 5,
            question: "Which method signature represents the valid entry point for a Java application?",
            options: [
                "public void main(String[] args)",
                "public static void main()",
                "public static void main(String[] args)",
                "private static void main(String args)"
            ],
            correct: 2,
            explanation: "The JVM specifically searches for 'public static void main(String[] args)' to launch the program execution."
        }
    ],
    python: [
        {
            id: 1,
            question: "What keyword is used to define a function in Python?",
            options: ["func", "function", "def", "define"],
            correct: 2,
            explanation: "In Python, functions are defined using the 'def' keyword: def function_name():"
        },
        {
            id: 2,
            question: "Which of the following data structures is IMMUTABLE in Python?",
            options: ["List", "Dictionary", "Tuple", "Set"],
            correct: 2,
            explanation: "A Tuple in Python is immutable; its elements cannot be changed, appended, or deleted after creation."
        },
        {
            id: 3,
            question: "What will be the output of type([1, 2, 3]) in Python?",
            options: ["<class 'tuple'>", "<class 'list'>", "<class 'array'>", "<class 'set'>"],
            correct: 1,
            explanation: "Square brackets [] in Python construct a list literal. Therefore, type([1, 2, 3]) evaluates to <class 'list'>."
        },
        {
            id: 4,
            question: "What does the expression 3 * 'Edu' evaluate to in Python?",
            options: ["TypeError", "'EduEduEdu'", "'9Edu'", "['Edu', 'Edu', 'Edu']"],
            correct: 1,
            explanation: "In Python, multiplying an integer with a string repeats the string: 3 * 'Edu' becomes 'EduEduEdu'."
        },
        {
            id: 5,
            question: "Which built-in Python function is used to get the length of an iterable?",
            options: ["size()", "count()", "length()", "len()"],
            correct: 3,
            explanation: "The built-in 'len()' function returns the number of items in any string, list, dictionary, or sequence."
        }
    ],
    dbms: [
        {
            id: 1,
            question: "Which normal form deals with the removal of partial functional dependency?",
            options: ["1NF", "2NF", "3NF", "BCNF"],
            correct: 1,
            explanation: "A relation is in 2NF if it is in 1NF and no non-prime attribute is partially dependent on any candidate key."
        },
        {
            id: 2,
            question: "What does the 'I' stand for in ACID properties of a DBMS transaction?",
            options: ["Integrity", "Isolation", "Indexing", "Information"],
            correct: 1,
            explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability. Isolation guarantees independent concurrent transaction execution."
        },
        {
            id: 3,
            question: "Which SQL clause is used to filter records AFTER an aggregation with GROUP BY?",
            options: ["WHERE", "HAVING", "ORDER BY", "FILTER"],
            correct: 1,
            explanation: "The 'HAVING' clause filters grouped records after aggregation. 'WHERE' filters rows before aggregation."
        },
        {
            id: 4,
            question: "A Primary Key constraint enforces which two rules?",
            options: ["UNIQUE and DEFAULT", "UNIQUE and NOT NULL", "NOT NULL and FOREIGN KEY", "CHECK and AUTO_INCREMENT"],
            correct: 1,
            explanation: "A Primary Key uniquely identifies every record in a table, requiring values to be strictly UNIQUE and NOT NULL."
        },
        {
            id: 5,
            question: "Which of the following is a Data Definition Language (DDL) command?",
            options: ["SELECT", "UPDATE", "ALTER", "INSERT"],
            correct: 2,
            explanation: "ALTER modifies table schema/structure, so it is a DDL command. SELECT is DQL; INSERT/UPDATE are DML."
        }
    ],
    os: [
        {
            id: 1,
            question: "Which CPU scheduling algorithm is completely free from starvation?",
            options: ["Shortest Job First (SJF)", "Priority Scheduling", "Round Robin (RR)", "Multilevel Queue"],
            correct: 2,
            explanation: "Round Robin assigns equal time quantums to every process cyclically, ensuring no process is starved of CPU time."
        },
        {
            id: 2,
            question: "Which of the following is NOT one of the 4 Coffman conditions for Deadlock?",
            options: ["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
            correct: 2,
            explanation: "The 4 Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If preemption is allowed, deadlock cannot occur."
        },
        {
            id: 3,
            question: "What is a 'Page Fault' in an Operating System?",
            options: ["A hardware RAM failure", "An access to a page not currently in physical RAM", "A disk write error", "A compiler error"],
            correct: 1,
            explanation: "A Page Fault is an MMU trap triggered when a running program references a virtual memory page that is not in physical RAM."
        },
        {
            id: 4,
            question: "What is the main difference between a Process and a Thread?",
            options: [
                "Threads have independent memory, processes share memory",
                "Processes share memory, threads do not",
                "Threads within the same process share the memory address space",
                "Processes are managed by hardware, threads by compiler"
            ],
            correct: 2,
            explanation: "Processes have isolated address spaces. Threads within the same process share the heap and code segment, but maintain private stacks."
        },
        {
            id: 5,
            question: "Thrashing in an operating system occurs when:",
            options: [
                "CPU utilization is at 100%",
                "The system spends more time swapping pages than executing instructions",
                "A deadlock occurs between two threads",
                "The hard disk runs out of physical space"
            ],
            correct: 1,
            explanation: "Thrashing occurs when active working sets exceed physical memory, forcing continuous page swapping and stalling CPU execution."
        }
    ],
    cn: [
        {
            id: 1,
            question: "At which layer of the OSI model does the IP (Internet Protocol) operate?",
            options: ["Data Link Layer (Layer 2)", "Network Layer (Layer 3)", "Transport Layer (Layer 4)", "Session Layer (Layer 5)"],
            correct: 1,
            explanation: "The Internet Protocol (IPv4/IPv6) operates at the Network Layer (Layer 3) to route packets across networks."
        },
        {
            id: 2,
            question: "What is the standard port number for secure web traffic using HTTPS?",
            options: ["21", "80", "443", "8080"],
            correct: 2,
            explanation: "Port 443 is the standard default port for HTTPS (TLS/SSL encrypted HTTP traffic). Port 80 is unencrypted HTTP."
        },
        {
            id: 3,
            question: "Which protocol provides reliable, connection-oriented data transfer with error recovery?",
            options: ["UDP", "IP", "TCP", "ICMP"],
            correct: 2,
            explanation: "TCP provides reliable, ordered byte-stream delivery with acknowledgments and retransmissions. UDP is connectionless."
        },
        {
            id: 4,
            question: "What is the size of an IPv4 address in bits?",
            options: ["16 bits", "32 bits", "64 bits", "128 bits"],
            correct: 1,
            explanation: "An IPv4 address is 32 bits long (4 octets, e.g. 192.168.1.1). IPv6 addresses are 128 bits."
        },
        {
            id: 5,
            question: "Which device connects two different networks and routes packets using IP addresses?",
            options: ["Hub", "Repeater", "Switch", "Router"],
            correct: 3,
            explanation: "A Router is a Layer 3 networking device that inspects destination IP addresses to route packets between networks."
        }
    ]
};


// ==========================================
// INITIALIZATION ON PAGE LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    checkSavedUser();
    checkApiStatus();
});

function checkSavedUser() {
    const saved = localStorage.getItem("edugenie_user");
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
        } catch (e) {
            currentUser = { username: saved, full_name: saved };
        }
        onUserAuthenticated(currentUser, false);
    } else {
        openAuthModal("login");
    }
}

function onUserAuthenticated(user, isNewLogin = false) {
    currentUser = user;
    const displayName = user.full_name || user.username || "Learner";

    // Close Auth Modal
    document.getElementById("authModal").style.display = "none";

    // Update Navbar Profile
    document.getElementById("userNameDisplay").innerText = `Hi, ${displayName} 👋`;
    document.getElementById("logoutBtn").style.display = "flex";

    // Show Top Welcome Banner ONLY upon fresh login on Home
    const topBanner = document.getElementById("topWelcomeBanner");
    const welcomeName = document.getElementById("welcomeUserName");
    if (welcomeName) welcomeName.innerText = displayName;

    if (isNewLogin) {
        if (topBanner) {
            topBanner.style.display = "flex";
            topBanner.style.opacity = "1";
            if (window._welcomeTimer) clearTimeout(window._welcomeTimer);
            window._welcomeTimer = setTimeout(() => {
                dismissWelcomeBanner();
            }, 6000);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        if (topBanner) topBanner.style.display = "none";
    }
}

function dismissWelcomeBanner() {
    const banner = document.getElementById("topWelcomeBanner");
    if (!banner) return;
    banner.style.opacity = "0";
    setTimeout(() => {
        banner.style.display = "none";
        banner.style.opacity = "1";
    }, 250);
}


// ==========================================
// AUTHENTICATION MODAL & LOGOUT
// ==========================================
function openAuthModal(tab = "login") {
    document.getElementById("authModal").style.display = "flex";
    switchAuthTab(tab);
    clearAuthAlert();
}

function switchAuthTab(tab) {
    const isLogin = tab === "login";
    document.getElementById("tabBtnLogin").classList.toggle("active", isLogin);
    document.getElementById("tabBtnSignup").classList.toggle("active", !isLogin);
    document.getElementById("loginForm").style.display = isLogin ? "block" : "none";
    document.getElementById("signupForm").style.display = isLogin ? "none" : "block";

    document.getElementById("authModalTitle").innerText = isLogin 
        ? "Welcome to EduGenie" 
        : "Create Your Account";
    document.getElementById("authModalSubtitle").innerText = isLogin 
        ? "Login to start your personalized learning journey" 
        : "Join EduGenie for smart notes and interactive quizzes";

    clearAuthAlert();
}

function showAuthAlert(msg, type = "error") {
    const alertBox = document.getElementById("authAlert");
    alertBox.className = `auth-alert ${type}`;
    alertBox.innerText = msg;
    alertBox.style.display = "block";
}

function clearAuthAlert() {
    const alertBox = document.getElementById("authAlert");
    alertBox.style.display = "none";
    alertBox.innerText = "";
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
        showAuthAlert("Please enter both username and password.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (res.ok && data.success) {
            localStorage.setItem("edugenie_user", JSON.stringify(data.user));
            onUserAuthenticated(data.user, true);
        } else {
            showAuthAlert(data.message || "Invalid username or password.");
        }
    } catch (err) {
        console.warn("Backend not reached, checking local registered users:", err);
        // Check offline registered users
        const registeredUsers = JSON.parse(localStorage.getItem("edugenie_registered_users") || "[]");
        const found = registeredUsers.find(u => (u.username.toLowerCase() === username.toLowerCase() || (u.email && u.email.toLowerCase() === username.toLowerCase())));
        if (found) {
            if (found.password && found.password !== password) {
                showAuthAlert("Invalid password. Please try again.");
                return;
            }
            const userObj = { username: found.username, full_name: found.full_name || found.username };
            localStorage.setItem("edugenie_user", JSON.stringify(userObj));
            onUserAuthenticated(userObj, true);
            return;
        }

        // Default fallback for demo / test accounts
        const fallbackUser = { username: username, full_name: username.charAt(0).toUpperCase() + username.slice(1) };
        localStorage.setItem("edugenie_user", JSON.stringify(fallbackUser));
        onUserAuthenticated(fallbackUser, true);
    }
}

async function handleSignupSubmit(e) {
    e.preventDefault();
    const fullName = document.getElementById("signupFullName").value.trim();
    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!username || !password) {
        showAuthAlert("Username and password are required.");
        return;
    }

    const saveLocally = () => {
        const regUsers = JSON.parse(localStorage.getItem("edugenie_registered_users") || "[]");
        const existing = regUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (existing) {
            showAuthAlert("Username already taken. Please choose another username.");
            return false;
        }
        regUsers.push({ username, password, full_name: fullName || username, email });
        localStorage.setItem("edugenie_registered_users", JSON.stringify(regUsers));
        return true;
    };

    try {
        const res = await fetch(`${API_BASE}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, full_name: fullName, email })
        });
        const data = await res.json();

        if (res.ok && data.success) {
            saveLocally();
            // Clear signup inputs
            document.getElementById("signupFullName").value = "";
            document.getElementById("signupUsername").value = "";
            document.getElementById("signupEmail").value = "";
            document.getElementById("signupPassword").value = "";

            // Switch to Login tab and show message directing them to login
            switchAuthTab("login");
            document.getElementById("loginUsername").value = username;
            document.getElementById("loginPassword").value = "";
            showAuthAlert("🎉 Account created successfully! Please enter your password to login.", "success");
        } else {
            showAuthAlert(data.message || "Signup failed. Please try another username.");
        }
    } catch (err) {
        console.warn("Backend not reached, saving registered user locally:", err);
        const ok = saveLocally();
        if (!ok) return;

        // Clear signup inputs
        document.getElementById("signupFullName").value = "";
        document.getElementById("signupUsername").value = "";
        document.getElementById("signupEmail").value = "";
        document.getElementById("signupPassword").value = "";

        // Switch to Login tab and show message directing them to login
        switchAuthTab("login");
        document.getElementById("loginUsername").value = username;
        document.getElementById("loginPassword").value = "";
        showAuthAlert("🎉 Account created successfully! Please enter your password to login.", "success");
    }
}

// LOGOUT CONFIRMATION MODAL HANDLERS
function openLogoutModal() {
    const modal = document.getElementById("logoutModal");
    if (modal) modal.style.display = "flex";
}

function closeLogoutModal(e) {
    if (e && e.target !== e.currentTarget && !e.target.classList.contains("btn-ghost")) return;
    const modal = document.getElementById("logoutModal");
    if (modal) modal.style.display = "none";
}

function confirmLogout() {
    const modal = document.getElementById("logoutModal");
    if (modal) modal.style.display = "none";
    handleLogout();
}

function handleLogout() {
    localStorage.removeItem("edugenie_user");
    currentUser = null;
    document.getElementById("userNameDisplay").innerText = "Hi, Guest 👋";
    document.getElementById("logoutBtn").style.display = "none";
    const banner = document.getElementById("topWelcomeBanner");
    if (banner) banner.style.display = "none";
    navigateTo("home");
    openAuthModal("login");
}


// ==========================================
// NAVIGATION (SINGLE PAGE VIEW CONTROLLER)
// ==========================================
function navigateTo(viewName) {
    const views = ["viewHome", "viewNotes", "viewPractice", "viewQuiz"];
    views.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.style.display = (v === `view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`) ? "block" : "none";
    });

    // Welcome banner should only show on Home view
    if (viewName !== "home") {
        const banner = document.getElementById("topWelcomeBanner");
        if (banner) banner.style.display = "none";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}


// ==========================================
// STUDY NOTES MODULE (Images 3 & 4 Fix - No Prompt Dialog)
// ==========================================
function openStudyNotes(topic = "java") {
    navigateTo("notes");
    loadNotesTopic(topic);
}

async function loadNotesTopic(topicKey) {
    const cleanKey = topicKey.toLowerCase().trim();
    
    // Update active topic pill button
    document.querySelectorAll(".topic-pills-bar .topic-pill").forEach(pill => {
        if (pill.getAttribute("data-topic")) {
            pill.classList.toggle("active", pill.getAttribute("data-topic") === cleanKey);
        }
    });

    const displayCard = document.getElementById("notesDisplayCard");
    displayCard.innerHTML = `<div style="text-align: center; padding: 40px;"><div class="spinner" style="margin: 0 auto 16px;"></div><p style="color: #636e72;">Loading ${cleanKey.toUpperCase()} notes...</p></div>`;

    let notesData = null;
    try {
        const res = await fetch(`${API_BASE}/api/notes/${cleanKey}`);
        if (res.ok) {
            const json = await res.json();
            if (json.success && json.notes) {
                notesData = json.notes;
            }
        }
    } catch (err) {
        console.warn("Backend error fetching notes, using local data:", err);
    }

    if (!notesData) {
        notesData = LOCAL_NOTES[cleanKey] || LOCAL_NOTES["java"];
    }

    renderNotesContent(notesData, cleanKey);
}

function renderNotesContent(notes, topicKey) {
    const displayCard = document.getElementById("notesDisplayCard");

    // Concepts Cards HTML
    let conceptsHtml = "";
    if (notes.key_concepts && notes.key_concepts.length > 0) {
        conceptsHtml = `
            <div class="notes-section">
                <div class="notes-section-title"><i class="fa-solid fa-layer-group" style="color: #6c5ce7;"></i> Key Concepts & Architecture</div>
                <div class="concepts-grid">
                    ${notes.key_concepts.map(c => `
                        <div class="concept-item">
                            <h4>${c.title}</h4>
                            <p>${c.desc}</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }

    // Code Example HTML
    let codeHtml = "";
    if (notes.code_example && notes.code_example.code) {
        const escapedCode = notes.code_example.code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        codeHtml = `
            <div class="notes-section">
                <div class="notes-section-title"><i class="fa-solid fa-code" style="color: #00cec9;"></i> Syntax & Code Implementation</div>
                <div class="code-container">
                    <div class="code-header-bar">
                        <span><i class="fa-regular fa-file-code"></i> ${notes.code_example.title || "Code Sample"}</span>
                        <span>${topicKey.toUpperCase()}</span>
                    </div>
                    <pre><code>${escapedCode}</code></pre>
                </div>
            </div>
        `;
    }

    // Cheat Sheet HTML
    let cheatSheetHtml = "";
    if (notes.cheat_sheet && notes.cheat_sheet.length > 0) {
        cheatSheetHtml = `
            <div class="notes-section">
                <div class="notes-section-title"><i class="fa-solid fa-bolt" style="color: #fdcb6e;"></i> Quick Revision Points</div>
                <ul class="cheat-sheet-list">
                    ${notes.cheat_sheet.map(item => `<li>${item}</li>`).join("")}
                </ul>
            </div>
        `;
    }

    // CTA Box with "Start Quiz on this topic" (Image 4 recommendation)
    const ctaHtml = `
        <div class="notes-cta-box">
            <div>
                <h3><i class="fa-solid fa-bullseye"></i> Test Your Knowledge on ${notes.title}</h3>
                <p>Take an interactive IndiaBix-style practice drill to reinforce these concepts.</p>
            </div>
            <button type="button" class="btn-cta-quiz" onclick="openPracticeQuestions('${topicKey}')">
                <span>Start ${notes.title} Quiz</span> <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    `;

    displayCard.innerHTML = `
        <div class="notes-header">
            <div class="notes-title-group">
                <h2><span>${notes.icon || "📘"}</span> ${notes.title}</h2>
                <p class="notes-tagline">${notes.tagline || ""}</p>
            </div>
            <span class="brand-badge" style="font-size: 13px; padding: 6px 16px;">${notes.badge || "Study Notes"}</span>
        </div>

        <div class="notes-section">
            <div class="notes-section-title"><i class="fa-solid fa-circle-info" style="color: #6c5ce7;"></i> Concept Overview</div>
            <div class="notes-overview-text">${notes.overview}</div>
        </div>

        ${conceptsHtml}
        ${codeHtml}
        ${cheatSheetHtml}
        ${ctaHtml}
    `;
}


// ==========================================
// INDIABIX PRACTICE QUESTIONS MODULE (Images 5 & 6 Fix)
// ==========================================
function openPracticeQuestions(topic = "java") {
    navigateTo("practice");
    switchPracticeTopic(topic);
}

async function switchPracticeTopic(topicKey) {
    currentPracticeTopic = topicKey.toLowerCase().trim();
    currentPracticeIndex = 0;
    userAnswers = {};
    practiceScore = 0;

    // Update active practice pill
    const pills = ["java", "python", "dbms", "os", "cn"];
    pills.forEach(p => {
        const el = document.getElementById(`practicePill-${p}`);
        if (el) el.classList.toggle("active", p === currentPracticeTopic);
    });

    document.getElementById("practiceTopicBadge").innerText = `${currentPracticeTopic.toUpperCase()} Practice`;
    document.getElementById("practiceSummaryCard").style.display = "none";
    document.getElementById("indiabixActiveContainer").style.display = "block";

    // Fetch Questions
    try {
        const res = await fetch(`${API_BASE}/api/practice/${currentPracticeTopic}`);
        if (res.ok) {
            const data = await res.json();
            if (data.success && data.questions && data.questions.length > 0) {
                practiceQuestions = data.questions;
            }
        }
    } catch (e) {
        console.warn("Backend error fetching practice questions, using local questions:", e);
    }

    if (!practiceQuestions || practiceQuestions.length === 0 || currentPracticeTopic !== "java") {
        practiceQuestions = LOCAL_PRACTICE_QUESTIONS[currentPracticeTopic] || LOCAL_PRACTICE_QUESTIONS["java"];
    }

    renderCurrentPracticeQuestion();
}

function renderCurrentPracticeQuestion() {
    if (!practiceQuestions || practiceQuestions.length === 0) return;

    const q = practiceQuestions[currentPracticeIndex];
    const total = practiceQuestions.length;

    // Update Trackers
    document.getElementById("practiceTracker").innerText = `Question ${currentPracticeIndex + 1} of ${total}`;
    document.getElementById("practiceQuestionNum").innerText = `Question ${currentPracticeIndex + 1}:`;
    document.getElementById("practiceQuestionText").textContent = q.question;

    // Prev / Next button states
    document.getElementById("btnPrevPractice").disabled = (currentPracticeIndex === 0);
    const nextBtn = document.getElementById("btnNextPractice");
    if (currentPracticeIndex === total - 1) {
        nextBtn.innerHTML = `Finish & View Score <i class="fa-solid fa-flag-checkered"></i>`;
    } else {
        nextBtn.innerHTML = `Next Question <i class="fa-solid fa-chevron-right"></i>`;
    }

    // Check if user already answered this question
    const alreadyAnswered = userAnswers.hasOwnProperty(q.id);
    const selectedOptIndex = userAnswers[q.id];

    // Render 4 Options
    const letters = ["A", "B", "C", "D"];
    const container = document.getElementById("practiceOptionsContainer");
    container.innerHTML = "";

    q.options.forEach((optText, idx) => {
        const card = document.createElement("div");
        card.className = "option-card";
        
        if (alreadyAnswered) {
            card.classList.add("locked");
            if (idx === q.correct) {
                card.classList.add("correct");
            } else if (idx === selectedOptIndex) {
                card.classList.add("wrong");
            }
        } else {
            card.onclick = () => handleOptionClick(idx);
        }

        const indicatorIcon = (alreadyAnswered && idx === q.correct) 
            ? "✓ Correct" 
            : (alreadyAnswered && idx === selectedOptIndex ? "✗ Wrong" : "");

        const letterDiv = document.createElement("div");
        letterDiv.className = "option-letter";
        letterDiv.textContent = letters[idx];

        const textDiv = document.createElement("div");
        textDiv.className = "option-text";
        textDiv.textContent = optText;

        const indicatorDiv = document.createElement("div");
        indicatorDiv.className = "option-indicator";
        indicatorDiv.textContent = indicatorIcon;

        card.appendChild(letterDiv);
        card.appendChild(textDiv);
        card.appendChild(indicatorDiv);

        container.appendChild(card);
    });

    // Explanation Box visibility
    const explBox = document.getElementById("practiceExplanationBox");
    if (alreadyAnswered) {
        document.getElementById("practiceCorrectAnsLabel").textContent = `Correct Answer: Option ${letters[q.correct]} (${q.options[q.correct]})`;
        document.getElementById("practiceExplanationText").textContent = q.explanation || "No explanation provided.";
        explBox.style.display = "block";
    } else {
        explBox.style.display = "none";
    }
}

/**
 * CRITICAL REQUIREMENT 6:
 * As soon as user clicks an option, immediately show correct/wrong state
 * and instantly reveal IndiaBix-style Answer & Explanation box!
 */
function handleOptionClick(chosenIndex) {
    const q = practiceQuestions[currentPracticeIndex];
    if (userAnswers.hasOwnProperty(q.id)) return; // Already locked

    // Save answer
    userAnswers[q.id] = chosenIndex;
    const isCorrect = (chosenIndex === q.correct);
    if (isCorrect) practiceScore++;

    const letters = ["A", "B", "C", "D"];
    const optionCards = document.querySelectorAll("#practiceOptionsContainer .option-card");

    // Immediately highlight choices
    optionCards.forEach((card, idx) => {
        card.classList.add("locked");
        card.onclick = null; // Remove click listener

        const indicator = card.querySelector(".option-indicator");

        if (idx === q.correct) {
            card.classList.add("correct");
            if (indicator) indicator.textContent = "✓ Correct";
        } else if (idx === chosenIndex) {
            card.classList.add("wrong");
            if (indicator) indicator.textContent = "✗ Incorrect";
        }
    });

    // Instantly reveal IndiaBix Answer & Explanation Box
    const explBox = document.getElementById("practiceExplanationBox");
    document.getElementById("practiceCorrectAnsLabel").textContent = `Correct Answer: Option ${letters[q.correct]} (${q.options[q.correct]})`;
    document.getElementById("practiceExplanationText").textContent = q.explanation || "Detailed analysis for this question.";
    explBox.style.display = "block";
}

function nextPracticeQuestion() {
    if (currentPracticeIndex < practiceQuestions.length - 1) {
        currentPracticeIndex++;
        renderCurrentPracticeQuestion();
    } else {
        showPracticeSummary();
    }
}

function prevPracticeQuestion() {
    if (currentPracticeIndex > 0) {
        currentPracticeIndex--;
        renderCurrentPracticeQuestion();
    }
}

function showPracticeSummary() {
    document.getElementById("indiabixActiveContainer").style.display = "none";
    const summaryCard = document.getElementById("practiceSummaryCard");
    summaryCard.style.display = "block";

    const total = practiceQuestions.length;
    const scoreDisplay = document.getElementById("summaryScoreDisplay");
    const feedback = document.getElementById("summaryFeedback");
    const trophy = document.getElementById("summaryTrophy");

    scoreDisplay.innerText = `${practiceScore} / ${total}`;

    const percent = (practiceScore / total) * 100;
    if (percent === 100) {
        trophy.innerText = "🏆";
        feedback.innerText = `Sensational ${currentUser?.full_name || "Learner"}! You answered every question correctly!`;
    } else if (percent >= 60) {
        trophy.innerText = "🌟";
        feedback.innerText = `Great job ${currentUser?.full_name || "Learner"}! Strong understanding of ${currentPracticeTopic.toUpperCase()}.`;
    } else {
        trophy.innerText = "📚";
        feedback.innerText = `Good effort! Review the notes and try the practice drill again to master this topic.`;
    }
}

function restartPractice() {
    switchPracticeTopic(currentPracticeTopic);
}


// ==========================================
// QUIZ MODULE (Images 2 Fix: Subject Chooser, No Immediate Reveal, End-of-Quiz Review)
// ==========================================
let currentQuizTopic = "python";
let currentQuizQuestions = [];
let currentQuizIndex = 0;
let userQuizAnswers = {}; // Map: question index -> chosen option index
let isQuizCompleted = false;

function openQuickRevision(topic = "python") {
    navigateTo("quiz");
    switchQuizTopic(topic);
}

function switchQuizTopic(topic) {
    currentQuizTopic = topic.toLowerCase().trim();
    
    // Update active quiz topic pill
    const pills = ["java", "python", "dbms", "os", "cn"];
    pills.forEach(p => {
        const el = document.getElementById(`quizPill-${p}`);
        if (el) el.classList.toggle("active", p === currentQuizTopic);
    });

    // Load questions for topic from LOCAL_PRACTICE_QUESTIONS
    currentQuizQuestions = LOCAL_PRACTICE_QUESTIONS[currentQuizTopic] || LOCAL_PRACTICE_QUESTIONS["python"];
    currentQuizIndex = 0;
    userQuizAnswers = {};
    isQuizCompleted = false;

    renderQuizQuestion();
}

function renderQuizQuestion() {
    const container = document.getElementById("quickRevisionContainer");
    if (!container) return;

    if (isQuizCompleted) {
        renderQuizCompleted();
        return;
    }

    if (!currentQuizQuestions || currentQuizQuestions.length === 0) {
        currentQuizQuestions = LOCAL_PRACTICE_QUESTIONS[currentQuizTopic] || LOCAL_PRACTICE_QUESTIONS["python"];
    }

    const q = currentQuizQuestions[currentQuizIndex];
    const total = currentQuizQuestions.length;
    const letters = ["A", "B", "C", "D"];
    const topicLabels = {
        java: "☕ Java Quiz",
        python: "🐍 Python Quiz",
        dbms: "🗄️ DBMS Quiz",
        os: "💻 OS Quiz",
        cn: "🌐 CN Quiz"
    };

    const selectedOpt = userQuizAnswers.hasOwnProperty(currentQuizIndex) ? userQuizAnswers[currentQuizIndex] : null;

    container.innerHTML = `
        <div class="indiabix-header">
            <span class="indiabix-badge" style="background: #f0eaff; color: #6c5ce7; font-weight: 700;">
                ${topicLabels[currentQuizTopic] || '⚡ Quiz'}
            </span>
            <span class="question-tracker">Question ${currentQuizIndex + 1} of ${total}</span>
        </div>

        <div class="question-text-box">
            <div class="question-number">Question ${currentQuizIndex + 1}:</div>
            <div class="question-text" id="quizQuestionText"></div>
        </div>

        <div class="options-list" id="quizOptionsList">
            <!-- Dynamically populated with safe textContent -->
        </div>

        <div class="practice-actions-row" style="margin-top: 24px;">
            <button type="button" class="btn-back" id="btnPrevQuiz" onclick="prevQuizQuestion()" ${currentQuizIndex === 0 ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-left"></i> Previous
            </button>
            <button type="button" class="btn-nav-question" id="btnNextQuiz" onclick="nextOrSubmitQuiz()">
                ${currentQuizIndex === total - 1 ? 'Submit Quiz 🏁' : 'Next Question <i class="fa-solid fa-chevron-right"></i>'}
            </button>
        </div>
    `;

    // Safely render question text
    document.getElementById("quizQuestionText").textContent = q.question;

    const optList = document.getElementById("quizOptionsList");
    optList.innerHTML = "";

    q.options.forEach((optText, idx) => {
        const card = document.createElement("div");
        card.className = "option-card";
        if (selectedOpt === idx) {
            card.classList.add("selected");
        }

        // Clicking ONLY selects the option (DO NOT reveal correct/wrong immediately!)
        card.onclick = () => selectQuizOption(idx);

        const letterDiv = document.createElement("div");
        letterDiv.className = "option-letter";
        letterDiv.textContent = letters[idx];

        const textDiv = document.createElement("div");
        textDiv.className = "option-text";
        textDiv.textContent = optText;

        const indicatorDiv = document.createElement("div");
        indicatorDiv.className = "option-indicator";
        indicatorDiv.textContent = (selectedOpt === idx) ? "● Selected" : "";

        card.appendChild(letterDiv);
        card.appendChild(textDiv);
        card.appendChild(indicatorDiv);

        optList.appendChild(card);
    });
}

function selectQuizOption(chosenIdx) {
    userQuizAnswers[currentQuizIndex] = chosenIdx;

    // In QUIZ mode: DO NOT reveal correct or wrong!
    // Simply update which option card is marked as selected!
    const cards = document.querySelectorAll("#quizOptionsList .option-card");
    cards.forEach((card, idx) => {
        const ind = card.querySelector(".option-indicator");
        if (idx === chosenIdx) {
            card.classList.add("selected");
            if (ind) ind.textContent = "● Selected";
        } else {
            card.classList.remove("selected");
            if (ind) ind.textContent = "";
        }
    });
}

function prevQuizQuestion() {
    if (currentQuizIndex > 0) {
        currentQuizIndex--;
        renderQuizQuestion();
    }
}

function nextOrSubmitQuiz() {
    const total = currentQuizQuestions.length;
    if (currentQuizIndex < total - 1) {
        currentQuizIndex++;
        renderQuizQuestion();
    } else {
        // Complete Quiz!
        isQuizCompleted = true;
        renderQuizCompleted();
    }
}

function renderQuizCompleted() {
    const container = document.getElementById("quickRevisionContainer");
    const total = currentQuizQuestions.length;
    let score = 0;
    const letters = ["A", "B", "C", "D"];

    currentQuizQuestions.forEach((q, idx) => {
        if (userQuizAnswers[idx] === q.correct) {
            score++;
        }
    });

    const percent = Math.round((score / total) * 100);
    let feedback = "";
    let trophy = "🏆";
    if (percent === 100) {
        feedback = "Outstanding mastery! You answered every question correctly!";
        trophy = "🌟";
    } else if (percent >= 60) {
        feedback = "Great effort! Strong performance, keep practicing to reach 100%!";
        trophy = "👏";
    } else {
        feedback = "Good practice! Review the detailed answers and explanations below to strengthen your understanding.";
        trophy = "📚";
    }

    container.innerHTML = `
        <div class="score-summary-box" style="margin-bottom: 30px;">
            <div class="score-trophy">${trophy}</div>
            <h2 style="font-size: 26px; color: #2d3436; margin-bottom: 6px;">Quiz Completed!</h2>
            <div class="score-big">${score} / ${total} <span style="font-size: 18px; color: #636e72; font-weight: normal;">(${percent}%)</span></div>
            <div class="score-feedback">${feedback}</div>
            <div class="score-actions">
                <button type="button" class="btn-nav-question" onclick="switchQuizTopic(currentQuizTopic)">
                    <i class="fa-solid fa-rotate-right"></i> Retake Quiz
                </button>
                <button type="button" class="btn-back" onclick="openPracticeQuestions(currentQuizTopic)">
                    <i class="fa-solid fa-bullseye"></i> Practice Questions
                </button>
                <button type="button" class="btn-back" onclick="navigateTo('home')">
                    <i class="fa-solid fa-house"></i> Home Dashboard
                </button>
            </div>
        </div>

        <div style="text-align: left; margin-bottom: 20px;">
            <h3 style="font-size: 20px; font-weight: 700; color: #2d3436; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-square-check" style="color: #6c5ce7;"></i> Quiz Review & Detailed Answers
            </h3>
            <p style="font-size: 14px; color: #636e72;">Review each question with correct answers and concept explanations below:</p>
        </div>
        <div id="quizReviewList"></div>
    `;

    const reviewList = document.getElementById("quizReviewList");
    currentQuizQuestions.forEach((q, idx) => {
        const userAns = userQuizAnswers[idx];
        const isAnswered = userQuizAnswers.hasOwnProperty(idx);
        const isCorrect = isAnswered && (userAns === q.correct);

        const card = document.createElement("div");
        card.className = `quiz-review-card ${isCorrect ? 'is-correct' : 'is-wrong'}`;
        card.style.background = "#ffffff";
        card.style.border = `2px solid ${isCorrect ? '#00b894' : '#fab1a0'}`;
        card.style.borderRadius = "16px";
        card.style.padding = "20px";
        card.style.marginBottom = "18px";
        card.style.textAlign = "left";

        const headerDiv = document.createElement("div");
        headerDiv.style.display = "flex";
        headerDiv.style.justifyContent = "space-between";
        headerDiv.style.alignItems = "center";
        headerDiv.style.marginBottom = "10px";

        const qNum = document.createElement("span");
        qNum.style.fontWeight = "700";
        qNum.style.fontSize = "13px";
        qNum.style.color = "#6c5ce7";
        qNum.textContent = `QUESTION ${idx + 1}`;

        const statusBadge = document.createElement("span");
        statusBadge.style.fontWeight = "700";
        statusBadge.style.fontSize = "12px";
        statusBadge.style.padding = "4px 10px";
        statusBadge.style.borderRadius = "20px";
        if (isCorrect) {
            statusBadge.style.background = "#e6f9f5";
            statusBadge.style.color = "#00b894";
            statusBadge.textContent = "✓ Correct (+1)";
        } else if (isAnswered) {
            statusBadge.style.background = "#ffeaea";
            statusBadge.style.color = "#d63031";
            statusBadge.textContent = "✗ Incorrect";
        } else {
            statusBadge.style.background = "#f1f2f6";
            statusBadge.style.color = "#747d8c";
            statusBadge.textContent = "Not Answered";
        }

        headerDiv.appendChild(qNum);
        headerDiv.appendChild(statusBadge);

        const qText = document.createElement("div");
        qText.style.fontWeight = "600";
        qText.style.fontSize = "15px";
        qText.style.color = "#2d3436";
        qText.style.marginBottom = "14px";
        qText.textContent = q.question;

        const ansBox = document.createElement("div");
        ansBox.style.fontSize = "14px";
        ansBox.style.marginBottom = "12px";

        const yourAnsDiv = document.createElement("div");
        yourAnsDiv.style.marginBottom = "6px";
        yourAnsDiv.innerHTML = `<strong>Your Answer:</strong> `;
        const yourAnsText = document.createElement("span");
        if (isAnswered) {
            yourAnsText.style.color = isCorrect ? "#00b894" : "#d63031";
            yourAnsText.style.fontWeight = "600";
            yourAnsText.textContent = `Option ${letters[userAns]} (${q.options[userAns]})`;
        } else {
            yourAnsText.style.color = "#747d8c";
            yourAnsText.textContent = "None";
        }
        yourAnsDiv.appendChild(yourAnsText);
        ansBox.appendChild(yourAnsDiv);

        if (!isCorrect) {
            const correctAnsDiv = document.createElement("div");
            correctAnsDiv.innerHTML = `<strong>Correct Answer:</strong> `;
            const corrAnsText = document.createElement("span");
            corrAnsText.style.color = "#00b894";
            corrAnsText.style.fontWeight = "600";
            corrAnsText.textContent = `Option ${letters[q.correct]} (${q.options[q.correct]})`;
            correctAnsDiv.appendChild(corrAnsText);
            ansBox.appendChild(correctAnsDiv);
        }

        const explBox = document.createElement("div");
        explBox.style.background = "#f8f9fa";
        explBox.style.borderLeft = "4px solid #6c5ce7";
        explBox.style.padding = "10px 14px";
        explBox.style.borderRadius = "0 8px 8px 0";
        explBox.style.fontSize = "13.5px";
        explBox.style.color = "#495057";
        explBox.style.lineHeight = "1.5";
        explBox.textContent = `💡 Explanation: ${q.explanation || "No explanation provided."}`;

        card.appendChild(headerDiv);
        card.appendChild(qText);
        card.appendChild(ansBox);
        card.appendChild(explBox);

        reviewList.appendChild(card);
    });
}


// API Key Modal
function openKeyModal() {
    document.getElementById("keyModal").style.display = "flex";
}

function closeKeyModal() {
    document.getElementById("keyModal").style.display = "none";
}

async function saveApiKeyFromModal() {
    const key = document.getElementById("modalApiKeyInput").value.trim();
    if (!key) return;

    try {
        const res = await fetch(`${API_BASE}/api/set-key`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_key: key })
        });
        if (res.ok) {
            closeKeyModal();
            checkApiStatus();
        }
    } catch (e) {
        closeKeyModal();
    }
}

async function checkApiStatus() {
    try {
        const res = await fetch(`${API_BASE}/api/status`);
        if (res.ok) {
            const data = await res.json();
            const pill = document.getElementById("apiStatusPill");
            if (pill) {
                pill.style.display = "flex";
                document.getElementById("statusText").innerText = data.api_configured ? "Gemini Ready" : "Offline Ready";
                document.getElementById("statusDot").style.background = data.api_configured ? "#00b894" : "#fdcb6e";
            }
        }
    } catch (e) {
        // Silent fallback
    }
}
