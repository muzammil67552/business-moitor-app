export const userData = {
  name: "Bussiness Monitoring App",
  location: "Made By Muzammil",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=YourMuzamilMonotoring"
};

export const days = [
  { day: "Mon", date: 1, isToday: true },
  { day: "Tue", date: 2, isToday: false },
  { day: "Wed", date: 3, isToday: false },
  { day: "Thu", date: 4, isToday: false },
  { day: "Fri", date: 5, isToday: false },
];

export const tasks = [
  {
    id: "1",
    time: "10:00",
    title: "Meeting with CEO",
    icon: "mail",
    progress: 35,
    isCompleted: true,
    date: "Saturday, 10 Sep",
    timeRange: "10:00 - 11:00 PM",
    agenda: [
      { id: "a1", icon: "info", text: "Explain current concept" },
      { id: "a2", icon: "presentation", text: "Prepare presentation for design" },
      { id: "a3", icon: "lightbulb", text: "Brain storming" },
      { id: "a4", icon: "users", text: "Discussion about new employee" },
    ],
    participants: [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=male1",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=male2",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=male3",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=male4",
    ]
  },
  {
    id: "2",
    time: "11:00",
    title: "Scanner app wireframe",
    icon: "calendar",
    progress: 18,
    isCompleted: true,
    date: "Saturday, 10 Sep",
    timeRange: "11:00 - 12:00 PM",
    agenda: [
      { id: "a1", icon: "info", text: "Review current wireframes" },
      { id: "a2", icon: "presentation", text: "Discuss user flow" },
      { id: "a3", icon: "lightbulb", text: "Iterate on design" },
    ],
    participants: [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=male5",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=male6",
    ]
  },
  {
    id: "3",
    time: "13:00",
    title: "Feed the kittens",
    icon: "smile",
    progress: 75,
    isCompleted: true,
    date: "Saturday, 10 Sep",
    timeRange: "13:00 - 13:30 PM",
    agenda: [
      { id: "a1", icon: "info", text: "Prepare food bowls" },
      { id: "a2", icon: "lightbulb", text: "Check water supply" },
    ],
    participants: []
  },
  {
    id: "4",
    time: "14:00",
    title: "Ask mom for key",
    icon: "bell",
    progress: 45,
    isCompleted: true,
    date: "Saturday, 10 Sep",
    timeRange: "14:00 - 14:15 PM",
    agenda: [
      { id: "a1", icon: "info", text: "Call mom" },
      { id: "a2", icon: "lightbulb", text: "Pick up spare key" },
    ],
    participants: []
  },
];
