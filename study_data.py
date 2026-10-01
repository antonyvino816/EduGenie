"""
Pre-curated Study Notes and IndiaBix-Style Practice Questions
Covers Core CS Subjects: Python, Java, DBMS, OS, Computer Networks (CN), and Aptitude.
"""

STUDY_NOTES = {
    "java": {
        "title": "Java Programming",
        "tagline": "Object-Oriented, Platform-Independent, Enterprise-Grade Language",
        "badge": "Core CS",
        "icon": "☕",
        "overview": "Java is a class-based, object-oriented programming language designed by James Gosling at Sun Microsystems in 1995. Its core design philosophy is 'Write Once, Run Anywhere' (WORA) via bytecode running on the Java Virtual Machine (JVM).",
        "key_concepts": [
            {
                "title": "JVM, JRE & JDK",
                "desc": "JDK (Java Development Kit) includes development tools + JRE. JRE (Java Runtime Environment) provides libraries + JVM. JVM executes compiled bytecode (.class files)."
            },
            {
                "title": "OOPs 4 Pillars",
                "desc": "Encapsulation (data hiding with private fields & getters/setters), Inheritance (extends keyword for code reuse), Polymorphism (Method Overloading and Overriding), and Abstraction (abstract classes & interfaces)."
            },
            {
                "title": "Memory Architecture",
                "desc": "Stack memory stores primitive values and local object references. Heap memory stores actual objects and instance variables. Garbage Collector (GC) runs in the background to deallocate unreferenced heap memory."
            },
            {
                "title": "Collections Framework",
                "desc": "Core interfaces: List (ArrayList, LinkedList), Set (HashSet, TreeSet), and Map (HashMap, TreeMap). HashMap uses hashing with O(1) average lookup."
            },
            {
                "title": "Exception Handling",
                "desc": "Handled using try, catch, finally, throw, and throws. Checked exceptions (compile-time, e.g., IOException) vs Unchecked exceptions (runtime, e.g., NullPointerException)."
            }
        ],
        "code_example": {
            "title": "Hello Java & OOP Example",
            "code": """public class EduGenieStudent {
    // Encapsulation: Private member
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
}"""
        },
        "cheat_sheet": [
            "Main Method: public static void main(String[] args)",
            "String is immutable in Java; use StringBuilder for mutable string operations.",
            "Default values: int is 0, boolean is false, object references are null.",
            "Common Uses: Android Apps, Enterprise Spring Boot backends, Big Data (Hadoop/Spark)."
        ]
    },
    "python": {
        "title": "Python Programming",
        "tagline": "Simple, Expressive, High-Level Interpreted Language",
        "badge": "AI & Web",
        "icon": "🐍",
        "overview": "Python is an interpreted, high-level, dynamically typed language known for its clean syntax and massive ecosystem. It is the de-facto standard for Artificial Intelligence, Machine Learning, Data Science, and rapid web prototyping.",
        "key_concepts": [
            {
                "title": "Dynamic Typing & Interpreted Nature",
                "desc": "Variables do not require explicit type declarations. Code is executed line-by-line via the CPython interpreter."
            },
            {
                "title": "Built-in Data Structures",
                "desc": "Lists (mutable ordered sequence []), Tuples (immutable ordered sequence ()), Sets (unique unordered items {}), and Dictionaries (key-value pairs {})."
            },
            {
                "title": "Functions & Lambdas",
                "desc": "Defined using the 'def' keyword. Supports default arguments, *args (variable positional), **kwargs (keyword arguments), and anonymous 'lambda' expressions."
            },
            {
                "title": "List Comprehensions",
                "desc": "Concise syntax for transforming iterables: [x*2 for x in numbers if x > 0]."
            },
            {
                "title": "Package Ecosystem",
                "desc": "NumPy & Pandas for data manipulation, FastAPI & Flask for web APIs, TensorFlow & PyTorch for Deep Learning."
            }
        ],
        "code_example": {
            "title": "Python Quick Demonstration",
            "code": """# Python Dictionary & List Comprehension
student = {"name": "Poornima", "skills": ["Python", "FastAPI"]}

# Filter skills length
long_skills = [s for s in student["skills"] if len(s) > 5]

def greet_learner(name: str) -> str:
    return f"Welcome {name}! Ready to master AI with EduGenie? 🚀"

print(greet_learner(student["name"]))
print(f"Highlighted skills: {long_skills}")"""
        },
        "cheat_sheet": [
            "Functions defined with: def function_name():",
            "Indentation (4 spaces) defines code blocks instead of curly braces {}",
            "Lists are indexed starting at 0; negative indexing (-1) accesses from the end.",
            "Use 'is' for identity check and '==' for value equality."
        ]
    },
    "dbms": {
        "title": "Database Management Systems (DBMS)",
        "tagline": "Relational Models, SQL Queries, ACID Properties & Indexing",
        "badge": "Core CS",
        "icon": "🗄️",
        "overview": "A DBMS is software used to define, store, manage, and query structured data safely. Relational DBMS (RDBMS) organizes data into tables (relations) with rows (tuples) and columns (attributes).",
        "key_concepts": [
            {
                "title": "SQL Sub-Languages",
                "desc": "DDL (Data Definition: CREATE, ALTER, DROP), DML (Data Manipulation: INSERT, UPDATE, DELETE), DQL (Data Query: SELECT), and TCL (Transaction Control: COMMIT, ROLLBACK)."
            },
            {
                "title": "ACID Properties",
                "desc": "Atomicity (all or nothing), Consistency (preserves integrity constraints), Isolation (concurrent transactions execute independently), Durability (committed changes persist even after crashes)."
            },
            {
                "title": "Database Keys",
                "desc": "Primary Key (uniquely identifies a record, cannot be null), Foreign Key (references primary key in another table), Candidate Key (minimal super key)."
            },
            {
                "title": "Normalization (1NF to BCNF)",
                "desc": "The process of organizing data to reduce redundancy and eliminate update/delete anomalies."
            },
            {
                "title": "Joins",
                "desc": "INNER JOIN (matching rows only), LEFT JOIN (all left rows + matches), RIGHT JOIN (all right rows + matches), FULL OUTER JOIN (all rows from both tables)."
            }
        ],
        "code_example": {
            "title": "SQL Query Example",
            "code": """-- Creating Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Query with JOIN and Aggregation
SELECT u.username, COUNT(q.id) AS total_quizzes_taken
FROM users u
LEFT JOIN quiz_results q ON u.id = q.user_id
GROUP BY u.username
HAVING total_quizzes_taken > 5;"""
        },
        "cheat_sheet": [
            "Primary Key = Unique + NOT NULL",
            "WHERE filters rows before aggregation; HAVING filters groups after GROUP BY.",
            "Indexes (B-Trees) speed up SELECT queries but add overhead to INSERT/UPDATE.",
            "Popular Databases: PostgreSQL, MySQL, SQLite, MongoDB (NoSQL)."
        ]
    },
    "os": {
        "title": "Operating Systems (OS)",
        "tagline": "Process Management, Memory Hierarchy, CPU Scheduling & Deadlocks",
        "badge": "Systems",
        "icon": "💻",
        "overview": "An Operating System acts as an intermediary between user applications and the physical computer hardware, managing CPU, memory, disk storage, and I/O devices.",
        "key_concepts": [
            {
                "title": "Process vs Thread",
                "desc": "A Process is a program in execution with its own address space. A Thread is a lightweight unit of execution within a process that shares memory and resources."
            },
            {
                "title": "CPU Scheduling Algorithms",
                "desc": "FCFS (First-Come First-Served), SJF (Shortest Job First - optimal average waiting time), Round Robin (time quantum based for time-sharing), and Priority Scheduling."
            },
            {
                "title": "Deadlock & Coffman Conditions",
                "desc": "A state where processes are permanently blocked waiting for resources held by each other. Four conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait."
            },
            {
                "title": "Virtual Memory & Paging",
                "desc": "Separates logical address space from physical RAM using Pages and Frames. Page Fault occurs when a referenced page is not currently in physical RAM."
            }
        ],
        "code_example": {
            "title": "Process Life Cycle States",
            "code": """[NEW] ---> (Admitted) ---> [READY] <--- (Timeout) --- [RUNNING]
                                 |                          |
                             (Scheduler)                (I/O Wait)
                                 |                          v
                             [RUNNING] ---> (Exit) ---> [TERMINATED]
                                 ^
                                 |
                             [WAITING] (I/O Completed)"""
        },
        "cheat_sheet": [
            "Deadlock Prevention requires breaking at least one of the 4 Coffman conditions.",
            "Banker's Algorithm is used for Deadlock Avoidance.",
            "Thrashing occurs when the OS spends more time swapping pages than executing instructions.",
            "Semaphores and Mutex are synchronization tools to prevent Race Conditions."
        ]
    },
    "cn": {
        "title": "Computer Networks (CN)",
        "tagline": "OSI 7 Layers, TCP/IP, Routing Protocols, IP Addressing & Sockets",
        "badge": "Networking",
        "icon": "🌐",
        "overview": "Computer Networking governs how computing devices exchange data over digital interconnections using standardized protocols.",
        "key_concepts": [
            {
                "title": "OSI 7-Layer Architecture",
                "desc": "Physical (bits) -> Data Link (frames) -> Network (packets) -> Transport (segments) -> Session -> Presentation -> Application (HTTP, DNS)."
            },
            {
                "title": "TCP vs UDP",
                "desc": "TCP (Transmission Control Protocol) is connection-oriented, reliable, with 3-way handshake (SYN, SYN-ACK, ACK). UDP is connectionless, lightweight, low-latency (used for live streaming & gaming)."
            },
            {
                "title": "IP Addressing & Subnetting",
                "desc": "IPv4 (32-bit dotted-decimal, ~4.3B addresses) vs IPv6 (128-bit hexadecimal). CIDR notation (e.g., /24) defines network prefix and host mask."
            },
            {
                "title": "DNS & HTTP/HTTPS",
                "desc": "DNS translates domain names (google.com) to IP addresses. HTTPS uses TLS/SSL (port 443) for encrypted end-to-end communication."
            }
        ],
        "code_example": {
            "title": "TCP 3-Way Handshake",
            "code": """Client                         Server
  |                              |
  |--- 1. SYN (seq=x) ---------->|  (Initiates connection)
  |                              |
  |<-- 2. SYN-ACK (ack=x+1) -----|  (Acknowledges & responds)
  |                              |
  |--- 3. ACK (ack=y+1) -------->|  (Connection Established!)
  |                              |"""
        },
        "cheat_sheet": [
            "TCP Port 80 = HTTP, Port 443 = HTTPS, Port 22 = SSH, Port 53 = DNS.",
            "MAC address operates at Layer 2 (Data Link); IP address operates at Layer 3 (Network).",
            "Routers connect different networks (L3); Switches connect devices within a LAN (L2).",
            "Ping uses ICMP (Internet Control Message Protocol)."
        ]
    }
}


