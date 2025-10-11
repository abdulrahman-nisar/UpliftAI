from models.JournalEntryModel import JournalEntryModel

journal_entries = [
    JournalEntryModel(
        user_id=1,
        entry_id=1,
        title="Morning Reflections",
        content="Woke up feeling refreshed. Planning my day ahead.",
        date="2025-09-28 08:30:00"
    ),
    JournalEntryModel(
        user_id=1,
        entry_id=2,
        title="Evening Thoughts",
        content="The day was productive, but I feel a bit tired.",
        date="2025-09-28 20:45:00"
    ),
    JournalEntryModel(
        user_id=2,
        entry_id=3,
        title="Study Session",
        content="Learned a lot about Python dictionaries today!",
        date="2025-09-27 17:15:00"
    ),
    JournalEntryModel(
        user_id=3,
        entry_id=4,
        title="Late Night Writing",
        content="Couldn't sleep, so I decided to write my thoughts.",
        date="2025-09-26 23:55:00"
    )
]