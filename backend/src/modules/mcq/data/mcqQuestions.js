const mcqQuestions = [
  // ============================================================
  // DBMS — 4 QUESTIONS
  // ============================================================

  {
    question:
      "Which key uniquely identifies each record in a relational database table?",
    options: [
      "Foreign Key",
      "Primary Key",
      "Candidate Key",
      "Composite Key",
    ],
    correctAnswer: "Primary Key",
    explanation:
      "A primary key uniquely identifies each record in a table and cannot contain duplicate or NULL values.",
    subject: "DBMS",
    topic: "Keys",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which normal form removes partial dependency from a relational database?",
    options: [
      "First Normal Form (1NF)",
      "Second Normal Form (2NF)",
      "Third Normal Form (3NF)",
      "Boyce-Codd Normal Form (BCNF)",
    ],
    correctAnswer: "Second Normal Form (2NF)",
    explanation:
      "2NF removes partial dependency, meaning non-key attributes must depend on the entire candidate key rather than only part of a composite key.",
    subject: "DBMS",
    topic: "Normalization",
    difficulty: "Medium",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which SQL command is used to remove a table and all of its data?",
    options: [
      "DELETE",
      "REMOVE",
      "DROP",
      "TRUNCATE",
    ],
    correctAnswer: "DROP",
    explanation:
      "DROP removes the table structure along with all data stored in the table.",
    subject: "DBMS",
    topic: "SQL Commands",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which property of a transaction ensures that all operations are completed successfully or none of them are?",
    options: [
      "Consistency",
      "Isolation",
      "Atomicity",
      "Durability",
    ],
    correctAnswer: "Atomicity",
    explanation:
      "Atomicity ensures that a transaction is treated as a single unit. Either all operations succeed or the entire transaction is rolled back.",
    subject: "DBMS",
    topic: "Transactions",
    difficulty: "Medium",
    marks: 1,
    isActive: true,
  },

  // ============================================================
  // OPERATING SYSTEMS — 4 QUESTIONS
  // ============================================================

  {
    question:
      "Which of the following is responsible for managing processes in an operating system?",
    options: [
      "Compiler",
      "Kernel",
      "Browser",
      "Text Editor",
    ],
    correctAnswer: "Kernel",
    explanation:
      "The kernel is the core component of an operating system and manages processes, memory, devices, and other system resources.",
    subject: "Operating Systems",
    topic: "Operating System Basics",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which CPU scheduling algorithm gives each process a fixed time slice?",
    options: [
      "FCFS",
      "Shortest Job First",
      "Round Robin",
      "Priority Scheduling",
    ],
    correctAnswer: "Round Robin",
    explanation:
      "Round Robin scheduling assigns each process a fixed time quantum and cycles through processes in a circular order.",
    subject: "Operating Systems",
    topic: "CPU Scheduling",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which condition occurs when processes wait indefinitely for resources held by each other?",
    options: [
      "Starvation",
      "Deadlock",
      "Fragmentation",
      "Thrashing",
    ],
    correctAnswer: "Deadlock",
    explanation:
      "Deadlock occurs when two or more processes are permanently waiting for resources held by one another.",
    subject: "Operating Systems",
    topic: "Deadlocks",
    difficulty: "Medium",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which memory management technique divides memory into fixed-size blocks?",
    options: [
      "Paging",
      "Segmentation",
      "Swapping",
      "Compaction",
    ],
    correctAnswer: "Paging",
    explanation:
      "Paging divides logical memory into fixed-size pages and physical memory into fixed-size frames.",
    subject: "Operating Systems",
    topic: "Memory Management",
    difficulty: "Medium",
    marks: 1,
    isActive: true,
  },

  // ============================================================
  // COMPUTER NETWORKS — 4 QUESTIONS
  // ============================================================

  {
    question:
      "Which protocol is primarily used to translate domain names into IP addresses?",
    options: [
      "HTTP",
      "FTP",
      "DNS",
      "SMTP",
    ],
    correctAnswer: "DNS",
    explanation:
      "DNS (Domain Name System) translates human-readable domain names such as example.com into IP addresses.",
    subject: "Computer Networks",
    topic: "Network Protocols",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which layer of the OSI model is responsible for routing packets?",
    options: [
      "Data Link Layer",
      "Network Layer",
      "Transport Layer",
      "Session Layer",
    ],
    correctAnswer: "Network Layer",
    explanation:
      "The Network Layer is responsible for logical addressing and routing packets between different networks.",
    subject: "Computer Networks",
    topic: "OSI Model",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which protocol provides reliable, connection-oriented communication?",
    options: [
      "UDP",
      "IP",
      "TCP",
      "ARP",
    ],
    correctAnswer: "TCP",
    explanation:
      "TCP provides reliable, connection-oriented communication using mechanisms such as acknowledgments, sequencing, and retransmission.",
    subject: "Computer Networks",
    topic: "Transport Layer",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which device forwards packets between different networks?",
    options: [
      "Hub",
      "Switch",
      "Router",
      "Repeater",
    ],
    correctAnswer: "Router",
    explanation:
      "A router connects different networks and forwards packets based on destination IP addresses.",
    subject: "Computer Networks",
    topic: "Networking Devices",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  // ============================================================
  // OOP — 3 QUESTIONS
  // ============================================================

  {
    question:
      "Which OOP concept allows a class to acquire properties and methods from another class?",
    options: [
      "Encapsulation",
      "Inheritance",
      "Polymorphism",
      "Abstraction",
    ],
    correctAnswer: "Inheritance",
    explanation:
      "Inheritance allows a child class to reuse and extend properties and methods of a parent class.",
    subject: "OOP",
    topic: "Inheritance",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which OOP principle hides internal implementation details and exposes only necessary functionality?",
    options: [
      "Inheritance",
      "Encapsulation",
      "Abstraction",
      "Polymorphism",
    ],
    correctAnswer: "Abstraction",
    explanation:
      "Abstraction hides unnecessary implementation details and exposes only the essential features of an object.",
    subject: "OOP",
    topic: "Abstraction",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which concept allows the same method name to behave differently depending on the object?",
    options: [
      "Encapsulation",
      "Inheritance",
      "Polymorphism",
      "Composition",
    ],
    correctAnswer: "Polymorphism",
    explanation:
      "Polymorphism allows the same interface or method name to have different implementations depending on the object or context.",
    subject: "OOP",
    topic: "Polymorphism",
    difficulty: "Medium",
    marks: 1,
    isActive: true,
  },

  // ============================================================
  // DATA STRUCTURES — 3 QUESTIONS
  // ============================================================

  {
    question:
      "Which data structure follows the LIFO principle?",
    options: [
      "Queue",
      "Stack",
      "Linked List",
      "Tree",
    ],
    correctAnswer: "Stack",
    explanation:
      "A stack follows LIFO (Last In, First Out), meaning the most recently inserted element is removed first.",
    subject: "Data Structures",
    topic: "Stack",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which data structure follows the FIFO principle?",
    options: [
      "Stack",
      "Queue",
      "Tree",
      "Graph",
    ],
    correctAnswer: "Queue",
    explanation:
      "A queue follows FIFO (First In, First Out), meaning the first inserted element is removed first.",
    subject: "Data Structures",
    topic: "Queue",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "What is the average time complexity of searching for an element in a hash table?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)",
    ],
    correctAnswer: "O(1)",
    explanation:
      "With a good hash function and controlled collisions, hash table lookup has an average-case time complexity of O(1).",
    subject: "Data Structures",
    topic: "Hashing",
    difficulty: "Medium",
    marks: 1,
    isActive: true,
  },

  // ============================================================
  // ALGORITHMS — 2 QUESTIONS
  // ============================================================

  {
    question:
      "What is the time complexity of binary search on a sorted array?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)",
    ],
    correctAnswer: "O(log n)",
    explanation:
      "Binary search repeatedly divides the search range into half, resulting in O(log n) time complexity.",
    subject: "Algorithms",
    topic: "Searching",
    difficulty: "Easy",
    marks: 1,
    isActive: true,
  },

  {
    question:
      "Which sorting algorithm has an average time complexity of O(n log n) and uses divide and conquer?",
    options: [
      "Bubble Sort",
      "Selection Sort",
      "Merge Sort",
      "Insertion Sort",
    ],
    correctAnswer: "Merge Sort",
    explanation:
      "Merge Sort uses divide and conquer by repeatedly splitting the array and merging sorted halves. Its average time complexity is O(n log n).",
    subject: "Algorithms",
    topic: "Sorting",
    difficulty: "Medium",
    marks: 1,
    isActive: true,
  },
];

module.exports = mcqQuestions;