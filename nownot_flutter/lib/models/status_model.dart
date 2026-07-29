class StatusModel {
  final String id;
  final String name;
  final String emoji;
  final Map<String, String> groupMessages; // {'Family': '...', 'Friends': '...', 'Work': '...', 'Unknown': '...'}

  StatusModel({
    required this.id,
    required this.name,
    required this.emoji,
    required this.groupMessages,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'emoji': emoji,
    'groupMessages': groupMessages,
  };

  factory StatusModel.fromJson(Map<String, dynamic> json) => StatusModel(
    id: json['id'] ?? '',
    name: json['name'] ?? '',
    emoji: json['emoji'] ?? '📱',
    groupMessages: Map<String, String>.from(json['groupMessages'] ?? {}),
  );

  static List<StatusModel> get defaultStatuses => [
    StatusModel(
      id: 'sleeping',
      name: 'Sleeping',
      emoji: '😴',
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
      groupMessages: {
        'Family': 'In a meeting right now! Will call back shortly.',
        'Friends': 'In a meeting. Send a text if urgent!',
        'Work': 'Currently in a meeting. Will get back to you once finished.',
        'Unknown': 'Busy in a meeting. Auto-reply from NowNot.',
      },
    ),
    StatusModel(
      id: 'driving',
      name: 'Driving',
      emoji: '🚗',
      groupMessages: {
        'Family': 'Driving right now! I\'ll call back once parked safely.',
        'Friends': 'On the road 🚗. Can\'t talk right now.',
        'Work': 'Driving. Will reach out as soon as I arrive.',
        'Unknown': 'Currently driving. Will respond when safe.',
      },
    ),
  ];
}
