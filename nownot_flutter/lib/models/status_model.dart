class StatusModel {
  final String id;
  final String name;
  final String emoji;
  final int defaultDurationMinutes;
  final bool isSystem;
  final Map<String, String> groupMessages; // {'Family': '...', 'Friends': '...', 'Work': '...', 'Unknown': '...'}

  StatusModel({
    required this.id,
    required this.name,
    required this.emoji,
    this.defaultDurationMinutes = 60,
    this.isSystem = false,
    required this.groupMessages,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'emoji': emoji,
    'defaultDurationMinutes': defaultDurationMinutes,
    'isSystem': isSystem,
    'groupMessages': groupMessages,
  };

  factory StatusModel.fromJson(Map<String, dynamic> json) => StatusModel(
    id: json['id'] ?? '',
    name: json['name'] ?? '',
    emoji: json['emoji'] ?? '📱',
    defaultDurationMinutes: json['defaultDurationMinutes'] ?? 60,
    isSystem: json['isSystem'] ?? false,
    groupMessages: Map<String, String>.from(json['groupMessages'] ?? {}),
  );

  static List<StatusModel> get defaultStatuses => [
    StatusModel(
      id: 'sleeping',
      name: 'Sleeping',
      emoji: '😴',
      defaultDurationMinutes: 480,
      isSystem: true,
      groupMessages: {
        'Family': 'I am currently sleeping 😴. Will check your call when I wake up!',
        'Friends': 'Sleeping bro! Catch up later 😴',
        'Work': 'Outside working hours. I will respond first thing in the morning.',
        'Unknown': 'I am currently away. Please leave a message.',
      },
    ),
    StatusModel(
      id: 'meeting',
      name: 'In a Meeting',
      emoji: '💼',
      defaultDurationMinutes: 60,
      isSystem: true,
      groupMessages: {
        'Family': 'In a meeting right now! Will call back shortly.',
        'Friends': 'In a meeting. Send a text if urgent!',
        'Work': 'Currently in a meeting. Will get back to you once finished.',
        'Unknown': 'Busy in a meeting. Auto-reply from NowNot.',
      },
    ),
    StatusModel(
      id: 'studying',
      name: 'Studying',
      emoji: '📚',
      defaultDurationMinutes: 120,
      isSystem: true,
      groupMessages: {
        'Family': 'I am currently studying 📚. Will call back soon.',
        'Friends': 'Studying right now. Text me if urgent!',
        'Work': 'Focusing on study/work session. Will reply later.',
        'Unknown': 'Currently in a study session.',
      },
    ),
    StatusModel(
      id: 'driving',
      name: 'Driving',
      emoji: '🚗',
      defaultDurationMinutes: 45,
      isSystem: true,
      groupMessages: {
        'Family': 'Driving right now! I\'ll call back once parked safely.',
        'Friends': 'On the road 🚗. Can\'t talk right now.',
        'Work': 'Driving. Will reach out as soon as I arrive.',
        'Unknown': 'Currently driving. Will respond when safe.',
      },
    ),
    StatusModel(
      id: 'gym',
      name: 'Gym',
      emoji: '💪',
      defaultDurationMinutes: 90,
      isSystem: true,
      groupMessages: {
        'Family': 'At the gym 💪. Will call back after my workout!',
        'Friends': 'Working out right now 💪. Catch up later.',
        'Work': 'Currently at the gym. Will respond shortly.',
        'Unknown': 'Working out. Auto-reply via NowNot.',
      },
    ),
  ];
}