INDIABIX_PRACTICE_QUESTIONS = {
    "java": [
        {
            "id": 1,
            "question": "Which of the following is NOT a Java primitive data type?",
            "options": [
                "int",
                "boolean",
                "String",
                "float"
            ],
            "correct": 2,  # 0-indexed: String
            "explanation": "In Java, 'String' is a class (an Object reference type in java.lang), not a primitive. The 8 primitive types in Java are: byte, short, int, long, float, double, char, and boolean."
        },
        {
            "id": 2,
            "question": "What is the size of an int variable in Java?",
            "options": [
                "16 bits (2 bytes)",
                "32 bits (4 bytes)",
                "64 bits (8 bytes)",
                "Platform dependent"
            ],
            "correct": 1,
            "explanation": "In Java, an 'int' is strictly 32 bits (4 bytes) signed two's complement integer across ALL platforms. Unlike C/C++, Java guarantees primitive data sizes regardless of the underlying OS."
        },
        {
            "id": 3,
            "question": "Which keyword is used to inherit a class in Java?",
            "options": [
                "implement",
                "extends",
                "inherits",
                "instanceof"
            ],
            "correct": 1,
            "explanation": "The 'extends' keyword is used to inherit a class in Java (e.g., class Dog extends Animal). The 'implements' keyword is used when a class implements an interface."
        },
        {
            "id": 4,
            "question": "Where are objects stored in Java memory?",
            "options": [
                "Stack memory",
                "Heap memory",
                "Code segment",
                "CPU registers"
            ],
            "correct": 1,
            "explanation": "In Java, all objects and their instance variables are dynamically allocated on the Heap memory. The Stack memory only stores primitive local variables and references/pointers to the objects in the Heap."
        },
        {
            "id": 5,
            "question": "Which method signature represents the valid entry point for a Java application?",
            "options": [
                "public void main(String[] args)",
                "public static void main()",
                "public static void main(String[] args)",
                "private static void main(String args)"
            ],
            "correct": 2,
            "explanation": "The JVM specifically looks for 'public static void main(String[] args)'. It must be public (accessible by JVM), static (callable without instantiating the class), void (returns nothing), and accept a String array parameter."
        }
    ],
    "python": [
        {
            "id": 1,
            "question": "What keyword is used to define a function in Python?",
            "options": [
                "func",
                "function",
                "def",
                "define"
            ],
            "correct": 2,
            "explanation": "In Python, functions are defined using the 'def' keyword followed by the function name and parentheses: def my_function():"
        },
        {
            "id": 2,
            "question": "Which of the following data structures is IMMUTABLE in Python?",
            "options": [
                "List",
                "Dictionary",
                "Tuple",
                "Set"
            ],
            "correct": 2,
            "explanation": "A Tuple in Python is immutable; once created, its elements cannot be modified, added, or removed. Lists, Dictionaries, and Sets are mutable."
        },
        {
            "id": 3,
            "question": "What will be the output of `print(type([1, 2, 3]))` in Python?",
            "options": [
                "<class 'tuple'>",
                "<class 'list'>",
                "<class 'array'>",
                "<class 'set'>"
            ],
            "correct": 1,
            "explanation": "Square brackets [] in Python define a list literal. Therefore, type([1, 2, 3]) evaluates to <class 'list'>."
        },
        {
            "id": 4,
            "question": "What does the expression `3 * 'Edu'` evaluate to in Python?",
            "options": [
                "TypeError",
                "'EduEduEdu'",
                "'9Edu'",
                "['Edu', 'Edu', 'Edu']"
            ],
            "correct": 1,
            "explanation": "In Python, the '*' operator between an integer and a string performs string repetition. So 3 * 'Edu' results in 'EduEduEdu'."
        },
        {
            "id": 5,
            "question": "Which built-in Python function is used to get the length of an iterable?",
            "options": [
                "size()",
                "count()",
                "length()",
                "len()"
            ],
            "correct": 3,
            "explanation": "The built-in 'len()' function returns the number of items in an object like a string, list, tuple, or dictionary."
        }
    ],
    "dbms": [
        {
            "id": 1,
            "question": "Which normal form deals with the removal of partial functional dependency?",
            "options": [
                "First Normal Form (1NF)",
                "Second Normal Form (2NF)",
                "Third Normal Form (3NF)",
                "Boyce-Codd Normal Form (BCNF)"
            ],
            "correct": 1,
            "explanation": "A relation is in 2NF if it is in 1NF and no non-prime attribute is partially dependent on any candidate key (removal of partial dependency)."
        },
        {
            "id": 2,
            "question": "What does the 'I' stand for in ACID properties of a DBMS transaction?",
            "options": [
                "Integrity",
                "Isolation",
                "Indexing",
                "Information"
            ],
            "correct": 1,
            "explanation": "ACID stands for Atomicity, Consistency, Isolation, and Durability. Isolation ensures that concurrent execution of transactions leaves the database in the same state as if they were executed sequentially."
        },
        {
            "id": 3,
            "question": "Which SQL clause is used to filter records AFTER an aggregation with GROUP BY?",
            "options": [
                "WHERE",
                "HAVING",
                "ORDER BY",
                "FILTER"
            ],
            "correct": 1,
            "explanation": "'HAVING' is used to filter aggregated group records (e.g. HAVING COUNT(*) > 5). The 'WHERE' clause filters individual rows before aggregation."
        },
        {
            "id": 4,
            "question": "A Primary Key constraint enforces which two rules?",
            "options": [
                "UNIQUE and DEFAULT",
                "UNIQUE and NOT NULL",
                "NOT NULL and FOREIGN KEY",
                "CHECK and AUTO_INCREMENT"
            ],
            "correct": 1,
            "explanation": "A Primary Key column uniquely identifies each row in a table. It implicitly enforces both UNIQUE (no two rows have the same value) and NOT NULL (cannot be blank)."
        },
        {
            "id": 5,
            "question": "Which of the following is a Data Definition Language (DDL) command?",
            "options": [
                "SELECT",
                "UPDATE",
                "ALTER",
                "INSERT"
            ],
            "correct": 2,
            "explanation": "ALTER is a DDL command because it modifies the database schema/structure. SELECT is DQL, while INSERT and UPDATE are DML commands."
        }
    ],
    "os": [
        {
            "id": 1,
            "question": "Which CPU scheduling algorithm is completely free from starvation?",
            "options": [
                "Shortest Job First (SJF)",
                "Priority Scheduling",
                "Round Robin (RR)",
                "Multilevel Queue"
            ],
            "correct": 2,
            "explanation": "Round Robin scheduling assigns a fixed time quantum to each ready process in cyclic order. Every process gets CPU time periodically, completely preventing starvation."
        },
        {
            "id": 2,
            "question": "Which of the following is NOT one of the 4 Coffman conditions for Deadlock?",
            "options": [
                "Mutual Exclusion",
                "Hold and Wait",
                "Preemption Allowed",
                "Circular Wait"
            ],
            "correct": 2,
            "explanation": "The 4 Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If preemption is allowed, deadlock cannot occur."
        },
        {
            "id": 3,
            "question": "What is a 'Page Fault' in an Operating System?",
            "options": [
                "A hardware memory corruption",
                "An access to a page that is not in physical RAM",
                "An error when saving a file to disk",
                "A syntax error in program code"
            ],
            "correct": 1,
            "explanation": "A Page Fault is a trap raised by hardware (MMU) when a program accesses a memory page mapped in the virtual address space but not currently loaded into physical RAM."
        },
        {
            "id": 4,
            "question": "What is the main difference between a Process and a Thread?",
            "options": [
                "Threads have independent memory, processes share memory",
                "Processes share memory, threads do not",
                "Threads within the same process share the address space",
                "Processes are managed by hardware, threads by compiler"
            ],
            "correct": 2,
            "explanation": "A process has its own isolated address space. Threads created inside a process share the process's address space, code segment, and heap, but each maintains its own stack and registers."
        },
        {
            "id": 5,
            "question": "Thrashing in an operating system occurs when:",
            "options": [
                "CPU utilization is at 100%",
                "The system spends more time swapping pages than executing instructions",
                "A deadlock occurs between two threads",
                "The hard disk runs out of physical space"
            ],
            "correct": 1,
            "explanation": "Thrashing happens when the OS has insufficient physical RAM to accommodate active working sets, causing continuous page faults and page swaps, bringing CPU throughput to near zero."
        }
    ],
    "cn": [
        {
            "id": 1,
            "question": "At which layer of the OSI model does the IP (Internet Protocol) operate?",
            "options": [
                "Data Link Layer (Layer 2)",
                "Network Layer (Layer 3)",
                "Transport Layer (Layer 4)",
                "Session Layer (Layer 5)"
            ],
            "correct": 1,
            "explanation": "The Internet Protocol (IPv4 and IPv6) operates at the Network Layer (Layer 3) of the OSI model, responsible for logical addressing and packet routing."
        },
        {
            "id": 2,
            "question": "What is the standard port number for secure web traffic using HTTPS?",
            "options": [
                "21",
                "80",
                "443",
                "8080"
            ],
            "correct": 2,
            "explanation": "Port 443 is the standard default port for HTTPS (HTTP over TLS/SSL). Port 80 is used for unencrypted HTTP, and Port 21 is used for FTP."
        },
        {
            "id": 3,
            "question": "Which protocol provides reliable, connection-oriented data transfer with error recovery?",
            "options": [
                "UDP",
                "IP",
                "TCP",
                "ICMP"
            ],
            "correct": 2,
            "explanation": "TCP (Transmission Control Protocol) is connection-oriented and ensures reliable data delivery via acknowledgments, retransmissions, and flow control. UDP is connectionless and best-effort."
        },
        {
            "id": 4,
            "question": "What is the size of an IPv4 address in bits?",
            "options": [
                "16 bits",
                "32 bits",
                "64 bits",
                "128 bits"
            ],
            "correct": 1,
            "explanation": "An IPv4 address is 32 bits in size, typically written as four decimal octets separated by dots (e.g. 192.168.1.1). IPv6 addresses are 128 bits."
        },
        {
            "id": 5,
            "question": "Which device connects two different networks and routes packets using IP addresses?",
            "options": [
                "Hub",
                "Repeater",
                "Switch",
                "Router"
            ],
            "correct": 3,
            "explanation": "A Router is a Layer 3 networking device that connects disparate networks and determines the best route to forward packets based on destination IP addresses."
        }
    ]
}
